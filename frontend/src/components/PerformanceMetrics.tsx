"use client";

import { useEffect } from "react";

// Add type for LayoutShift
// type LayoutShift = PerformanceEntry & {
//   hadRecentInput: boolean;
//   value: number;
// };

// Add type for FirstInputEntry
// type FirstInputEntry = PerformanceEntry & {
//   processingStart: number;
//   startTime: number;
// };

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
        // console.log("FCP:", fcp.startTime);
      }

      // Largest Contentful Paint
      const lcpObserver = new PerformanceObserver(() => {
        // const entries = entryList.getEntries();
        // const lastEntry = entries[entries.length - 1];
        // console.log("LCP:", lastEntry.startTime);
      });
      lcpObserver.observe({ entryTypes: ["largest-contentful-paint"] });

      // Cumulative Layout Shift
      const clsObserver = new PerformanceObserver(() => {
        // let clsValue = 0;
        // for (const entry of entryList.getEntries()) {
        //   const layoutShift = entry as LayoutShift;
        //   if (!layoutShift.hadRecentInput) {
        //     clsValue += layoutShift.value;
        //   }
        // }
        // console.log("CLS:", clsValue);
      });
      clsObserver.observe({ entryTypes: ["layout-shift"] });

      // First Input Delay
      const fidObserver = new PerformanceObserver(() => {
        // for (const entry of entryList.getEntries()) {
        //   const firstInput = entry as FirstInputEntry;
        //   // console.log(
        //   //   "FID:",
        //   //   firstInput.processingStart - firstInput.startTime
        //   // );
        // }
      });
      fidObserver.observe({ entryTypes: ["first-input"] });
    }
  }, []);

  return null; // This component doesn't render anything
}
