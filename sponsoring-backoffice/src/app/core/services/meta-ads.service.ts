import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { delay, map } from 'rxjs/operators';
import { 
  MetaCampaign, 
  MetaAdSet, 
  MetaAd, 
  CampaignObjective, 
  MetaStatus, 
  BillingEvent, 
  OptimizationGoal,
  CreateAdRequest
} from '../models/meta-ads.interface';

@Injectable({
  providedIn: 'root'
})
export class MetaAdsService {
  private campaignsSubject = new BehaviorSubject<MetaCampaign[]>([]);
  private adSetsSubject = new BehaviorSubject<MetaAdSet[]>([]);
  private adsSubject = new BehaviorSubject<MetaAd[]>([]);

  public campaigns$ = this.campaignsSubject.asObservable();
  public adSets$ = this.adSetsSubject.asObservable();
  public ads$ = this.adsSubject.asObservable();

  // Mock data
  private mockCampaigns: MetaCampaign[] = [
    {
      id: '1',
      name: 'Real Estate Lead Generation',
      objective: CampaignObjective.LEADS,
      status: MetaStatus.ACTIVE,
      metaCampaignId: 'META_CAMP_001',
      createdAt: new Date('2024-01-15'),
      userId: '2'
    },
    {
      id: '2',
      name: 'Property Awareness Campaign',
      objective: CampaignObjective.AWARENESS,
      status: MetaStatus.PAUSED,
      metaCampaignId: 'META_CAMP_002',
      createdAt: new Date('2024-01-10'),
      userId: '3'
    }
  ];

  private mockAdSets: MetaAdSet[] = [
    {
      id: '1',
      campaignId: '1',
      name: 'Downtown Properties AdSet',
      budget: 50,
      startDate: new Date('2024-01-20'),
      endDate: new Date('2024-02-20'),
      status: MetaStatus.ACTIVE,
      metaAdSetId: 'META_ADSET_001',
      billingEvent: BillingEvent.CLICKS,
      optimizationGoal: OptimizationGoal.CONVERSIONS,
      targeting: {
        age_min: 25,
        age_max: 55,
        genders: [1, 2],
        geo_locations: {
          countries: ['FR'],
          cities: [{ key: 'paris', name: 'Paris' }]
        },
        interests: [{ id: '6003107902433', name: 'Real estate' }]
      },
      createdAt: new Date('2024-01-18')
    },
    {
      id: '2',
      campaignId: '1',
      name: 'Luxury Homes AdSet',
      budget: 100,
      startDate: new Date('2024-01-22'),
      endDate: new Date('2024-02-22'),
      status: MetaStatus.ACTIVE,
      metaAdSetId: 'META_ADSET_002',
      billingEvent: BillingEvent.IMPRESSIONS,
      optimizationGoal: OptimizationGoal.REACH,
      targeting: {
        age_min: 35,
        age_max: 65,
        genders: [1, 2],
        geo_locations: {
          countries: ['FR'],
          cities: [{ key: 'nice', name: 'Nice' }]
        },
        interests: [{ id: '6003107902433', name: 'Real estate' }, { id: '6003139266461', name: 'Luxury goods' }]
      },
      createdAt: new Date('2024-01-20')
    }
  ];

  private mockAds: MetaAd[] = [
    {
      id: '1',
      adSetId: '1',
      name: 'Modern Apartment Ad',
      metaAdId: 'META_AD_001',
      creativeId: 'CREATIVE_001',
      status: MetaStatus.ACTIVE,
      postId: 'POST_001',
      title: 'Find Your Dream Apartment',
      description: 'Beautiful modern apartments in downtown Paris',
      imageUrl: 'https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg',
      listingId: '1', // Links to listing with idSitePost: 1
      createdAt: new Date('2024-01-19')
    },
    {
      id: '2',
      adSetId: '2',
      name: 'Luxury Villa Ad',
      metaAdId: 'META_AD_002',
      creativeId: 'CREATIVE_002',
      status: MetaStatus.ACTIVE,
      postId: 'POST_002',
      title: 'Exclusive Luxury Villas',
      description: 'Premium properties with stunning views',
      imageUrl: 'https://images.pexels.com/photos/2121121/pexels-photo-2121121.jpeg',
      listingId: '3', // Links to listing with idSitePost: 3
      createdAt: new Date('2024-01-21')
    }
  ];

  constructor() {
    this.campaignsSubject.next(this.mockCampaigns);
    this.adSetsSubject.next(this.mockAdSets);
    this.adsSubject.next(this.mockAds);
  }

  // Campaigns CRUD
  getCampaigns(): Observable<MetaCampaign[]> {
    return of(this.mockCampaigns).pipe(delay(300));
  }

  createCampaign(campaign: MetaCampaign): Observable<MetaCampaign> {
    const newCampaign = {
      ...campaign,
      id: (this.mockCampaigns.length + 1).toString(),
      createdAt: new Date(),
      metaCampaignId: `META_CAMP_${String(this.mockCampaigns.length + 1).padStart(3, '0')}`
    };
    
    this.mockCampaigns.push(newCampaign);
    this.campaignsSubject.next(this.mockCampaigns);
    
    return of(newCampaign).pipe(delay(500));
  }

