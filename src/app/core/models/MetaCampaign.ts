
export interface MetaCampaign {
    name: string;
    objective: string;
    status: string;
    metaCampaignId?: string; // renvoyé par backend
}

export interface MetaAdSet {
    name: string;
    metaCampaignId: string;
    dailyBudget: number;
    billingEvent: string;
    optimizationGoal: string;
    status: string;
    bidStrategy: string;
    bidAmount?: number;
    bidConstraints?: string;
    startTime: string;  // Format ISO 8601
    endTime: string;    // Format ISO 8601
    targetingJson: string;
    metaAdSetId?: string;
    id?: number;
}
export interface Ad {
    metaCampaignId?: string;
    metaAdSetId?: string;
    metaAdId?: string;
    idSitePost: number;
}

export interface MetaAd {
    id?: number;
    name: string;
    creativeId?: string;
    status: string;
    metaAdSetId: string;
    createdAt?: Date;
    adSet?: any;
}


