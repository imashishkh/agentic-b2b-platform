
import { SayHaloLogo } from "./SayHaloLogo";

/**
 * Props interface for the WelcomeMessage component
 * @property {string} [username] - Optional username to display in the greeting
 */
interface WelcomeMessageProps {
  username?: string;
}

/**
 * WelcomeMessage Component
 * 
 * Displays a welcome greeting to the user with an animated logo and introductory text.
 * Used as the initial empty state in the chat interface.
 * 
 * @param {WelcomeMessageProps} props - Component properties
 * @returns {JSX.Element} - Rendered welcome message component
 */
export function WelcomeMessage({ username = "Asal Design" }: WelcomeMessageProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 animate-fade-in px-4">
      {/* Logo container with dark background */}
      <div className="w-[80px] h-[80px] bg-sayhalo-dark rounded-[20px] flex items-center justify-center mb-2">
        <SayHaloLogo size={48} className="animate-pulse-gentle" />
      </div>
      
      {/* Personalized greeting */}
      <h2 className="text-sayhalo-light font-medium text-xl mt-4">Hi, {username}</h2>
      
      {/* Main headline */}
      <h1 className="text-sayhalo-dark font-semibold text-2xl md:text-3xl text-center">Can I help you with anything?</h1>
      
      {/* Supportive text with width constraint */}
      <p className="text-sayhalo-light text-center max-w-[70%] mx-auto mt-3 text-base">
        Ready to assist you with anything you need, from answering questions to providing recommendations. Let's get started!
      </p>
    </div>
  );
}
