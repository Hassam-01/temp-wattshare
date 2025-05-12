# WattShare - Solar Energy Marketplace

WattShare is a modern marketplace platform that connects buyers and sellers of solar energy equipment. Built with React, TypeScript, and Supabase, it provides a seamless experience for trading solar panels, batteries, inverters, and complete systems.

## Features

- **User Authentication**: Secure email/password authentication with role-based access (customers and sellers)
- **Product Listings**: Create, browse, and manage solar equipment listings
- **Real-time Messaging**: Built-in chat system for buyers and sellers
- **Payment Processing**: Secure payment handling for transactions
- **Saved Listings**: Users can save listings for later reference
- **Seller Dashboard**: Comprehensive tools for sellers to manage listings and orders
- **Responsive Design**: Mobile-first approach using Tailwind CSS

## Tech Stack

- **Frontend**:
  - React 18
  - TypeScript
  - Tailwind CSS
  - shadcn/ui components
  - React Router v6
  - React Query
  - React Hook Form
  - Zod validation

- **Backend**:
  - Supabase (PostgreSQL)
  - Row Level Security
  - Real-time subscriptions
  - Storage for images

- **Development**:
  - Vite
  - ESLint
  - SWC
  - PostCSS

## Project Structure

```
├── src/
│   ├── components/     # Reusable UI components
│   ├── contexts/       # React context providers
│   ├── hooks/         # Custom React hooks
│   ├── integrations/  # Third-party service integrations
│   ├── lib/           # Utility functions and helpers
│   ├── pages/         # Application pages/routes
│   └── types/         # TypeScript type definitions
├── public/            # Static assets
├── supabase/          # Supabase configuration and migrations
└── ...configuration files
```

## Getting Started

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/wattshare.git
   cd wattshare
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   Create a `.env` file with:
   ```
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   VITE_IMGBB_API_KEY=your_imgbb_api_key
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.