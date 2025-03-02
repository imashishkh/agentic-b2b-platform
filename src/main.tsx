
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Safety check to ensure the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  const rootElement = document.getElementById("root");
  
  if (!rootElement) {
    console.error("Root element not found! Creating one...");
    const newRoot = document.createElement("div");
    newRoot.id = "root";
    document.body.appendChild(newRoot);
    createRoot(newRoot).render(<App />);
  } else {
    createRoot(rootElement).render(<App />);
  }
});
