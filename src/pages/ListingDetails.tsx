import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { MapPin, User, Star, MessageSquare, ShoppingCart } from "lucide-react";
import Navbar from "@/components/Navbar";

const ListingDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { authState } = useAuth();

  const [localRating, setLocalRating] = useState<number | null>(null);
  const { data: listing, isLoading } = useQuery({
    queryKey: ["listing", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("listings")
        .select(
          `
          *,
          profiles:seller_id (
            id,
            first_name,
            last_name,
            user_type
          ),
          listing_images (
            image_url,
            is_primary
          )
        `
        )
        .eq("id", id)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!id,
  });

  const handleContactSeller = () => {
    if (!authState.user) {
      toast.info("Please sign in to contact the seller");
      navigate("/auth", { state: { returnTo: `/listing/${id}` } });
      return;
    }

    if (authState.profile?.user_type !== "customer") {
      toast.info("Only customers can contact sellers");
      return;
    }

    navigate(`/contact/${id}`);
  };

  const handleBuyNow = () => {
    if (!authState.user) {
      toast.info("Please sign in to purchase this item");
      navigate("/auth", { state: { returnTo: `/listing/${id}` } });
      return;
    }

    if (authState.profile?.user_type !== "customer") {
      toast.info("Only customers can purchase items");
      return;
    }

    navigate(`/payment/${id}`);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="container max-w-7xl mx-auto px-4 py-8">
          <div className="flex justify-center items-center min-h-[60vh]">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        </main>
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="container max-w-7xl mx-auto px-4 py-8">
          <Card>
            <CardContent className="pt-6">
              <p className="text-center">Listing not found</p>
              <div className="flex justify-center mt-4">
                <Button onClick={() => navigate("/explore")}>
                  Back to Explore
                </Button>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

  // Find the primary image or use the first one
  const primaryImage =
    listing.listing_images.find((img) => img.is_primary) ||
    (listing.listing_images.length > 0 ? listing.listing_images[0] : null);
  const imageUrl = primaryImage ? primaryImage.image_url : "/placeholder.svg";

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card>
              <div className="relative aspect-video w-full overflow-hidden rounded-t-lg">
                <img
                  src={imageUrl}
                  alt={listing.title}
                  className="h-full w-full object-cover"
                />
              </div>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-2xl mb-2">
                      {listing.title}
                    </CardTitle>
                    <CardDescription className="flex items-center mb-2">
                      <MapPin className="h-4 w-4 mr-1" />
                      {listing.location}
                    </CardDescription>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-solar-darkblue mb-2">
                      ${listing.price.toLocaleString()}
                    </div>
                    <Badge variant="outline" className="bg-gray-100">
                      {listing.condition}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center mb-6">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      onClick={async () => {
                        if (!authState.user) {
                          toast.info("Please sign in to rate this listing");
                          navigate("/auth", {
                            state: { returnTo: `/listing/${id}` },
                          });
                          return;
                        }

                        try {
                          const { error } = await supabase
                            .from("listings")
                            .update({ rating: i + 1 })
                            .eq("id", id);

                          if (error) throw error;

                          setLocalRating(i + 1);
                          listing.rating = i + 1;
                        } catch (error) {
                          toast.error("Failed to submit rating");
                        }
                      }}
                      className={`${
                        i < ((localRating ?? listing.rating) || 0)
                          ? "text-solar-yellow fill-solar-yellow"
                          : "text-black-300"
                      }`}
                    />
                  ))}
                </div>

                <div className="mb-8">
                  <h3 className="text-lg font-semibold mb-2">Description</h3>
                  <p className="text-gray-700 whitespace-pre-line">
                    {listing.description}
                  </p>
                </div>

                <div className="mt-6 space-y-4">
                  {listing.listing_images.length > 1 && (
                    <div>
                      <h3 className="text-lg font-semibold mb-3">
                        More Images
                      </h3>
                      <div className="grid grid-cols-3 gap-4">
                        {listing.listing_images.map((image, index) => (
                          <div
                            key={index}
                            className="aspect-square overflow-hidden rounded-md"
                          >
                            <img
                              src={image.image_url}
                              alt={`${listing.title} ${index + 1}`}
                              className="h-full w-full object-cover"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          <div>
            <Card>
              <CardHeader>
                <CardTitle>Seller Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-4 mb-6">
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <User className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">
                      {listing.profiles?.first_name}{" "}
                      {listing.profiles?.last_name}
                    </p>
                    <p className="text-sm text-muted-foreground capitalize">
                      {listing.profiles?.user_type}
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  {authState.user?.id !== listing.seller_id &&
                    authState.profile?.user_type === "customer" && (
                      <>
                        <Button className="w-full" onClick={handleBuyNow}>
                          <ShoppingCart className="mr-2 h-4 w-4" />
                          Buy Now
                        </Button>

                        <Button
                          variant="outline"
                          onClick={handleContactSeller}
                          className="w-full"
                        >
                          <MessageSquare className="mr-2 h-4 w-4" />
                          Contact Seller
                        </Button>
                      </>
                    )}

                  {authState.user?.id === listing.seller_id && (
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => navigate("/seller/listings")}
                    >
                      Manage Your Listings
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ListingDetails;
