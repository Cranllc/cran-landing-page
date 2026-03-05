import { Camera, Sparkles, CheckCircle2, ArrowRight } from "lucide-react";

const steps = [
  {
    number: "01",
    icon: Camera,
    title: "Point & Capture",
    description: "Open the app, point your camera at any animal. No forms, no typing—just point and tap."
  },
  {
    number: "02",
    icon: Sparkles,
    title: "AI Identifies",
    description: "Our AI instantly recognizes species, suggests breed matches, and pre-fills key details automatically."
  },
  {
    number: "03",
    icon: CheckCircle2,
    title: "Start Caring",
    description: "Animal profile created in seconds. Jump straight to medical records, care tasks, and adoption tracking."
  }
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <div className="inline-block bg-[#A78BFA]/10 text-[#1a1a1a] px-4 py-2 rounded-full border border-[#A78BFA]/30 mb-6">
            <span className="text-sm font-medium">Simple. Intelligent. Fast.</span>
          </div>
          <h2 className="text-4xl md:text-5xl text-[#1a1a1a] mb-6">
            How Cran Works
          </h2>
          <p className="text-xl text-[#6B5D5A] max-w-3xl mx-auto leading-relaxed">
            Three steps from camera to complete animal profile. No paperwork, no data entry lag.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-12 relative">
          {/* Connection Lines (desktop only) */}
          <div className="hidden md:block absolute top-24 left-0 right-0 h-0.5 bg-gradient-to-r from-[#D64436] via-[#A78BFA] to-[#8B7E7D] opacity-20"></div>
          
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div key={index} className="relative">
                <div className="flex flex-col items-center text-center space-y-6">
                  {/* Number */}
                  <div className="text-6xl font-bold text-[#D0C4B8]">
                    {step.number}
                  </div>
                  
                  {/* Icon */}
                  <div className="w-20 h-20 bg-gradient-to-br from-[#D64436] to-[#B83A2E] rounded-3xl flex items-center justify-center shadow-lg relative -mt-12">
                    <Icon className="w-10 h-10 text-white" />
                  </div>
                  
                  {/* Content */}
                  <div className="space-y-3">
                    <h3 className="text-2xl text-[#1a1a1a] font-medium">
                      {step.title}
                    </h3>
                    <p className="text-[#6B5D5A] leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>
                
                {/* Arrow (desktop only) */}
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-24 -right-6 transform -translate-y-1/2">
                    <ArrowRight className="w-6 h-6 text-[#D64436]/30" />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}