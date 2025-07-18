export interface AdPerformance {
  id: string;
  postName: string;
  reach: number;
  impressions: number;
  ctr: number; // Click-through rate as percentage
  engagement: {
    likes: number;
    comments: number;
    shares: number;
    total: number;
  };
  costPerResult: number;
  totalSpend: number;
  campaignStatus: 'active' | 'paused' | 'ended';
  campaignName: string;
  dateRange: {
    startDate: string;
    endDate: string;
  };
  platform: 'facebook' | 'instagram' | 'both';
}

export interface PerformanceFilters {
  dateRange?: {
    startDate: string;
    endDate: string;
  };
  campaignName?: string;
  status?: 'active' | 'paused' | 'ended' | 'all';
  platform?: 'facebook' | 'instagram' | 'both' | 'all';
}

export interface PerformanceSummary {
  totalReach: number;
  totalImpressions: number;
  averageCtr: number;
  totalEngagement: number;
  totalSpend: number;
  activeCampaigns: number;
}