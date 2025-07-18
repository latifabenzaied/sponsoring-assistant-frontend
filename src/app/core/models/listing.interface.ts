export interface SitePost {
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
  status: 'draft' | 'active' | 'paused' | 'completed';
  createdAt?: Date;
}

export interface AISuggestion {
  id: string;
  type: 'listing' | 'campaign';
  category: 'improvement' | 'optimization' | 'warning' | 'tip';
  title: string;
  description: string;
  actionable: boolean;
  priority: 'low' | 'medium' | 'high';
}
