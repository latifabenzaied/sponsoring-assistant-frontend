export interface SitePost {
    idSitePost: number;
    title: string;
    description: string;
    propertyType: string;
    type: ListingType;
    area: number;
    price: number;
    location: string;
    photoUrls: string[];
    publishedAt: string;
    status: StatusAnnonce;
    isSponsored: boolean;
    bedRoomsNb: number;
    bathRoomsNb: number;
    furnished: boolean;
    availability: string;
}


export enum ListingType {
    SALE = 'SALE',
    RENT = 'RENT'
}

export enum StatusAnnonce {
    PUBLISHED = 'PUBLISHED',
    ARCHIVED="ARCHIVED",
    DRAFT="DRAFT"
}