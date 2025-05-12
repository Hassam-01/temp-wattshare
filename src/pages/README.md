# Pages Directory

This directory contains all the page components that represent different routes in the application.

## Structure

- `Index.tsx` - Homepage
- `About.tsx` - About page
- `Auth.tsx` - Authentication page
- `Explore.tsx` - Product listings page
- `ListingDetails.tsx` - Individual listing page
- `Messages.tsx` - User messages page
- `Payment.tsx` - Payment processing page
- `Profile.tsx` - User profile page
- `SavedDeals.tsx` - Saved listings page

### Seller Dashboard

The `SellerDashboard/` directory contains seller-specific pages:
- `Layout.tsx` - Dashboard layout wrapper
- `Overview.tsx` - Dashboard home
- `Listings.tsx` - Manage listings
- `CreateListing.tsx` - Create new listing

### Customer Dashboard

The `CustomerDashboard/` directory contains customer-specific pages:
- `Purchases.tsx` - Order history

## Routing

Pages are routed using React Router v6. Protected routes are wrapped with authentication checks.

## State Management

Pages use React Query for data fetching and caching, with Supabase as the backend.

## Adding New Pages

1. Create a new page component in this directory
2. Add the route to `App.tsx`
3. Include proper authentication checks if needed
4. Implement data fetching using React Query
5. Add necessary TypeScript types