


import React from 'react';
import type { Restaurant } from '/types.ts';
import RestaurantCard from '/components/RestaurantCard.tsx';

interface RestaurantListProps {
  restaurants: Restaurant[];
}

const RestaurantList: React.FC<RestaurantListProps> = ({ restaurants }) => {
  return (
    <section>
      <h2 className="text-2xl sm:text-3xl font-bold text-center text-blue-700 mb-6 border-t pt-8">
        Resultaten
      </h2>
      {restaurants.length === 0 ? (
        <div className="bg-slate-100 p-8 rounded-lg shadow-inner text-center">
          <p className="text-slate-600 font-medium">Geen restaurants gevonden.</p>
          <p className="text-slate-500 mt-1">Pas uw filters aan of wis ze om meer resultaten te zien.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {restaurants.map((restaurant) => (
            <RestaurantCard key={restaurant.name} restaurant={restaurant} />
          ))}
        </div>
      )}
    </section>
  );
};

export default RestaurantList;