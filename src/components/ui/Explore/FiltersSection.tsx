import { Grid, List, Search } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../select";
import { Input } from "../input";

interface FiltersSectionProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  condition: string;
  setCondition: (condition: string) => void;
  sortBy: string;
  setSortBy: (sortBy: string) => void;
  viewMode: string;
  setViewMode: (mode: string) => void;
}

const FiltersSection: React.FC<FiltersSectionProps> = ({
  searchTerm,
  setSearchTerm,
  condition,
  setCondition,
  sortBy,
  setSortBy,
  viewMode,
  setViewMode,
}: FiltersSectionProps) => {
  return (
    <section className="py-8 bg-white/50 dark:bg-gray-800/30 backdrop-blur-sm shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap gap-4 items-center">
          <div className="relative flex-grow min-w-[200px]">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-indigo-400 dark:text-indigo-300" />
            <Input
              type="text"
              placeholder="Search listings..."
              className="pl-10 border-indigo-200 dark:border-indigo-900 focus:ring-indigo-500 dark:focus:ring-indigo-400 dark:bg-gray-800 dark:text-white"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex flex-wrap gap-4 items-center">
            <Select value={condition} onValueChange={setCondition}>
              <SelectTrigger className="w-[180px] bg-white/80 dark:bg-gray-800 border-indigo-200 dark:border-indigo-700">
                <SelectValue placeholder="Condition" />
              </SelectTrigger>
              <SelectContent className="bg-white dark:bg-gray-800 border-indigo-200 dark:border-indigo-700">
                <SelectItem value="all">All Conditions</SelectItem>
                <SelectItem value="new">New</SelectItem>
                <SelectItem value="like new">Like New</SelectItem>
                <SelectItem value="used">Used</SelectItem>
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[180px] bg-white/80 dark:bg-gray-800 border-indigo-200 dark:border-indigo-700">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent className="bg-white dark:bg-gray-800 border-indigo-200 dark:border-indigo-700">
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="price_low">Price: Low to High</SelectItem>
                <SelectItem value="price_high">Price: High to Low</SelectItem>
                <SelectItem value="rating">Highest Rated</SelectItem>
              </SelectContent>
            </Select>

            <div className="flex items-center rounded-md overflow-hidden shadow-sm dark:shadow-indigo-900/20">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 ${
                  viewMode === "grid"
                    ? "bg-gradient-to-r from-indigo-700 to-purple-700 text-white"
                    : "bg-white/80 text-indigo-700 dark:bg-gray-800 dark:text-indigo-300"
                } transition-all duration-200`}
              >
                <Grid className="h-5 w-5" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 ${
                  viewMode === "list"
                    ? "bg-gradient-to-r from-indigo-700 to-purple-700 text-white"
                    : "bg-white/80 text-indigo-700 dark:bg-gray-800 dark:text-indigo-300"
                } transition-all duration-200`}
              >
                <List className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FiltersSection;
