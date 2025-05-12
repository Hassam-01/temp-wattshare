import { ArrowRight, Sun, Leaf, Zap, Battery, PanelLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const Home = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-primary/90 to-secondary/90 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-4">
                Buy and Sell Solar Energy Products with Ease
              </h1>
              <p className="text-lg md:text-xl mb-8 text-white/90">
                Join the largest marketplace for solar panels, batteries,
                inverters and complete systems. Save money and help the planet.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  asChild
                  size="lg"
                  className="bg-white text-primary hover:bg-white/90 text-lg"
                >
                  <Link to="/explore">Browse Listings</Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="bg-transparent border-2 border-white text-white hover:bg-white/10 text-lg"
                >
                  <Link to="#">List Your Products</Link>
                </Button>
              </div>
            </div>
            <div className="relative hidden md:block">
              <div className="aspect-square w-full max-w-md mx-auto relative">
                {/* Improved bubble with solar-themed content */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-white/5 rounded-full animate-float backdrop-blur-sm border border-white/10 flex items-center justify-center overflow-hidden">
                  {/* Center sun */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="relative w-1/3 h-1/3">
                      <div className="absolute inset-0 bg-gradient-to-r from-yellow-100 to-yellow-500 rounded-full animate-pulse shadow-lg shadow-yellow-400/50"></div>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Sun className="text-white h-12 w-12" />
                      </div>
                    </div>
                  </div>

                  {/* Orbiting elements */}
                  <div className="absolute inset-0 animate-spin-slow">
                    <div className="absolute top-10 right-10">
                      <PanelLeft className="h-8 w-8 text-blue-300" />
                    </div>
                    <div className="absolute bottom-16 left-16">
                      <Battery className="h-8 w-8 text-green-300" />
                    </div>
                    <div className="absolute top-1/2 left-10">
                      <Zap className="h-8 w-8 text-yellow-300" />
                    </div>
                  </div>
                </div>
              </div>
              <div className="absolute -top-6 -right-6 bg-gradient-to-br from-yellow-300 via-yellow-400 to-yellow-500 text-primary font-bold text-sm px-5 py-3 rounded-full shadow-lg flex items-center gap-2 animate-pulse ring-2 ring-white ring-offset-2">
                <Zap className="h-5 w-5 text-primary" />
                <span>Save 30%+</span>
              </div>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-16">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 1440 320"
            className="w-full h-full"
          >
            <path
              fill="#ffffff"
              fillOpacity="1"
              d="M0,128L80,117.3C160,107,320,85,480,96C640,107,800,149,960,149.3C1120,149,1280,107,1360,85.3L1440,64L1440,320L1360,320C1280,320,1120,320,960,320C800,320,640,320,480,320C320,320,160,320,80,320L0,320Z"
            ></path>
          </svg>
        </div>
      </section>

      {/* Features Section with modern design */}
      <section className="section-padding bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Why Choose WattShare?
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Our marketplace connects buyers and sellers of solar equipment,
              helping you save money and reduce your carbon footprint.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-solar-lightgray p-6 rounded-lg text-center">
              <div className="inline-flex items-center justify-center p-4 bg-solar-yellow rounded-full mb-4">
                <Sun className="h-8 w-8 text-solar-darkblue" />
              </div>
              <h3 className="text-xl font-bold mb-2">Verified Sellers</h3>
              <p className="text-gray-600">
                All sellers go through our verification process to ensure
                quality and reliability.
              </p>
            </div>

            <div className="bg-solar-lightgray p-6 rounded-lg text-center">
              <div className="inline-flex items-center justify-center p-4 bg-solar-green rounded-full mb-4">
                <Leaf className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-2">Eco-Friendly</h3>
              <p className="text-gray-600">
                Extending the life of solar products reduces waste and maximizes
                environmental benefits.
              </p>
            </div>

            <div className="bg-solar-lightgray p-6 rounded-lg text-center">
              <div className="inline-flex items-center justify-center p-4 bg-solar-blue rounded-full mb-4">
                <Zap className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-2">Save Money</h3>
              <p className="text-gray-600">
                Find great deals on new and used solar equipment at prices below
                retail.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section with premium look */}
      <section className="section-padding">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Shop By Category
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Find exactly what you need in our comprehensive selection of solar
              energy products.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="relative group overflow-hidden rounded-lg h-64">
              <img
                src="https://cdn.webgenius.co.nz/cdn-cgi/image/format=auto%2Cwidth=2000/https://cdn.webgenius.co.nz/c/66ad316863ec2c04afb74341/hp-banner-coastal-solar-mobile?h=ab6b3d42"
                alt="Solar Panels"
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end">
                <div className="p-4 w-full">
                  <h3 className="text-white text-xl font-bold mb-1">
                    Solar Panels
                  </h3>
                  <Link
                    to="/explore?category=panels"
                    className="text-solar-yellow flex items-center"
                  >
                    Browse <ArrowRight className="ml-1 h-4 w-4" />
                  </Link>
                </div>
              </div>
            </div>

            <div className="relative group overflow-hidden rounded-lg h-64">
              <img
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQr_D1kqvG9zijEIjc1qNsJ99tPnWMPBawEqQ&s"
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end">
                <div className="p-4 w-full">
                  <h3 className="text-white text-xl font-bold mb-1">
                    Batteries
                  </h3>
                  <Link
                    to="/explore?category=batteries"
                    className="text-solar-yellow flex items-center"
                  >
                    Browse <ArrowRight className="ml-1 h-4 w-4" />
                  </Link>
                </div>
              </div>
            </div>

            <div className="relative group overflow-hidden rounded-lg h-64">
              <img
                src="https://www.rei.com/dam/van_dragt_102517_0032_how_to_choose_batteries.jpg?t=ea16by9xs"
                alt="Inverters"
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end">
                <div className="p-4 w-full">
                  <h3 className="text-white text-xl font-bold mb-1">
                    Inverters
                  </h3>
                  <Link
                    to="/explore?category=inverters"
                    className="text-solar-yellow flex items-center"
                  >
                    Browse <ArrowRight className="ml-1 h-4 w-4" />
                  </Link>
                </div>
              </div>
            </div>

            <div className="relative group overflow-hidden rounded-lg h-64">
              <img
                src="https://images.unsplash.com/photo-1613665813446-82a78c468a1d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
                alt="Complete Systems"
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end">
                <div className="p-4 w-full">
                  <h3 className="text-white text-xl font-bold mb-1">
                    Complete Systems
                  </h3>
                  <Link
                    to="/explore?category=systems"
                    className="text-solar-yellow flex items-center"
                  >
                    Browse <ArrowRight className="ml-1 h-4 w-4" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section with modern gradient */}
      <section className="bg-gradient-to-r from-primary to-secondary text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Join the Solar Revolution?
          </h2>
          <p className="text-xl mb-8 max-w-3xl mx-auto text-white/90">
            Whether you're looking to buy or sell solar equipment, WattShare
            makes it easy and secure.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button
              asChild
              size="lg"
              className="bg-white text-primary hover:bg-white/90 text-lg"
            >
              <Link to="/explore">Start Exploring</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="bg-transparent border-2 border-white text-white hover:bg-white/10 text-lg"
            >
              <Link to="#">List Your Products</Link>
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Home;
