import React from "react";

const ErrorMessage = ({ message, onRetry }) => {
    return (
        <div className="flex flex-col items-center justify-center p-8 text-center">
            <div className="text-red-500 dark:text-red-400 text-5xl mb-4">⚠️</div>
            <p className="text-gray-700 dark:text-gray-300 mb-4">{message}</p>
            {onRetry && (
                <button
                    onClick={onRetry}
                    className="px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-lg transition-colors"
                >
                    Try Again
                </button>
            )}
        </div>
    );
}

export default ErrorMessage;