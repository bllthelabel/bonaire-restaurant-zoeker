
import React, { useMemo } from 'react';
import type { Filters, FilterType } from '../types';
import { allRestaurants } from '../constants';

interface FilterPanelProps {
  filters: Filters;
  onFilterChange: (filterType: FilterType, value: string | number | string[]) => void;
  onClearFilters: () => void;
}

const FilterPanel: React.FC<FilterPanelProps> = ({ filters, onFilterChange, onClearFilters }) => {

  const filterOptions = useMemo(() => {
    const cities = new Set<string>();
    const cuisines = new Set<string>();
    const priceLevels = new Set<string>();
    const features = new Set<string>();

    allRestaurants.forEach(restaurant => {
      if (restaurant.city) cities.add(restaurant.city);
      restaurant.cuisines.forEach(cuisine => cuisines.add(cuisine));
      if (restaurant.priceLevel && restaurant.priceLevel !== "Niet beschikbaar" && restaurant.priceLevel !== "Not available") {
        priceLevels.add(restaurant.priceLevel);
      }
      restaurant.features.forEach(feature => features.add(feature));
    });
    
    const orderedPriceLevels = ['€', '€€ - €€€', '€€€€'].filter(p => priceLevels.has(p));

    return {
      cities: Array.from(cities).sort(),
      cuisines: Array.from(cuisines).sort(),
      priceLevels: orderedPriceLevels,
      features: Array.from(features).sort()
    };
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8 p-6 bg-slate-50 rounded-lg border border-slate-200">
      {/* Search by Name */}
      <div className="relative">
        <label htmlFor="searchName" className="block text-sm font-medium text-slate-700 mb-1">Zoek op naam</label>
        <input
          type="text"
          id="searchName"
          placeholder="Bijv. At Sea, Cuba Bonaire"
          value={filters.name}
          onChange={(e) => onFilterChange('name', e.target.value)}
          className="w-full p-3 border border-slate-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 text-slate-800"
        />
      </div>

      {/* Filter by City */}
      <div>
        <label htmlFor="filterCity" className="block text-sm font-medium text-slate-700 mb-1">Stad</label>
        <select
          id="filterCity"
          value={filters.city}
          onChange={(e) => onFilterChange('city', e.target.value)}
          className="w-full p-3 border border-slate-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 text-slate-800"
        >
          <option value="">Alle steden</option>
          {filterOptions.cities.map(city => <option key={city} value={city}>{city}</option>)}
        </select>
      </div>
      
      {/* Filter by Cuisine */}
      <div>
        <label htmlFor="filterCuisine" className="block text-sm font-medium text-slate-700 mb-1">Keuken</label>
        <select
          id="filterCuisine"
          value={filters.cuisine}
          onChange={(e) => onFilterChange('cuisine', e.target.value)}
          className="w-full p-3 border border-slate-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 text-slate-800"
        >
          <option value="">Alle keukens</option>
          {filterOptions.cuisines.map(cuisine => <option key={cuisine} value={cuisine}>{cuisine}</option>)}
        </select>
      </div>

      {/* Filter by Price Level */}
      <div>
        <label htmlFor="filterPrice" className="block text-sm font-medium text-slate-700 mb-1">Prijsniveau</label>
        <select
          id="filterPrice"
          value={filters.priceLevel}
          onChange={(e) => onFilterChange('priceLevel', e.target.value)}
          className="w-full p-3 border border-slate-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 text-slate-800"
        >
          <option value="">Alle prijsniveaus</option>
          {filterOptions.priceLevels.map(price => <option key={price} value={price}>{price}</option>)}
        </select>
      </div>

      {/* Filter by Minimum Rating */}
      <div>
        <label htmlFor="filterRating" className="block text-sm font-medium text-slate-700 mb-1">Minimale beoordeling</label>
        <select
          id="filterRating"
          value={filters.minRating}
          onChange={(e) => onFilterChange('minRating', parseFloat(e.target.value))}
          className="w-full p-3 border border-slate-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 text-slate-800"
        >
          <option value="0">Geen minimum</option>
          <option value="1">★ en hoger</option>
          <option value="2">★★ en hoger</option>
          <option value="3">★★★ en hoger</option>
          <option value="4">★★★★ en hoger</option>
          <option value="4.5">★★★★½ en hoger</option>
        </select>
      </div>

      {/* Clear Filters Button */}
       <div className="flex items-end justify-center">
            <button
                onClick={onClearFilters}
                className="w-full px-6 py-3 bg-red-500 text-white font-semibold rounded-lg shadow-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition duration-150 ease-in-out"
            >
                Wis Filters
            </button>
        </div>


      {/* Filter by Features */}
      <div className="md:col-span-2 lg:col-span-3">
        <label className="block text-sm font-medium text-slate-700 mb-2">Voorzieningen</label>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-3 bg-white p-4 rounded-lg shadow-inner border border-slate-200 overflow-y-auto max-h-48 custom-scrollbar">
          {filterOptions.features.map(feature => (
            <div key={feature} className="flex items-center">
              <input
                type="checkbox"
                id={`feature-${feature}`}
                value={feature}
                checked={filters.features.includes(feature)}
                onChange={() => onFilterChange('features', feature)}
                className="h-4 w-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
              />
              <label htmlFor={`feature-${feature}`} className="ml-2 text-sm text-slate-700 select-none cursor-pointer">
                {feature}
              </label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FilterPanel;
