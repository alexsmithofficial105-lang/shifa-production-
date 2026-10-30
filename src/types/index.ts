export interface Inquiry {
  id: string;
  fullName: string;
  phoneNumber: string;
  email: string;
  city: string;
  requiredService: string;
  projectDescription: string;
  preferredDate: string;
  estimatedBudget: string;
  preferredContactMethod: 'phone' | 'whatsapp' | 'email';
  status: 'New' | 'Contacted' | 'In Discussion' | 'Confirmed' | 'Completed';
  internalNotes: string;
  createdAt: string;
  updatedAt: string;
}

export interface ServiceItem {
  id: string;
  slug: string;
  title: string;
  shortDesc: string;
  fullDesc: string;
  iconName: string;
  image?: string;
  features: string[];
  deliverables: string[];
  startingPricePkr?: string;
  turnaroundTime: string;
  displayOrder: number;
}

export interface PortfolioItem {
  id: string;
  title: string;
  category: 'Weddings' | 'Commercials' | 'Events' | 'Products' | 'Cinematic Films';
  client: string;
  location: string;
  description: string;
  image: string;
  videoUrl?: string;
  year: string;
  gearUsed: string;
  deliverables: string[];
  isFeatured: boolean;
}

export interface PackageItem {
  id: string;
  name: string;
  tagline: string;
  pricePkr: string;
  isCustomQuote: boolean;
  duration: string;
  crewSize: string;
  includedServices: string[];
  deliverables: string[];
  optionalAddons: string[];
  isPopular?: boolean;
}

export interface TestimonialItem {
  id: string;
  clientName: string;
  roleOrBrand: string;
  city: string;
  rating: number;
  reviewText: string;
  projectType: string;
  isVerifiedCustomer: boolean;
  date: string;
}

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
  category: string;
}

export type TeamRoleType = 'owner' | 'ceo' | 'team_member';

export interface TeamMember {
  id: string;
  name: string;
  roleType: TeamRoleType;
  title: string;
  bio: string;
  photo: string;
  email?: string;
  phone?: string;
  instagram?: string;
  linkedin?: string;
  displayOrder: number;
}

export interface SiteSettings {
  brandName: string;
  tagline: string;
  logoUrl?: string;
  phone: string;
  whatsapp: string;
  email: string;
  addressLahore: string;
  addressIslamabad: string;
  socials: {
    instagram: string;
    youtube: string;
    vimeo: string;
    facebook: string;
    linkedin: string;
  };
  hero: {
    heading: string;
    subheading: string;
    bgImage: string;
    bgVideoUrl?: string;
  };
  about: {
    title: string;
    story: string;
    experienceYears: string;
    completedProjects: string;
    filmmakersCount: string;
    cinematicVision: string;
  };
  seo: {
    metaTitle: string;
    metaDescription: string;
    keywords: string;
  };
  legal?: {
    privacyPolicy: string;
    termsAndConditions: string;
  };
  theme?: {
    accentColor: string;
    mode: 'dark' | 'cinematic';
  };
}

export type PageRoute =
  | 'home'
  | 'about'
  | 'services'
  | 'portfolio'
  | 'pricing'
  | 'contact'
  | 'quote'
  | 'faq'
  | 'privacy'
  | 'terms'
  | 'admin-login'
  | 'admin-dashboard'
  | '404';
