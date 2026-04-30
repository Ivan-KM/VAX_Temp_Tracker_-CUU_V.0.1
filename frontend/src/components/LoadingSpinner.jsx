import React from "react";

const LoadingSpinner = () => {
    return (
        <div className="flex item-center justify-center p-8">
            <div className="relative">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
                <div className="animate-pulse absolute inset-0 flex items-center justify-center"></div>
                <div className="h-2 w-2 bg-primary-500 rounded-full" ></div>
            </div>
        </div>
    );
};

export default LoadingSpinner;
