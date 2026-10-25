"use client";

import { motion } from "framer-motion";

const ease = [0.76, 0, 0.24, 1] as const;

const variants = {
  hidden: { y: "110%" },
  shown: { y: "0%" },
};

/**
 * A line of text that slides up from behind a mask. Pass `show` to drive it
 * manually; leave it out to reveal when it scrolls into view.
 */
export default function Reveal({
  children,
  show,
  delay = 0,
  className,
}: {
  children: React.ReactNode;
  show?: boolean;
  delay?: number;
  className?: string;
}) {
  // The mask (outer span) is what's watched for visibility — the text itself
  // starts clipped out of view, so it would never count as "in view".
  const trigger =
    show === undefined
      ? { whileInView: "shown", viewport: { once: true, amount: 0.5 } }
      : { animate: show ? "shown" : "hidden" };

  return (
    <motion.span initial="hidden" {...trigger} className={`block overflow-hidden ${className ?? ""}`}>
      <motion.span className="block" variants={variants} transition={{ duration: 1, delay, ease }}>
        {children}
      </motion.span>
    </motion.span>
  );
}
