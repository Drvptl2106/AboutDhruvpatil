"use client";

import { useEffect, useRef } from "react";

const greetings = [
  { text: "Hello", type: "" },
  { text: "Bonjour", type: "" },
  { text: "Hola", type: "" },
  { text: "Ciao", type: "" },
  { text: "Hallo", type: "" },
  { text: "Olá", type: "" },
  { text: "வணக்கம்", type: "tamil" },
  { text: "देव बरें करूं", type: "konkani" },
  { text: "こんにちは", type: "cjk" },
  { text: "你好", type: "cjk" },
  { text: "안녕", type: "cjk" },
  { text: "नमस्ते", type: "devanagari" },
  { text: "مرحبا", type: "arabic" },
  { text: "Привет", type: "" },
];

const WORD_TIME = 145;
const FADE_TIME = 95;

/**
 * Multilingual greeting intro. When the cycle finishes, a black
 * oval slides up from the bottom of the screen and `onDone` fires
 * right as it takes over, so the next section can animate in.
 */
export default function Intro({ onDone }: { onDone: () => void }) {
  const introRef = useRef<HTMLDivElement>(null);
  const greetingRef = useRef<HTMLDivElement>(null);
  const revealRef = useRef<HTMLDivElement>(null);
  const onDoneRef = useRef(onDone);
  onDoneRef.current = onDone;

  useEffect(() => {
    const intro = introRef.current!;
    const greeting = greetingRef.current!;
    const blackReveal = revealRef.current!;
    const timers: ReturnType<typeof setTimeout>[] = [];
    const later = (fn: () => void, ms: number) => timers.push(setTimeout(fn, ms));

    const done = () => {
      document.body.classList.remove("intro-running");
      document.body.classList.add("intro-done");
      onDoneRef.current();
    };

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      intro.style.display = "none";
      blackReveal.style.display = "none";
      done();
      return;
    }

    let current = 0;

    function changeGreeting() {
      greeting.style.opacity = "0";

      later(() => {
        current++;

        if (current >= greetings.length) {
          finishIntro();
          return;
        }

        greeting.textContent = greetings[current].text;
        greeting.className = greetings[current].type;

        requestAnimationFrame(() => {
          greeting.style.opacity = "1";
        });

        later(changeGreeting, WORD_TIME);
      }, FADE_TIME);
    }

    function finishIntro() {
      later(() => {
        // The black oval is completely off-screen until this moment.
        blackReveal.classList.add("enter");

        later(done, 390);
        later(() => intro.classList.add("hide"), 440);
        later(() => {
          intro.style.display = "none";
          blackReveal.style.display = "none";
        }, 1050);
      }, 170);
    }

    later(changeGreeting, WORD_TIME);

    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <>
      <div id="intro" ref={introRef}>
        <div id="greeting" ref={greetingRef}>
          Hello
        </div>
      </div>
      <div id="black-reveal" ref={revealRef} />
    </>
  );
}
