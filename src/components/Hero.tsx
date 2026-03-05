import { Button } from "./ui/button";
import { Camera } from "lucide-react";
import { MobileAppUI } from "./MobileAppUI";

export function Hero() {
  return (
    <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white to-[#F5EDE8]">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 bg-[#A78BFA]/10 text-[#1a1a1a] px-4 py-2 rounded-full border border-[#A78BFA]/30">
              <Camera className="w-4 h-4 text-[#A78BFA]" />
              <span className="text-sm font-medium">Camera-First AI Platform</span>
            </div>
            
            <h1 className="text-5xl md:text-6xl lg:text-7xl text-[#1a1a1a] leading-tight">
              Start with the Camera.
              <br />
              <span className="text-[#D64436]">Save More Lives.</span>
            </h1>
            
            <p className="text-xl text-[#6B5D5A] leading-relaxed">
              Cran replaces paper and spreadsheets with intelligent, mobile workflows. 
              Point your camera at an animal, and AI does the rest—identifying species, 
              suggesting breeds, and pre-filling records so your team can focus on care.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button size="lg" className="bg-[#D64436] hover:bg-[#B83A2E] text-white rounded-full px-8 text-lg">
                See It In Action
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="border-2 border-[#D64436] text-[#1a1a1a] hover:bg-[#D64436]/10 rounded-full px-8 text-lg"
              >
                Learn More
              </Button>
            </div>
            
            <div className="flex items-center gap-8 pt-8">
              <div className="flex -space-x-3">
                <div className="w-10 h-10 bg-[#D64436] rounded-full border-2 border-white"></div>
                <div className="w-10 h-10 bg-[#A78BFA] rounded-full border-2 border-white"></div>
                <div className="w-10 h-10 bg-[#8B7E7D] rounded-full border-2 border-white"></div>
              </div>
              <div className="text-sm text-[#6B5D5A]">
                <span className="text-[#1a1a1a] font-medium">500+ shelters</span> already saving time
              </div>
            </div>
          </div>
          
          {/* Right Content - Mobile App UI */}
          <div className="relative">
            <MobileAppUI />
          </div>
        </div>
      </div>
    </section>
  );
}