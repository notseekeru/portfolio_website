import type { Variants } from "motion/react";

const REVEAL = { duration: 0.45, ease: "easeOut" } as const;

export const stagger = (each = 0.05): Variants => ({ hidden: {}, show: { transition: { staggerChildren: each } } });

export const rise: Variants = {
    hidden: { opacity: 0, y: 24 },
    show: { opacity: 1, y: 0, transition: REVEAL },
};

export const fade: Variants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { duration: 0.6, ease: "easeOut" } },
};

export const slideIn: Variants = {
    hidden: { opacity: 0, x: -28 },
    show: { opacity: 1, x: 0, transition: REVEAL },
    exit: { opacity: 0, x: -16, transition: { duration: 0.2 } },
};

export const pop: Variants = {
    hidden: { opacity: 0, y: 12, scale: 0.95 },
    show: { opacity: 1, y: 0, scale: 1, transition: REVEAL },
};

export const wave: Variants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, y: [0, -8, 0], transition: { duration: 0.55, times: [0, 0.35, 1], ease: "easeOut" } },
};

export const maskRise: Variants = {
    hidden: { opacity: 0, y: 12, clipPath: "inset(0% 0% 100% 0%)" },
    show: { opacity: 1, y: 0, clipPath: "inset(0% 0% -5% 0%)", transition: { duration: 0.6, ease: "easeOut" } },
};

export const revealViewport = { once: true, margin: "-40px 0px" } as const;
