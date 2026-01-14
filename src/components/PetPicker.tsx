import { Link, useSearch } from '@tanstack/react-router';
import { Dog, Check, Plus } from 'lucide-react';
import { CATEGORY_INTENT } from '../lib/categoryIntent';

interface Pet {
  id: string;
  name: string;
}

interface PetPickerProps {
  pets: Pet[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}

export function PetPicker({ pets, selectedId, onSelect }: PetPickerProps) {
  const search = useSearch({ from: '/_auth/_app/create-request' }); // Capture current params

  const petCareCategory = CATEGORY_INTENT.filter(intent => intent.id === 'pet_care');
  let brandColor;
  let borderColor;
  if (petCareCategory.length > 0) {
    brandColor = petCareCategory[0]?.color;
    borderColor = petCareCategory[0]?.borderColor;
  } else {
    brandColor = 'bg-brand-green';
    borderColor = 'border-brand-green';
  }

  return (
    <section className="space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Dog className="w-4 h-4 text-brand-green" />
          <label className="text-label italic">Who needs help?</label>
        </div>
        {selectedId && (
          <span className="text-[10px] font-bold text-brand-green uppercase tracking-widest flex items-center gap-1">
            <Check className="w-3 h-3" /> Selected
          </span>
        )}
      </div>
      
      {/* Horizontal Scroll Container */}
      <div className="flex gap-4 overflow-x-auto pb-4 pt-2 scrollbar-hide -mx-2 px-2">
        {pets.map((pet) => {
          const isSelected = selectedId === pet.id;
          
          return (
            <button
              key={pet.id}
              type="button"
              onClick={() => onSelect(pet.id)}
              className={`flex-shrink-0 flex flex-col items-center gap-3 p-4 rounded-2xl border-2 transition-all duration-200 active:scale-95 ${
                isSelected 
                ? `${brandColor} ${borderColor} shadow-md`
                : 'border-brand-border/20 bg-white hover:border-brand-border/40'
              }`}
            >
              {/* Pet Avatar Circle */}
              <div className={`h-14 w-14 rounded-full flex items-center justify-center text-xl font-serif border-2 transition-colors ${
                isSelected 
                ? `${brandColor} text-white border-white shadow-inner`
                : 'bg-brand-stone text-brand-muted border-brand-border/20'
              }`}>
                {pet.name[0]}
              </div>

              {/* Pet Name Label */}
              <span className={`text-label ${
                isSelected ? 'text-white' : 'text-brand-text'
              }`}>
                {pet.name}
              </span>
            </button>
          );
        })}
        <Link
          to="/help-details/create"
          search={{ 
            returnTo: '/create-request',
            categoryId: search.categoryId,
            actionId: search.actionId 
          }}
          className="flex-shrink-0 flex flex-col items-center gap-3 p-4 rounded-2xl border-2 transition-all duration-200 active:scale-95 border-brand-border/20 bg-white hover:border-brand-border/40"
        >
          <Plus className="h-14 w-14 rounded-full flex items-center justify-center text-xl font-serif border-2 transition-colors bg-brand-stone text-brand-muted border-brand-border/20" />
          <span className="text-label text-brand-text">Add pet profile</span>
        </Link>
      </div>
    </section>
  );
}