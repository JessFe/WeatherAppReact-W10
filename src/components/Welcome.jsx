import React, { useState, useEffect } from "react";
import { Sparkles } from "./Sparkles";

function Welcome() {
  const [fadeIn, setFadeIn] = useState(false);

  useEffect(() => {
    setFadeIn(true);
  }, []);

  const getGreeting = () => {
    const hour = new Date().getHours();
    switch (true) {
      case hour >= 6 && hour < 13:
        return "Morning, let's thrive!";
      case hour >= 13 && hour < 18:
        return "Hope you're having a great day!";
      case hour >= 18 && hour < 23:
        return "Unwind under starry skies.";
      default:
        return "Hey there night owl!";
    }
  };

  const greeting = getGreeting();

  return (
    <div className={`text-center text-shadow ${fadeIn ? "fade-in" : ""}`}>
      <h2 className="fw-bold p-1">
        <Sparkles> {greeting}</Sparkles>
      </h2>
    </div>
  );
}

export { Welcome };
