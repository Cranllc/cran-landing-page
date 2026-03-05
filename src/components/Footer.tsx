import { PawPrint } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-[#1a1a1a] text-white py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#D64436] rounded-2xl flex items-center justify-center">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="12" cy="12" r="8" fill="white" fillOpacity="0.3"/>
                  <circle cx="12" cy="12" r="4" fill="white"/>
                </svg>
              </div>
              <span className="text-2xl font-medium">Cran</span>
            </div>
            <p className="text-[#C9BCAF] leading-relaxed">
              AI-powered shelter software built for the real world—not back offices.
            </p>
          </div>

          {/* Product */}
          <div>
            <h3 className="text-white mb-4 font-medium">Product</h3>
            <ul className="space-y-3">
              <li>
                <a href="#features" className="text-[#C9BCAF] hover:text-white transition-colors">
                  Features
                </a>
              </li>
              <li>
                <a href="#how-it-works" className="text-[#C9BCAF] hover:text-white transition-colors">
                  How It Works
                </a>
              </li>
              <li>
                <a href="#" className="text-[#C9BCAF] hover:text-white transition-colors">
                  Pricing
                </a>
              </li>
              <li>
                <a href="#" className="text-[#C9BCAF] hover:text-white transition-colors">
                  Mobile App
                </a>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-white mb-4 font-medium">Company</h3>
            <ul className="space-y-3">
              <li>
                <a href="#mission" className="text-[#C9BCAF] hover:text-white transition-colors">
                  Mission
                </a>
              </li>
              <li>
                <a href="#" className="text-[#C9BCAF] hover:text-white transition-colors">
                  Blog
                </a>
              </li>
              <li>
                <a href="#" className="text-[#C9BCAF] hover:text-white transition-colors">
                  Careers
                </a>
              </li>
              <li>
                <a href="#" className="text-[#C9BCAF] hover:text-white transition-colors">
                  Contact
                </a>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-white mb-4 font-medium">Support</h3>
            <ul className="space-y-3">
              <li>
                <a href="#" className="text-[#C9BCAF] hover:text-white transition-colors">
                  Help Center
                </a>
              </li>
              <li>
                <a href="#" className="text-[#C9BCAF] hover:text-white transition-colors">
                  Getting Started
                </a>
              </li>
              <li>
                <a href="#" className="text-[#C9BCAF] hover:text-white transition-colors">
                  Privacy
                </a>
              </li>
              <li>
                <a href="#" className="text-[#C9BCAF] hover:text-white transition-colors">
                  Terms
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-[#C9BCAF] text-sm">
            © 2025 Cran. Made with ❤️ for animal welfare.
          </p>
          <div className="flex gap-6">
            <a href="#" className="text-[#C9BCAF] hover:text-white transition-colors text-sm">
              Twitter
            </a>
            <a href="#" className="text-[#C9BCAF] hover:text-white transition-colors text-sm">
              Instagram
            </a>
            <a href="#" className="text-[#C9BCAF] hover:text-white transition-colors text-sm">
              LinkedIn
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}