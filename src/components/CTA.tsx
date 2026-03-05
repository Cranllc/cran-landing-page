import { Button } from "./ui/button";
import { Camera, Check } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";

export function CTA() {
  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 bg-[#F5EDE8]">
      <div className="max-w-7xl mx-auto">
        <div className="bg-gradient-to-br from-[#D64436] to-[#B83A2E] rounded-3xl overflow-hidden shadow-2xl">
          <div className="grid lg:grid-cols-2 gap-0 items-center">
            {/* Left Content */}
            <div className="p-12 lg:p-16 space-y-8">
              <div className="inline-block bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-full">
                <span className="text-sm font-medium">Start Free Trial</span>
              </div>
              
              <h2 className="text-4xl md:text-5xl text-white">
                Ready to Replace Your Clipboard?
              </h2>
              
              <p className="text-xl text-white/90 leading-relaxed">
                Join 500+ shelters using Cran to spend less time on paperwork and more time saving lives.
              </p>
              
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center flex-shrink-0">
                    <Check className="w-4 h-4 text-[#D64436]" strokeWidth={3} />
                  </div>
                  <span className="text-white">30-day free trial, no credit card</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center flex-shrink-0">
                    <Check className="w-4 h-4 text-[#D64436]" strokeWidth={3} />
                  </div>
                  <span className="text-white">Setup support included</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center flex-shrink-0">
                    <Check className="w-4 h-4 text-[#D64436]" strokeWidth={3} />
                  </div>
                  <span className="text-white">Cancel anytime</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Button 
                  size="lg" 
                  className="bg-white hover:bg-white/90 text-[#D64436] rounded-full px-8 text-lg"
                >
                  <Camera className="w-5 h-5 mr-2" />
                  Get Started Free
                </Button>
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="border-2 border-white text-white hover:bg-white/10 rounded-full px-8 text-lg"
                >
                  Schedule Demo
                </Button>
              </div>
            </div>

            {/* Right Content - Image */}
            <div className="hidden lg:block h-full min-h-[500px]">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1548199973-03cce0bbc87b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhbmltYWwlMjByZXNjdWUlMjBoYXBweSUyMGRvZ3xlbnwxfHx8fDE3Mzc0NDUwNTJ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                alt="Happy rescue dog"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}