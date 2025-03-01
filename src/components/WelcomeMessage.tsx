
import { SayHaloLogo } from "./SayHaloLogo";

interface WelcomeMessageProps {
  username?: string;
}

export function WelcomeMessage({ username = "Asal Design" }: WelcomeMessageProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 animate-fade-in">
      <SayHaloLogo size={60} className="animate-pulse-gentle" />
      <h2 className="text-sayhalo-light font-medium text-lg mt-2">Hi, {username}</h2>
      <h1 className="text-sayhalo-dark font-semibold text-2xl md:text-3xl">Can I help you with anything?</h1>
      <p className="text-sayhalo-light text-center max-w-[65%] mx-auto mt-2">
        Ready to assist you with anything you need, from answering questions to providing recommendations. Let's get started!
      </p>
    </div>
  );
}
