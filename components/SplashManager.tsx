"use client";
// components/SplashManager.tsx

import { useState, useEffect } from "react";
import { SplashScreen } from "./splash-screen";

export default function SplashManager() {
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    // Lock scrolling and force scroll to top so the Anime.js wipe aligns perfectly
    if (showSplash) {
      document.body.style.overflow = "hidden";
      window.scrollTo(0, 0); 
    } else {
      document.body.style.overflow = "";
    }
    
    // Safety cleanup 
    return () => {
      document.body.style.overflow = "";
    };
  }, [showSplash]);

  // Once finished, remove the splash screen from the DOM completely
  if (!showSplash) return null;

  return <SplashScreen onFinished={() => setShowSplash(false)} />;
}