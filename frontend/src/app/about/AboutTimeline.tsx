"use client";

import { motion } from "framer-motion";
import AnimatedSection from "@/components/ui/AnimatedSection";
import { timelineMilestones } from "./about-content";

const itemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: (index: number) => ({
    opacity: 1,
    x: 0,
    transition: { delay: index * 0.1, duration: 0.5, ease: "easeOut" },
  }),
};

function MobileMilestoneRow({
  milestone,
}: {
  milestone: (typeof timelineMilestones)[number];
}) {
  return (
    <div className="grid grid-cols-[3.5rem_1fr] gap-3 py-3">
      <p className="text-sm font-semibold text-deep-red">{milestone.year}</p>
      <div>
        <h3 className="text-sm font-semibold text-dark-teal">
          {milestone.title}
        </h3>
        <p className="mt-1 text-sm text-dark-teal/80">{milestone.description}</p>
      </div>
    </div>
  );
}

function MilestoneItem({
  milestone,
  index,
}: {
  milestone: (typeof timelineMilestones)[number];
  index: number;
}) {
  return (
    <motion.div
      className="relative flex gap-4 md:gap-6"
      custom={index}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      variants={itemVariants}
    >
      <div className="relative z-10 flex shrink-0 flex-col items-center">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-dark-teal ring-4 ring-light-cream">
          <div className="h-2.5 w-2.5 rounded-full bg-light-cream" />
        </div>
      </div>

      <div className="min-w-0 flex-1 rounded-xl bg-light-teal/50 p-5">
        <p className="mb-1 text-sm font-semibold uppercase tracking-wide text-deep-red">
          {milestone.year}
        </p>
        <h3 className="mb-2 text-xl font-semibold text-dark-teal">
          {milestone.title}
        </h3>
        <p className="text-base text-dark-teal/90">{milestone.description}</p>
      </div>
    </motion.div>
  );
}

export default function AboutTimeline() {
  return (
    <AnimatedSection className="md:rounded-2xl md:bg-white md:p-10 md:ring-1 md:ring-dark-teal/10">
      <h2 className="mb-4 text-center text-2xl font-semibold text-dark-teal md:mb-8 md:text-3xl">
        Our Story
      </h2>

      <div className="divide-y divide-dark-teal/10 md:hidden">
        {timelineMilestones.map((milestone) => (
          <MobileMilestoneRow key={milestone.year} milestone={milestone} />
        ))}
      </div>

      <div className="relative hidden space-y-6 md:block md:space-y-8">
        <div
          className="absolute bottom-0 left-4 top-0 w-0.5 bg-muted-teal/40"
          aria-hidden
        />
        {timelineMilestones.map((milestone, index) => (
          <MilestoneItem
            key={milestone.year}
            milestone={milestone}
            index={index}
          />
        ))}
      </div>
    </AnimatedSection>
  );
}
