import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MetaAdsService } from '../../../core/services/meta-ads.service';
import { MetaAd, MetaAdSet, MetaCampaign, MetaStatus, CreateAdRequest } from '../../../core/models/meta-ads.interface';

@Component({
  selector: 'app-ads',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './ads.component.html',
  styleUrls: ['./ads.component.css']
})
export class AdsComponent implements OnInit {
  campaignId!: string;
  adSetId!: string;
  campaign: MetaCampaign | null = null;
  adSet: MetaAdSet | null = null;
  ads: MetaAd[] = [];
  isLoading = true;
  showCreateModal = false;
  isCreating = false;

  // Form data
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

  // Enums for templates
  MetaStatus = MetaStatus;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private metaAdsService: MetaAdsService
  ) {}

  ngOnInit() {
    this.campaignId = this.route.snapshot.params['campaignId'];
    this.adSetId = this.route.snapshot.params['adSetId'];
    this.loadCampaign();
    this.loadAdSet();
    this.loadAds();
  }

  loadCampaign() {
    this.metaAdsService.getCampaignById(this.campaignId).subscribe({
      next: (campaign) => {
        this.campaign = campaign || null;
      },
      error: (error) => {
        console.error('Error loading campaign:', error);
      }
    });
  }

  loadAdSet() {
    this.metaAdsService.getAdSetById(this.adSetId).subscribe({
      next: (adSet) => {
        this.adSet = adSet || null;
      },
      error: (error) => {
        console.error('Error loading ad set:', error);
      }
    });
  }

  loadAds() {
    this.isLoading = true;
    this.metaAdsService.getAdsByAdSet(this.adSetId).subscribe({
      next: (ads) => {
        this.ads = ads;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading ads:', error);
        this.isLoading = false;
      }
    });
  }

  openCreateModal() {
    this.showCreateModal = true;
    this.resetForm();
  }

  closeCreateModal() {
    this.showCreateModal = false;
    this.resetForm();
  }

  resetForm() {
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
      
      // Create preview
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
        
        // Create preview
        const reader = new FileReader();
        reader.onload = (e) => {
          this.imagePreview = e.target?.result as string;
        };
        reader.readAsDataURL(file);
      }
    }
  }

  createAd() {
    if (!this.newAd.name?.trim() || !this.newAd.title?.trim()) {
      return;
    }

    this.isCreating = true;
    
    // Update metaAd object with form data
    if (this.newAd.metaAd?.creative?.object_story_spec?.link_data) {
      this.newAd.metaAd.creative.object_story_spec.link_data.name = this.newAd.title;
      this.newAd.metaAd.creative.object_story_spec.link_data.description = this.newAd.description || '';
      this.newAd.metaAd.creative.object_story_spec.link_data.message = this.newAd.title;
    }

    const createRequest: CreateAdRequest = {
      name: this.newAd.name!,
      metaAdSetId: this.adSetId,
      title: this.newAd.title!,
      description: this.newAd.description,
      metaAd: this.newAd.metaAd!,
      image: this.selectedImage || undefined
    };

    this.metaAdsService.createAd(createRequest).subscribe({
      next: (ad) => {
        this.ads.push(ad);
        this.closeCreateModal();
        this.isCreating = false;
      },
      error: (error) => {
        console.error('Error creating ad:', error);
        this.isCreating = false;
      }
    });
  }

  goBackToAdSets() {
    this.router.navigate(['/campaigns', this.campaignId, 'adsets']);
  }

  goBackToCampaigns() {
    this.router.navigate(['/campaigns']);
  }

  getStatusClass(status: MetaStatus): string {
    switch (status) {
      case MetaStatus.ACTIVE:
        return 'status-active';
      case MetaStatus.PAUSED:
        return 'status-pending';
      case MetaStatus.DELETED:
        return 'status-archived';
      case MetaStatus.ARCHIVED:
        return 'status-archived';
      default:
        return 'status-draft';
    }
  }

  deleteAd(id: string) {
    if (confirm('Are you sure you want to delete this ad?')) {
      this.metaAdsService.deleteAd(id).subscribe({
        next: () => {
          this.ads = this.ads.filter(a => a.id !== id);
        },
        error: (error) => {
          console.error('Error deleting ad:', error);
        }
      });
    }
  }
}