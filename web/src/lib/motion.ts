// One motion language for the whole app: a soft ease-out (quint) that starts gently and settles without overshoot.
// CSS transitions use the same curve through --ease-smooth / Tailwind's default transition timing.
export const EASE = [0.22, 1, 0.36, 1] as const
