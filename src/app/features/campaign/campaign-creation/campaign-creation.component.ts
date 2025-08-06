import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {CommonModule} from '@angular/common';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import { SitePost} from '../../../core/models/listing.interface';
import {AiSuggestionsComponent} from '../../../shared/components/ai-suggestions/ai-suggestions.component';
import {SitePostService} from "../../../core/services/SitePostService";
import {catchError, finalize, switchMap, tap, throwError} from "rxjs";
import {MetaAd, MetaAdSet, MetaCampaign, MetaStatus} from "../../../core/models/MetaCampaign";
import {MetaApiService} from "../../../core/services/MetaCampaignService";
import {MetaAdSetService} from "../../../core/services/MetaAdSetService";
import {MetaAdService} from "../../../core/services/MetaAdService";
import {combineLatest} from 'rxjs';

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
    showPopup = false;
    isLoading = false;
    createdCampaign?: MetaCampaign;
    createdAdSet?: MetaAdSet;
    createdAd?: MetaAd;


    constructor(private router: Router,
                private sitePostService: SitePostService,
                private actR: ActivatedRoute,
                private fb: FormBuilder,
                private metaApi: MetaApiService,
                private metaSetAd: MetaAdSetService,
                private metaAd: MetaAdService,
    ) {
    }


    async ngOnInit() {
        this.campaignForm = this.fb.group({
            name: ['', Validators.required],
            budget: [null, [Validators.required, Validators.min(1)]],
            duration: [{value: null, disabled: true}, [Validators.required, Validators.min(1)]],
            startDate: ['', Validators.required],
            endDate: ['', Validators.required],
        });
        this.actR.params.subscribe(async (params) => {
                this.sitePostId = params['id'];
            }
        );

        this.campaignForm.valueChanges.subscribe(() => {
            this.getCampaignDuration();
            this.getTotalBudget();
        });

        setInterval(() => {
            if (this.selectedInstagramFormat === 'carousel') {
                this.currentCarouselIndex = (this.currentCarouselIndex + 1) % Math.max(this.listing.photoUrls.length, 3);
            }
        }, 3000);

        await this.getSitePostById(this.sitePostId);
        this.autoCalculateDuration();

    }
    getAdTitle(): string {
        return `${this.sitePost.propertyType} for ${this.sitePost.type === 'SALE' ? 'Sale' : 'Rent'} - ${this.sitePost.area}m²`;
    }
    getAdDescription(): string {
        return `${this.sitePost.description.substring(0, 100)}... Perfect location in ${this.sitePost.location}. Contact us for more details!`;
    }
    getCampaignDuration(): string {
        if (this.campaignForm.value.startDate && this.campaignForm.value.endDate) {
            const start = new Date(this.campaignForm.value.startDate);
            const end = new Date(this.campaignForm.value.endDate);
            const startStr = start.toLocaleDateString('en-US', {month: 'short', day: 'numeric'});
            const endStr = end.toLocaleDateString('en-US', {month: 'short', day: 'numeric'});
            return `${startStr} – ${endStr}`;
        }
        return ` days`;
    }
    getTotalBudget(): string {
        if (this.campaignForm.value.budget) {
            return this.campaignForm.value.budget + 'dt';
        }
        return `0`;
    }
    navigateToListing() {
        this.router.navigate(['/listing']);
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
        const campaign = this.prepareCampaignData();
        this.isLoading = true;
        this.metaApi.createMetaCampaign(campaign)
            .pipe(
                tap((createdCampaign) => {
                    console.log('✅ Étape 1 - Campagne créée:', createdCampaign);
                    this.createdCampaign = createdCampaign;
                    console.log(createdCampaign.id)
                }),

                switchMap((createdCampaign) => {
                    const adSet = this.prepareAdSetData(createdCampaign);
                    return this.metaSetAd.createAdSet(adSet);
                }),

                tap((createdAdSet) => {
                    console.log('✅ Étape 2 - AdSet créé:', createdAdSet);
                    this.createdAdSet = createdAdSet;
                }),

                switchMap((createdAdSet) => {
                    console.log(createdAdSet);
                    const ad = this.prepareAdData(createdAdSet.metaAdSetId!);
                    console.log('ad', ad);
                    return this.metaAd.createAd(ad);
                }),

                tap((createdAd) => {
                    console.log('Étape 3 - Publicité créée:', createdAd);
                    this.createdAd = createdAd;
                }),
                catchError((error) => {
                    console.error(`Erreur à l'étape`, error);
                    return throwError(error);
                }),
                finalize(() => {
                    this.isLoading = false;
                    /*     this.isLoading = false;*/
                })
            )
            .subscribe({
                next: (finalResult) => {
                    setTimeout(() => {
                        this.showPopup = false;
                        this.router.navigate(['/listing']);
                    }, 4000);

                },
                error: (error) => {


                    console.error('Échec du workflow:', error);
                }
            });
    }
    private prepareCampaignData(): MetaCampaign {
        return {

            name: this.campaignForm.value.name || `Campagne_${Date.now()}`,
            objective: 'OUTCOME_TRAFFIC', // Objectif par défaut
            status: 'PAUSED', // Toujours créer en pause pour révision
            // metaCampaignId sera généré par le backend
        };
    }
    private prepareAdSetData(campaign: MetaCampaign): MetaAdSet {
        const now = new Date();
        const endDate = new Date(now.getTime() + (30 * 24 * 60 * 60 * 1000)); // +30 jours par défaut

        return {
            name: `AdSet_${Date.now()}`,
            metaCampaignId: campaign.metaCampaignId,
            dailyBudget: this.campaignForm.value.budget || 1000,
            billingEvent: 'IMPRESSIONS',
            optimizationGoal: 'LINK_CLICKS',
            status: MetaStatus.PAUSED,
            bidStrategy: 'LOWEST_COST_WITHOUT_CAP',
            bidAmount: 100, // Optionnel selon la stratégie
            startTime: this.campaignForm.value.startDate,
            endTime: this.campaignForm.value.endDate,
            targetingJson: "{\"geo_locations\":{\"countries\":[\"TN\"]},\"age_min\":25,\"age_max\":55,\"interests\":[{\"id\":\"6003139266461\",\"name\":\"Immobilier\"}]}",

        };
    }
    private prepareAdData(adSetId: string): MetaAd {
        const fileName = this.sitePost.photoUrls[0]?.split('/').pop();
        return {
            name: this.sitePost.title,
            metaAdSetId: adSetId,
            status: 'PAUSED',
            imageFileName: fileName,
            siteAdId: this.sitePostId,
            message: this.sitePost.description
        };
    }
    private autoCalculateDuration(): void {
        combineLatest([
            this.campaignForm.get('startDate')!.valueChanges,
            this.campaignForm.get('endDate')!.valueChanges
        ]).subscribe(([start, end]) => {
            const startDate = new Date(start);
            const endDate = new Date(end);

            if (!isNaN(startDate.getTime()) && !isNaN(endDate.getTime()) && endDate >= startDate) {
                const days = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
                this.campaignForm.get('duration')!.setValue(days, {emitEvent: false});
            } else {
                this.campaignForm.get('duration')!.setValue(null, {emitEvent: false});
            }
        });
    }


}
