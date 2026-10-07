export type MilestoneStatus = "completed" | "in_progress" | "upcoming";

export interface RoadmapMilestone {
  id: string;
  phaseNumber: number;
  phaseTitle: string; // e.g. "Foundation", "Priority Skills", "Project", "Deployment"
  title: string;
  duration: string; // e.g. "Weeks 1-2"
  skills: string[];
  reason: string;
  actionItems: string[];
  recommendedProject?: {
    name: string;
    description: string;
    architecture: string;
  };
  status: MilestoneStatus;
}

export interface CareerRoadmap {
  id: string;
  targetRole: string;
  durationWeeks: number;
  currentStateSummary: string;
  immediatePriorities: string[];
  milestones: RoadmapMilestone[];
}
