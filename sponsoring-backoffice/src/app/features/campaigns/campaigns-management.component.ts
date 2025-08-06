import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import {  CampaignObjective, BillingEvent, OptimizationGoal, CreateAdRequest } from '../../core/models/meta-ads.interface';
import { AdminDataService } from '../../core/services/admin-data.service';
import { RealEstateListing } from '../../core/models/admin.interface';
import {MetaAdsService} from "../../core/services/MetaCampaignService";
import {
  MetaAdSet,
  MetaCampaign,
  ObjectiveType,
  MetaStatus,
  MetaAd,
  AdSetWithData, CampaignWithData
} from "../../core/models/MetaCampaign";
import {MetaAdService} from "../../core/services/MetaAdService";
import {MetaAdCreativeService} from "../../core/services/MetaAdCreativeService";
import {SitePost} from "../../core/models/SitePost";
import {UtlityService} from "../../core/services/UtlityService";
import {Observable} from "rxjs";
import {SitePostService} from "../../core/services/SitePostService";

@Component({
  selector: 'app-campaigns-management',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './campaigns-management.component.html'
})
export class CampaignsManagementComponent implements OnInit {
  campaigns1: (MetaCampaign & {
    isExpanded: boolean;
    isLoadingAdSets: boolean;
  })[] = [];
  isLoading = true;
  showCreateCampaignModal = false;
  showCreateAdSetModal = false;
  showCreateAdModal = false;
  isCreating = false;
  selectedCampaignId: string | null = null;
  selectedAdSetId: number | null = null;
  selectedAdSetForDetails :any = null;

  // Form data
 /* newCampaign: Partial<MetaCampaign> = {
    name: '',
    objective: CampaignObjective.LEADS,
    status: MetaStatus.ACTIVE
  };*/

  /*newAdSet: Partial<MetaAdSet> = {
    name: '',
    budget: 50,
    startDate: new Date(),
    endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    status: MetaStatus.ACTIVE,
    billingEvent: BillingEvent.CLICKS,
    optimizationGoal: OptimizationGoal.CONVERSIONS,
    targeting: {
      age_min: 18,
      age_max: 65,
      genders: [1, 2],
      geo_locations: {
        countries: ['FR']
      },
      interests: []
    }
  };*/

  newAd: Partial<CreateAdRequest> = {
    name: '',
    title: '',
    description: '',
    metaAd: {
      creative: {
        object_story_spec: {
          page_id: 'YOUR_PAGE_ID',
          link_data: {
            message: '',
            link: '',
            name: '',
            description: ''
          }
        }
      }
    }
  };

  selectedImage: File | null = null;
  imagePreview: string | null = null;
  targetingJson = '';
  showTargetingEditor = false;

  // Detail panels
  showCampaignDetails = false;
  showAdSetDetails = false;
  showAdDetails = false;
  selectedCampaignForDetails: CampaignWithData | null = null;
/*  selectedAdSetForDetails: AdSetWithData | null = null;*/
  selectedAdForDetails: MetaAd | null = null;
  linkedListing: RealEstateListing | null = null;
  showLinkedListingModal = false;

  // Enums for templates
  CampaignObjective = CampaignObjective;
  MetaStatus = MetaStatus;
  BillingEvent = BillingEvent;
  OptimizationGoal = OptimizationGoal;
  private baseUrl = 'http://localhost:9091/api/v1';

  linkedSitePosts = new Map<string, SitePost>();
  metaAds: MetaAd[] = [];
  constructor(
    private metaAdsService: MetaAdsService,
    private router: Router,
    private adminDataService: AdminDataService,
    private metaAdService: MetaAdService,
    private metaAdCretiveService: MetaAdCreativeService,
    private utilityService: UtlityService,
    private sitePostService: SitePostService

  ) {}

  ngOnInit() {
    this.loadCampaigns();
    this.loadAds();
  }

