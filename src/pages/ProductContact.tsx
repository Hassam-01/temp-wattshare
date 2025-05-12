
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import Navbar from '@/components/Navbar';

const ProductContact = () => {
  const { listingId } = useParams<{ listingId: string }>();
  const { authState } = useAuth();
  const navigate = useNavigate();
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);

  const { data: listing, isLoading } = useQuery({
    queryKey: ['listing', listingId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('listings')
        .select(`
          *,
          profiles:seller_id (
            id,
            first_name,
            last_name
          )
        `)
        .eq('id', listingId)
        .single();
      
      if (error) throw error;
      return data;
    },
    enabled: !!listingId,
  });

  useEffect(() => {
    // Check if user is authenticated
    if (!authState.isLoading && !authState.user) {
      toast.info('Please sign in to contact the seller');
      navigate('/auth', { state: { returnTo: `/contact/${listingId}` } });
    }
    
    // Check if user is trying to contact their own listing
    if (!authState.isLoading && listing && authState.user?.id === listing.seller_id) {
      toast.info("You can't contact yourself for your own listing");
      navigate(`/listing/${listingId}`);
    }
  }, [authState, navigate, listingId, listing]);

  const handleContactSeller = async () => {
    if (!authState.user) {
      toast.error('You must be logged in to contact the seller');
      navigate('/auth', { state: { returnTo: `/contact/${listingId}` } });
      return;
    }

    if (!message.trim()) {
      toast.error('Please enter a message');
      return;
    }

    setIsSending(true);
    try {
      // First create a deal if one doesn't exist
      let dealId;
      const { data: existingDeals, error: dealsError } = await supabase
        .from('deals')
        .select('id')
        .eq('listing_id', listingId)
        .eq('customer_id', authState.user.id)
        .eq('seller_id', listing.seller_id)
        .maybeSingle();

      if (dealsError) throw dealsError;
      
      if (existingDeals) {
        dealId = existingDeals.id;
      } else {
        // Create new deal
        const { data: newDeal, error: createError } = await supabase
          .from('deals')
          .insert({
            listing_id: listingId,
            seller_id: listing.seller_id,
            customer_id: authState.user.id,
            status: 'pending'
          })
          .select()
          .single();
        
        if (createError) throw createError;
        dealId = newDeal.id;
      }

      // Now create the message
      const { error: messageError } = await supabase
        .from('messages')
        .insert({
          deal_id: dealId,
          sender_id: authState.user.id,
          receiver_id: listing.seller_id,
          content: message
        });
      
      if (messageError) throw messageError;
      
      toast.success('Message sent successfully!');
      navigate(`/messages/${dealId}`);
    } catch (error: any) {
      toast.error(error.message || 'Failed to send message');
    } finally {
      setIsSending(false);
    }
  };

  if (authState.isLoading || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="container max-w-3xl mx-auto px-4 py-8">
          <Card>
            <CardContent className="text-center p-8">
              <p>Listing not found</p>
              <Button className="mt-4" onClick={() => navigate('/explore')}>
                Back to Explore
              </Button>
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container max-w-3xl mx-auto px-4 py-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Contact Seller</CardTitle>
            <CardDescription>
              You're interested in: <span className="font-semibold">{listing.title}</span> (${listing.price})
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-muted p-4 rounded-md">
              <h3 className="text-sm font-semibold mb-1">Seller</h3>
              <p>{listing.profiles.first_name} {listing.profiles.last_name}</p>
            </div>
            
            <div>
              <label htmlFor="message" className="block text-sm font-medium mb-2">
                Your Message
              </label>
              <Textarea
                id="message"
                placeholder="Introduce yourself and let the seller know why you're interested in their product"
                rows={6}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full"
              />
            </div>
            
            <div className="flex justify-between">
              <Button variant="outline" onClick={() => navigate(-1)}>
                Cancel
              </Button>
              <Button 
                onClick={handleContactSeller}
                disabled={isSending || !message.trim()}
              >
                {isSending ? 'Sending...' : 'Send Message & Make Offer'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default ProductContact;
