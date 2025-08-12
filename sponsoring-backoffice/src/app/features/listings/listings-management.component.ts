import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AdminDataService } from '../../core/services/admin-data.service';
import { MetaAdsService } from '../../core/services/meta-ads.service';
import { RealEstateListing, PaginatedResponse, StatusAnnonce, ListingType } from '../../core/models/admin.interface';
import { MetaAd, MetaCampaign, MetaAdSet, MetaStatus, CreateAdRequest } from '../../core/models/meta-ads.interface';
import {SitePostService} from "../../core/services/SitePostService";
import {SitePost} from "../../core/models/SitePost";
import { HttpClientModule } from '@angular/common/http';
import {UtlityService} from "../../core/services/UtlityService"; // Ajout important

@Component({
  selector: 'app-listings-management',
  standalone: true,
  imports: [CommonModule, FormsModule,HttpClientModule  ],
  templateUrl: './listings-management.component.html',
  styleUrls: ['./listings-management.component.css']
})
export class ListingsManagementComponent implements OnInit {
  listings: SitePost[] = [];
  isLoading = true;
  filteredListings: SitePost[] = [];
  searchTerm = '';
  currentPage = 1;
  itemsPerPage = 10;
  totalPages = 1;
  totalItems = 0;
  allListings: SitePost[] = [];
  
  // Ad integration
  showAdHistoryModal = false;
  showCreateAdModal = false;
  selectedListing: RealEstateListing | null = null;
  listingAds: MetaAd[] = [];
  isLoadingAds = false;
  isCreatingAd = false;
  
  // Available campaigns and ad sets for ad creation
  availableCampaigns: MetaCampaign[] = [];
  availableAdSets: MetaAdSet[] = [];
  selectedCampaignId = '';
  selectedAdSetId = '';


  private baseUrl = 'http://localhost:9091/api/v1';
  
  // New ad form
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

  Math = Math;

  constructor(
    private adminDataService: AdminDataService,
    private metaAdsService: MetaAdsService,
    private router: Router,
    private sitePostService: SitePostService,
    private utilityService:UtlityService,
  ) {}

  ngOnInit() {
    this.loadListings();
    this.loadCampaigns();
  }

  /*loadListings() {
    this.isLoading = true;
    this.adminDataService.getListings({
      page: this.currentPage,
      limit: 10,
      search: this.searchTerm
    }).subscribe({
      next: (response: PaginatedResponse<RealEstateListing>) => {
        this.listings = response.data;
        this.totalPages = response.totalPages;
        this.totalItems = response.total;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading listings:', error);
        this.isLoading = false;
      }
    });
  }*/
  loadListings() {
    this.isLoading = true;
    this.sitePostService.getAllSitePosts().subscribe({
      next: (response: SitePost[]) => {
        this.listings = response;
        this.allListings = response; // <- conserve tout
        // Simuler la pagination côté client
        this.totalItems = response.length;
        this.totalPages = Math.ceil(this.totalItems / this.itemsPerPage);
        console.log(this.totalItems);
        console.log(this.totalPages);

        // Appliquer la pagination côté client
        this.applyClientSidePagination();

        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading listings:', error);
        this.isLoading = false;
      }
    });
  }

  private applyClientSidePagination() {
    let filtered = [...this.allListings]; // <- utiliser allListings
    if (this.searchTerm.trim()) {
      const term = this.searchTerm.toLowerCase();
      filtered = filtered.filter(listing =>
          listing.title.toLowerCase().includes(term) ||
          listing.description.toLowerCase().includes(term) ||
          listing.location.toLowerCase().includes(term) ||
          listing.propertyType.toLowerCase().includes(term)
      );
    }

    this.totalItems = filtered.length;
    this.totalPages = Math.ceil(this.totalItems / this.itemsPerPage);

    // Appliquer la pagination
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.listings = filtered.slice(startIndex, endIndex);
  }

  goToPreviousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.applyClientSidePagination();
    }
  }

  goToNextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.applyClientSidePagination();
    }
  }


 /* getImageUrl(imageName: any): string {

    if (!imageName) {
      return 'https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?auto=compress&cs=tinysrgb&w=500&h=300&fit=crop\'';
    }
    const fileName = imageName.split('/').pop();

    return `${this.baseUrl}/images/${fileName}`;
  }*/
  getImageUrl(imageName: any): string {
    console.log(imageName);
    this.utilityService.getImageUrl(imageName).subscribe(url => {
      console.log('Image URL reçue :', url);
      return url;
      // ici tu peux assigner à une variable pour l'utiliser dans le template
    });
    return '';
  }

  applyFilters() {
    let filtered = [...this.listings];
    if (this.searchTerm.trim()) {
      console.log("Searching for " + this.searchTerm);
      const term = this.searchTerm.toLowerCase();
      filtered = filtered.filter(listing =>
          listing.title.toLowerCase().includes(term) ||
          listing.description.toLowerCase().includes(term) ||
          listing.location.toLowerCase().includes(term) ||
          listing.propertyType.toLowerCase().includes(term)
      );
      this.listings=filtered;
    }

    this.filteredListings = filtered;
    this.totalItems = filtered.length;
    this.totalPages = Math.ceil(this.totalItems / this.itemsPerPage);

    // Assurer que currentPage est valide
    if (this.currentPage > this.totalPages) {
      this.currentPage = 1;
    }
  }
  
  loadCampaigns() {
    this.metaAdsService.getCampaigns().subscribe({
      next: (campaigns) => {
        this.availableCampaigns = campaigns.filter(c => c.status === MetaStatus.ACTIVE);
      },
      error: (error) => {
        console.error('Error loading campaigns:', error);
      }
    });
  }
  
  onCampaignChange() {
    if (this.selectedCampaignId) {
      this.metaAdsService.getAdSetsByCampaign(this.selectedCampaignId).subscribe({
        next: (adSets) => {
          this.availableAdSets = adSets.filter(a => a.status === MetaStatus.ACTIVE);
          this.selectedAdSetId = '';
        },
        error: (error) => {
          console.error('Error loading ad sets:', error);
        }
      });
    } else {
      this.availableAdSets = [];
      this.selectedAdSetId = '';
    }
  }

  onSearch() {
    console.log(this.searchTerm);
    this.currentPage = 1;
    this.applyClientSidePagination(); // utilise le filtre + pagination
  }
  
  // Ad integration methods
  viewListingAds(listing: RealEstateListing) {
    this.selectedListing = listing;
    this.isLoadingAds = true;
    this.showAdHistoryModal = true;
    
    // Load ads that reference this listing
    this.loadListingAds(listing.idSitePost!.toString());
  }
  
  loadListingAds(listingId: string) {
    // Get all ads and filter by listingId
    this.metaAdsService.ads$.subscribe({
      next: (allAds) => {
        this.listingAds = allAds.filter(ad => ad.listingId === listingId);
        this.isLoadingAds = false;
      },
      error: (error) => {
        console.error('Error loading listing ads:', error);
        this.isLoadingAds = false;
      }
    });
  }
  
  closeAdHistoryModal() {
    this.showAdHistoryModal = false;
    this.selectedListing = null;
    this.listingAds = [];
  }
  
  openCreateAdModal(listing: RealEstateListing) {
    this.selectedListing = listing;
    this.showCreateAdModal = true;
    this.prefillAdForm(listing);
  }
  
  prefillAdForm(listing: RealEstateListing) {
    const listingType = listing.type === ListingType.SALE ? 'Sale' : 'Rent';
    const priceText = listing.type === ListingType.SALE ? 
      `€${listing.price.toLocaleString()}` : 
      `€${listing.price}/month`;
    
    this.newAd = {
      name: `${listing.title} - ${listingType} Ad`,
      title: listing.title,
      description: `${listing.description.substring(0, 100)}...`,
      metaAd: {
        creative: {
          object_story_spec: {
            page_id: 'YOUR_PAGE_ID',
            link_data: {
              message: `${listing.title} - ${priceText}`,
              link: `https://yourwebsite.com/listings/${listing.idSitePost}`,
              name: listing.title,
              description: `${listing.area}m² in ${listing.location} - ${priceText}`
            }
          }
        }
      }
    };
    
    // Reset form state
    this.selectedCampaignId = '';
    this.selectedAdSetId = '';
    this.availableAdSets = [];
  }
  
  closeCreateAdModal() {
    this.showCreateAdModal = false;
    this.selectedListing = null;
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
    this.selectedCampaignId = '';
    this.selectedAdSetId = '';
    this.availableAdSets = [];
  }
  
  createAdFromListing() {
    if (!this.newAd.name?.trim() || !this.newAd.title?.trim() || !this.selectedAdSetId || !this.selectedListing) {
      return;
    }

    this.isCreatingAd = true;
    
    // Update metaAd object with form data
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
      listingId: this.selectedListing.idSitePost!.toString()
    };

    this.metaAdsService.createAd(createRequest).subscribe({
      next: (ad) => {
        this.closeCreateAdModal();
        this.isCreatingAd = false;
        // Show success message or refresh the listing ads
        alert('Ad created successfully!');
      },
      error: (error) => {
        console.error('Error creating ad:', error);
        this.isCreatingAd = false;
      }
    });
  }
  
  viewAdDetails(ad: MetaAd) {
    // Navigate to campaigns page with the ad details
    this.router.navigate(['/campaigns'], { 
      queryParams: { 
        showAd: ad.id,
        campaign: ad.adSetId // This would need to be mapped to campaign ID in a real app
      }
    });
  }
  
  getAdStatusClass(status: MetaStatus): string {
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

  getStatusClass(status: StatusAnnonce): string {
    switch (status) {
      case StatusAnnonce.PUBLISHED:
        return 'status-published';
      case StatusAnnonce.DRAFT:
        return 'status-draft';
      case StatusAnnonce.SOLD:
        return 'status-sold';
      case StatusAnnonce.RENTED:
        return 'status-rented';
      case StatusAnnonce.ARCHIVED:
        return 'status-archived';
      default:
        return 'status-draft';
    }
  }

  getTypeLabel(type: ListingType): string {
    return type === ListingType.SALE ? 'Sale' : 'Rent';
  }

  deleteListing(id: number) {
    if (confirm('Are you sure you want to delete this listing?')) {
      this.adminDataService.deleteListing(id).subscribe({
        next: () => {
          this.loadListings();
        },
        error: (error) => {
          console.error('Error deleting listing:', error);
        }
      });
    }
  }
}