# Hooks Directory

This directory contains custom React hooks used throughout the application.

## Available Hooks

- `use-mobile.tsx` - Detect mobile viewport
- `use-toast.ts` - Toast notification system
- `useListingMutations.ts` - Mutations for listings

## Usage

```tsx
import { useIsMobile } from "@/hooks/use-mobile";
import { useToast } from "@/hooks/use-toast";
import { useSaveListing } from "@/hooks/useListingMutations";
```

## Creating New Hooks

1. Create a new hook file using TypeScript
2. Follow the `use` prefix naming convention
3. Include proper TypeScript types
4. Add necessary documentation
5. Export the hook as default if it's the only export