  loadCampaigns() {
    this.isLoading = true;
    this.metaAdsService.getCampaigns().subscribe({
      next: (campaigns) => {

        this.campaigns1 = campaigns.map(campaign => ({
          ...campaign,
        /*  test: (campaign.adSets || []).map(adSet => ({

            ...adSet,
            ads: adSet.ads || [],
            isExpanded: false,
            isLoadingAds: false
          })),*/
          isExpanded: false,
          isLoadingAdSets: false
        }));
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading campaigns:', error);
        this.isLoading = false;
      }
    });
  }

  loadAds(){
    this.metaAdService.getAllMetaAds().subscribe((ads: MetaAd[]) => {
      this.metaAds = ads;

      for (let ad of ads) {
        if (ad.metaAdId) {
          this.metaAdService.getSitePostByMetaAdId(ad.metaAdId).subscribe({
            next: (sitePost) => {this.linkedSitePosts.set(ad.metaAdId!, sitePost)
            console.log(sitePost);
              },
            error: () => console.warn('Pas de sitePost trouvé pour', ad.metaAdId)
          });
        }
      }
    });
  }

  toggleCampaign(campaign: any) {
    console.log("campaign", campaign);
    if (campaign.isExpanded) {
      campaign.isExpanded = false;
      return;
    }

    if (!campaign.adSets || campaign.adSets.length === 0) {
      campaign.isLoadingAdSets = true;
      /*this.metaAdsService.getAdSetsByCampaign(campaign.id!).subscribe({
        next: (adSets) => {
          campaign.adSets = adSets.map(adSet => ({
            ...adSet,
            isExpanded: false,
            isLoadingAds: false,
            ads: []
          }));
          campaign.isExpanded = true;
          campaign.isLoadingAdSets = false;
        },
        error: (error) => {
          console.error('Error loading ad sets:', error);
          campaign.isLoadingAdSets = false;
        }
      });*/
    } else {
      campaign.isExpanded = true;
    }
  }


  getStatusClass(status: MetaStatus): string {
    switch (status) {
      case MetaStatus.ACTIVE:
        return 'status-active';
      case MetaStatus.PAUSED:
        return 'status-pending';
      default:
        return status;
    }
  }

  getObjectiveLabel(objective: ObjectiveType): string {
    switch (objective) {
      case ObjectiveType.OUTCOME_AWARENESS:
        return 'Brand Awareness';
      case ObjectiveType.OUTCOME_APP_PROMOTION:
        return 'Traffic';
      case ObjectiveType.OUTCOME_ENGAGEMENT:
        return 'Engagement';
      case ObjectiveType.OUTCOME_LEADS:
        return 'Lead Generation';
      case ObjectiveType.OUTCOME_SALES:
        return 'Sales';
      default:
        return objective;
    }
  }

  toggleAdSet(adSet: AdSetWithData) {
    console.log("adSet", adSet);
    if (adSet.isExpanded) {
      adSet.isExpanded = false;
      return;
    }

    if (!adSet.ads || adSet.ads.length === 0) {
      adSet.isLoadingAds = true;

     /* this.metaAdsService.getAdsByAdSet(adSet.id!).subscribe({
        next: (ads) => {
          adSet.ads = ads;
          adSet.isExpanded = true;
          adSet.isLoadingAds = false;
        },
        error: (error) => {
          console.error('Error loading ads:', error);
          adSet.isLoadingAds = false;
        }
      });*/
    } else {
      adSet.isExpanded = true;
      this.loadCreativePreviews(adSet);
    }
  }

