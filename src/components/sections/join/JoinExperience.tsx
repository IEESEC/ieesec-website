"use client";

import { useState } from "react";
import { JoinForm } from "./JoinForm";
import { JoinHero } from "./JoinHero";
import { ScrollVideoBackground } from "./ScrollVideoBackground";

export function JoinExperience() {
  const [activeStep, setActiveStep] = useState(0);

  return (
    <main
      id="main-content"
      tabIndex={-1}
      className="relative isolate flex flex-1 flex-col bg-background dark:bg-slate-950/10"
    >
      <ScrollVideoBackground activeStep={activeStep} />
      <JoinHero />
      <JoinForm onActiveStepChange={setActiveStep} />
    </main>
  );
}
