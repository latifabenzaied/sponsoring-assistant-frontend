import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {CommonModule} from '@angular/common';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {Campaign, SitePost} from '../../../core/models/listing.interface';
import {AiSuggestionsComponent} from '../../../shared/components/ai-suggestions/ai-suggestions.component';
import {SitePostService} from "../../../core/services/SitePostService";
import {Observable} from "rxjs";
import {MetaCampaign} from "../../../core/models/MetaCampaign";
import {MetaApiService} from "../../../core/services/MetaCampaignService";

@Component({
    selector: 'app-campaign-creation',
    standalone: true,
    imports: [CommonModule, FormsModule, AiSuggestionsComponent, ReactiveFormsModule],
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
    campaignForm!: FormGroup;


    constructor(private router: Router,
                private sitePostService: SitePostService,
                private actR: ActivatedRoute,
                private fb: FormBuilder,
                private metaApi: MetaApiService) {
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
        this.campaignForm = this.fb.group({
            name: ['', Validators.required],
            budget: [null, [Validators.required, Validators.min(1)]],
            duration: [null, [Validators.required, Validators.min(1)]],
            startDate: ['', Validators.required],
            endDate: ['', Validators.required],
        });

        this.actR.params.subscribe(async (params) => {
                this.sitePostId = params['id'];
            }
        )

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
                const fileName = res.photoUrls[0].split('/').pop();
            }
        } catch (error) {
            console.error('Error fetching responses:', error);
        }
    }

    getImageUrl(imageName: any): string {

        if (!imageName) {
            return 'https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?auto=compress&cs=tinysrgb&w=500&h=300&fit=crop\'';
        }
        const fileName = imageName.split('/').pop();

        return `${this.baseUrl}/images/${fileName}`;
    }


    onSubmit(): void {
        if (this.campaignForm.valid) {
            const formData = this.campaignForm.value;
            console.log('Formulaire soumis :', formData);
            const payload: MetaCampaign = {
                name: this.campaignForm.value.name,
                objective: 'OUTCOME_SALES',
                status: 'PAUSED'
            };
            this.metaApi.createMetaCampaign(payload).subscribe({
                next: (response) => {
                    console.log('✅ Campaign créée avec succès:', response);
                },
                error: (err) => {
                    console.error('Erreur création campagne:', err);
                    alert('Erreur création campagne');
                }
            });
        } else {
            console.warn('Formulaire invalide');
        }
    }
}
