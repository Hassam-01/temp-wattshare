
import { useAuth } from '@/contexts/AuthContext';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Package, Edit, Trash } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

const Listings = () => {
  const { authState } = useAuth();
  const navigate = useNavigate();

  const { data: listings, isLoading, refetch } = useQuery({
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

  const handleDeleteListing = async (id: string) => {
    try {
      const { error } = await supabase
        .from('listings')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      toast.success('Listing deleted successfully');
      refetch();
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete listing');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">My Listings</h1>
        <Button onClick={() => navigate('/seller/listings/new')}>
          <Plus className="mr-2" /> Create Listing
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center p-8">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : listings && listings.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {listings.map((listing) => (
            <Card key={listing.id}>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">{listing.title}</CardTitle>
                <CardDescription>${listing.price}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-500 mb-4 line-clamp-2">{listing.description}</p>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => navigate(`/seller/listings/${listing.id}/edit`)}>
                    <Edit className="h-4 w-4 mr-1" /> Edit
                  </Button>
                  <Button variant="destructive" size="sm" onClick={() => handleDeleteListing(listing.id)}>
                    <Trash className="h-4 w-4 mr-1" /> Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="text-center p-8 text-muted-foreground">
            <Package className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <p>You don't have any listings yet.</p>
            <Button variant="outline" className="mt-4" onClick={() => navigate('/seller/listings/new')}>
              <Plus className="h-4 w-4 mr-2" />
              Create Your First Listing
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Listings;
