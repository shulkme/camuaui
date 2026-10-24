"use client";

import { useEffect, type ReactNode } from "react";
import { ToastProvider } from "./toast";
import { TooltipProvider } from "./tooltip";

function finishThemeColorTransitions() {
  // Resolving a parent's color can start a descendant's inherited transition.
  for (;;) {
    const transitions = document.getAnimations().filter(
      (animation) =>
        "transitionProperty" in animation &&
        typeof animation.transitionProperty === "string" &&
        /(?:^color$|-color$|^(?:fill|stroke|box-shadow|text-shadow)$)/.test(
          animation.transitionProperty,
        ),
    );
    if (transitions.length === 0) break;
    for (const animation of transitions) animation.cancel();
  }
}

export function UIProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    const root = document.documentElement;
    const observer = new MutationObserver(finishThemeColorTransitions);
    observer.observe(root, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });

    const systemTheme = window.matchMedia("(prefers-color-scheme: dark)");
    function onSystemThemeChange() {
      if (!root.hasAttribute("data-theme")) finishThemeColorTransitions();
    }
    systemTheme.addEventListener("change", onSystemThemeChange);

    return () => {
      observer.disconnect();
      systemTheme.removeEventListener("change", onSystemThemeChange);
    };
  }, []);

  return (
    <TooltipProvider>
      <ToastProvider>
        <div className="isolate">{children}</div>
      </ToastProvider>
    </TooltipProvider>
  );
}
