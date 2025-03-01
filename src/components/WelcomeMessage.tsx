
import { useState, useEffect } from "react";
import { SayHaloLogo } from "./SayHaloLogo";

/**
 * Props interface for the WelcomeMessage component
 * @property {string} [username] - Optional username to display in the greeting
 */
interface WelcomeMessageProps {
  username?: string;
}

/**
 * Array of dynamic welcome messages that will rotate
 */
const welcomeMessages = [
  "Can I help you with anything?",
  "What can I assist you with today?",
  "How may I help you?",
  "What would you like to know?",
  "Ready to answer your questions!"
];

/**
 * WelcomeMessage Component
 * 
 * Displays a welcome greeting to the user with an animated logo and introductory text.
 * Features a dynamic headline that changes periodically.
 * Used as the initial empty state in the chat interface.
 * 
 * @param {WelcomeMessageProps} props - Component properties
 * @returns {JSX.Element} - Rendered welcome message component
 */
export function WelcomeMessage({ username = "Asal Design" }: WelcomeMessageProps) {
  // State to track the current welcome message index
  const [messageIndex, setMessageIndex] = useState(0);
  
  // Effect to rotate through welcome messages
  useEffect(() => {
    // Set up an interval to change the message every 5 seconds
    const intervalId = setInterval(() => {
      setMessageIndex((prevIndex) => (prevIndex + 1) % welcomeMessages.length);
    }, 5000);
    
    // Clean up the interval when component unmounts
    return () => clearInterval(intervalId);
  }, []);
  
  return (
    <div className="flex flex-col items-center justify-center gap-4 animate-fade-in px-4">
      {/* Logo container with dark background */}
      <div className="w-[80px] h-[80px] bg-sayhalo-dark rounded-[20px] flex items-center justify-center mb-2">
        <SayHaloLogo size={48} className="animate-pulse-gentle" />
      </div>
      
      {/* Personalized greeting */}
      <h2 className="text-sayhalo-light font-medium text-xl mt-4">Hi, {username}</h2>
      
      {/* Dynamic main headline with transition effect */}
      <h1 className="text-sayhalo-dark font-semibold text-2xl md:text-3xl text-center min-h-[40px] transition-opacity duration-300">
        {welcomeMessages[messageIndex]}
      </h1>
      
      {/* Supportive text with width constraint */}
      <p className="text-sayhalo-light text-center max-w-[70%] mx-auto mt-3 text-base">
        Ready to assist you with anything you need, from answering questions to providing recommendations. Let's get started!
      </p>
    </div>
  );
}
