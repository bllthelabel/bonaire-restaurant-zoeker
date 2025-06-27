import React, { useState, useCallback, useEffect, useRef } from 'react';
import { GoogleGenAI } from '@google/genai';
import type { Restaurant } from '../types.ts';
import StarRating from './StarRating.tsx';

// Initialize the Gemini client. Assume process.env.API_KEY is available.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

interface RestaurantCardProps {
  restaurant: Restaurant;
}

const RestaurantCard: React.FC<RestaurantCardProps> = ({ restaurant }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [summary, setSummary] = useState<string | null>(null);
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [error, setError] = useState<string | null>(null);

  const fallbackImage = 'https://picsum.photos/400/300';
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    e.currentTarget.src = fallbackImage;
  };

  const generateSummary = useCallback(async () => {
    setStatus('loading');
    setError(null);

    const prompt = `Genereer een "Over ons" tekst van 2-3 zinnen in het Nederlands voor het volgende restaurant op Bonaire. De toon moet natuurlijk en informatief zijn. Geef ALLEEN de uiteindelijke tekst terug, zonder enige inleiding of opmerkingen zoals 'Hier is een suggestie'.
Data:
- Naam: ${restaurant.name}
- Keukens: ${restaurant.cuisines.join(', ') || 'Niet gespecificeerd'}
- Prijs: ${restaurant.priceLevel || 'Niet gespecificeerd'}
- Kenmerken: ${restaurant.features.slice(0, 5).join(', ') || 'Geen'}
- Beoordeling: ${restaurant.rating} sterren`;

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-preview-04-17',
        contents: prompt,
      });

      // Clean the response text to remove any unwanted introductory phrases
      let cleanedText = response.text.trim();

      // Remove markdown fences like ```json ... ``` or ``` ... ```
      const fenceRegex = /^```(\w*)?\s*\n?(.*?)\n?\s*```$/s;
      const match = cleanedText.match(fenceRegex);
      if (match && match[2]) {
        cleanedText = match[2].trim();
      }

      // Remove common introductory phrases, case-insensitive, looking for variations.
      const introRegex = /^(Oké, |Zeker, |Natuurlijk, )?hier is (een suggestie|de tekst|een tekst voor de "Over ons" sectie|een beschrijving)(, gebaseerd op de gegevens)?:?\s*/i;
      cleanedText = cleanedText.replace(introRegex, '');

      setSummary(cleanedText);
      setStatus('success');
    } catch (e) {
      console.error("Error generating summary:", e);
      setError("Kon de beschrijving niet ophalen.");
      setStatus('error');
    }
  }, [restaurant]);

  useEffect(() => {
    const currentRef = cardRef.current;
    if (!currentRef || status !== 'idle') {
        return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          generateSummary();
          // Stop observing once it has been triggered
          if (currentRef) {
            observer.unobserve(currentRef);
          }
        }
      },
      {
        rootMargin: '0px 0px 200px 0px', // Pre-load summaries for cards 200px below the viewport
      }
    );

    observer.observe(currentRef);

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [generateSummary, status]);


  return (
    <div ref={cardRef} className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden flex flex-col group">
      <div className="relative">
        <img
          src={restaurant.image || fallbackImage}
          alt={`Afbeelding van ${restaurant.name}`}
          className="w-full h-48 object-cover"
          onError={handleImageError}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
        <div className="absolute bottom-0 left-0 p-4">
            <h3 className="text-xl font-bold text-white tracking-tight">{restaurant.name}</h3>
        </div>
      </div>

      <div className="p-5 flex-grow flex flex-col">
        <div className="flex items-center text-sm text-slate-500 mb-3">
          <StarRating rating={restaurant.rating} />
          <span className="ml-2">
            {restaurant.rating > 0 ? `${restaurant.numberOfReviews} beoordelingen` : 'Nog geen beoordelingen'}
          </span>
        </div>
        
        <div className="text-sm text-slate-600 space-y-2 mb-4 flex-grow">
          <p><span className="font-semibold text-slate-700">Stad:</span> {restaurant.city || 'N.v.t.'}</p>
          <p><span className="font-semibold text-slate-700">Keuken:</span> {restaurant.cuisines.join(', ') || 'N.v.t.'}</p>
          <p><span className="font-semibold text-slate-700">Prijs:</span> {restaurant.priceLevel || 'N.v.t.'}</p>
          
          {restaurant.features && restaurant.features.length > 0 && (
            <div className="pt-3">
                <h4 className="text-sm font-semibold text-slate-800 mb-2">Kenmerken</h4>
                <div className="flex flex-wrap gap-1.5">
                {restaurant.features.slice(0, 6).map(feature => (
                    <span key={feature} className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded-full text-xs font-medium">
                    {feature}
                    </span>
                ))}
                {restaurant.features.length > 6 && (
                    <span className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded-full text-xs font-medium">
                    + {restaurant.features.length - 6} meer
                    </span>
                )}
                </div>
            </div>
            )}

           <div className="pt-3">
             <h4 className="text-sm font-semibold text-slate-800 mb-2">{`Over ${restaurant.name}`}</h4>
             <div className="min-h-[6rem] flex flex-col justify-center">
                {status === 'loading' && (
                  <div className="text-center py-4">
                    <p className="text-sm text-slate-500 animate-pulse">Beschrijving wordt geladen...</p>
                  </div>
                )}

                {status === 'error' && (
                  <div className="p-3 bg-red-50 border-l-4 border-red-400 text-red-700 text-sm rounded">
                    <p>{error} <button onClick={generateSummary} className="font-semibold hover:underline">Opnieuw proberen</button></p>
                  </div>
                )}
                
                {status === 'success' && summary && (
                  <blockquote className="relative p-3 text-slate-700 bg-slate-50 rounded-lg border-l-4 border-blue-400">
                    <p className="italic text-sm">{summary}</p>
                  </blockquote>
                )}
             </div>
          </div>
        </div>

        <div className="mt-auto pt-4">
            <a
            href={restaurant.webUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full text-center bg-blue-600 text-white py-2.5 px-4 rounded-lg font-semibold hover:bg-blue-700 transition duration-150 ease-in-out shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
            Bekijk op TripAdvisor
            </a>
        </div>
      </div>
    </div>
  );
};

export default RestaurantCard;