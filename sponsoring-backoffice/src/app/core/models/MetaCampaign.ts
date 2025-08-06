export interface MetaCampaign {
    id: number;
    name: string;
    objective: ObjectiveType;
    status: MetaStatus;
    createdAt: string; // Format ISO string
    metaCampaignId?: string;
    adSets?: AdSetWithData[];
}
 export interface AdSetWithData extends MetaAdSet {
    ads?: MetaAd[];
    isExpanded?: boolean;
    isLoadingAds?: boolean;
}
export interface MetaAdSet {
    id: number;
    name: string;
    campaignId: number;
    startTime?: string;
    endTime?: string;
    status: MetaStatus;
    dailyBudget?: number;
    ads?: MetaAd[];

}
export interface CampaignWithData extends MetaCampaign {
    isExpanded?: boolean;
    isLoadingAdSets?: boolean;
}
export interface MetaAd {
    id: number;
    name: string;
    creativeId: string;
    status: MetaStatus;
    metaAdId: string;
    createdAt: string;
    imageUrl: string;
    creativePreview?: MetaAdCreativeDto;
    siteAdId: number;

}
    export enum ObjectiveType {
    OUTCOME_TRAFFIC = 'OUTCOME_TRAFFIC',
    OUTCOME_APP_PROMOTION = 'OUTCOME_APP_PROMOTION',
    OUTCOME_LEADS = 'OUTCOME_LEADS',
    OUTCOME_ENGAGEMENT = 'OUTCOME_ENGAGEMENT',
    OUTCOME_SALES = 'OUTCOME_SALES',
    OUTCOME_AWARENESS = 'OUTCOME_AWARENESS'
}

export enum MetaStatus {
    ACTIVE = 'ACTIVE',
    PAUSED = 'PAUSED',
}


export interface MetaAdCreativeDto {
    name: string;
    message: string;
    link: string;
}