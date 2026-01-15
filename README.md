# LocalLoop

A hyperlocal social app connecting neighbors to help each other with everyday needs.

## What is LocalLoop?

LocalLoop makes it easy for verified neighbors to request and offer help within their community. Whether you need to borrow a drill, find someone to walk your dog, or get help moving furniture, LocalLoop connects you with trusted neighbors nearby.

## Features

- **Request & Offer Help**: Post requests for items or services you need, or offer to help your neighbors
- **Category-Based Organization**: Browse requests by category (Pet Care, Home & Repairs, Moving & Lifting, etc.)
- **Real-Time Updates**: See new requests and offers as they happen
- **Verified Neighbors Only**: Secure vouch-based verification system ensures only real residents join
- **Location-Based**: Automatically connects you with neighbors in your immediate area
- **Smart Filtering**: Filter requests by category to find what matters to you

## Tech Stack

- **Frontend**: React + TypeScript + Vite
- **Routing**: TanStack Router
- **State Management**: TanStack Query
- **Backend**: Supabase (PostgreSQL, Auth, Real-time)
- **Styling**: Tailwind CSS
- **Maps**: Mapbox
- **Icons**: Lucide React

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Supabase account
- Mapbox account

### Installation

1. Clone the repository:
```bash
git clone https://github.com/shefalijoshi/localloop.git
cd localloop
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env.local` file based on `.env.example`:
```bash
cp .env.example .env.local
```

4. Add your credentials to `.env.local`:
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_MAPBOX_TOKEN=your_mapbox_token
```

5. Start the development server:
```bash
npm run dev
```

## Project Structure
```
localloop/
├── src/
│   ├── components/     # Reusable UI components
│   ├── lib/           # Utilities and configurations
│   ├── routes/        # Page components and routing
│   └── types/         # TypeScript type definitions
├── public/            # Static assets
└── docs/             # Documentation
```

## Key Features Explained

### Vouch-Based Verification
New users must be vouched for by existing verified neighbors, ensuring a trusted community.

### Request Types
- **Items**: Borrow tools, equipment, or household items
- **Services**: Get help with tasks like pet sitting, yard work, or moving

### Smart Expiry
Requests automatically expire after a set time to keep the feed relevant and up-to-date.

## Contributing

This is a personal project, but suggestions and feedback are welcome! Feel free to open an issue.

## License

MIT

## Contact

Created by [@shefalijoshi](https://github.com/shefalijoshi)