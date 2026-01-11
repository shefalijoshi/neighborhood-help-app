import { useState } from 'react'
import { Search, ChevronLeft, PlusCircle } from 'lucide-react'
import type { Category, Action } from '../lib/categoryIntent'

interface ActionSelectorProps {
  category: Category
  onBack: () => void
  onSelect: (action: Action) => void
}

export function ActionSelector({ category, onBack, onSelect }: ActionSelectorProps) {
  const [searchQuery, setSearchQuery] = useState('')

  const filteredActions = category.actions.filter((a: Action) =>
    a.label.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const priorityActions = category.actions.slice(0, 3)

  return (
    <div className="animate-in max-w-lg mx-auto">
      <button onClick={onBack} className="nav-link-back mb-6">
        <ChevronLeft className="w-4 h-4" />
        <span>Back to Categories</span>
      </button>

      <div className="flex items-center gap-3 mb-4">
        <div className={`icon-box ${category.color} border-none text-white shadow-sm`}>
          <category.icon className="w-5 h-5" />
        </div>
        <h2 className="text-xl font-serif text-brand-dark">{category.label}</h2>
      </div>

      <div className="relative mb-4">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-muted" />
        <input
          type="text"
          placeholder={`Search ${category.label.toLowerCase()}...`}
          className="artisan-input pl-11 py-2" 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="space-y-1">
        <p className="text-label mb-4 ml-1 italic">
          {searchQuery ? 'Search Results' : 'Commonly requested'}
        </p>
        {(searchQuery ? filteredActions : priorityActions).map((action: Action) => (
          <button
            key={action.id}
            onClick={() => onSelect(action)}
            className="w-full flex items-center justify-between p-4 border-b border-brand-border/20 hover:bg-brand-stone/40 transition-colors text-left"
          >
            <span className="text-brand-text font-medium">{action.label}</span>
            <span className="badge-pill !py-0.5 !px-2 !text-[9px] border border-brand-border/30">
               {action.type}
            </span>
          </button>
        ))}
        <button
          onClick={() => onSelect({ 
            id: 'custom_service', 
            label: 'Request something else...', 
            type: 'service', 
            tag: 'Custom Service' 
          })}
          className="w-full flex items-center justify-between p-5 border-b border-brand-border/20 bg-brand-stone/10 hover:bg-brand-stone/30 transition-colors text-left group"
        >
          <div className="flex flex-col">
            <span className="text-brand-text italic text-sm">Help with something else?</span>
            <span className="!text-[9px] text-brand-muted tracking-wider">Custom Service</span>
          </div>
          <PlusCircle className="w-5 h-5 text-brand-green group-hover:rotate-90 transition-transform" />
        </button>

        {/* --- Custom Item Trigger --- */}
        <button
          onClick={() => onSelect({ 
            id: 'custom_item', 
            label: 'Borrow something else...', 
            type: 'item', 
            tag: 'Custom Item' 
          })}
          className="w-full flex items-center justify-between p-5 border-b border-brand-border/20 bg-brand-stone/10 hover:bg-brand-stone/30 transition-colors text-left group"
        >
          <div className="flex flex-col">
            <span className="text-brand-text italic text-sm">Borrowing something else?</span>
            <span className="!text-[9px] text-brand-muted tracking-wider">Custom Item</span>
          </div>
          <PlusCircle className="w-5 h-5 text-brand-green group-hover:rotate-90 transition-transform" />
        </button>
      </div>
    </div>
  )
}