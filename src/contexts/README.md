# Contexts Directory

This directory contains React Context providers used for global state management.

## Available Contexts

### AuthContext

`AuthContext.tsx` manages authentication state:
- User session management
- Profile information
- Authentication methods (login/signup/logout)
- Role-based access control

## Usage

```tsx
import { useAuth } from "@/contexts/AuthContext";

function MyComponent() {
  const { authState, signIn, signOut } = useAuth();
  // Use auth state and methods
}
```

## Creating New Contexts

1. Create a new context file
2. Define the context interface
3. Create the provider component
4. Export the context hook
5. Add the provider to the app's component tree