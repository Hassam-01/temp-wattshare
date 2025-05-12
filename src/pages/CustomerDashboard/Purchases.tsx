
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Package, MessageSquare, CheckCircle, Clock } from 'lucide-react';
import Navbar from '@/components/Navbar';
import { format } from 'date-fns';

const Purchases = () => {
  const { authState } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!authState.isLoading && (!authState.user || authState.profile?.user_type !== 'customer')) {
      navigate('/auth');
    }
  }, [authState, navigate]);

  const { data: purchases, isLoading } = useQuery({
    queryKey: ['customer-purchases'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('deals')
        .select(`
          *,
          listings (
            id,
            title,
            price,
            seller_id,
            description,
            listing_images (
              image_url,
              is_primary
            )
          ),
          payments (
            id,
            amount,
            status,
            payment_method,
            created_at
          ),
          seller:profiles!deals_seller_id_fkey (
            id,
            first_name,
            last_name
          )
        `)
        .eq('customer_id', authState.user?.id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
    enabled: !!authState.user?.id,
  });

  if (authState.isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!authState.user || authState.profile?.user_type !== 'customer') {
    return null; // Will redirect via useEffect
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">My Purchases</h1>
        
        {isLoading ? (
          <div className="flex justify-center p-8">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : purchases && purchases.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {purchases.map((deal) => {
              const listing = deal.listings;
              const payment = deal.payments && deal.payments.length > 0 ? deal.payments[0] : null;
              const primaryImage = listing.listing_images.find(img => img.is_primary) || 
                                 (listing.listing_images.length > 0 ? listing.listing_images[0] : null);
              const imageUrl = primaryImage?.image_url || '/placeholder.svg';
              
              return (
                <Card key={deal.id} className="overflow-hidden">
                  <div className="relative h-48">
                    <img
                      src={imageUrl}
                      alt={listing.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2 right-2">
                      <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                        deal.status === 'paid' ? 'bg-green-500 text-white' : 
                        deal.status === 'pending' ? 'bg-yellow-500 text-white' : 
                        'bg-gray-500 text-white'
                      }`}>
                        {deal.status.charAt(0).toUpperCase() + deal.status.slice(1)}
                      </div>
                    </div>
                  </div>
                  <CardHeader>
                    <CardTitle className="line-clamp-1">{listing.title}</CardTitle>
                    <CardDescription>
                      From: {deal.seller.first_name} {deal.seller.last_name}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-xl font-bold mb-2">${listing.price}</p>
                    <p className="text-sm text-gray-500 mb-4 line-clamp-2">{listing.description}</p>
                    
                    {payment && (
                      <div className="bg-muted p-3 rounded-md text-sm mb-4">
                        <div className="flex items-center mb-1">
                          {payment.status === 'completed' ? (
                            <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                          ) : (
                            <Clock className="h-4 w-4 text-yellow-500 mr-2" />
                          )}
                          <span>
                            Payment {payment.status === 'completed' ? 'completed' : 'processing'}
                          </span>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {format(new Date(payment.created_at), 'PPP')} via {payment.payment_method.replace('_', ' ')}
                        </div>
                      </div>
                    )}
                  </CardContent>
                  <CardFooter className="flex gap-2 border-t pt-4">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex-1"
                      onClick={() => navigate(`/listing/${listing.id}`)}
                    >
                      View Listing
                    </Button>
                    <Button 
                      variant="secondary" 
                      size="sm" 
                      className="flex-1"
                      onClick={() => navigate(`/messages/${deal.id}`)}
                    >
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Message
                    </Button>
                  </CardFooter>
                </Card>
              );
            })}
          </div>
        ) : (
          <Card>
            <CardContent className="text-center p-8 text-muted-foreground">
              <Package className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <p>You don't have any purchases yet.</p>
              <Button variant="outline" className="mt-4" onClick={() => navigate('/explore')}>
                Explore Products
              </Button>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
};

export default Purchases;
