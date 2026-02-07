import React from "react";
import Loading from "./loading";

const LoadingPage = () => {
  return (
    <div
      className="
        h-full w-full
        flex items-center justify-center
        bg-white dark:bg-[#101010]
        relative overflow-hidden
      "
    >
      {/* subtle grid / depth feel */}
      <div
        className="
          absolute inset-0
          bg-[linear-gradient(to_right,rgba(0,0,0,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.04)_1px,transparent_1px)]
          dark:bg-[linear-gradient(to_right,rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.04)_1px,transparent_1px)]
          bg-[size:40px_40px]
          pointer-events-none
        "
      />

      {/* loader panel */}
      <div
        className="
          relative z-10
          flex items-center justify-center
          rounded-2xl border
          bg-white dark:bg-[#101010]
          border-neutral-200 dark:border-neutral-800
          p-10
          shadow-[0_32px_64px_-20px_rgba(0,0,0,0.7)]
        "
      >
        <Loading />
      </div>
    </div>
  );
};

export default LoadingPage;
