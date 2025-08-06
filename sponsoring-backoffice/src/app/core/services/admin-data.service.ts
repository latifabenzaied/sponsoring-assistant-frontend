import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { delay, map } from 'rxjs/operators';
import { 
  RealEstateListing, 
  Campaign, 
  User, 
  AdminStats, 
  AnalyticsData,
  PaginationParams,
  PaginatedResponse,
  ListingType,
  StatusAnnonce,
  CampaignStatus,
  UserRole
} from '../models/admin.interface';

@Injectable({
  providedIn: 'root'
})
export class AdminDataService {
  private listingsSubject = new BehaviorSubject<RealEstateListing[]>([]);
  private campaignsSubject = new BehaviorSubject<Campaign[]>([]);
  private usersSubject = new BehaviorSubject<User[]>([]);

  public listings$ = this.listingsSubject.asObservable();
  public campaigns$ = this.campaignsSubject.asObservable();
  public users$ = this.usersSubject.asObservable();

  // Mock data
  private mockListings: RealEstateListing[] = [
    {
      idSitePost: 1,
      title: 'Modern Apartment Downtown',
      description: 'Beautiful 3-bedroom apartment in the heart of the city with stunning views and modern amenities.',
      propertyType: 'APARTMENT',
      type: ListingType.SALE,
      area: 120,
      price: 450000,
      location: 'Paris, 75001',
      photoUrls: ['https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg'],
      status: StatusAnnonce.PUBLISHED,
      isSponsored: true,
      bedRoomsNb: 3,
      bathRoomsNb: 2,
      furnished: true,
      availability: 'Immediately',
      createdAt: new Date('2024-01-15'),
      updatedAt: new Date('2024-01-20'),
      userId: '2'
    },
    {
      idSitePost: 2,
      title: 'Family House with Garden',
      description: 'Spacious family home with large garden, perfect for families with children.',
      propertyType: 'HOUSE',
      type: ListingType.RENT,
      area: 200,
      price: 2500,
      location: 'Lyon, 69000',
      photoUrls: ['https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg'],
      status: StatusAnnonce.PUBLISHED,
      isSponsored: false,
      bedRoomsNb: 4,
      bathRoomsNb: 3,
      furnished: false,
      availability: 'March 2024',
      createdAt: new Date('2024-01-10'),
      updatedAt: new Date('2024-01-18'),
      userId: '3'
    },
    {
      idSitePost: 3,
      title: 'Luxury Penthouse',
      description: 'Exclusive penthouse with panoramic city views and premium finishes.',
      propertyType: 'APARTMENT',
      type: ListingType.SALE,
      area: 180,
      price: 850000,
      location: 'Nice, 06000',
      photoUrls: ['https://images.pexels.com/photos/2121121/pexels-photo-2121121.jpeg'],
      status: StatusAnnonce.SOLD,
      isSponsored: true,
      bedRoomsNb: 3,
      bathRoomsNb: 2,
      furnished: true,
      availability: 'Sold',
      createdAt: new Date('2024-01-05'),
      updatedAt: new Date('2024-01-25'),
      userId: '2'
    }
  ];

  private mockCampaigns: Campaign[] = [
    {
      id: '1',
      listingId: '1',
      name: 'Downtown Apartment Campaign',
      budget: 1000,
      duration: 30,
      startDate: new Date('2024-01-20'),
      endDate: new Date('2024-02-20'),
      targeting: {
        ageRange: { min: 25, max: 45 },
        interests: ['Real Estate', 'Urban Living'],
        location: { radius: 10, center: 'Paris, 75001' }
      },
      platforms: ['facebook', 'instagram'],
      status: CampaignStatus.ACTIVE,
      createdAt: new Date('2024-01-18'),
      userId: '2',
      performance: {
        reach: 15000,
        impressions: 25000,
        clicks: 850,
        ctr: 3.4,
        spend: 650,
        conversions: 12
      }
    },
    {
      id: '2',
      listingId: '2',
      name: 'Family House Promotion',
      budget: 800,
      duration: 21,
      startDate: new Date('2024-01-15'),
      endDate: new Date('2024-02-05'),
      targeting: {
        ageRange: { min: 30, max: 55 },
        interests: ['Family Living', 'Suburban Life'],
        location: { radius: 15, center: 'Lyon, 69000' }
      },
      platforms: ['facebook'],
      status: CampaignStatus.COMPLETED,
      createdAt: new Date('2024-01-12'),
      userId: '3',
      performance: {
        reach: 12000,
        impressions: 18000,
        clicks: 540,
        ctr: 3.0,
        spend: 800,
        conversions: 8
      }
    }
  ];

