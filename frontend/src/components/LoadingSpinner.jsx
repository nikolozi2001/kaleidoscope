import React from 'react';

const LoadingSpinner = ({ size = 'md', language = 'GE' }) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
    xl: 'h-16 w-16'
  };

  return (
    <div className="flex flex-col items-center justify-center p-4">
      <div className={`${sizeClasses[size]} animate-spin`}>
        <svg className="h-full w-full text-blue-600" fill="none" viewBox="0 0 24 24">
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      </div>
      <p className="mt-2 text-sm text-gray-600 font-bpg-nino">
        {language === 'GE' ? 'მონაცემების ჩატვირთვა...' : 'Loading data...'}
      </p>
    </div>
  );
};

const LoadingOverlay = ({ language = 'GE' }) => (
  <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-50">
    <LoadingSpinner size="lg" language={language} />
  </div>
);

const LoadingButton = ({ loading, children, language = 'GE', ...props }) => (
  <button
    {...props}
    disabled={loading || props.disabled}
    className={`${props.className} relative`}
  >
    {loading && (
      <div className="absolute inset-0 flex items-center justify-center">
        <LoadingSpinner size="sm" language={language} />
      </div>
    )}
    <span className={loading ? 'opacity-0' : 'opacity-100'}>
      {children}
    </span>
  </button>
);

export { LoadingSpinner, LoadingOverlay, LoadingButton };
export default LoadingSpinner;