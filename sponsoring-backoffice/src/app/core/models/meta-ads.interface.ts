export interface MetaCampaign {
  id?: string;
  name: string;
  objective: CampaignObjective;
  status: MetaStatus;
  metaCampaignId?: string;
  createdAt?: Date;
  updatedAt?: Date;
  userId?: string;
}

export interface MetaAdSet {
  id?: string;
  campaignId: string;
  name: string;
  budget: number;
  startDate: Date;
  endDate: Date;
  status: MetaStatus;
  metaAdSetId?: string;
  billingEvent: BillingEvent;
  optimizationGoal: OptimizationGoal;
  targeting: any; // JSON object for targeting
  createdAt?: Date;
  updatedAt?: Date;
}

export interface MetaAd {
  id?: string;
  adSetId: string;
  name: string;
  metaAdId?: string;
  creativeId?: string;
  status: MetaStatus;
  postId?: string;
  title?: string;
  description?: string;
  imageUrl?: string;
  imageHash?: string;
  listingId?: string; // Reference to the real estate listing
  createdAt?: Date;
  updatedAt?: Date;
}

export enum CampaignObjective {
  AWARENESS = 'AWARENESS',
  TRAFFIC = 'TRAFFIC',
  ENGAGEMENT = 'ENGAGEMENT',
  LEADS = 'LEADS',
  APP_PROMOTION = 'APP_PROMOTION',
  SALES = 'SALES'
}

export enum MetaStatus {
  ACTIVE = 'ACTIVE',
  PAUSED = 'PAUSED',
  DELETED = 'DELETED',
  ARCHIVED = 'ARCHIVED'
}

export enum BillingEvent {
  IMPRESSIONS = 'IMPRESSIONS',
  CLICKS = 'CLICKS',
  ACTIONS = 'ACTIONS'
}

export enum OptimizationGoal {
  REACH = 'REACH',
  IMPRESSIONS = 'IMPRESSIONS',
  CLICKS = 'CLICKS',
  CONVERSIONS = 'CONVERSIONS',
  ENGAGEMENT = 'ENGAGEMENT'
}

export interface CreateAdRequest {
  name: string;
  metaAdSetId: string;
  title: string;
  description?: string;
  metaAd: any; // JSON object
  image?: File;
  listingId?: string;
}