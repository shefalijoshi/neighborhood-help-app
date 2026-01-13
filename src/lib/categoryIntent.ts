
import { 
  Wrench, 
  TreePine, 
  Package, 
  Sparkles, 
  Dog, 
  Laptop, 
  PartyPopper, 
  Users,
} from 'lucide-react';

import type { LucideIcon } from 'lucide-react';

export type RequestType = 'item' | 'service';

export interface Action {
  id: string;
  label: string;
  type: RequestType;
  tag: string; // The primary tag sent to the DB (e.g., 'Drill' or 'Handywork')
}

export interface Category {
  id: string;
  label: string;
  icon: LucideIcon;
  color: string; // Tailwinds bg- class
  borderColor: string; // Tailwinds bg- class
  requiresProfile: boolean;
  actions: Action[];
}

export const CATEGORY_INTENT: Category[] = [
  {
    id: 'pet_care',
    label: 'Pet Care',
    icon: Dog,
    color: 'bg-brand-green',
    borderColor: 'border-brand-green',
    requiresProfile: true, // Triggers Profile Picker
    actions: [
      { id: 'quick_walk', label: 'Quick Walk', type: 'service', tag: 'Dog Walk' },
      { id: 'potty_break', label: 'Potty Break', type: 'service', tag: 'Dog Walk' },
      { id: 'feeding', label: 'Pet Feeding', type: 'service', tag: 'Pet Sitting' },
      { id: 'pet_sitting', label: 'Overnight Sitting', type: 'service', tag: 'Pet Sitting' },
      { id: 'cat_sitting', label: 'Cat Sitting', type: 'service', tag: 'Pet Sitting' },
      { id: 'borrow_crate', label: 'Borrow a Crate', type: 'item', tag: 'Pet Gear' },
      { id: 'borrow_gate', label: 'Borrow a Pet Gate', type: 'item', tag: 'Pet Gear' },
      { id: 'borrow_cone', label: 'Borrow a Cone', type: 'item', tag: 'Pet Gear' }
    ]
  },
  {
    id: 'lawn_garden',
    label: 'Lawn & Garden',
    icon: TreePine,
    color: 'bg-brand-green',
    borderColor: 'border-brand-green',
    requiresProfile: false,
    actions: [
      { id: 'mowing', label: 'Lawn Mowing', type: 'service', tag: 'Mowing' },
      { id: 'borrow_mower', label: 'Borrow a Mower', type: 'item', tag: 'Mower' },
      { id: 'weeding', label: 'Weeding Help', type: 'service', tag: 'Yardwork' },
      { id: 'leaf_raking', label: 'Leaf Raking', type: 'service', tag: 'Yardwork' },
      { id: 'snow_shoveling', label: 'Snow Shoveling', type: 'service', tag: 'Yardwork' },
      { id: 'borrow_blower', label: 'Borrow Leaf Blower', type: 'item', tag: 'Blower' },
      { id: 'watering_plants', label: 'Watering Plants', type: 'service', tag: 'Yardwork' }
    ]
  },
  {
    id: 'events_parties',
    label: 'Events & Parties',
    icon: PartyPopper,
    color: 'bg-orange-500',
    borderColor: 'border-orange-500',
    requiresProfile: false,
    actions: [
      { id: 'party_setup', label: 'Setup/Clean-up', type: 'service', tag: 'Event Help' },
      { id: 'borrow_chairs', label: 'Borrow Chairs/Tables', type: 'item', tag: 'Party Gear' },
      { id: 'borrow_canopy', label: 'Borrow Canopy', type: 'item', tag: 'Party Canopy' },
      { id: 'grilling_help', label: 'Grilling/Serving', type: 'service', tag: 'Event Help' },
      { id: 'borrow_cooler', label: 'Borrow a Cooler', type: 'item', tag: 'Party Cooler' },
      { id: 'borrow_lights', label: 'Borrow String Lights', type: 'item', tag: 'Party Gear' }
    ]
  },
  {
    id: 'home_repair',
    label: 'Home & Repairs',
    icon: Wrench,
    color: 'bg-brand-terracotta',
    borderColor: 'border-brand-terracotta',
    requiresProfile: false,
    // The first 3 are used for the Quick-Tap Grid in Step 2
    actions: [
      { id: 'furniture_assembly', label: 'Furniture Assembly', type: 'service', tag: 'Handywork' },
      { id: 'borrow_drill', label: 'Borrow a Drill', type: 'item', tag: 'Drill' },
      { id: 'small_repair', label: 'Small Repair', type: 'service', tag: 'Handywork' },
      // Searchable long-tail
      { id: 'borrow_ladder', label: 'Borrow a Ladder', type: 'item', tag: 'Ladder' },
      { id: 'stud_finder', label: 'Borrow Stud Finder', type: 'item', tag: 'Tools' },
      { id: 'hanging_pictures', label: 'Hanging Pictures', type: 'service', tag: 'Handywork' },
      { id: 'tightening_screws', label: 'Tightening Screws', type: 'service', tag: 'Handywork' }
    ]
  },
  {
    id: 'moving_lifting',
    label: 'Moving & Lifting',
    icon: Package,
    color: 'bg-brand-dark',
    borderColor: 'border-brand-dark',
    requiresProfile: false,
    actions: [
      { id: 'heavy_lifting', label: 'Heavy Lifting', type: 'service', tag: 'Lifting' },
      { id: 'borrow_dolly', label: 'Borrow a Dolly', type: 'item', tag: 'Dolly' },
      { id: 'loading_truck', label: 'Loading Truck', type: 'service', tag: 'Moving' },
      { id: 'unloading_truck', label: 'Unloading Truck', type: 'service', tag: 'Moving' },
      { id: 'moving_blankets', label: 'Borrow Blankets', type: 'item', tag: 'Moving Gear' },
      { id: 'straps_ramps', label: 'Borrow Straps/Ramps', type: 'item', tag: 'Moving Gear' }
    ]
  },
  {
    id: 'housekeeping',
    label: 'Housekeeping & Org',
    icon: Sparkles,
    color: 'bg-blue-500',
    borderColor: 'border-blue-500',
    requiresProfile: false,
    actions: [
      { id: 'kitchen_clean', label: 'Kitchen Deep Clean', type: 'service', tag: 'Cleaning' },
      { id: 'borrow_mixer', label: 'Borrow Stand Mixer', type: 'item', tag: 'Kitchen' },
      { id: 'closet_organizing', label: 'Closet Organizing', type: 'service', tag: 'Organizing' },
      { id: 'borrow_vacuum', label: 'Borrow Shop Vac', type: 'item', tag: 'Cleaning' },
      { id: 'borrow_steamer', label: 'Borrow Steam Cleaner', type: 'item', tag: 'Cleaning' },
      { id: 'garage_tidy', label: 'Garage Tidying', type: 'service', tag: 'Organizing' }
    ]
  },
  {
    id: 'tech_devices',
    label: 'Tech & Devices',
    icon: Laptop,
    color: 'bg-indigo-600',
    borderColor: 'border-indigo-600',
    requiresProfile: false,
    actions: [
      { id: 'wifi_help', label: 'Wi-Fi Setup Help', type: 'service', tag: 'Tech Support' },
      { id: 'borrow_monitor', label: 'Borrow a Monitor', type: 'item', tag: 'Computer' },
      { id: 'printer_setup', label: 'Printer Setup', type: 'service', tag: 'Tech Support' },
      { id: 'troubleshooting', label: 'Troubleshooting', type: 'service', tag: 'Tech Support' },
      { id: 'borrow_cables', label: 'Borrow Cables/HDMI', type: 'item', tag: 'Computer' },
      { id: 'app_help', label: 'App/Software Help', type: 'service', tag: 'Tech Support' }
    ]
  },
  {
    id: 'family_learning',
    label: 'Family & Learning',
    icon: Users,
    color: 'bg-rose-500',
    borderColor: 'border-rose-500',
    requiresProfile: false,
    actions: [
      { id: 'math_tutoring', label: 'Math Tutoring', type: 'service', tag: 'Tutoring' },
      { id: 'borrow_stroller', label: 'Borrow Stroller', type: 'item', tag: 'Baby Gear' },
      { id: 'reading_help', label: 'Reading Help', type: 'service', tag: 'Tutoring' },
      { id: 'date_night', label: 'Date Night Sitter', type: 'service', tag: 'Sitting' },
      { id: 'music_lesson', label: 'Music Lesson', type: 'service', tag: 'Learning' },
      { id: 'borrow_highchair', label: 'Borrow High Chair', type: 'item', tag: 'Baby Gear' }
    ]
  }
];