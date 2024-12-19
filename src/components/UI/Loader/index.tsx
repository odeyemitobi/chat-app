import React from "react";

const Loader: React.FC = () => {
  return (
    <div className="fixed inset-0 z-50 flex bg-blue-100 items-center justify-center">
      <div className="relative">
        <div className="absolute w-24 h-24 border-4 border-transparent border-b-blue-500 rounded-full animate-spin"></div>
      </div>
    </div>
  );
};

export default Loader;