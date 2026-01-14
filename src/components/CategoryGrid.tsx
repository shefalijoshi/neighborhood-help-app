import { ChevronLeft } from 'lucide-react'
import type { Category } from '../lib/categoryIntent'
import { CATEGORY_INTENT } from '../lib/categoryIntent'

interface CategoryGridProps {
  onBack: () => void
  onSelect: (category: Category) => void
}

export function CategoryGrid({ onBack, onSelect }: CategoryGridProps) {
  return (
    <div className="animate-in mx-auto">
      <button onClick={onBack} className="nav-link-back mb-6">
        <ChevronLeft className="w-4 h-4" />
        <span>Back to Dashboard</span>
      </button>
      <div className="mb-4 text-center">
        <h1 className="artisan-header-title">
          How can neighbors help?
        </h1>
        <p className="text-brand-text italic">
          Select a category to start your request.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {CATEGORY_INTENT.map((cat) => (
          <button
            key={cat.id}
            onClick={() => onSelect(cat)}
            className={`artisan-card ${cat.borderColor} !p-0 group active:scale-95 transition-transform cursor-pointer`}
          >
            <div className="artisan-card-inner p-4 bg-white flex flex-col items-center justify-center">
              <div className={`icon-box mb-2 transition-transform group-hover:scale-110 ${cat.color} border-none text-white shadow-md`}>
                <cat.icon className="w-6 h-6" />
              </div>
              
              <span className="artisan-card-title text-lg text-wrap text-center leading-tight">
                {cat.label}
              </span>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}