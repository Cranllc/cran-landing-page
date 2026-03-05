import { Camera, Home, PawPrint, FileText, Zap, Grid3x3 } from "lucide-react";

export function MobileAppUI() {
  return (
    <div className="w-full max-w-sm mx-auto">
      {/* Phone Frame */}
      <div className="relative bg-[#1a1a1a] rounded-[3rem] p-3 shadow-2xl">
        {/* Screen */}
        <div className="bg-white rounded-[2.5rem] overflow-hidden">
          {/* Status Bar */}
          <div className="bg-white px-6 py-3 flex items-center justify-between text-xs text-[#1a1a1a]">
            <span>9:41</span>
            <div className="flex gap-1">
              <div className="w-4 h-3 border border-[#1a1a1a] rounded-sm"></div>
              <div className="w-4 h-3 border border-[#1a1a1a] rounded-sm bg-[#1a1a1a]"></div>
              <div className="w-4 h-3 border border-[#1a1a1a] rounded-sm"></div>
            </div>
          </div>

          {/* Camera View Content */}
          <div className="relative bg-[#1a1a1a] h-[600px]">
            {/* Camera Viewfinder */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center space-y-4 px-6">
                <div className="w-32 h-32 mx-auto bg-[#D64436]/20 rounded-full flex items-center justify-center border-2 border-[#D64436]/40 border-dashed">
                  <Camera className="w-16 h-16 text-[#D64436]" />
                </div>
                <div className="space-y-2">
                  <p className="text-white text-lg font-medium">Point camera at animal</p>
                  <p className="text-white/70 text-sm">AI will identify species & breed</p>
                </div>
              </div>
            </div>

            {/* Top Controls */}
            <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
              <button className="w-10 h-10 bg-black/40 backdrop-blur-sm rounded-full flex items-center justify-center">
                <Zap className="w-5 h-5 text-white" />
              </button>
              <button className="w-10 h-10 bg-black/40 backdrop-blur-sm rounded-full flex items-center justify-center">
                <Grid3x3 className="w-5 h-5 text-white" />
              </button>
            </div>

            {/* Bottom AI Suggestions Panel */}
            <div className="absolute bottom-20 left-0 right-0 bg-white/95 backdrop-blur-sm p-4 space-y-3">
              <div className="flex items-center gap-2 text-[#6B5D5A] text-sm">
                <div className="w-1.5 h-1.5 bg-[#A78BFA] rounded-full animate-pulse"></div>
                <span>AI Ready</span>
              </div>
              <button className="w-full bg-[#D64436] text-white py-3 rounded-2xl font-medium">
                Capture & Identify
              </button>
            </div>
          </div>

          {/* Bottom Navigation */}
          <div className="bg-white border-t border-[#D0C4B8] px-4 py-3">
            <div className="flex items-center justify-around">
              <button className="flex flex-col items-center gap-1 text-[#8B7E7D]">
                <Home className="w-5 h-5" />
                <span className="text-xs">Home</span>
              </button>
              <button className="flex flex-col items-center gap-1 text-[#D64436]">
                <Camera className="w-5 h-5" />
                <span className="text-xs font-medium">Camera</span>
              </button>
              <button className="flex flex-col items-center gap-1 text-[#8B7E7D]">
                <PawPrint className="w-5 h-5" />
                <span className="text-xs">Animals</span>
              </button>
              <button className="flex flex-col items-center gap-1 text-[#8B7E7D]">
                <FileText className="w-5 h-5" />
                <span className="text-xs">Intake</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}