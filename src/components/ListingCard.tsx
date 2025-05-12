import { useState } from "react";
import { Bookmark, MapPin, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { toast as toast2 } from "sonner";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useSaveListing } from "@/hooks/useListingMutations";

interface ListingCardProps {
  id: string;
  title: string;
  price: number;
  location: string;
  image: string;
  condition: string;
  rating: number;
  isSaved?: boolean;
}
const ListingCard = ({
  id,
  title,
  price,
  location,
  image,
  condition,
  rating,
  isSaved = false,
}: ListingCardProps) => {
  const { authState } = useAuth();
  const [saved, setSaved] = useState(isSaved);
  const navigate = useNavigate();
  const {mutate: saveListing} = useSaveListing();
  const toggleSave = (e) => {
    e.stopPropagation();
    // handleSaveListing();
    setSaved(!saved);
    toast({
      title: !saved ? "Listing saved!" : "Listing removed from saved",
      description: !saved
        ? "You can find this in your saved deals."
        : "This listing has been removed from your saved deals.",
    });
    saveListing({
      listingId: id,
      userId: authState.user?.id,
      isSaved: saved,
    });
    
  };
  const handleViewDeal = () => {
    navigate(`/listing/${id}`);
  };

  return (
    <div className="solar-card group cursor-pointer" onClick={handleViewDeal}>
      <div className="relative overflow-hidden">
        <img
          src={image}
          alt={title}
          className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute top-2 right-2">
          <button
            onClick={toggleSave}
            className={`p-2 rounded-full ${
              saved ? "bg-solar-yellow text-black" : "bg-white text-gray-500"
            } hover:scale-105 transition-all`}
          >
            <Bookmark className="h-5 w-5" />
          </button>
        </div>
        <div className="absolute bottom-2 left-2 bg-white px-2 py-1 rounded text-sm font-medium">
          {condition}
        </div>
      </div>
      <div className="p-4">
        <h3 className="font-bold text-lg mb-1 text-gray-800">{title}</h3>
        <div className="flex items-center mb-2 text-gray-600">
          <MapPin className="h-4 w-4 mr-1" />
          <span className="text-sm">{location}</span>
        </div>
        <div className="flex items-center mb-3">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`h-4 w-4 ${
                i < rating
                  ? "text-solar-yellow fill-solar-yellow"
                  : "text-gray-300"
              }`}
            />
          ))}
        </div>
        <div className="flex items-center justify-between">
          <span className="text-xl font-bold text-solar-darkblue">
            ${price.toLocaleString()}
          </span>
          <Button
            variant="outline"
            className="border-solar-blue text-solar-blue hover:bg-solar-blue hover:text-white"
            onClick={(e) => {
              e.stopPropagation();
              handleViewDeal();
            }}
          >
            View Deal
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ListingCard;
