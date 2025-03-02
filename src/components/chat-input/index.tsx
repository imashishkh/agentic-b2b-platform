
import React, { useState, KeyboardEvent } from 'react';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  isLoading?: boolean;
  isDisabled?: boolean; // Added isDisabled prop
}

export const ChatInput: React.FC<ChatInputProps> = ({ 
  onSendMessage, 
  isLoading = false,
  isDisabled = false 
}) => {
  const [message, setMessage] = useState('');

  const handleSubmit = () => {
    if (message.trim() && !isLoading && !isDisabled) {
      onSendMessage(message);
      setMessage('');
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="flex-1 flex items-center">
      <input
        type="text"
        placeholder="Type your message here..."
        className="input input-bordered w-full"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={handleKeyDown}
        disabled={isLoading || isDisabled}
      />
      <button
        className="btn btn-primary ml-2"
        onClick={handleSubmit}
        disabled={!message.trim() || isLoading || isDisabled}
      >
        {isLoading ? 'Loading...' : 'Send'}
      </button>
    </div>
  );
};
