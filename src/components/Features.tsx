import { Sparkles, Camera, Heart, FileText, BarChart3, Calendar } from "lucide-react";

const features = [
  {
    icon: Camera,
    title: "AI Vision Recognition",
    description: "Automatic species and breed identification from photos. Pre-fills intake forms instantly."
  },
  {
    icon: Sparkles,
    title: "Smart Suggestions",
    description: "AI-powered insights for care plans, adoption matching, and resource prioritization."
  },
  {
    icon: Heart,
    title: "Complete Care Profiles",
    description: "Track medical history, behavioral notes, medications, and milestones all in one place."
  },
  {
    icon: Calendar,
    title: "Task Management",
    description: "Daily care checklists, vet appointments, and follow-ups organized by priority."
  },
  {
    icon: BarChart3,
    title: "Real-Time Insights",
    description: "See capacity, adoption rates, and animal outcomes without digging through spreadsheets."
  },
  {
    icon: FileText,
    title: "Digital Intake & Records",
    description: "Replace clipboards with mobile forms. Everything syncs instantly across your team."
  }
];

export function Features() {
  return (
    <section id="features" className="py-24 px-4 sm:px-6 lg:px-8 bg-[#F5EDE8]">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl text-[#1a1a1a] mb-6">
            Built for Field Work,
            <br />
            Not Back Offices
          </h2>
          <p className="text-xl text-[#6B5D5A] max-w-3xl mx-auto leading-relaxed">
            Every feature designed for real shelter conditions—bright sun, busy days, animals in motion.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div 
                key={index}
                className="bg-white p-8 rounded-3xl shadow-sm hover:shadow-md transition-shadow border border-[#D0C4B8]"
              >
                <div className="w-14 h-14 bg-gradient-to-br from-[#D64436] to-[#B83A2E] rounded-2xl flex items-center justify-center mb-6">
                  <Icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl text-[#1a1a1a] mb-3 font-medium">
                  {feature.title}
                </h3>
                <p className="text-[#6B5D5A] leading-relaxed">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}