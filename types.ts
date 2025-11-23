export enum MaterialType {
  PLASTIC = 'Plastic Packaging',
  ORGANIC = 'Organic/Food Residue',
  TEXTILE = 'Paper/Cotton Scrap',
  METAL = 'Scrap Metal',
  ELECTRONIC = 'E-Waste',
  RUBBER = 'Rubber/Tyres',
  GLASS = 'Glass Cullet',
  CHEMICAL = 'Chemical By-products',
  CONSTRUCTION = 'Construction Debris',
  WOOD = 'Wood/Pallets',
  ENERGY = 'Waste Heat/Energy',
  OTHER = 'Other'
}

export enum ListingType {
  OFFER = 'OFFER', // I have waste to sell/give
  REQUEST = 'REQUEST' // I need raw materials
}

export enum VerificationStatus {
  PENDING = 'Pending',
  VERIFIED = 'Verified',
  REJECTED = 'Rejected'
}

export interface User {
  id: string;
  name: string;
  email: string;
  companyName?: string;
  isProfileComplete: boolean;
  // Extended profile fields
  industry?: string;
  location?: string;
  description?: string;
  memberSince?: string;
  size?: string;
}

export interface BusinessProfile {
  id: string;
  companyName: string;
  industry: string;
  location: string; // Simple string for MVP (e.g., "Gurugram, India")
  size: 'Small' | 'Medium' | 'Large';
  verificationStatus: VerificationStatus;
  description: string;
}

export interface Listing {
  id: string;
  userId: string;
  companyName: string;
  industry?: string; // Added for better filtering
  type: ListingType;
  material: MaterialType;
  quantity: number;
  unit: 'kg' | 'tons' | 'liters' | 'units';
  pricePerUnit: number; // 0 if free
  location: string;
  description: string;
  datePosted: string;
  imageUrl?: string; // Added for visual cards
}

export interface MatchResult {
  listingId: string;
  score: number; // 0-100
  reason: string;
  potentialSavings: string;
}

export interface Manifest {
  id: string;
  date: string;
  material: string;
  quantity: string;
  source: string;
  destination: string;
  status: 'Pending' | 'In Transit' | 'Completed' | 'Verified';
  carbonSaved: number; // in kg CO2
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  date: string;
  read: boolean;
  type: 'info' | 'success' | 'warning';
}