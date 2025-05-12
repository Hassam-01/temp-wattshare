
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import Navbar from '@/components/Navbar';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { toast } from 'sonner';
import { CreditCard, MapPin, Loader2 } from 'lucide-react';

const Payment = () => {
  const { listingId } = useParams<{ listingId: string }>();
  const { authState } = useAuth();
  const navigate = useNavigate();
  const [paymentMethod, setPaymentMethod] = useState('credit_card');
  const [isProcessing, setIsProcessing] = useState(false);

  // Fetch listing details
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
          ),
          listing_images (
            image_url,
            is_primary
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
      toast.info('Please sign in to complete your purchase');
      navigate('/auth', { state: { returnTo: `/payment/${listingId}` } });
    }
    
    // Check if user is trying to purchase their own listing
    if (!authState.isLoading && listing && authState.user?.id === listing.seller_id) {
      toast.info("You can't purchase your own listing");
      navigate(`/listing/${listingId}`);
    }
  }, [authState, navigate, listingId, listing]);

  // Find primary image or use first available
  const primaryImage = listing?.listing_images?.find(img => img.is_primary) || 
                      (listing?.listing_images?.length > 0 ? listing.listing_images[0] : null);

  const handlePayment = async () => {
    if (!authState.user) {
      toast.error('You must be logged in to make a purchase');
      navigate('/auth', { state: { returnTo: `/payment/${listingId}` } });
      return;
    }

    setIsProcessing(true);
    try {
      // Create or get existing deal
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
        
        // Update deal status
        const { error: updateError } = await supabase
          .from('deals')
          .update({ status: 'paid' })
          .eq('id', dealId);
        
        if (updateError) throw updateError;
      } else {
        // Create new deal
        const { data: newDeal, error: createError } = await supabase
          .from('deals')
          .insert({
            listing_id: listingId,
            seller_id: listing.seller_id,
            customer_id: authState.user.id,
            status: 'paid'
          })
          .select()
          .single();
        
        if (createError) throw createError;
        dealId = newDeal.id;
      }

      // Create payment record
      const { error: paymentError } = await supabase
        .from('payments')
        .insert({
          deal_id: dealId,
          amount: listing.price,
          payment_method: paymentMethod,
          status: 'completed',
          transaction_id: `TXN-${Math.floor(Math.random() * 1000000)}`
        });
      
      if (paymentError) throw paymentError;
      
      // Send a confirmation message
      const { error: messageError } = await supabase
        .from('messages')
        .insert({
          deal_id: dealId,
          sender_id: authState.user.id,
          receiver_id: listing.seller_id,
          content: `I've completed the payment for ${listing.title} at $${listing.price}. Looking forward to receiving it!`
        });
      
      if (messageError) throw messageError;
      
      toast.success('Payment successful!');
      navigate(`/purchases`);
    } catch (error) {
      console.error('Payment error:', error);
      toast.error('Payment failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex items-center justify-center min-h-[calc(100vh-64px)]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
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
        <h1 className="text-2xl font-bold mb-6">Complete Your Purchase</h1>
        
        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
              <CardDescription>Review your order details</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4">
                <div className="w-24 h-24 rounded-md overflow-hidden">
                  <img 
                    src={primaryImage?.image_url || '/placeholder.svg'} 
                    alt={listing.title}
                    className="w-full h-full object-cover" 
                  />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium">{listing.title}</h3>
                  <div className="flex items-center text-sm text-muted-foreground mt-1">
                    <MapPin className="h-3.5 w-3.5 mr-1" />
                    {listing.location}
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground mt-1">
                    Condition: {listing.condition}
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground mt-1">
                    Seller: {listing.profiles.first_name} {listing.profiles.last_name}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xl font-semibold">${listing.price}</div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Payment Method</CardTitle>
              <CardDescription>Select how you want to pay</CardDescription>
            </CardHeader>
            <CardContent>
              <RadioGroup 
                value={paymentMethod} 
                onValueChange={setPaymentMethod}
                className="space-y-3"
              >
                <div className="flex items-center space-x-2 border p-4 rounded-md">
                  <RadioGroupItem value="credit_card" id="credit_card" />
                  <Label htmlFor="credit_card" className="flex items-center">
                    <CreditCard className="h-4 w-4 mr-2" />
                    Credit/Debit Card
                  </Label>
                </div>
                <div className="flex items-center space-x-2 border p-4 rounded-md">
                  <RadioGroupItem value="paypal" id="paypal" />
                  <Label htmlFor="paypal">PayPal</Label>
                </div>
                <div className="flex items-center space-x-2 border p-4 rounded-md">
                  <RadioGroupItem value="bank_transfer" id="bank_transfer" />
                  <Label htmlFor="bank_transfer">Bank Transfer</Label>
                </div>
              </RadioGroup>
            </CardContent>
            <CardFooter className="flex justify-between border-t pt-6">
              <Button variant="outline" onClick={() => navigate(`/listing/${listingId}`)}>
                Back
              </Button>
              <Button 
                onClick={handlePayment}
                disabled={isProcessing}
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  `Pay $${listing.price}`
                )}
              </Button>
            </CardFooter>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Payment;
