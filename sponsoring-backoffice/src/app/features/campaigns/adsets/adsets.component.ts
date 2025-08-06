import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MetaAdsService } from '../../../core/services/meta-ads.service';
import { MetaAdSet, MetaCampaign, MetaStatus, BillingEvent, OptimizationGoal } from '../../../core/models/meta-ads.interface';

@Component({
  selector: 'app-adsets',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './adsets.component.html',
  styleUrls: ['./adsets.component.css']
})
export class AdSetsComponent implements OnInit {
  campaignId!: string;
  campaign: MetaCampaign | null = null;
  adSets: MetaAdSet[] = [];
  isLoading = true;
  showCreateModal = false;
  isCreating = false;
  showTargetingEditor = false;

  // Form data
  newAdSet: Partial<MetaAdSet> = {
    name: '',
    budget: 50,
    startDate: new Date(),
    endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
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
  };

  targetingJson = '';

  // Enums for templates
  MetaStatus = MetaStatus;
  BillingEvent = BillingEvent;
  OptimizationGoal = OptimizationGoal;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private metaAdsService: MetaAdsService
  ) {}

  ngOnInit() {
    this.campaignId = this.route.snapshot.params['campaignId'];
    this.loadCampaign();
    this.loadAdSets();
    this.updateTargetingJson();
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

  loadAdSets() {
    this.isLoading = true;
    this.metaAdsService.getAdSetsByCampaign(this.campaignId).subscribe({
      next: (adSets) => {
        this.adSets = adSets;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading ad sets:', error);
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
    this.showTargetingEditor = false;
    this.resetForm();
  }

  resetForm() {
    this.newAdSet = {
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
    };
    this.updateTargetingJson();
  }

  updateTargetingJson() {
    this.targetingJson = JSON.stringify(this.newAdSet.targeting, null, 2);
  }

  onTargetingJsonChange() {
    try {
      this.newAdSet.targeting = JSON.parse(this.targetingJson);
    } catch (e) {
      // Invalid JSON, keep the previous targeting
    }
  }

  toggleTargetingEditor() {
    this.showTargetingEditor = !this.showTargetingEditor;
    if (this.showTargetingEditor) {
      this.updateTargetingJson();
    }
  }

  createAdSet() {
    if (!this.newAdSet.name?.trim()) {
      return;
    }

    this.isCreating = true;
    const adSetData = {
      ...this.newAdSet,
      campaignId: this.campaignId
    } as MetaAdSet;

    this.metaAdsService.createAdSet(adSetData).subscribe({
      next: (adSet) => {
        this.adSets.push(adSet);
        this.closeCreateModal();
        this.isCreating = false;
      },
      error: (error) => {
        console.error('Error creating ad set:', error);
        this.isCreating = false;
      }
    });
  }

  viewAds(adSetId: string) {
    this.router.navigate(['/campaigns', this.campaignId, 'adsets', adSetId, 'ads']);
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

  deleteAdSet(id: string) {
    if (confirm('Are you sure you want to delete this ad set? This will also delete all associated ads.')) {
      this.metaAdsService.deleteAdSet(id).subscribe({
        next: () => {
          this.adSets = this.adSets.filter(a => a.id !== id);
        },
        error: (error) => {
          console.error('Error deleting ad set:', error);
        }
      });
    }
  }

  formatDate(date: Date): string {
    return new Date(date).toISOString().split('T')[0];
  }

  onDateChange(field: 'startDate' | 'endDate', value: string) {
    if (this.newAdSet[field]) {
      this.newAdSet[field] = new Date(value);
    }
  }
}