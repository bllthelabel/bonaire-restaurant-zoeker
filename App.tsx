


import React, { useState, useMemo, useCallback } from 'react';
import { allRestaurants } from '/constants.ts';
import type { Restaurant, Filters, FilterType } from '/types.ts';
import FilterPanel from '/components/FilterPanel.tsx';
import RestaurantList from '/components/RestaurantList.tsx';
import SelectedFilters from '/components/SelectedFilters.tsx';

const initialFilters: Filters = {
  name: '',
  city: '',
  cuisine: '',
  priceLevel: '',
  minRating: 0,
  features: [],
};

const App: React.FC = () => {
  const [filters, setFilters] = useState<Filters>(initialFilters);

  const handleFilterChange = useCallback((filterType: FilterType, value: string | string[] | number) => {
    setFilters(prevFilters => {
      // Handle feature checkbox toggle
      if (filterType === 'features' && typeof value === 'string') {
        const newFeatures = prevFilters.features.includes(value)
          ? prevFilters.features.filter(f => f !== value)
          : [...prevFilters.features, value];
        return { ...prevFilters, features: newFeatures };
      }
      // Handle other filters
      return { ...prevFilters, [filterType]: value };
    });
  }, []);

  const handleRemoveFilter = useCallback((filterType: FilterType, valueToRemove?: string) => {
    if (filterType === 'features' && valueToRemove) {
      handleFilterChange('features', valueToRemove); // Re-use the toggle logic
    } else {
      const defaultValue = initialFilters[filterType];
      handleFilterChange(filterType, defaultValue);
    }
  }, [handleFilterChange]);
  
  const handleClearFilters = useCallback(() => {
    setFilters(initialFilters);
  }, []);

  const filteredRestaurants = useMemo(() => {
    return allRestaurants.filter(restaurant => {
      // Filter by Name
      if (filters.name && !restaurant.name.toLowerCase().includes(filters.name.toLowerCase())) {
        return false;
      }
      // Filter by City
      if (filters.city && restaurant.city.toLowerCase() !== filters.city.toLowerCase()) {
        return false;
      }
      // Filter by Cuisine
      if (filters.cuisine && !restaurant.cuisines.map(c => c.toLowerCase()).includes(filters.cuisine.toLowerCase())) {
        return false;
      }
      // Filter by Price Level
      if (filters.priceLevel && restaurant.priceLevel !== filters.priceLevel) {
          return false;
      }
      // Filter by Minimum Rating
      if (restaurant.rating > 0 && restaurant.rating < filters.minRating) {
        return false;
      }
      // Filter by Features
      if (filters.features.length > 0) {
        const restaurantFeaturesLower = restaurant.features.map(f => f.toLowerCase());
        const selectedFeaturesLower = filters.features.map(f => f.toLowerCase());
        if (!selectedFeaturesLower.every(feature => restaurantFeaturesLower.includes(feature))) {
          return false;
        }
      }
      return true;
    });
  }, [filters]);

  return (
    <div className="p-4 sm:p-6 md:p-8">
      <div className="max-w-7xl mx-auto bg-white rounded-xl shadow-lg p-6 sm:p-8">
        <header className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-blue-800">
            Vind het perfecte restaurant op Bonaire!
          </h1>
          <p className="mt-2 text-slate-500">Gebruik de filters om uw ideale eetgelegenheid te ontdekken.</p>
        </header>

        <main>
          <FilterPanel 
            filters={filters} 
            onFilterChange={handleFilterChange} 
            onClearFilters={handleClearFilters} 
          />
          <SelectedFilters
            filters={filters}
            onRemoveFilter={handleRemoveFilter}
          />
          <RestaurantList restaurants={filteredRestaurants} />
        </main>
      </div>
       <footer className="text-center mt-8 text-sm text-slate-500">
        <p>Bonaire Restaurant Zoeker &copy; {new Date().getFullYear()}</p>
      </footer>
    </div>
  );
}

export default App;