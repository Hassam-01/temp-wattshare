import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import DetailModal from "@/components/ui/Explore/DetailModal";
import ListingSection from "@/components/ui/Explore/LsitingSection";
import FiltersSection from "@/components/ui/Explore/FiltersSection";
import { Button } from "@/components/ui/button";

const ITEMS_PER_PAGE = 100;

const Explore = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [condition, setCondition] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [viewMode, setViewMode] = useState("grid");
  const [selectedListing, setSelectedListing] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const loadMoreRef = useRef<HTMLDivElement>(null);

  // Function to get filtered paid listing IDs
  const getFilteredPaidListingIds = async () => {
    const { data: dealsData } = await supabase
      .from("deals")
      .select("listing_id")
      .eq("status", "paid");

    return dealsData?.map((deal) => deal.listing_id) || [];
  };

  // Function to get the total count of filtered listings
  const fetchTotalCount = async () => {
    const paidListingIds = await getFilteredPaidListingIds();
  
    let countQuery = supabase.from("listings").select("id", { count: "exact" });
  
    // Exclude paid listings only if there are any
    if (paidListingIds.length > 0) {
      countQuery = countQuery.not("id", "in", `(${paidListingIds.join(",")})`);
    }
  
    // Apply filters
    if (searchTerm) {
      countQuery = countQuery.or(
        `title.ilike.%${searchTerm}%,location.ilike.%${searchTerm}%`
      );
    }
  
    if (condition !== "all") {
      countQuery = countQuery.ilike("condition", condition);
    }
  
    const { count, error } = await countQuery;
  
    if (error) throw error;
    return count || 0;
  };

  // Separate query for the total count
  const { data: totalCount = 0, refetch: refetchCount } = useQuery({
    queryKey: ["listingsCount", searchTerm, condition],
    queryFn: fetchTotalCount,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  // Function to fetch paginated listings from Supabase
  const fetchListings = async ({ pageParam = 0 }) => {
    const paidListingIds = await getFilteredPaidListingIds();
  
    let query = supabase
      .from("listings")
      .select(
        `
        *,
        listing_images (id, image_url, is_primary),
        profiles:seller_id (first_name, last_name)
      `
      )
      .range(pageParam * ITEMS_PER_PAGE, (pageParam + 1) * ITEMS_PER_PAGE - 1);
  
    // Exclude paid listings only if there are any
    if (paidListingIds.length > 0) {
      query = query.not("id", "in", `(${paidListingIds.join(",")})`);
    }
  
    // Apply filters
    if (searchTerm) {
      query = query.or(
        `title.ilike.%${searchTerm}%,location.ilike.%${searchTerm}%`
      );
    }
  
    if (condition !== "all") {
      query = query.ilike("condition", condition);
    }
  
    // Apply sorting
    switch (sortBy) {
      case "price_low":
        query = query.order("price", { ascending: true });
        break;
      case "price_high":
        query = query.order("price", { ascending: false });
        break;
      case "rating":
        query = query.order("rating", { ascending: false });
        break;
      default:
        query = query.order("created_at", { ascending: false });
        break;
    }
  
    const { data, error } = await query;
  
    if (error) throw error;
  
    return {
      data: data || [],
      nextPage: data?.length === ITEMS_PER_PAGE ? pageParam + 1 : undefined,
    };
  };
  
  // Use React Query's useInfiniteQuery for pagination
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    refetch,
  } = useInfiniteQuery({
    queryKey: ["listings", searchTerm, condition, sortBy],
    queryFn: fetchListings,
    getNextPageParam: (lastPage) => lastPage.nextPage,
    initialPageParam: 0,
  });

  // Flattened listings from all pages
  const allLoadedListings = data?.pages.flatMap((page) => page.data) || [];

  // Refetch when filters change
  useEffect(() => {
    refetch();
    refetchCount();
  }, [searchTerm, condition, sortBy, refetch, refetchCount]);

  // Intersection Observer for infinite scrolling
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 0.1 }
    );

    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current);
    }

    return () => {
      if (loadMoreRef.current) {
        observer.unobserve(loadMoreRef.current);
      }
    };
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const handleViewDeal = (listing) => {
    navigate(`/listing/${listing.id}`);
  };

  const openDetailsModal = (listing) => {
    setSelectedListing(listing);
    setShowDetailsModal(true);
  };

  const handleMessage = (listingId) => {
    navigate(`/contact/${listingId}`);
  };

  const handleMakeDeal = (listingId) => {
    navigate(`/contact/${listingId}`);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 to-slate-100 dark:from-gray-900 dark:to-gray-950">
      <Navbar />

      {/* Header section */}
      <section className="bg-gradient-to-r from-indigo-900 to-purple-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-200 to-purple-200">
            Explore Solar Listings
          </h1>
          <p className="text-lg text-blue-100">
            Find the perfect solar equipment for your needs. Browse through our
            extensive collection of unsold listings.
          </p>
        </div>
      </section>

      {/* Filters section */}
      <FiltersSection
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        condition={condition}
        setCondition={setCondition}
        sortBy={sortBy}
        setSortBy={setSortBy}
        viewMode={viewMode}
        setViewMode={setViewMode}
      />

      {/* Listings section */}
      <ListingSection
        filteredListings={allLoadedListings}
        totalCount={totalCount}
        viewMode={viewMode}
        isLoading={isLoading}
        condition={condition}
        setCondition={setCondition}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        openDetailsModal={openDetailsModal}
        handleViewDeal={handleViewDeal}
      />

      {/* Load More section - this div is used for intersection observer */}
      <div ref={loadMoreRef} className="flex justify-center my-8">
        {isFetchingNextPage ? (
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-600"></div>
            <span className="ml-2 text-gray-600">Loading more listings...</span>
          </div>
        ) : hasNextPage ? (
          <Button
            onClick={() => fetchNextPage()}
            className="px-8 py-4 text-lg"
            variant="outline"
          >
            Load More
          </Button>
        ) : allLoadedListings.length > 0 ? (
          <span className="text-gray-500">All listings loaded</span>
        ) : null}
      </div>

      {/* Details Modal */}
      <DetailModal
        open={showDetailsModal}
        onClose={() => setShowDetailsModal(false)}
        listing={selectedListing}
        onMessage={handleMessage}
        onMakeDeal={handleMakeDeal}
      />

      <Footer />
    </div>
  );
};

export default Explore;
