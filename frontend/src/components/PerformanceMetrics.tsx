"use client";

import { useEffect } from "react";

export default function PerformanceMetrics() {
  useEffect(() => {
    // Report Web Vitals
    if (typeof window !== "undefined") {
      // First Contentful Paint
      const paintEntries = performance.getEntriesByType("paint");
      const fcp = paintEntries.find(
        (entry) => entry.name === "first-contentful-paint"
      );
      if (fcp) {
        console.log("FCP:", fcp.startTime);
      }

      // Largest Contentful Paint
      const lcpObserver = new PerformanceObserver((entryList) => {
        const entries = entryList.getEntries();
        const lastEntry = entries[entries.length - 1];
        console.log("LCP:", lastEntry.startTime);
      });
      lcpObserver.observe({ entryTypes: ["largest-contentful-paint"] });

      // Cumulative Layout Shift
      const clsObserver = new PerformanceObserver((entryList) => {
        let clsValue = 0;
        for (const entry of entryList.getEntries()) {
          if (!entry.hadRecentInput) {
            clsValue += entry.value;
          }
        }
        console.log("CLS:", clsValue);
      });
      clsObserver.observe({ entryTypes: ["layout-shift"] });

      // First Input Delay
      const fidObserver = new PerformanceObserver((entryList) => {
        for (const entry of entryList.getEntries()) {
          console.log("FID:", entry.processingStart - entry.startTime);
        }
      });
      fidObserver.observe({ entryTypes: ["first-input"] });
    }
  }, []);

  return null; // This component doesn't render anything
}
