export interface RealEstateListing {
  idSitePost?: number;
  title: string;
  description: string;
  propertyType: string;
  type: ListingType;
  area: number;
  price: number;
  location: string;
  photoUrls: string[];
  publishedAt?: string;
  status: StatusAnnonce;
  isSponsored: boolean;
  bedRoomsNb?: number;
  bathRoomsNb?: number;
  furnished?: boolean;
  availability: string;
  createdAt?: Date;
  updatedAt?: Date;
  userId?: string;
}

export enum ListingType {
  SALE = 'SALE',
  RENT = 'RENT'
}

export enum StatusAnnonce {
  DRAFT = 'DRAFT',
  PUBLISHED = 'PUBLISHED',
  SOLD = 'SOLD',
  RENTED = 'RENTED',
  ARCHIVED = 'ARCHIVED'
}

export interface Campaign {
  id?: string;
  listingId: string;
  name: string;
  budget: number;
  duration: number;
  startDate: Date;
  endDate: Date;
  targeting: {
    ageRange: {
      min: number;
      max: number;
    };
    interests: string[];
    location: {
      radius: number;
      center: string;
    };
  };
  platforms: string[];
  status: CampaignStatus;
  createdAt?: Date;
  updatedAt?: Date;
  userId?: string;
  performance?: CampaignPerformance;
}

export enum CampaignStatus {
  DRAFT = 'draft',
  ACTIVE = 'active',
  PAUSED = 'paused',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled'
}

export interface CampaignPerformance {
  reach: number;
  impressions: number;
  clicks: number;
  ctr: number;
  spend: number;
  conversions: number;
}

export interface User {
  id?: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  company?: string;
  phone?: string;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  lastLoginAt?: Date;
  listingsCount?: number;
  campaignsCount?: number;
}

export enum UserRole {
  ADMIN = 'admin',
  AGENT = 'agent',
  USER = 'user'
}

export interface AdminStats {
  totalUsers: number;
  totalListings: number;
  totalCampaigns: number;
  totalRevenue: number;
  activeUsers: number;
  publishedListings: number;
  activeCampaigns: number;
  monthlyGrowth: {
    users: number;
    listings: number;
    campaigns: number;
    revenue: number;
  };
}

export interface AnalyticsData {
  userGrowth: ChartData[];
  listingsByType: ChartData[];
  campaignPerformance: ChartData[];
  revenueOverTime: ChartData[];
  topLocations: LocationData[];
  platformDistribution: ChartData[];
}

export interface ChartData {
  label: string;
  value: number;
  date?: string;
}

export interface LocationData {
  location: string;
  count: number;
  percentage: number;
}

export interface PaginationParams {
  page: number;
  limit: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  search?: string;
  filters?: any;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}