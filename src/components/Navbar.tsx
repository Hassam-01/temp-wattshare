import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Menu,
  X,
  Sun,
  User,
  LogOut,
  Package,
  LayoutDashboard,
  MessageSquare,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { authState, signOut } = useAuth();
  const navigate = useNavigate();

  const { data: unreadCount = 0 } = useQuery({
    queryKey: ["unread-messages"],
    queryFn: async () => {
      if (!authState.user?.id) return 0;

      const { count, error } = await supabase
        .from("messages")
        .select("*", { count: "exact", head: true })
        .eq("receiver_id", authState.user.id)
        .eq("is_read", false);

      if (error) throw error;
      return count || 0;
    },
    enabled: !!authState.user?.id,
    refetchInterval: 30000,
  });

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  const getInitials = () => {
    const firstName = authState.profile?.first_name || "";
    const lastName = authState.profile?.last_name || "";
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <Sun className="h-8 w-8 text-solar-yellow mr-2" />
              <span className="text-2xl font-bold text-solar-darkblue">
                WattShare
              </span>
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            <Link
              to="/"
              className="text-gray-700 hover:text-solar-blue transition-colors"
            >
              Home
            </Link>
            <Link
              to="/explore"
              className="text-gray-700 hover:text-solar-blue transition-colors"
            >
              Explore
            </Link>
            <Link
              to="/saved"
              className="text-gray-700 hover:text-solar-blue transition-colors"
            >
              Saved Deals
            </Link>
            <Link
              to="/about"
              className="text-gray-700 hover:text-solar-blue transition-colors"
            >
              About Us
            </Link>

            {authState.user && (
              <Button
                variant="ghost"
                className="relative text-black dark:text-black"
                onClick={() => navigate("/messages")}
              >
                <MessageSquare className="h-5 w-5" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 rounded-full text-[10px] text-white flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </Button>
            )}

            {authState.user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Avatar className="h-10 w-10 cursor-pointer">
                    <AvatarFallback>{getInitials()}</AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link
                      to={`/user/${authState.user.id}`}
                      className="flex items-center cursor-pointer w-full"
                    >
                      <User className="h-4 w-4 mr-2" />
                      Profile
                    </Link>
                  </DropdownMenuItem>

                  {authState.profile?.user_type === "seller" && (
                    <DropdownMenuItem asChild>
                      <Link
                        to="/seller/dashboard"
                        className="flex items-center cursor-pointer w-full"
                      >
                        <LayoutDashboard className="h-4 w-4 mr-2" />
                        Seller Dashboard
                      </Link>
                    </DropdownMenuItem>
                  )}

                  {authState.profile?.user_type === "customer" && (
                    <DropdownMenuItem asChild>
                      <Link
                        to="/purchases"
                        className="flex items-center cursor-pointer w-full"
                      >
                        <Package className="h-4 w-4 mr-2" />
                        My Purchases
                      </Link>
                    </DropdownMenuItem>
                  )}

                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="cursor-pointer"
                    onClick={handleSignOut}
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => navigate("/auth")}>
                  Sign In
                </Button>
                <Button onClick={() => navigate("/auth?tab=signup")}>
                  Sign Up
                </Button>
              </div>
            )}
          </div>

          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="text-gray-700 hover:text-solar-blue focus:outline-none"
            >
              {isOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white">
            <Link
              to="/"
              className="block px-3 py-2 rounded-md text-gray-700 hover:bg-solar-lightgray"
              onClick={toggleMenu}
            >
              Home
            </Link>
            <Link
              to="/explore"
              className="block px-3 py-2 rounded-md text-gray-700 hover:bg-solar-lightgray"
              onClick={toggleMenu}
            >
              Explore
            </Link>
            <Link
              to="/saved"
              className="block px-3 py-2 rounded-md text-gray-700 hover:bg-solar-lightgray"
              onClick={toggleMenu}
            >
              Saved Deals
            </Link>
            <Link
              to="/about"
              className="block px-3 py-2 rounded-md text-gray-700 hover:bg-solar-lightgray"
              onClick={toggleMenu}
            >
              About Us
            </Link>

            {authState.user ? (
              <>
                <Link
                  to="/profile"
                  className="block px-3 py-2 rounded-md text-gray-700 hover:bg-solar-lightgray"
                  onClick={toggleMenu}
                >
                  Profile
                </Link>

                {authState.profile?.user_type === "seller" && (
                  <Link
                    to="/seller/dashboard"
                    className="block px-3 py-2 rounded-md text-gray-700 hover:bg-solar-lightgray"
                    onClick={toggleMenu}
                  >
                    Seller Dashboard
                  </Link>
                )}

                {authState.profile?.user_type === "customer" && (
                  <Link
                    to="/purchases"
                    className="block px-3 py-2 rounded-md text-gray-700 hover:bg-solar-lightgray"
                    onClick={toggleMenu}
                  >
                    My Purchases
                  </Link>
                )}

                <button
                  onClick={() => {
                    handleSignOut();
                    toggleMenu();
                  }}
                  className="block w-full text-left px-3 py-2 rounded-md text-gray-700 hover:bg-solar-lightgray"
                >
                  Log out
                </button>
              </>
            ) : (
              <div className="pt-2 space-y-2">
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => {
                    navigate("/auth");
                    toggleMenu();
                  }}
                >
                  Sign In
                </Button>
                <Button
                  className="w-full"
                  onClick={() => {
                    navigate("/auth?tab=signup");
                    toggleMenu();
                  }}
                >
                  Sign Up
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
