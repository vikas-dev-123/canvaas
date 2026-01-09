import Loading from "@/components/global/loading";
import React from "react";

const LoadingAgencyPage = () => {
    return ( //loading screen for agency page
        <div className="h-screen w-screen flex justify-center items-center">
            <Loading></Loading>
        </div>
    );
};

export default LoadingAgencyPage;