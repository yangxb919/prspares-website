'use client';

import { reportCategories } from '@/data/reports';

interface CategoryFilterProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

export default function CategoryFilter({ selectedCategory, onCategoryChange }: CategoryFilterProps) {
  return (
    <div className="flex flex-wrap gap-2 mb-8">
      {reportCategories.map((category) => (
        <button
          key={category}
          onClick={() => onCategoryChange(category)}
          className={`px-4 py-2 rounded-full font-medium transition-all duration-200 ${
            selectedCategory === category
              ? 'bg-[#00B140] text-white shadow-lg transform scale-105'
              : 'bg-white text-gray-700 border border-gray-200 hover:border-[#00B140] hover:text-[#00B140] hover:shadow-md'
          }`}
        >
          {category}
        </button>
      ))}
    </div>
  );
}
