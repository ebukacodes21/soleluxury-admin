import React from "react"

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="w-full md:w-1/2 mx-auto pb-10 flex items-center justify-center h-full">
      {children}
    </div>
  );
};

export default AuthLayout;
