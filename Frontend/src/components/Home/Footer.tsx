import { Github, Twitter } from "lucide-react";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-[rgba(14,14,21,1)] border-t border-gray-700 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Brand Section */}
        <div>
          <h3 className="text-white font-extrabold text-xl mb-4">ExoHabitat</h3>
          <p className="text-gray-400 text-sm">
            Exploring the universe, discovering habitable worlds, and advancing planetary science.
          </p>
        </div>

        {/* Explore Links */}
        <div>
          <h3 className="text-white font-semibold mb-4">Explore</h3>
          <ul className="space-y-2">
            <li>
              <Link
                to="/solar"
                className="text-gray-300 hover:text-blue-400 transition-colors"
              >
                Solar System
              </Link>
            </li>
            <li>
              <Link
                to="/simulation"
                className="text-gray-300 hover:text-blue-400 transition-colors"
              >
                Simulation
              </Link>
            </li>
            <li>
              <Link
                to="/compare"
                className="text-gray-300 hover:text-blue-400 transition-colors"
              >
                Compare
              </Link>
            </li>
          </ul>
        </div>

        {/* Connect Links */}
        <div>
          <h3 className="text-white font-semibold mb-4">Connect</h3>
          <ul className="space-y-2">
            <li>
              <a
                href="#"
                className="text-gray-300 hover:text-blue-400 transition-colors"
              >
                Twitter
              </a>
            </li>
            <li>
              <a
                href="#"
                className="text-gray-300 hover:text-blue-400 transition-colors"
              >
                GitHub
              </a>
            </li>
            <li>
              <Link
                to="/contact"
                className="text-gray-300 hover:text-blue-400 transition-colors"
              >
                Contact Us
              </Link>
            </li>
          </ul>
        </div>

        {/* Legal Links */}
        <div>
          <h3 className="text-white font-semibold mb-4">Legal</h3>
          <ul className="space-y-2">
            <li>
              <Link
                to="/privacy"
                className="text-gray-300 hover:text-blue-400 transition-colors"
              >
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link
                to="/terms"
                className="text-gray-300 hover:text-blue-400 transition-colors"
              >
                Terms of Service
              </Link>
            </li>
          </ul>
        </div>
      </div>

      {/* Social and Brand Section */}
      <div className="mt-12 border-t border-gray-700 pt-8 text-center">
        <p className="text-gray-400 text-sm">
          &copy; {new Date().getFullYear()} ExoHabitat. All rights reserved.
        </p>
        <div className="mt-4 flex justify-center space-x-4">
          <a
            href="#"
            className="text-gray-300 hover:text-blue-400 transition-colors"
          >
            <span className="sr-only">Twitter</span>
            <Twitter />
          </a>
          <a
            href="#"
            className="text-gray-300 hover:text-blue-400 transition-colors"
          >
            <span className="sr-only">GitHub</span>
            <Github />
          </a>
        </div>
      </div>
    </footer>
  );
}
