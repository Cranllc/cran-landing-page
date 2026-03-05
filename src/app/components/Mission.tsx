import { Heart, Users, Clock } from "lucide-react";

const stats = [
  {
    icon: Users,
    value: "500+",
    label: "Shelters & Rescues",
    description: "Using Cran every day"
  },
  {
    icon: Heart,
    value: "50K+",
    label: "Animals Helped",
    description: "Through our platform"
  },
  {
    icon: Clock,
    value: "10 min",
    label: "Saved Per Intake",
    description: "Average time reduction"
  }
];

export function Mission() {
  return (
    <section id="mission" className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-[#1a1a1a] to-[#2a2a2a]">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl text-white mb-6">
            Technology That Understands
            <br />
            Animal Welfare
          </h2>
          <p className="text-xl text-[#C9BCAF] max-w-3xl mx-auto leading-relaxed">
            We're not building generic software. We're building tools for people who dedicate 
            their lives to animal rescue—designed for the real world, not boardrooms.
          </p>
        </div>

        <div className="grid sm:grid-cols-3 gap-8 mb-16">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div 
                key={index}
                className="text-center bg-white/5 backdrop-blur-sm border border-white/10 p-8 rounded-3xl"
              >
                <div className="inline-flex items-center justify-center w-14 h-14 bg-[#D64436] rounded-2xl mb-6">
                  <Icon className="w-7 h-7 text-white" />
                </div>
                <div className="text-5xl text-white mb-3 font-medium">
                  {stat.value}
                </div>
                <div className="text-xl text-white mb-2">
                  {stat.label}
                </div>
                <div className="text-sm text-white/60">
                  {stat.description}
                </div>
              </div>
            );
          })}
        </div>

        <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-3xl p-12 text-center max-w-4xl mx-auto">
          <div className="inline-block bg-[#D64436] rounded-full p-3 mb-6">
            <Heart className="w-8 h-8 text-white" />
          </div>
          <p className="text-2xl text-white leading-relaxed mb-6">
            "Cran feels like it was made by people who've actually worked in a shelter. 
            Every feature solves a real problem we face daily."
          </p>
          <div className="flex items-center justify-center gap-3">
            <div className="w-12 h-12 bg-[#A78BFA] rounded-full"></div>
            <div className="text-left">
              <div className="text-white font-medium">Alex Rivera</div>
              <div className="text-white/60 text-sm">Director, Hope Haven Animal Rescue</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}