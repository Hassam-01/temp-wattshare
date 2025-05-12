import { Link } from "react-router-dom";
import { Facebook, Twitter, Instagram, Mail, Sun } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-gray-950 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center mb-4">
              <Sun className="h-8 w-8 text-solar-yellow mr-2" />
              <span className="text-2xl font-bold">WattShare</span>
            </div>
            <p className="text-gray-300 mb-4">
              The premier marketplace for buying and selling solar energy
              equipment and products.
            </p>
            <div className="flex space-x-4">
              <a
                href="#"
                className="text-gray-300 hover:text-solar-yellow transition-colors"
              >
                <Facebook size={20} />
              </a>
              <a
                href="#"
                className="text-gray-300 hover:text-solar-yellow transition-colors"
              >
                <Twitter size={20} />
              </a>
              <a
                href="#"
                className="text-gray-300 hover:text-solar-yellow transition-colors"
              >
                <Instagram size={20} />
              </a>
              <a
                href="#"
                className="text-gray-300 hover:text-solar-yellow transition-colors"
              >
                <Mail size={20} />
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Navigation</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/"
                  className="text-gray-300 hover:text-solar-yellow transition-colors"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/explore"
                  className="text-gray-300 hover:text-solar-yellow transition-colors"
                >
                  Explore
                </Link>
              </li>
              <li>
                <Link
                  to="/saved"
                  className="text-gray-300 hover:text-solar-yellow transition-colors"
                >
                  Saved Deals
                </Link>
              </li>
              <li>
                <Link
                  to="/about"
                  className="text-gray-300 hover:text-solar-yellow transition-colors"
                >
                  About Us
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Categories</h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="#"
                  className="text-gray-300 hover:text-solar-yellow transition-colors"
                >
                  Solar Panels
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-300 hover:text-solar-yellow transition-colors"
                >
                  Inverters
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-300 hover:text-solar-yellow transition-colors"
                >
                  Batteries
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-300 hover:text-solar-yellow transition-colors"
                >
                  Complete Systems
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-300 hover:text-solar-yellow transition-colors"
                >
                  Accessories
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Contact</h3>
            <p className="text-gray-300 mb-2">Email: info@wattshare.com</p>
            <p className="text-gray-300 mb-2">Phone: (+92)345-6789457</p>
            <p className="text-gray-300">CR22 ,Rimms building Nust h12</p>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-300">
          <p>
            &copy; {new Date().getFullYear()} WattShare. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
