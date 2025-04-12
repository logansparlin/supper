"use client";
 
import { useContext, useEffect, useRef, useCallback } from "react";
import { usePathname, useSelectedLayoutSegment } from "next/navigation";
import { useLenis } from "lenis/react";

import { LayoutRouterContext } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { AnimatePresence, motion } from "motion/react";
 
function usePreviousValue<T>(value: T): T | undefined {
  const prevValue = useRef<T | undefined>(undefined);
 
  useEffect(() => {
    prevValue.current = value;
    return () => {
      prevValue.current = undefined;
    };
  });
 
  return prevValue.current;
}
 
function FrozenRouter(props: { children: React.ReactNode }) {
  const context = useContext(LayoutRouterContext);
  const prevContext = usePreviousValue(context) || null;
 
  const url = context?.url;
  const prevUrl = prevContext?.url;
  const segment = useSelectedLayoutSegment();
  const prevSegment = usePreviousValue(segment);
 
  const changed =
    (
      segment !== prevSegment &&
      segment !== undefined &&
      prevSegment !== undefined
    ) || (
      url !== prevUrl &&
      url !== undefined &&
      prevUrl !== undefined
    )
 
  return (
    <LayoutRouterContext.Provider value={changed ? prevContext : context}>
      {props.children}
    </LayoutRouterContext.Provider>
  );
}

const defaultInitial = {
  opacity: 0,
}

const defaultAnimate = {
  opacity: 1,
}

const defaultExit = {
  opacity: 0,
}

const defaultTransition = {
  duration: 0.45,
  ease: "easeInOut"
}
 
interface LayoutTransitionProps {
  children: React.ReactNode;
  className?: React.ComponentProps<typeof motion.div>["className"];
  style?: React.ComponentProps<typeof motion.div>["style"];
  initial?: React.ComponentProps<typeof motion.div>["initial"];
  animate?: React.ComponentProps<typeof motion.div>["animate"];
  exit?: React.ComponentProps<typeof motion.div>["exit"];
  transition?: React.ComponentProps<typeof motion.div>["transition"];
}
 
export function LayoutTransition({
  children,
  className,
  style,
  initial = defaultInitial,
  animate = defaultAnimate,
  exit = defaultExit,
  transition = defaultTransition,
}: LayoutTransitionProps) {
  const segment = useSelectedLayoutSegment();
  const lenis = useLenis();
  const pathname = usePathname();

  const scrollToTop = useCallback(() => {
    if (lenis) {
      lenis.scrollTo(0, { immediate: true });
    } else {
      window.scrollTo(0, 0);
    }
  }, [lenis])
 
  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        className={className}
        style={style}
        key={`${segment}-${pathname}`}
        initial={initial}
        animate={animate}
        exit={{
          opacity: 0,
          transition: {
            ...transition,
            onComplete: scrollToTop
          }
        }}
        transition={transition}
      >
        <FrozenRouter>{children}</FrozenRouter>
      </motion.div>
    </AnimatePresence>
  );
}
