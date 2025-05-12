import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import ListingCard from "@/components/ListingCard";
import Navbar from "@/components/Navbar";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Package } from "lucide-react";

const SavedDeals = () => {
  const { authState } = useAuth();
  const navigate = useNavigate();

  const { data: savedListings, isLoading, error } = useQuery({
    queryKey: ["user-saved-listings", authState.user?.id],
    queryFn: async () => {
      if (!authState.user) return [];
      
      const { data, error } = await supabase
        .from("saved_listings")
        .select(
          `
          id,
          listings (
            id,
            title,
            price,
            location,
            condition,
            rating,
            listing_images (
              image_url,
              is_primary
            )
          )
        `
        )
        .eq("user_id", authState.user.id);

      if (error) throw error;
      return data || [];
    },
    enabled: !!authState.user?.id,
  });

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

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Saved Deals</h1>

        {savedListings && savedListings.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {savedListings.map((savedListing) => {
              const listing = savedListing.listings;
              const primaryImage =
                listing.listing_images.find((img) => img.is_primary) ||
                (listing.listing_images.length > 0
                  ? listing.listing_images[0]
                  : null);

              return (
                <ListingCard
                  key={listing.id}
                  id={listing.id}
                  title={listing.title}
                  price={listing.price}
                  location={listing.location}
                  image={primaryImage?.image_url || "/placeholder.svg"}
                  condition={listing.condition}
                  rating={listing.rating || 0}
                  isSaved={true}
                />
              );
            })}
          </div>
        ) : (
          <Card>
            <CardContent className="text-center p-8 text-muted-foreground">
              <Package className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <p>You don't have any saved deals yet.</p>
              <Button
                variant="outline"
                className="mt-4"
                onClick={() => navigate("/explore")}
              >
                Explore Products
              </Button>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
};

export default SavedDeals;