  private loadCreativePreviews(adSet: AdSetWithData): void {
    if (!adSet.ads) return;

    adSet.ads.forEach(ad => {
      if (!ad.creativePreview && ad.creativeId) {
        this.metaAdCretiveService.getAdCreativeById(ad.creativeId).subscribe({
          next: (dto) => {
            ad.creativePreview = dto;
            console.log(ad.creativePreview);
          },
          error: (err) => {
            console.error(`Erreur lors du chargement de la creative pour ad ${ad.name}`, err);
          }
        });
      }
    });
  }
  // Campaign CRUD
  openCreateCampaignModal() {
   /* this.showCreateCampaignModal = true;
    this.resetCampaignForm();*/
  }

  closeCreateCampaignModal() {
    /*this.showCreateCampaignModal = false;
    this.resetCampaignForm();*/
  }

  resetCampaignForm() {
    /*this.newCampaign = {
      name: '',
      objective: CampaignObjective.LEADS,
      status: MetaStatus.ACTIVE
    };*/
  }

  createCampaign() {
   /* if (!this.newCampaign.name?.trim()) {
      return;
    }

    this.isCreating = true;
    this.metaAdsService.createCampaign(this.newCampaign as MetaCampaign).subscribe({
      next: (campaign) => {
        this.campaigns.push({
          ...campaign,
          isExpanded: false,
          isLoadingAdSets: false,
          adSets: []
        });
        this.closeCreateCampaignModal();
        this.isCreating = false;
      },
      error: (error) => {
        console.error('Error creating campaign:', error);
        this.isCreating = false;
      }
    });*/
  }

  deleteCampaign(campaignId: string) {
  /*  if (confirm('Are you sure you want to delete this campaign? This will also delete all associated ad sets and ads.')) {
      this.metaAdsService.deleteCampaign(campaignId).subscribe({
        next: () => {
          this.campaigns = this.campaigns.filter(c => c.id !== campaignId);
        },
        error: (error) => {
          console.error('Error deleting campaign:', error);
        }
      });
    }*/
  }

  // Ad Set CRUD
  openCreateAdSetModal(campaignId: string) {
    this.selectedCampaignId = campaignId;
    this.showCreateAdSetModal = true;
    this.resetAdSetForm();
  }

  closeCreateAdSetModal() {
    this.showCreateAdSetModal = false;
    this.showTargetingEditor = false;
    this.selectedCampaignId = null;
    this.resetAdSetForm();
  }

  resetAdSetForm() {
/*    this.newAdSet = {
      name: '',
      budget: 50,
      startDate: new Date(),
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      status: MetaStatus.ACTIVE,
      billingEvent: BillingEvent.CLICKS,
      optimizationGoal: OptimizationGoal.CONVERSIONS,
      targeting: {
        age_min: 18,
        age_max: 65,
        genders: [1, 2],
        geo_locations: {
          countries: ['FR']
        },
        interests: []
      }
    };*/
    /*this.updateTargetingJson();/!**!/*/
  }

 /* updateTargetingJson() {
    this.targetingJson = JSON.stringify(this.newAdSet.targeting, null, 2);
  }
*/
 /* onTargetingJsonChange() {
    try {
      this.newAdSet.targeting = JSON.parse(this.targetingJson);
    } catch (e) {
      // Invalid JSON, keep the previous targeting
    }
  }*/

  toggleTargetingEditor() {
    this.showTargetingEditor = !this.showTargetingEditor;
    if (this.showTargetingEditor) {
 /*     this.updateTargetingJson();*/
    }
  }

  createAdSet() {
    /*if (!this.newAdSet.name?.trim() || !this.selectedCampaignId) {
      return;
    }

    this.isCreating = true;
    const adSetData = {
      ...this.newAdSet,
      campaignId: this.selectedCampaignId
    } as MetaAdSet;

    this.metaAdsService.createAdSet(adSetData).subscribe({
      next: (adSet) => {
        const campaign = this.campaigns.find(c => c.id === this.selectedCampaignId);
        if (campaign) {
          if (!campaign.adSets) campaign.adSets = [];
          campaign.adSets.push({
            ...adSet,
            isExpanded: false,
            isLoadingAds: false,
            ads: []
          });
        }
        this.closeCreateAdSetModal();
        this.isCreating = false;
      },
      error: (error) => {
        console.error('Error creating ad set:', error);
        this.isCreating = false;
      }
    });*/
  }

