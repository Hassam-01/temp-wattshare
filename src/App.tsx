import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuth, AuthProvider } from "@/contexts/AuthContext";
import { ThemeProvider } from "@/components/ThemeProvider";

import Index from "./pages/Index";
import Explore from "./pages/Explore";
import SavedDeals from "./pages/SavedDeals";
import About from "./pages/About";
import Auth from "./pages/Auth";
import SellerDashboardLayout from "./pages/SellerDashboard/Layout";
import SellerDashboardOverview from "./pages/SellerDashboard/Overview";
import SellerListings from "./pages/SellerDashboard/Listings";
import CreateListing from "./pages/SellerDashboard/CreateListing";
import CustomerPurchases from "./pages/CustomerDashboard/Purchases";
import ProductContact from "./pages/ProductContact";
import NotFound from "./pages/NotFound";
import ListingDetails from "./pages/ListingDetails";
import Messages from "./pages/Messages";
import Profile from "./pages/Profile";
import Payment from "./pages/Payment";

const queryClient = new QueryClient();

const ProtectedRoute = ({ children, requiredUserType }) => {
  const { authState } = useAuth();
  
  if (authState.isLoading) {
    return <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
    </div>;
  }
  
  if (!authState.user) {
    return <Navigate to="/auth" state={{ returnTo: window.location.pathname }} />;
  }
  
  if (requiredUserType && authState.profile?.user_type !== requiredUserType) {
    return <Navigate to="/" />;
  }
  
  return children;
};

const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<Index />} />
    <Route path="/explore" element={<Explore />} />
    <Route path="/listing/:id" element={<ListingDetails />} />
    <Route path="/saved" element={<SavedDeals />} />
    <Route path="/about" element={<About />} />
    <Route path="/auth" element={<Auth />} />
    <Route path="/login" element={<Auth />} />
    <Route path="/signup" element={<Auth defaultTab="signup" />} />
    
    <Route path="/payment/:listingId" element={
      <ProtectedRoute requiredUserType="customer">
        <Payment />
      </ProtectedRoute>
    } />
    
    <Route path="/seller" element={
      <ProtectedRoute requiredUserType="seller">
        <SellerDashboardLayout />
      </ProtectedRoute>
    }>
      <Route path="dashboard" element={<SellerDashboardOverview />} />
      <Route path="listings" element={<SellerListings />} />
      <Route path="listings/new" element={<CreateListing />} />
    </Route>
    
    <Route path="/purchases" element={
      <ProtectedRoute requiredUserType="customer">
        <CustomerPurchases />
      </ProtectedRoute>
    } />
    
    <Route path="/contact/:listingId" element={
      <ProtectedRoute requiredUserType={null}>
        <ProductContact />
      </ProtectedRoute>
    } />
    
    <Route path="/user/:userId" element={
      <ProtectedRoute requiredUserType={null}>
        <Profile />
      </ProtectedRoute>
    } />
    
    <Route path="/messages/:dealId?" element={
      <ProtectedRoute requiredUserType={null}>
        <Messages />
      </ProtectedRoute>
    } />
    
    <Route path="*" element={<NotFound />} />
  </Routes>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <ThemeProvider>
        <AuthProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <AppRoutes />
          </BrowserRouter>
        </AuthProvider>
      </ThemeProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
