import { useNavigate } from "react-router-dom";
import { Button } from "../button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../dialog";
interface DetailModalProps {
  open: boolean;
  onClose: () => void;
  listing: any;
  onMessage: (listingId: any) => void;
  onMakeDeal: (listingId: any) => void;
}
const DetailModal: React.FC<DetailModalProps> = ({
  open,
  onClose,
  listing,
  onMessage,
  onMakeDeal,
}) => {
  const navigate = useNavigate();
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto bg-white dark:bg-gray-800 border border-indigo-100 dark:border-indigo-900/50 rounded-xl shadow-xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-indigo-900 dark:text-indigo-100">
            {listing?.title}
          </DialogTitle>
          <DialogDescription className="text-indigo-700 dark:text-indigo-300">
            <div className="mt-4 space-y-6">
              <div className="rounded-lg overflow-hidden shadow-md">
                <img
                  src={
                    listing?.listing_images?.[0]?.image_url ||
                    "/placeholder.svg"
                  }
                  alt={listing?.title}
                  className="w-full h-56 object-cover"
                />
              </div>
              <div className="space-y-3 text-gray-800 dark:text-gray-200">
                <p className="flex justify-between border-b border-indigo-100 dark:border-indigo-800/30 pb-2">
                  <span className="font-semibold text-indigo-900 dark:text-indigo-100">
                    Price:
                  </span>
                  <span className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-700 to-purple-700 dark:from-indigo-400 dark:to-purple-400">
                    ${listing?.price?.toLocaleString()}
                  </span>
                </p>
                <p className="flex justify-between border-b border-indigo-100 dark:border-indigo-800/30 pb-2">
                  <span className="font-semibold text-indigo-900 dark:text-indigo-100">
                    Location:
                  </span>
                  <span>{listing?.location}</span>
                </p>
                <p className="flex justify-between border-b border-indigo-100 dark:border-indigo-800/30 pb-2">
                  <span className="font-semibold text-indigo-900 dark:text-indigo-100">
                    Condition:
                  </span>
                  <span className="capitalize">{listing?.condition}</span>
                </p>
                <p className="flex justify-between border-b border-indigo-100 dark:border-indigo-800/30 pb-2">
                  <span className="font-semibold text-indigo-900 dark:text-indigo-100">
                    Available Units:
                  </span>
                  <span>5</span>
                </p>
                <div className="mt-4 p-3 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg">
                  <p className="text-sm text-indigo-800 dark:text-indigo-200">
                    This is a premium listing from a verified seller. The
                    product comes with a standard warranty and free installation
                    support.
                  </p>
                </div>
              </div>
            </div>
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex gap-3 mt-6">
          <Button
            variant="outline"
            onClick={() => {
              onClose();
              onMessage(listing.id);
            }}
            className="flex-1 border-indigo-600 text-indigo-700 hover:bg-indigo-600 hover:text-white dark:border-indigo-400 dark:text-indigo-300 dark:hover:bg-indigo-600 dark:hover:text-white transition-colors duration-200"
          >
            Message Seller
          </Button>
          <Button
            onClick={() => {
              onClose();
              navigate(`/listing/${listing.id}`);
            }}
            className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-md hover:shadow-lg transition-all duration-200"
          >
            View Full Details
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DetailModal;
