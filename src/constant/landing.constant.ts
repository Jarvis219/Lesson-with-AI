import { Feature, NavItem, Stat, Testimonial } from "@/types/landing";
import {
  Award,
  BookOpen,
  BrainCircuit,
  Globe,
  Headphones,
  Mic,
  PenTool,
  Sparkles,
  Target,
  TrendingUp,
  Users,
  Zap,
} from "lucide-react";

export const NAV_ITEMS: NavItem[] = [
  { label: "Outcomes", href: "#outcomes" },
  { label: "Skills", href: "#skills" },
  { label: "For Teachers", href: "#teachers" },
  { label: "For Students", href: "#students" },
  { label: "AI Features", href: "#ai" },
];

export const CORE_SKILLS: Feature[] = [
  {
    title: "Listening",
    description:
      "Understand real conversations, diverse accents, and rapid speech with ease.",
    icon: Headphones,
  },
  {
    title: "Speaking",
    description:
      "Communicate fluently and confidently in meetings, travel, or casual chats.",
    icon: Mic,
  },
  {
    title: "Reading",
    description:
      "Comprehend complex articles, business documents, and academic texts efficiently.",
    icon: BookOpen,
  },
  {
    title: "Writing",
    description:
      "Craft professional emails, essays, and reports with perfect grammar and style.",
    icon: PenTool,
  },
];

export const OUTCOMES: Feature[] = [
  {
    title: "Real-World Fluency",
    description:
      "Go beyond textbooks. Learn to speak naturally in business and social settings.",
    icon: Globe,
  },
  {
    title: "Career Advancement",
    description:
      "Unlock global opportunities by mastering professional English communication.",
    icon: TrendingUp,
  },
  {
    title: "Certified Progress",
    description:
      "Track your growth with measurable milestones and certificate achievements.",
    icon: Award,
  },
  {
    title: "Cultural Confidence",
    description:
      "Understand nuances and idioms to connect deeply with native speakers.",
    icon: Users,
  },
];

export const AI_FEATURES: Feature[] = [
  {
    title: "Smart Curriculum",
    description:
      "AI analyzes your level to generate a custom learning path instantly.",
    icon: BrainCircuit,
  },
  {
    title: "Instant Feedback",
    description: "Get real-time corrections on your pronunciation and writing.",
    icon: Zap,
  },
  {
    title: "Adaptive Practice",
    description: "Exercises that evolve based on your weak points.",
    icon: Target,
  },
  {
    title: "Effortless Creation",
    description: "Teachers can generate lesson plans and quizzes in seconds.",
    icon: Sparkles,
  },
];

export const TESTIMONIALS: Testimonial[] = [
  {
    name: "Sarah Jenkins",
    role: "ESL Student",
    image: "https://picsum.photos/100/100?random=1",
    quote:
      "I finally feel confident speaking in meetings. The AI roleplay exercises were a game changer for my anxiety.",
  },
  {
    name: "David Chen",
    role: "Certified Teacher",
    image: "https://picsum.photos/100/100?random=2",
    quote:
      "Building courses here is incredibly fast. The AI tools handle the structure so I can focus on teaching.",
  },
  {
    name: "Elena Rodriguez",
    role: "Academic Learner",
    image: "https://picsum.photos/100/100?random=3",
    quote:
      "The reading comprehension modules helped me pass my IELTS exam with a band score of 8.0.",
  },
];

export const STATS: Stat[] = [
  { label: "Active Students", value: "50,000+" },
  { label: "Courses Created", value: "1,200+" },
  { label: "Success Stories", value: "95%" },
];
