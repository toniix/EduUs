import { Users, Award, GraduationCap, BookOpen } from "lucide-react";
// Helper to calculate growth %
export const getGrowth = (current, previous) => {
  if (previous === 0) return current > 0 ? "+100%" : "0%";
  const diff = current - previous;
  const percent = ((diff / previous) * 100).toFixed(1);
  return `${diff >= 0 ? "+" : ""}${percent}%`;
};
