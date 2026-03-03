import React, { useEffect } from 'react';

const StartupPage = ({ onComplete }) => {
  useEffect(() => {
    // Random duration between 2000ms and 4000ms
    const duration = Math.floor(Math.random() * 2000) + 2000;

    const timer = setTimeout(() => {
      onComplete();
    }, duration);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 bg-black z-[9999] flex flex-col items-center justify-center select-none cursor-none">
      <div className="relative">
        {/* User Provided DBD Loading Icon */}
        <div className="relative animate-pulse duration-[2000ms]">
          <img
            src="https://images.steamusercontent.com/ugc/988989114488731806/4F7547A4CD93085C38217C96CEB0E879BE91C4F0/?imw=268&imh=268&ima=fit&impolicy=Letterbox&imcolor=%23000000&letterbox=true"
            alt="Loading..."
            className="w-32 h-32 object-contain"
          />
        </div>

        {/* Ambient Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-dbd-red/5 rounded-full blur-[100px]"></div>
      </div>

      {/* Cinematic Text */}
      <div className="mt-12 overflow-hidden">
        <p className="text-white/40 text-[10px] tracking-[0.5em] uppercase font-light animate-pulse italic">
          Connecting to the Fog
        </p>
      </div>

      {/* Corner Loading Details */}
      <div className="absolute bottom-6 right-6 sm:bottom-8 sm:right-8 md:bottom-12 md:right-12 flex items-center gap-3 opacity-50">
        <div className="w-1 h-1 bg-dbd-red rounded-full animate-ping"></div>
        <p className="text-white/30 text-[9px] tracking-[0.2em] uppercase">
          Verifying Entity Connection...
        </p>
      </div>
    </div>
  );
};

export default StartupPage;