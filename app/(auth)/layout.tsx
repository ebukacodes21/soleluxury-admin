import React from "react";

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="w-full md:w-1/2 mx-auto pb-10 flex items-center justify-center h-full">
      <div className="bg-white rounded-lg mt-5 px-5 py-5 shadow-lg w-full">
        {children}
      </div>
    </div>
  );
};

export default AuthLayout;