  deleteAdSet(adSetId: string) {/*
    if (confirm('Are you sure you want to delete this ad set? This will also delete all associated ads.')) {
      this.metaAdsService.deleteAdSet(adSetId).subscribe({
        next: () => {
          this.campaigns.forEach(campaign => {
            if (campaign.adSets) {
              campaign.adSets = campaign.adSets.filter(a => a.id !== adSetId);
            }
          });
        },
        error: (error) => {
          console.error('Error deleting ad set:', error);
        }
      });
    }*/
  }

  // Ad CRUD
  openCreateAdModal(adSetId: number) {
    console.log(adSetId);
    this.selectedAdSetId = adSetId;
    this.showCreateAdModal = true;
    this.resetAdForm();
  }

  closeCreateAdModal() {
    this.showCreateAdModal = false;
    this.selectedAdSetId = null;
    this.resetAdForm();
  }

  resetAdForm() {
    this.newAd = {
      name: '',
      title: '',
      description: '',
      metaAd: {
        creative: {
          object_story_spec: {
            page_id: 'YOUR_PAGE_ID',
            link_data: {
              message: '',
              link: '',
              name: '',
              description: ''
            }
          }
        }
      }
    };
    this.selectedImage = null;
    this.imagePreview = null;
  }

  onImageSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedImage = file;
      
      const reader = new FileReader();
      reader.onload = (e) => {
        this.imagePreview = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
  }

  onDragLeave(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    
    const files = event.dataTransfer?.files;
    if (files && files.length > 0) {
      const file = files[0];
      if (file.type.startsWith('image/')) {
        this.selectedImage = file;
        
        const reader = new FileReader();
        reader.onload = (e) => {
          this.imagePreview = e.target?.result as string;
        };
        reader.readAsDataURL(file);
      }
    }
  }

 /* createAd() {
    if (!this.newAd.name?.trim() || !this.newAd.title?.trim() || !this.selectedAdSetId) {
      return;
    }

    this.isCreating = true;
    
    if (this.newAd.metaAd?.creative?.object_story_spec?.link_data) {
      this.newAd.metaAd.creative.object_story_spec.link_data.name = this.newAd.title;
      this.newAd.metaAd.creative.object_story_spec.link_data.description = this.newAd.description || '';
      this.newAd.metaAd.creative.object_story_spec.link_data.message = this.newAd.title;
    }

    const createRequest: CreateAdRequest = {
      name: this.newAd.name!,
      metaAdSetId: this.selectedAdSetId,
      title: this.newAd.title!,
      description: this.newAd.description,
      metaAd: this.newAd.metaAd!,
      image: this.selectedImage || undefined
    };

    this.metaAdsService.createAd(createRequest).subscribe({
      next: (ad) => {
        this.campaigns.forEach(campaign => {
          campaign.adSets?.forEach(adSet => {
            if (adSet.id === this.selectedAdSetId) {
              if (!adSet.ads) adSet.ads = [];
              adSet.ads.push(ad);
            }
          });
        });
        this.closeCreateAdModal();
        this.isCreating = false;
      },
      error: (error) => {
        console.error('Error creating ad:', error);
        this.isCreating = false;
      }
    });
  }*/

/*  deleteAd(adId: string) {
    if (confirm('Are you sure you want to delete this ad?')) {
      this.metaAdsService.deleteAd(adId).subscribe({
        next: () => {
          this.campaigns.forEach(campaign => {
            campaign.adSets?.forEach(adSet => {
              if (adSet.ads) {
                adSet.ads = adSet.ads.filter(a => a.id !== adId);
              }
            });
          });
        },
        error: (error) => {
          console.error('Error deleting ad:', error);
        }
      });
    }
  }*/

