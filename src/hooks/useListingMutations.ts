import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const useSaveListing = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ listingId, userId, isSaved }: { 
      listingId: string; 
      userId: string; 
      isSaved: boolean 
    }) => {
      if (!isSaved) {
            const { data, error } = await supabase
              .from("saved_listings")
              .upsert({ listing_id: listingId, user_id: userId })
              .single();
            if (error) throw error;
            return data;
          } else {
            const { error } = await supabase
              .from("saved_listings")
              .delete()
              .eq("listing_id", listingId)
              .eq("user_id", userId);
            if (error) throw error;
          }
    },
    onSuccess: (_, variables) => {
      // invalidate the saved listings query to trigger a refetch
      queryClient.invalidateQueries({ 
        queryKey: ["user-saved-listings", variables.userId] 
      });
    },
    onError: (error: any) => {
      if (error.code ) { 
        toast.error("Failed to update saved listing");
        console.error(error);
      }
    },
  });
};