  private mockUsers: User[] = [
    {
      id: '1',
      email: 'admin@realestate.com',
      firstName: 'Admin',
      lastName: 'User',
      role: UserRole.ADMIN,
      company: 'RealEstate CRM',
      phone: '+33 1 23 45 67 89',
      isActive: true,
      createdAt: new Date('2023-12-01'),
      lastLoginAt: new Date(),
      listingsCount: 0,
      campaignsCount: 0
    },
    {
      id: '2',
      email: 'john.doe@realestate.com',
      firstName: 'John',
      lastName: 'Doe',
      role: UserRole.AGENT,
      company: 'Premium Properties',
      phone: '+33 1 23 45 67 90',
      isActive: true,
      createdAt: new Date('2024-01-01'),
      lastLoginAt: new Date('2024-01-25'),
      listingsCount: 2,
      campaignsCount: 1
    },
    {
      id: '3',
      email: 'jane.smith@realestate.com',
      firstName: 'Jane',
      lastName: 'Smith',
      role: UserRole.AGENT,
      company: 'City Homes',
      phone: '+33 1 23 45 67 91',
      isActive: true,
      createdAt: new Date('2024-01-05'),
      lastLoginAt: new Date('2024-01-24'),
      listingsCount: 1,
      campaignsCount: 1
    }
  ];

  constructor() {
    this.listingsSubject.next(this.mockListings);
    this.campaignsSubject.next(this.mockCampaigns);
    this.usersSubject.next(this.mockUsers);
  }

