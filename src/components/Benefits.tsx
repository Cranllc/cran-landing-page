import { Check } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";

const benefits = [
  "Less time on paperwork, more time with animals",
  "Faster, more accurate intake processes",
  "Better adoption matching through AI insights",
  "Real-time coordination across your team",
  "No more lost notes or missing records"
];

export function Benefits() {
  return (
    <section id="benefits" className="py-24 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Content - Image */}
          <div className="order-2 lg:order-1">
            <div className="relative overflow-hidden rounded-3xl shadow-xl">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1601758228041-f3b2795255f1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhbmltYWwlMjBzaGVsdGVyJTIwd29ya2VyJTIwZG9nfGVufDF8fHx8MTczNzQ0NDk3NHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                alt="Shelter worker with dog using mobile app"
                className="w-full h-full object-cover"
              />
              {/* Overlay badge */}
              <div className="absolute bottom-6 left-6 right-6 bg-white/95 backdrop-blur-sm p-4 rounded-2xl border border-[#D0C4B8]">
                <p className="text-[#1a1a1a] text-sm leading-relaxed">
                  "We processed 40% more intakes in the same time. The camera feature alone 
                  saves us 10 minutes per animal."
                </p>
                <div className="mt-2 flex items-center gap-2">
                  <div className="w-8 h-8 bg-[#D64436] rounded-full"></div>
                  <div>
                    <div className="text-[#1a1a1a] text-sm font-medium">Maria Santos</div>
                    <div className="text-[#6B5D5A] text-xs">Intake Coordinator</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Content */}
          <div className="order-1 lg:order-2 space-y-8">
            <div>
              <div className="inline-block bg-[#D64436]/10 text-[#1a1a1a] px-4 py-2 rounded-full border border-[#D64436]/30 mb-6">
                <span className="text-sm font-medium">Why Shelters Choose Cran</span>
              </div>
              <h2 className="text-4xl md:text-5xl text-[#1a1a1a] mb-6">
                Less Admin.
                <br />
                More Impact.
              </h2>
              <p className="text-xl text-[#6B5D5A] leading-relaxed">
                Your team didn't get into animal welfare to fill out forms. 
                Cran handles the busywork so you can focus on what matters—the animals.
              </p>
            </div>

            <div className="space-y-4">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-6 h-6 bg-[#D64436] rounded-full flex items-center justify-center mt-1">
                    <Check className="w-4 h-4 text-white" strokeWidth={3} />
                  </div>
                  <p className="text-[#1a1a1a] text-lg leading-relaxed">{benefit}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}