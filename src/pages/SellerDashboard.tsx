
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Navbar from '@/components/Navbar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

const SellerDashboard = () => {
  const { authState } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect if not logged in or not a seller
    if (!authState.isLoading && (!authState.user || authState.profile?.user_type !== 'seller')) {
      navigate('/login');
    }
  }, [authState, navigate]);

  if (authState.isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!authState.user || authState.profile?.user_type !== 'seller') {
    return null; // Will redirect via useEffect
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold">Seller Dashboard</h1>
            <Button onClick={() => navigate('/seller/listings/new')}>
              <Plus className="h-4 w-4 mr-2" />
              New Listing
            </Button>
          </div>

          <Tabs defaultValue="listings" className="w-full">
            <TabsList className="mb-6">
              <TabsTrigger value="listings">My Listings</TabsTrigger>
              <TabsTrigger value="deals">Active Deals</TabsTrigger>
              <TabsTrigger value="messages">Messages</TabsTrigger>
            </TabsList>
            
            <TabsContent value="listings">
              <Card>
                <CardHeader>
                  <CardTitle>My Listings</CardTitle>
                  <CardDescription>Manage your solar product listings</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center p-8 text-muted-foreground">
                    <p>You don't have any listings yet.</p>
                    <Button variant="outline" className="mt-4" onClick={() => navigate('/seller/listings/new')}>
                      <Plus className="h-4 w-4 mr-2" />
                      Create Your First Listing
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="deals">
              <Card>
                <CardHeader>
                  <CardTitle>Active Deals</CardTitle>
                  <CardDescription>Manage your active deals with customers</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center p-8 text-muted-foreground">
                    <p>You don't have any active deals.</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="messages">
              <Card>
                <CardHeader>
                  <CardTitle>Messages</CardTitle>
                  <CardDescription>Communication with your customers</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center p-8 text-muted-foreground">
                    <p>You don't have any messages.</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default SellerDashboard;