  // Listings CRUD
  getListings(params?: PaginationParams): Observable<PaginatedResponse<RealEstateListing>> {
    return of(this.mockListings).pipe(
      delay(500),
      map(listings => {
        let filteredListings = [...listings];
        
        if (params?.search) {
          filteredListings = filteredListings.filter(listing =>
            listing.title.toLowerCase().includes(params.search!.toLowerCase()) ||
            listing.location.toLowerCase().includes(params.search!.toLowerCase())
          );
        }

        const total = filteredListings.length;
        const page = params?.page || 1;
        const limit = params?.limit || 10;
        const startIndex = (page - 1) * limit;
        const endIndex = startIndex + limit;

        return {
          data: filteredListings.slice(startIndex, endIndex),
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit)
        };
      })
    );
  }

  createListing(listing: RealEstateListing): Observable<RealEstateListing> {
    const newListing = {
      ...listing,
      idSitePost: Math.max(...this.mockListings.map(l => l.idSitePost || 0)) + 1,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    this.mockListings.push(newListing);
    this.listingsSubject.next(this.mockListings);
    
    return of(newListing).pipe(delay(500));
  }

  updateListing(id: number, listing: Partial<RealEstateListing>): Observable<RealEstateListing> {
    const index = this.mockListings.findIndex(l => l.idSitePost === id);
    if (index === -1) {
      return throwError(() => new Error('Listing not found'));
    }

    this.mockListings[index] = {
      ...this.mockListings[index],
      ...listing,
      updatedAt: new Date()
    };
    
    this.listingsSubject.next(this.mockListings);
    return of(this.mockListings[index]).pipe(delay(500));
  }

  deleteListing(id: number): Observable<void> {
    const index = this.mockListings.findIndex(l => l.idSitePost === id);
    if (index === -1) {
      return throwError(() => new Error('Listing not found'));
    }

    this.mockListings.splice(index, 1);
    this.listingsSubject.next(this.mockListings);
    return of(void 0).pipe(delay(500));
  }

  // Campaigns CRUD
  getCampaigns(params?: PaginationParams): Observable<PaginatedResponse<Campaign>> {
    return of(this.mockCampaigns).pipe(
      delay(500),
      map(campaigns => {
        let filteredCampaigns = [...campaigns];
        
        if (params?.search) {
          filteredCampaigns = filteredCampaigns.filter(campaign =>
            campaign.name.toLowerCase().includes(params.search!.toLowerCase())
          );
        }

        const total = filteredCampaigns.length;
        const page = params?.page || 1;
        const limit = params?.limit || 10;
        const startIndex = (page - 1) * limit;
        const endIndex = startIndex + limit;

        return {
          data: filteredCampaigns.slice(startIndex, endIndex),
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit)
        };
      })
    );
  }

  createCampaign(campaign: Campaign): Observable<Campaign> {
    const newCampaign = {
      ...campaign,
      id: (this.mockCampaigns.length + 1).toString(),
      createdAt: new Date()
    };
    
    this.mockCampaigns.push(newCampaign);
    this.campaignsSubject.next(this.mockCampaigns);
    
    return of(newCampaign).pipe(delay(500));
  }

  updateCampaign(id: string, campaign: Partial<Campaign>): Observable<Campaign> {
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

  // Users CRUD
  getUsers(params?: PaginationParams): Observable<PaginatedResponse<User>> {
    return of(this.mockUsers).pipe(
      delay(500),
      map(users => {
        let filteredUsers = [...users];
        
        if (params?.search) {
          filteredUsers = filteredUsers.filter(user =>
            user.firstName.toLowerCase().includes(params.search!.toLowerCase()) ||
            user.lastName.toLowerCase().includes(params.search!.toLowerCase()) ||
            user.email.toLowerCase().includes(params.search!.toLowerCase())
          );
        }

        const total = filteredUsers.length;
        const page = params?.page || 1;
        const limit = params?.limit || 10;
        const startIndex = (page - 1) * limit;
        const endIndex = startIndex + limit;

        return {
          data: filteredUsers.slice(startIndex, endIndex),
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit)
        };
      })
    );
  }

  createUser(user: User): Observable<User> {
    const newUser = {
      ...user,
      id: (this.mockUsers.length + 1).toString(),
      createdAt: new Date(),
      listingsCount: 0,
      campaignsCount: 0
    };
    
    this.mockUsers.push(newUser);
    this.usersSubject.next(this.mockUsers);
    
    return of(newUser).pipe(delay(500));
  }

  updateUser(id: string, user: Partial<User>): Observable<User> {
    const index = this.mockUsers.findIndex(u => u.id === id);
    if (index === -1) {
      return throwError(() => new Error('User not found'));
    }

    this.mockUsers[index] = {
      ...this.mockUsers[index],
      ...user,
      updatedAt: new Date()
    };
    
    this.usersSubject.next(this.mockUsers);
    return of(this.mockUsers[index]).pipe(delay(500));
  }

  deleteUser(id: string): Observable<void> {
    const index = this.mockUsers.findIndex(u => u.id === id);
    if (index === -1) {
      return throwError(() => new Error('User not found'));
    }

    this.mockUsers.splice(index, 1);
    this.usersSubject.next(this.mockUsers);
    return of(void 0).pipe(delay(500));
  }

  // Analytics and Stats
  getAdminStats(): Observable<AdminStats> {
    const stats: AdminStats = {
      totalUsers: this.mockUsers.length,
      totalListings: this.mockListings.length,
      totalCampaigns: this.mockCampaigns.length,
      totalRevenue: this.mockCampaigns.reduce((sum, c) => sum + (c.performance?.spend || 0), 0),
      activeUsers: this.mockUsers.filter(u => u.isActive).length,
      publishedListings: this.mockListings.filter(l => l.status === StatusAnnonce.PUBLISHED).length,
      activeCampaigns: this.mockCampaigns.filter(c => c.status === CampaignStatus.ACTIVE).length,
      monthlyGrowth: {
        users: 15,
        listings: 23,
        campaigns: 18,
        revenue: 12
      }
    };

    return of(stats).pipe(delay(500));
  }

  getAnalyticsData(): Observable<AnalyticsData> {
    const analyticsData: AnalyticsData = {
      userGrowth: [
        { label: 'Jan', value: 45 },
        { label: 'Feb', value: 52 },
        { label: 'Mar', value: 48 },
        { label: 'Apr', value: 61 },
        { label: 'May', value: 55 },
        { label: 'Jun', value: 67 }
      ],
      listingsByType: [
        { label: 'Apartments', value: 45 },
        { label: 'Houses', value: 30 },
        { label: 'Commercial', value: 15 },
        { label: 'Land', value: 10 }
      ],
      campaignPerformance: [
        { label: 'Reach', value: 27000 },
        { label: 'Impressions', value: 43000 },
        { label: 'Clicks', value: 1390 },
        { label: 'Conversions', value: 20 }
      ],
      revenueOverTime: [
        { label: 'Jan', value: 12000 },
        { label: 'Feb', value: 15000 },
        { label: 'Mar', value: 13500 },
        { label: 'Apr', value: 18000 },
        { label: 'May', value: 16500 },
        { label: 'Jun', value: 21000 }
      ],
      topLocations: [
        { location: 'Paris', count: 25, percentage: 45 },
        { location: 'Lyon', count: 15, percentage: 27 },
        { location: 'Nice', count: 8, percentage: 14 },
        { location: 'Marseille', count: 8, percentage: 14 }
      ],
      platformDistribution: [
        { label: 'Facebook', value: 60 },
        { label: 'Instagram', value: 35 },
        { label: 'Both', value: 5 }
      ]
    };

    return of(analyticsData).pipe(delay(500));
  }
}