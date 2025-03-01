
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { SayHaloLogo } from "@/components/SayHaloLogo";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen gradient-bg noise-bg flex items-center justify-center">
      <div className="glass rounded-[20px] p-8 flex flex-col items-center max-w-md">
        <SayHaloLogo size={60} className="mb-6" />
        <h1 className="text-3xl font-bold text-sayhalo-dark mb-3">404</h1>
        <p className="text-lg text-sayhalo-light mb-6">Oops! Page not found</p>
        <a 
          href="/" 
          className="px-6 py-3 bg-sayhalo-coral text-white rounded-lg hover:shadow-md transition-all"
        >
          Return to SayHalo
        </a>
      </div>
    </div>
  );
};

export default NotFound;