  // Utility methods


  formatDate(date: Date): string {
    return new Date(date).toISOString().split('T')[0];
  }

  onDateChange(field: 'startDate' | 'endDate', value: string) {
 /*   if (this.newAdSet[field]) {
      this.newAdSet[field] = new Date(value);
    }*/
  }

  // Detail panel methods
  openCampaignDetails(campaign: CampaignWithData) {
    console.log(campaign);

    this.selectedCampaignForDetails = campaign;
    this.showCampaignDetails = true;
  }


  openAdSetDetails(adSet: AdSetWithData) {
    this.selectedAdSetForDetails = adSet;
    this.showAdSetDetails = true;
  }

  closeAdSetDetails() {
    this.showAdSetDetails = false;
    this.selectedAdSetForDetails = null;
  }

  openAdDetails(ad: MetaAd) {
    this.selectedAdForDetails = ad;
    this.showAdDetails = true;
  }

  closeAdDetails() {
    this.showAdDetails = false;
    this.selectedAdForDetails = null;
  }
  loadLinkedListing(listingId: number) {
    console.log(listingId);
    // Get all listings and find the one with matching idSitePost
    this.sitePostService.getAllSitePosts().subscribe({
      next: (response) => {

        const listing = response.find(l => l.idSitePost==listingId);
        console.log(listing);
        if (listing) {

          this.linkedListing = listing;
          this.showLinkedListingModal = true;
        } else {
          console.error('Linked listing not found:', listingId);
        }
      },
      error: (error) => {
        console.error('Error loading linked listing:', error);
      }
    });
  }

  // Linked listing methods
  viewLinkedListing(ad: MetaAd) {
    const sitePostId = this.linkedSitePosts.get(ad.metaAdId);
    console.log(sitePostId);
    if (sitePostId) {
      // In a real app, you might navigate to the listing page
      // this.router.navigate(['/listings', ad.listingId]);
      
      // For demo, we'll show the listing in a modal
    this.loadLinkedListing(sitePostId.idSitePost);
    }
  }
  getLinkedListingPreview(ad: MetaAd): SitePost | null {
    return ad?.metaAdId ? this.linkedSitePosts.get(ad.metaAdId) || null : null;
  }

  getImageUrl(imageName: any): string {
    if (!imageName) {
      return 'https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?auto=compress&cs=tinysrgb&w=500&h=300&fit=crop\'';
    }
    const fileName = imageName.split('/').pop();

    return `${this.baseUrl}/images/${fileName}`;
  }




  closeLinkedListingModal() {
    this.showLinkedListingModal = false;
    this.linkedListing = null;
  }


  // Mock performance data methods
/*  getCampaignMetrics(campaign: CampaignWithData) {
    return {
      totalReach: 45000 + Math.floor(Math.random() * 20000),
      totalSpend: 1200 + Math.floor(Math.random() * 800),
      totalImpressions: 85000 + Math.floor(Math.random() * 30000),
      totalClicks: 2400 + Math.floor(Math.random() * 1000)
    };
  }*/

/*  getAdSetMetrics(adSet: AdSetWithData) {
    return {
      reach: 15000 + Math.floor(Math.random() * 10000),
      clicks: 850 + Math.floor(Math.random() * 500),
      ctr: (2.5 + Math.random() * 2).toFixed(2),
      spend: adSet.budget! * 15 + Math.floor(Math.random() * 200)
    };
  }*/

  getAdMetrics(ad: MetaAd) {
    return {
      reach: 8000 + Math.floor(Math.random() * 5000),
      clicks: 420 + Math.floor(Math.random() * 300),
      reactions: 150 + Math.floor(Math.random() * 100),
      shares: 25 + Math.floor(Math.random() * 50)
    };
  }

  closeCampaignDetails() {
    this.showCampaignDetails = false;
    this.selectedCampaignForDetails = null;
  }
}