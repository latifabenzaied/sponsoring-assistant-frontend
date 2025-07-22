import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {Campaign, SitePost} from '../../../core/models/listing.interface';
import { AiSuggestionsComponent } from '../../../shared/components/ai-suggestions/ai-suggestions.component';
import {SitePostService} from "../../../core/services/SitePostService";
import {Observable} from "rxjs";

@Component({
  selector: 'app-campaign-creation',
  standalone: true,
  imports: [CommonModule, FormsModule, AiSuggestionsComponent],
  templateUrl: './campaign-creation.component.html'
})
export class CampaignCreationComponent implements OnInit {
  listing: SitePost = {} as SitePost;
  showCampaignDetails = false;
  selectedInstagramFormat = 'single-image';
  currentCarouselIndex = 0;
  Math = Math;
  sitePostId !: number;
  sitePost!: SitePost;

  instagramFormats = [
    { value: 'single-image', label: 'Single Image' },
    { value: 'carousel', label: 'Carousel' },
    { value: 'single-video', label: 'Single Video' }
  ];

  constructor(private router: Router,
              private sitePostService: SitePostService,
              private actR: ActivatedRoute,) {}

  campaign: Campaign = {
    listingId: '',
    name: '',
    budget: 700,
    duration: 14,
    startDate: new Date(),
    endDate: new Date(),
    targeting: {
      ageRange: {
        min: 25,
        max: 65
      },
      interests: ['Real Estate', 'Home Buying'],
      location: {
        radius: 20,
        center: ''
      }
    },
    platforms: ['facebook', 'instagram'],
    status: 'draft'
  };

  async ngOnInit() {
    const savedListing = localStorage.getItem('currentListing');
    if (savedListing) {
      this.listing = JSON.parse(savedListing);
    } else {
      this.router.navigate(['/listing']);
      return;
    }

    if (this.listing) {
      this.campaign.listingId = this.listing.idSitePost?.toString() || '';
      this.campaign.name = `Campaign - ${this.listing.title}`;
      this.campaign.targeting.location.center = `${this.listing.location}`;
    }
    this.actR.params.subscribe(async (params) => {
          this.sitePostId = params['id'];
        }
    )
    await this.getSitePostById(this.sitePostId);


    // Auto-rotate carousel for demo
    setInterval(() => {
      if (this.selectedInstagramFormat === 'carousel') {
        this.currentCarouselIndex = (this.currentCarouselIndex + 1) % Math.max(this.listing.photoUrls.length, 3);
      }
    }, 3000);

  }

  getAdTitle(): string {
    return `${this.listing.propertyType} for ${this.listing.type === 'SALE' ? 'Sale' : 'Rent'} - ${this.listing.area}m²`;
  }

  getAdDescription(): string {
    return `${this.listing.description.substring(0, 100)}... Perfect location in ${this.listing.location}. Contact us for more details!`;
  }

  getCampaignDuration(): string {
    if (this.campaign.startDate && this.campaign.endDate) {
      const start = new Date(this.campaign.startDate);
      const end = new Date(this.campaign.endDate);
      const startStr = start.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      const endStr = end.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      return `${startStr} – ${endStr}`;
    }
    return `${this.campaign.duration} days`;
  }

  navigateToListing() {
    this.router.navigate(['/listing']);
  }

  launchCampaign() {
    console.log('Campaign launched:', this.campaign);
    alert('🚀 Campaign launched successfully! Your ads are now live on Facebook and Instagram.');
  }



  async getSitePostById(id: number): Promise<void> {
    try {
      const res = await this.sitePostService.getSitePostById(id).toPromise();
      if (res) {
        this.sitePost=res;
        console.log(this.sitePost);
        console.log('Responses loaded:', this.sitePost);
      }
    } catch (error) {
      console.error('Error fetching responses:', error);
    }
  }
}
