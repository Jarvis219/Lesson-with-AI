import { LucideIcon } from "lucide-react";

export interface Feature {
  title: string;
  description: string;
  icon: LucideIcon;
}

export interface Testimonial {
  name: string;
  role: string;
  image: string;
  quote: string;
}

export interface Stat {
  label: string;
  value: string;
}

export interface NavItem {
  label: string;
  href: string;
}
