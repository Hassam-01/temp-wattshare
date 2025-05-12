# Components Directory

This directory contains all reusable UI components used throughout the application.

## Structure

- `auth/` - Authentication-related components (login/signup forms)
- `ui/` - Base UI components from shadcn/ui
- `sellers/` - Seller-specific components
- `Navbar.tsx` - Main navigation component
- `Footer.tsx` - Site footer component
- `ContactForm.tsx` - Contact form component
- `ListingCard.tsx` - Card component for displaying listings
- `ThemeProvider.tsx` - Dark/light theme provider

## UI Components

The `ui/` directory contains shadcn/ui components that follow a consistent design system:

- Buttons, inputs, and form elements
- Cards and containers
- Navigation components
- Modals and dialogs
- Toast notifications
- Loading states

## Usage

Import components like this:

```tsx
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import ListingCard from "@/components/ListingCard";
```

## Adding New Components

1. Create a new component file using TypeScript and React
2. Export the component as default
3. Include proper TypeScript types and props interface
4. Add necessary documentation
5. Follow the established styling patterns using Tailwind CSS