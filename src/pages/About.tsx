import { useEffect } from "react";
import {
  Sun,
  Users,
  ShieldCheck,
  BarChart4,
  Leaf,
  MessageSquare,
  Moon,
  Contact,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/components/ThemeProvider";
import ContactSection from "@/components/ContactForm";

const teamMembers = [
  {
    id: 1,
    name: "Hassam Ali",
    role: "Founder & CEO",
    description: "Passionate about renewable energy and innovation.",
    image:
      "https://i.ibb.co/Ps7mKcvs/Whats-App-Image-2025-04-30-at-03-30-55-578e531c.jpghttps://i.ibb.co/gbgKPzPw/MEE22.jpg",
  },
  {
    id: 2,
    name: "Adeena Reeham",
    role: "Chief Technology Officer",
    description: "Expert in solar technology and system design.",
    image: " https://i.ibb.co/8DDNh9kP/IMG-20241207-WA0020.jpg",
  },

  {
    id: 3,
    name: "Shahzaib",
    role: "MVP (Most Valuable Procrastinator)",
    description: "Leads with vibes, delivers under pressure (usually self-inflicted). Master of last-minute brilliance and coffee-fueled innovation.",
    image: "https://i.ibb.co/jkC1Nc4H/Me.jpg",
  }

];

const AboutUs = () => {
  const { theme } = useTheme();

  useEffect(() => {
    // Apply theme class to document body
    document.body.classList.toggle("dark", theme === "dark");
    // Set background color based on theme
    document.body.style.backgroundColor =
      theme === "dark" ? "#111827" : "#ffffff";
  }, [theme]);

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-300">
      <Navbar />
      {/* Header */}
      <section className="bg-gradient-to-r from-purple-900 to-purple-800 dark:from-gray-900 dark:to-purple-900 text-white pt-16 pb-32 md:pt-24 md:pb-48 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex justify-center mb-6">
            <Sun className="h-16 w-16 text-yellow-400 animate-pulse" />
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-6">WattShare</h1>
          <p className="text-xl max-w-3xl mx-auto">
            Connecting solar enthusiasts and making sustainable energy more
            accessible for everyone.
          </p>
        </div>

        {/* Wave SVG with deeper curve */}
        <div className="absolute bottom-0 left-0 right-0 w-full">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 1440 320"
            className="w-full"
            preserveAspectRatio="none"
          >
            <path
              fill="currentColor"
              fillOpacity="1"
              className="text-gray-900 dark:text-gray-900"
              d="M0,96L60,112C120,128,240,160,360,176C480,192,600,192,720,176C840,160,960,128,1080,122.7C1200,117,1320,139,1380,149.3L1440,160L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z"
            ></path>
          </svg>
        </div>
      </section>

      {/* Mission */}
      <section className="py-16 flex items-center mt-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6 text-gray-900 dark:text-gray-100">
                Our Mission
              </h2>
              <p className="text-lg mb-6 text-gray-800 dark:text-gray-300">
                At WattShare, we believe that sustainable energy should be
                accessible to everyone. Our mission is to create a vibrant
                marketplace where solar enthusiasts, homeowners, businesses, and
                installers can connect to buy and sell solar equipment at fair
                prices.
              </p>
              <p className="text-lg mb-6 text-gray-800 dark:text-gray-300">
                By facilitating the exchange of new, used, and refurbished solar
                products, we're helping to:
              </p>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <Leaf className="h-6 w-6 text-green-600 dark:text-green-400 mr-2 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-800 dark:text-gray-300">
                    Reduce waste by extending the lifespan of solar equipment
                  </span>
                </li>
                <li className="flex items-start">
                  <Users className="h-6 w-6 text-purple-700 dark:text-purple-400 mr-2 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-800 dark:text-gray-300">
                    Make solar technology more affordable for those on a budget
                  </span>
                </li>
                <li className="flex items-start">
                  <Sun className="h-6 w-6 text-yellow-400 mr-2 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-800 dark:text-gray-300">
                    Accelerate the transition to renewable energy worldwide
                  </span>
                </li>
              </ul>
            </div>
            <div>
              <img
                src="https://i.ibb.co/vxzMtX67/nuno-marques-0-Gbrj-L3v-ZF4-unsplash.jpg"
                alt="Solar panels on a sunny day"
                className="rounded-lg shadow-xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Story */}
      <section className="py-16 bg-gray-100 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="order-2 md:order-1">
              <img
                src="https://i.ibb.co/LdBLX0wN/hannah-busing-Zyx1b-K9mqm-A-unsplash.jpg"
                alt="Our team working together"
                className="rounded-lg shadow-xl"
              />
            </div>
            <div className="order-1 md:order-2">
              <h2 className="text-3xl font-bold mb-6 text-gray-900 dark:text-gray-100">
                Our Story
              </h2>
              <p className="text-lg text-gray-700 dark:text-gray-300 mb-6">
                WattShare was founded in 2025 by a group of solar enthusiasts
                who recognized a gap in the market. While searching for
                affordable solar equipment for their own project, they
                discovered how difficult it was to find quality used or surplus
                solar products.
              </p>
              <p className="text-lg text-gray-700 dark:text-gray-300 mb-6">
                They envisioned a platform where anyone could easily buy and
                sell solar equipment—from individual panels to complete
                systems—creating a circular economy that benefits both people
                and the planet.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold mb-12 text-center text-gray-900 dark:text-gray-100">
            Our Core Values
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border-b-4 border-yellow-400">
              <div className="bg-yellow-400 inline-flex rounded-full p-3 mb-4">
                <ShieldCheck className="h-8 w-8 text-purple-900" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-gray-100">
                Trust & Safety
              </h3>
              <p className="text-gray-700 dark:text-gray-300">
                We prioritize creating a secure marketplace with verified users
                and secure transactions to protect our community.
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border-b-4 border-purple-600">
              <div className="bg-green-600 dark:bg-green-500 inline-flex rounded-full p-3 mb-4">
                <Leaf className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-gray-100">
                Sustainability
              </h3>
              <p className="text-gray-700 dark:text-gray-300">
                Every transaction on WattShare contributes to a more sustainable
                future by extending the life of solar products.
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border-b-4 border-purple-700">
              <div className="bg-purple-700 inline-flex rounded-full p-3 mb-4">
                <Users className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-gray-100">
                Community
              </h3>
              <p className="text-gray-700 dark:text-gray-300">
                We foster a supportive community where knowledge is shared and
                solar adoption is encouraged.
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border-b-4 border-purple-900">
              <div className="bg-purple-900 inline-flex rounded-full p-3 mb-4">
                <BarChart4 className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-gray-100">
                Transparency
              </h3>
              <p className="text-gray-700 dark:text-gray-300">
                We believe in clear, honest communication about product
                conditions, pricing, and marketplace operations.
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border-b-4 border-yellow-400">
              <div className="bg-yellow-400 inline-flex rounded-full p-3 mb-4">
                <Sun className="h-8 w-8 text-purple-900" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-gray-100">
                Innovation
              </h3>
              <p className="text-gray-700 dark:text-gray-300">
                We continuously improve our platform to better serve the
                evolving needs of the solar community.
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border-b-4 border-purple-700">
              <div className="bg-purple-700 inline-flex rounded-full p-3 mb-4">
                <MessageSquare className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-gray-100">
                Education
              </h3>
              <p className="text-gray-700 dark:text-gray-300">
                We're committed to helping people learn about solar energy
                through resources, guides, and community support.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-16 bg-gray-100 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold mb-12 text-center text-gray-900 dark:text-gray-100">
            Meet Our Team
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {teamMembers.map((member) => (
              <div
                key={member.id}
                className="bg-white dark:bg-gray-700 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow"
              >
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-full h-64 object-cover object-center"
                />
                <div className="p-4">
                  <h3 className="font-bold text-lg mb-1 text-gray-900 dark:text-gray-100">
                    {member.name}
                  </h3>
                  <p className="text-purple-700 dark:text-purple-400 mb-2">
                    {member.role}
                  </p>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">
                    {member.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-16 bg-gradient-to-r from-purple-900 to-purple-700 dark:from-gray-900 dark:to-purple-900 text-white relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute top-0 left-0 right-0 bottom-0 opacity-10">
          <div className="absolute top-10 left-10 w-32 h-32 rounded-full bg-yellow-400"></div>
          <div className="absolute bottom-10 right-10 w-24 h-24 rounded-full bg-yellow-400"></div>
          <div className="absolute bottom-32 left-1/4 w-16 h-16 rounded-full bg-purple-400"></div>
          <div className="absolute top-24 right-1/4 w-20 h-20 rounded-full bg-purple-400"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Join Our Mission
          </h2>
          <p className="text-xl mb-8 max-w-3xl mx-auto">
            Whether you're looking to buy, sell, or simply learn more about
            solar energy, WattShare is here to help you on your journey.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button
              asChild
              className="bg-yellow-400 text-purple-900 hover:bg-yellow-500 text-lg px-8 py-6 font-medium"
            >
              <a href="/explore">Browse Listings</a>
            </Button>
            <Button
              asChild
              variant="outline"
              className="border-white text-black hover:bg-white/10 dark:border-gray-300 dark:text-white dark:hover:bg-purple-800 text-lg px-8 py-6 font-medium"
            >
              <a href="#contact">Contact Us</a>
            </Button>
          </div>
        </div>
      </section>

      <ContactSection />

      <Footer />
    </div>
  );
};

export default AboutUs;