  updateCampaign(id: string, campaign: Partial<MetaCampaign>): Observable<MetaCampaign> {
    const index = this.mockCampaigns.findIndex(c => c.id === id);
    if (index === -1) {
      return throwError(() => new Error('Campaign not found'));
    }

    this.mockCampaigns[index] = {
      ...this.mockCampaigns[index],
      ...campaign,
      updatedAt: new Date()
    };
    
    this.campaignsSubject.next(this.mockCampaigns);
    return of(this.mockCampaigns[index]).pipe(delay(500));
  }

  deleteCampaign(id: string): Observable<void> {
    const index = this.mockCampaigns.findIndex(c => c.id === id);
    if (index === -1) {
      return throwError(() => new Error('Campaign not found'));
    }

    this.mockCampaigns.splice(index, 1);
    this.campaignsSubject.next(this.mockCampaigns);
    return of(void 0).pipe(delay(500));
  }

  // Ad Sets CRUD
  getAdSetsByCampaign(campaignId: string): Observable<MetaAdSet[]> {
    const adSets = this.mockAdSets.filter(adSet => adSet.campaignId === campaignId);
    return of(adSets).pipe(delay(300));
  }

  createAdSet(adSet: MetaAdSet): Observable<MetaAdSet> {
    const newAdSet = {
      ...adSet,
      id: (this.mockAdSets.length + 1).toString(),
      createdAt: new Date(),
      metaAdSetId: `META_ADSET_${String(this.mockAdSets.length + 1).padStart(3, '0')}`
    };
    
    this.mockAdSets.push(newAdSet);
    this.adSetsSubject.next(this.mockAdSets);
    
    return of(newAdSet).pipe(delay(500));
  }

  updateAdSet(id: string, adSet: Partial<MetaAdSet>): Observable<MetaAdSet> {
    const index = this.mockAdSets.findIndex(a => a.id === id);
    if (index === -1) {
      return throwError(() => new Error('Ad Set not found'));
    }

    this.mockAdSets[index] = {
      ...this.mockAdSets[index],
      ...adSet,
      updatedAt: new Date()
    };
    
    this.adSetsSubject.next(this.mockAdSets);
    return of(this.mockAdSets[index]).pipe(delay(500));
  }

  deleteAdSet(id: string): Observable<void> {
    const index = this.mockAdSets.findIndex(a => a.id === id);
    if (index === -1) {
      return throwError(() => new Error('Ad Set not found'));
    }

    this.mockAdSets.splice(index, 1);
    this.adSetsSubject.next(this.mockAdSets);
    return of(void 0).pipe(delay(500));
  }

  // Ads CRUD
  getAdsByAdSet(adSetId: string): Observable<MetaAd[]> {
    const ads = this.mockAds.filter(ad => ad.adSetId === adSetId);
    return of(ads).pipe(delay(300));
  }

  createAd(createAdRequest: CreateAdRequest): Observable<MetaAd> {
    // Simulate multipart/form-data processing
    const imageHash = createAdRequest.image ? 
      `IMG_HASH_${Math.random().toString(36).substr(2, 9)}` : undefined;
    
    const newAd: MetaAd = {
      id: (this.mockAds.length + 1).toString(),
      adSetId: createAdRequest.metaAdSetId,
      name: createAdRequest.name,
      title: createAdRequest.title,
      description: createAdRequest.description,
      metaAdId: `META_AD_${String(this.mockAds.length + 1).padStart(3, '0')}`,
      creativeId: `CREATIVE_${String(this.mockAds.length + 1).padStart(3, '0')}`,
      status: MetaStatus.ACTIVE,
      postId: `POST_${String(this.mockAds.length + 1).padStart(3, '0')}`,
      imageHash,
      imageUrl: createAdRequest.image ? URL.createObjectURL(createAdRequest.image) : undefined,
      listingId: createAdRequest.listingId,
      createdAt: new Date()
    };
    
    this.mockAds.push(newAd);
    this.adsSubject.next(this.mockAds);
    
    return of(newAd).pipe(delay(1000)); // Longer delay to simulate file upload
  }

  updateAd(id: string, ad: Partial<MetaAd>): Observable<MetaAd> {
    const index = this.mockAds.findIndex(a => a.id === id);
    if (index === -1) {
      return throwError(() => new Error('Ad not found'));
    }

    this.mockAds[index] = {
      ...this.mockAds[index],
      ...ad,
      updatedAt: new Date()
    };
    
    this.adsSubject.next(this.mockAds);
    return of(this.mockAds[index]).pipe(delay(500));
  }

  deleteAd(id: string): Observable<void> {
    const index = this.mockAds.findIndex(a => a.id === id);
    if (index === -1) {
      return throwError(() => new Error('Ad not found'));
    }

    this.mockAds.splice(index, 1);
    this.adsSubject.next(this.mockAds);
    return of(void 0).pipe(delay(500));
  }

  // Helper methods
  getCampaignById(id: string): Observable<MetaCampaign | undefined> {
    const campaign = this.mockCampaigns.find(c => c.id === id);
    return of(campaign).pipe(delay(200));
  }

  getAdSetById(id: string): Observable<MetaAdSet | undefined> {
    const adSet = this.mockAdSets.find(a => a.id === id);
    return of(adSet).pipe(delay(200));
  }
}