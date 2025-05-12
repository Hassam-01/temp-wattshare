# Integrations Directory

This directory contains integrations with third-party services.

## Structure

### Supabase

- `client.ts` - Supabase client configuration
- `types.ts` - Generated TypeScript types

### Image Cloud

- `imageCloud.ts` - Image upload service integration

## Usage

```tsx
import { supabase } from "@/integrations/supabase/client";
import uploadImagesToCloud from "@/integrations/imageCloud/imageCloud";
```

## Adding New Integrations

1. Create a new directory for the service
2. Include configuration files
3. Add TypeScript types
4. Create utility functions
5. Document usage and requirements