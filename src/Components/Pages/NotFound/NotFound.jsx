import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function NotFound() {
  const [isRedirecting, setIsRedirecting] = useState(false);
  const navigate = useNavigate();

  const handleRedirect = () => {
    setIsRedirecting(true);
    setTimeout(() => {
      console.log("Redirecting to home page...");
      navigate('/');
    }, 1500);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900 px-4">
      <div className="text-center max-w-md">
        <h1 className="text-9xl font-bold text-blue-500 dark:text-blue-400">404</h1>

        <div className="mt-4 mb-8">
          <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-2">Page Not Found</h2>
          <p className="text-gray-600 dark:text-gray-400">
            Oops! The page you are looking for doesn't exist or has been moved.
          </p>
        </div>

        <div className="space-y-4">
          {isRedirecting ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 dark:border-blue-400"></div>
              <span className="ml-3 text-blue-500 dark:text-blue-400">Redirecting you...</span>
            </div>
          ) : (
            <button
              onClick={handleRedirect}
              className="bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg transition-colors duration-300"
            >
              Back to Home
            </button>
          )}

          <div className="pt-6">
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              If you believe this is an error, please contact support.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}