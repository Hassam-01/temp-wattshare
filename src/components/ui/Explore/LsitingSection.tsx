import { useEffect, useState } from "react";
import { Eye, MapPin, Star } from "lucide-react";
import { Badge } from "../badge";
import { Button } from "../button";
import { FaBookmark, FaRegBookmark } from "react-icons/fa";
import { supabase } from "@/integrations/supabase/client";


interface ListingSectionProps {
  filteredListings: any[];
  totalCount?: number;
  viewMode: string;
  isLoading: boolean;
  condition: string;
  setCondition: (condition: string) => void;
  searchTerm: string;
  setSearchTerm: (searchTerm: string) => void;
  openDetailsModal: (listing: any) => void;
  handleViewDeal: (listing: any) => void;
  updateRating?: (listingId: string, newRating: number) => void;
}

const ListingSection: React.FC<ListingSectionProps> = ({
  filteredListings,
  totalCount,
  viewMode,
  isLoading,
  condition,
  setCondition,
  searchTerm,
  setSearchTerm,
  openDetailsModal,
  handleViewDeal,
  updateRating,
}) => {
  const [hoveredRatings, setHoveredRatings] = useState<Record<string, number>>(
    {}
  );

  const [savedListings, setSavedListings] = useState<Set<string>>(new Set());

  const toggleSaveListing = async (listingId: string) => {
    try {
      const user = (await supabase.auth.getUser()).data.user;
      if (!user) {
        console.error("User not authenticated");
        return;
      }

      const isAlreadySaved = savedListings.has(listingId);

      if (isAlreadySaved) {
        // UNSAVE: Remove from Supabase
        const { error } = await supabase
          .from("saved_listings")
          .delete()
          .match({ user_id: user.id, listing_id: listingId });

        if (error) {
          console.error("Error unsaving listing:", error.message);
          return;
        }

        setSavedListings((prev) => {
          const updated = new Set(prev);
          updated.delete(listingId);
          return updated;
        });
      } else {
        // SAVE: Add to Supabase
        const { error } = await supabase.from("saved_listings").insert([
          {
            user_id: user.id,
            listing_id: listingId,
          },
        ]);

        if (error) {
          console.error("Error saving listing:", error.message);
          return;
        }

        setSavedListings((prev) => new Set(prev).add(listingId));
      }
    } catch (error) {
      console.error("Unexpected error:", error);
    }
  };



  // Inside your component, after the useState declarations:

  useEffect(() => {
    const fetchSavedListings = async () => {
      const user = (await supabase.auth.getUser()).data.user;
      if (!user) return;

      const { data, error } = await supabase
        .from("saved_listings")
        .select("listing_id")
        .eq("user_id", user.id);

      if (error) {
        console.error("Error fetching saved listings:", error.message);
        return;
      }

      const savedIds = new Set(data.map((item) => item.listing_id));
      setSavedListings(savedIds);
    };

    fetchSavedListings();
  }, []);


  const handleStarClick = (listing: any, rating: number) => {
    // Call the parent function to update the rating in your data store
    if (updateRating) {
      updateRating(listing.id, rating);
    }
  };

  const handleStarHover = (listingId: string, rating: number) => {
    setHoveredRatings((prev) => ({ ...prev, [listingId]: rating }));
  };

  const handleStarLeave = (listingId: string) => {
    setHoveredRatings((prev) => {
      const newState = { ...prev };
      delete newState[listingId];
      return newState;
    });
  };

  const renderStars = (listing: any) => {
    const hoveredRating = hoveredRatings[listing.id];

    return [...Array(5)].map((_, i) => {
      const starValue = i + 1;
      const isFilled = hoveredRating
        ? starValue <= hoveredRating
        : starValue <= (listing.rating || 0);

      return (
        <Star
          key={i}
          className={`h-4 w-4 cursor-pointer ${isFilled
            ? "text-amber-400 fill-amber-400"
            : "text-gray-300 dark:text-gray-600"
            }`}
          onClick={() => handleStarClick(listing, starValue)}
          onMouseEnter={() => handleStarHover(listing.id, starValue)}
          onMouseLeave={() => handleStarLeave(listing.id)}
        />
      );
    });
  };

  const renderListCard = (listing: any) => (
    <div
      key={listing.id}
      className="relative group transform transition-transform duration-200 hover:-translate-y-1"
    >
      {listing.is_sponsored && (
        <Badge className="absolute top-4 left-4 z-10 bg-gradient-to-r from-amber-400 to-yellow-300 text-indigo-900 font-medium shadow-md">
          Sponsored
        </Badge>
      )}
      <div className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-200 border border-indigo-100 dark:border-indigo-900/30">
        <div
          className="h-48 overflow-hidden relative"
          onClick={() => openDetailsModal(listing)}
        >
          <div className="rounded-md absolute top-2 right-2 z-10">
            {savedListings.has(listing.id) ? (
              <FaBookmark
                size={24}
                color="black"
                className="cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation();
                  toggleSaveListing(listing.id);
                }}
              />

            ) : (
              <FaRegBookmark
                size={24}
                color="black"
                className="cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation();
                  toggleSaveListing(listing.id);
                }}
              />

            )}
          </div>

          <img
            src={listing.listing_images?.[0]?.image_url || "/placeholder.svg"}
            alt={listing.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 cursor-pointer"
          />
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 flex items-center justify-center transition-all duration-300">
            <Eye className="text-white opacity-0 group-hover:opacity-100 h-8 w-8 transition-opacity duration-300" />
          </div>
        </div>
        <div className="p-6">
          <h3
            className="font-bold text-lg mb-2 text-indigo-900 dark:text-indigo-100 cursor-pointer"
            onClick={() => openDetailsModal(listing)}
          >
            {listing.title}
          </h3>
          <div className="flex items-center mb-2 text-indigo-600 dark:text-indigo-300">
            <MapPin className="h-4 w-4 mr-1" />
            <span className="text-sm">{listing.location}</span>
          </div>
          {/*<div className="flex items-center mb-3">{renderStars(listing)}</div>*/}
          <div className="pt-4 border-t border-indigo-100 dark:border-indigo-800/30 mt-4 flex items-center justify-between">
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-700 to-purple-700 dark:from-indigo-400 dark:to-purple-400">
              ${listing.price.toLocaleString()}
            </span>
            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => openDetailsModal(listing)}
                className="border-indigo-300 text-indigo-700 hover:bg-indigo-100 dark:border-indigo-700 dark:text-indigo-300 dark:hover:bg-indigo-800/30"
              >
                <Eye className="h-4 w-4 mr-1" />
                Preview
              </Button>
              <Button
                variant="outline"
                onClick={() => handleViewDeal(listing)}
                className="border-indigo-600 text-indigo-700 hover:bg-indigo-600 hover:text-white dark:border-indigo-400 dark:text-indigo-300 dark:hover:bg-indigo-600 dark:hover:text-white transition-colors duration-200"
              >
                View Deal
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderListItem = (listing: any) => (
    <div
      key={listing.id}
      className="relative group transform transition-transform duration-200 hover:-translate-y-1"
    >
      {listing.is_sponsored && (
        <Badge className="absolute top-4 left-4 z-10 bg-gradient-to-r from-amber-400 to-yellow-300 text-indigo-900 font-medium shadow-md">
          Sponsored
        </Badge>
      )}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-200 overflow-hidden border border-indigo-100 dark:border-indigo-900/30">
        <div className="flex flex-col md:flex-row">
          <div
            className="w-full md:w-1/3 h-56 relative overflow-hidden cursor-pointer"
            onClick={() => openDetailsModal(listing)}
          >
            <img
              src={listing.listing_images?.[0]?.image_url || "/placeholder.svg"}
              alt={listing.title}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 flex items-center justify-center transition-all duration-300">
              <Eye className="text-white opacity-0 group-hover:opacity-100 h-8 w-8 transition-opacity duration-300" />
            </div>
          </div>
          <div className="p-6 flex-grow flex flex-col justify-between">
            <div>
              <h3
                className="font-bold text-xl mb-2 text-indigo-900 dark:text-indigo-100 cursor-pointer"
                onClick={() => openDetailsModal(listing)}
              >
                {listing.title}
              </h3>
              <div className="flex items-center mb-3 text-indigo-600 dark:text-indigo-300">
                <MapPin className="h-4 w-4 mr-1" />
                <span className="text-sm">{listing.location}</span>
              </div>
              <div className="flex items-center mb-4">
                {renderStars(listing)}
              </div>
              <p className="text-gray-600 dark:text-gray-300 line-clamp-2">
                {listing.condition} condition • Available now
              </p>
            </div>
            <div className="flex items-center justify-between mt-6">
              <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-700 to-purple-700 dark:from-indigo-400 dark:to-purple-400">
                ${listing.price.toLocaleString()}
              </span>
              <div className="flex space-x-3">
                <Button
                  variant="outline"
                  onClick={() => openDetailsModal(listing)}
                  className="border-indigo-300 text-indigo-700 hover:bg-indigo-100 dark:border-indigo-700 dark:text-indigo-300 dark:hover:bg-indigo-800/30"
                >
                  <Eye className="h-4 w-4 mr-1" />
                  Preview
                </Button>
                <Button
                  onClick={() => handleViewDeal(listing)}
                  className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-md hover:shadow-lg transition-all duration-200"
                >
                  View Deal
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <section className="py-12 flex-grow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <p className="text-indigo-900 dark:text-indigo-200">
            Showing{" "}
            <span className="font-semibold text-indigo-700 dark:text-indigo-300">
              {/* Use totalCount if available, otherwise fall back to filteredListings.length */}
              {totalCount !== undefined ? totalCount : filteredListings.length}
            </span>{" "}
            results
            {condition !== "all" && (
              <>
                {" "}
                in{" "}
                <span className="font-semibold text-indigo-700 dark:text-indigo-300">
                  {condition}
                </span>{" "}
                condition
              </>
            )}
            {searchTerm && (
              <>
                {" "}
                matching "
                <span className="font-semibold text-indigo-700 dark:text-indigo-300">
                  {searchTerm}
                </span>
                "
              </>
            )}
          </p>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center min-h-[400px]">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600 dark:border-indigo-400"></div>
          </div>
        ) : filteredListings.length === 0 ? (
          <div className="bg-white/80 dark:bg-gray-800/50 p-8 rounded-xl shadow-lg backdrop-blur-sm border border-indigo-100 dark:border-indigo-900/50 text-center">
            <p className="text-xl text-indigo-800 dark:text-indigo-200 mb-6">
              No listings found matching your criteria.
            </p>
            <Button
              onClick={() => {
                setSearchTerm("");
                setCondition("all");
              }}
              className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-md hover:shadow-lg transition-all duration-200"
            >
              Reset Filters
            </Button>
          </div>
        ) : viewMode === "grid" ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredListings.map((listing) => renderListCard(listing))}
          </div>
        ) : (
          <div className="space-y-6">
            {filteredListings.map((listing) => renderListItem(listing))}
          </div>
        )}
      </div>
    </section>
  );
};

export default ListingSection;
