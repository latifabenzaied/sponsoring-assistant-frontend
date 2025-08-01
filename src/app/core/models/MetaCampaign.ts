
export interface MetaCampaign {
    id?:number;
    name: string;
    objective: string;
    status: string;
    metaCampaignId?: string; // renvoyé par backend
}

export interface MetaAdSet {
    id?: number; // optionnel si auto-généré par le backend
    metaAdSetId?: string;
    name: string;
    dailyBudget: number;
    billingEvent: string;
    optimizationGoal: string;
    status: MetaStatus;
    startTime?: string; // ISO string (LocalDateTime en Java)
    endTime?: string;
    targetingJson?: string;
    bidAmount?: number;
    bidStrategy?: string;
    bidConstraints?: string;

    campaign?: MetaCampaign; // relation ManyToOne
    ads?: MetaAd[];          // relation OneToMany
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

export enum MetaStatus {
    ACTIVE = 'ACTIVE',
    PAUSED = 'PAUSED',
}

