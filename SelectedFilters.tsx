
import React, { useMemo } from 'react';
import type { Filters, FilterType } from '../types';

interface SelectedFiltersProps {
  filters: Filters;
  onRemoveFilter: (filterType: FilterType, value?: string) => void;
}

const FilterTag: React.FC<{
  label: string;
  onRemove: () => void;
}> = ({ label, onRemove }) => (
  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 animate-fade-in">
    <span>{label}</span>
    <button
      type="button"
      className="ml-2 -mr-1 flex-shrink-0 h-5 w-5 rounded-full inline-flex items-center justify-center text-blue-500 hover:bg-blue-200 hover:text-blue-600 focus:outline-none focus:bg-blue-500 focus:text-white transition-colors"
      onClick={onRemove}
    >
      <span className="sr-only">Verwijder filter</span>
      <svg className="h-3 w-3" stroke="currentColor" fill="none" viewBox="0 0 8 8">
        <path strokeLinecap="round" strokeWidth="1.5" d="M1 1l6 6m0-6L1 7" />
      </svg>
    </button>
  </span>
);

const SelectedFilters: React.FC<SelectedFiltersProps> = ({ filters, onRemoveFilter }) => {
  const activeFilters = useMemo(() => {
    const active: { label: string; onRemove: () => void }[] = [];

    if (filters.name) {
      active.push({
        label: `Naam: "${filters.name}"`,
        onRemove: () => onRemoveFilter('name'),
      });
    }
    if (filters.city) {
      active.push({
        label: `Stad: ${filters.city}`,
        onRemove: () => onRemoveFilter('city'),
      });
    }
    if (filters.cuisine) {
      active.push({
        label: `Keuken: ${filters.cuisine}`,
        onRemove: () => onRemoveFilter('cuisine'),
      });
    }
    if (filters.priceLevel) {
      active.push({
        label: `Prijs: ${filters.priceLevel}`,
        onRemove: () => onRemoveFilter('priceLevel'),
      });
    }
    if (filters.minRating > 0) {
      active.push({
        label: `Min. ${filters.minRating} ★`,
        onRemove: () => onRemoveFilter('minRating'),
      });
    }
    filters.features.forEach(feature => {
      active.push({
        label: `Voorziening: ${feature}`,
        onRemove: () => onRemoveFilter('features', feature),
      });
    });

    return active;
  }, [filters, onRemoveFilter]);

  if (activeFilters.length === 0) {
    return null;
  }

  return (
    <div className="mb-8 p-4 bg-blue-50 rounded-lg shadow-sm border border-blue-200">
      <h3 className="text-lg font-semibold text-blue-800 mb-3">Actieve filters:</h3>
      <div className="flex flex-wrap gap-2">
        {activeFilters.map((filter, index) => (
          <FilterTag key={index} label={filter.label} onRemove={filter.onRemove} />
        ))}
      </div>
    </div>
  );
};

export default SelectedFilters;
