import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {Campaign, SitePost} from '../../../core/models/listing.interface';
import {AiSuggestionsComponent} from '../../../shared/components/ai-suggestions/ai-suggestions.component';
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
    private baseUrl = 'http://localhost:9091/api/v1';
    instagramFormats = [
        {value: 'single-image', label: 'Single Image'},
        {value: 'carousel', label: 'Carousel'},
        {value: 'single-video', label: 'Single Video'}
    ];

    selectedFacebookImage = 0; // Index de l'image sélectionnée pour Facebook
    selectedInstagramImage = 0; // Index de l'image sélectionnée pour Instagram

    constructor(private router: Router,
                private sitePostService: SitePostService,
                private actR: ActivatedRoute,) {
    }

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
        /* if (savedListing) {
           this.listing = JSON.parse(savedListing);
         } else {
          this.router.navigate(['/listing']);
           return;
         }*/

        this.actR.params.subscribe(async (params) => {
                this.sitePostId = params['id'];
            }
        )

        /*  if (this.sitePost) {
              this.listing = this.sitePost;

              this.campaign.listingId = this.listing.idSitePost?.toString() || '';
              this.campaign.name = `Campaign - ${this.listing.title}`;
              this.campaign.targeting.location.center = `${this.listing.location}`;
          }*/
        setInterval(() => {
            if (this.selectedInstagramFormat === 'carousel') {
                this.currentCarouselIndex = (this.currentCarouselIndex + 1) % Math.max(this.listing.photoUrls.length, 3);
            }
        }, 3000);

        await this.getSitePostById(this.sitePostId);

    }

    getAdTitle(): string {
        return `${this.sitePost.propertyType} for ${this.sitePost.type === 'SALE' ? 'Sale' : 'Rent'} - ${this.sitePost.area}m²`;
    }

    getAdDescription(): string {
        return `${this.sitePost.description.substring(0, 100)}... Perfect location in ${this.sitePost.location}. Contact us for more details!`;
    }

    getCampaignDuration(): string {
       /* if (this.campaign.startDate && this.campaign.endDate) {
            const start = new Date(this.campaign.startDate);
            const end = new Date(this.campaign.endDate);
            const startStr = start.toLocaleDateString('en-US', {month: 'short', day: 'numeric'});
            const endStr = end.toLocaleDateString('en-US', {month: 'short', day: 'numeric'});
            return `${startStr} – ${endStr}`;
        }*/
        return ` days`;
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
                this.sitePost = res;
                console.log(res.photoUrls);
                console.log('Responses loaded:', this.sitePost);
                const fileName = res.photoUrls[0].split('/').pop();
                /* console.log(this.getImageUrl(fileName));*/

            }
        } catch (error) {
            console.error('Error fetching responses:', error);
        }
    }
    getImageUrl(imageName: any): string {

        console.log(imageName);
        if (!imageName) {
            return 'https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?auto=compress&cs=tinysrgb&w=500&h=300&fit=crop\'';
        }
        const fileName = imageName.split('/').pop();

        return `${this.baseUrl}/images/${fileName}`;
    }


    // Méthodes pour la sélection d'images
    selectFacebookImage(index: number) {
        this.selectedFacebookImage = index;
    }

    selectInstagramImage(index: number) {
        this.selectedInstagramImage = index;
    }

    getFacebookPreviewImage(): string {
        if (this.sitePost && this.sitePost.photoUrls && this.sitePost.photoUrls.length > 0) {
            return this.getImageUrl(this.sitePost.photoUrls[this.selectedFacebookImage]);
        }
        return '';
    }

    getInstagramPreviewImage(): string {
        if (this.sitePost && this.sitePost.photoUrls && this.sitePost.photoUrls.length > 0) {
            if (this.selectedInstagramFormat === 'carousel') {
                return this.getImageUrl(this.sitePost.photoUrls[this.currentCarouselIndex]);
            }
            return this.getImageUrl(this.sitePost.photoUrls[this.selectedInstagramImage]);
        }
        return '';
    }

    hasMultipleImages(): boolean {
        return this.sitePost && this.sitePost.photoUrls && this.sitePost.photoUrls.length > 1;
    }
}
