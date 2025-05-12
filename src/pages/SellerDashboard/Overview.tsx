
import { useAuth } from '@/contexts/AuthContext';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Package, ShoppingCart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Overview = () => {
  const { authState } = useAuth();
  const navigate = useNavigate();

  const { data: listings, isLoading: isLoadingListings } = useQuery({
    queryKey: ['seller-listings'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('listings')
        .select('*')
        .eq('seller_id', authState.user?.id);
      
      if (error) throw error;
      return data;
    },
    enabled: !!authState.user?.id,
  });

  const { data: deals, isLoading: isLoadingDeals } = useQuery({
    queryKey: ['seller-deals'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('deals')
        .select('*')
        .eq('seller_id', authState.user?.id);
      
      if (error) throw error;
      return data;
    },
    enabled: !!authState.user?.id,
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Seller Dashboard</h1>
        <Button onClick={() => navigate('/seller/listings/new')}>
          <Plus className="mr-2" /> Create Listing
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package /> Active Listings
            </CardTitle>
            <CardDescription>Manage your product listings</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{listings?.length || 0}</div>
            <Button variant="outline" className="mt-4 w-full" onClick={() => navigate('/seller/listings')}>
              View All Listings
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShoppingCart /> Active Orders
            </CardTitle>
            <CardDescription>Track your ongoing deals</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{deals?.length || 0}</div>
            <Button variant="outline" className="mt-4 w-full" onClick={() => navigate('/seller/orders')}>
              View All Orders
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Overview;
