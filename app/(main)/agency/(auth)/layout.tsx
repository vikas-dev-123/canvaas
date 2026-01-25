import React from "react";

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
    return <div className="min-h-screen flex items-center bg-white justify-center">{children}</div>;
};

export default AuthLayout;
