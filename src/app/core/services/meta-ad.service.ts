import { Injectable } from '@angular/core';
import { BehaviorSubject, delay, Observable, of, throwError, from } from 'rxjs';
import { AdPerformance, PerformanceFilters, PerformanceSummary } from '../models/performance.interface';

@Injectable({
  providedIn: 'root'
})
export class MetaAdService {
  private performanceDataSubject = new BehaviorSubject<AdPerformance[]>([]);
  public performanceData$ = this.performanceDataSubject.asObservable();

  // Mock data for demonstration
  private mockData: AdPerformance[] = [
    {
      id: '1',
      postName: 'Luxury Apartment Downtown',
      reach: 12000,
      impressions: 20000,
      ctr: 3.4,
      engagement: {
        likes: 520,
        comments: 180,
        shares: 175,
        total: 875
      },
      costPerResult: 0.23,
      totalSpend: 460,
      campaignStatus: 'active',
      campaignName: 'Premium Properties Campaign',
      dateRange: {
        startDate: '2024-01-15',
        endDate: '2024-02-15'
      },
      platform: 'both'
    },
    {
      id: '2',
      postName: 'Modern Studio Near Metro',
      reach: 8500,
      impressions: 15200,
      ctr: 2.8,
      engagement: {
        likes: 340,
        comments: 95,
        shares: 120,
        total: 555
      },
      costPerResult: 0.31,
      totalSpend: 285,
      campaignStatus: 'active',
      campaignName: 'Urban Living Campaign',
      dateRange: {
        startDate: '2024-01-10',
        endDate: '2024-02-10'
      },
      platform: 'instagram'
    },
    {
      id: '3',
      postName: 'Family House with Garden',
      reach: 18500,
      impressions: 28000,
      ctr: 4.1,
      engagement: {
        likes: 720,
        comments: 250,
        shares: 380,
        total: 1350
      },
      costPerResult: 0.45,
      totalSpend: 890,
      campaignStatus: 'active',
      campaignName: 'Family Homes Campaign',
      dateRange: {
        startDate: '2024-01-05',
        endDate: '2024-02-05'
      },
      platform: 'facebook'
    },
    {
      id: '4',
      postName: 'Penthouse with City View',
      reach: 6200,
      impressions: 9800,
      ctr: 5.2,
      engagement: {
        likes: 180,
        comments: 45,
        shares: 85,
        total: 310
      },
      costPerResult: 1.20,
      totalSpend: 1250,
      campaignStatus: 'paused',
      campaignName: 'Luxury Properties Campaign',
      dateRange: {
        startDate: '2024-01-01',
        endDate: '2024-02-01'
      },
      platform: 'both'
    },
    {
      id: '5',
      postName: 'Cozy Cottage in Suburbs',
      reach: 14800,
      impressions: 22500,
      ctr: 2.1,
      engagement: {
        likes: 420,
        comments: 110,
        shares: 160,
        total: 690
      },
      costPerResult: 0.18,
      totalSpend: 320,
      campaignStatus: 'ended',
      campaignName: 'Suburban Properties Campaign',
      dateRange: {
        startDate: '2023-12-15',
        endDate: '2024-01-15'
      },
      platform: 'instagram'
    }
  ];

  getPerformanceData(filters?: PerformanceFilters): Observable<AdPerformance[]> {
    // Simulate API call delay
    return from(new Promise<AdPerformance[]>((resolve) => {
      setTimeout(() => {
        let filteredData = [...this.mockData];

        if (filters) {
          if (filters.campaignName) {
            filteredData = filteredData.filter(ad => 
              ad.campaignName.toLowerCase().includes(filters.campaignName!.toLowerCase())
            );
          }

          if (filters.status && filters.status !== 'all') {
            filteredData = filteredData.filter(ad => ad.campaignStatus === filters.status);
          }

          if (filters.platform && filters.platform !== 'all') {
            filteredData = filteredData.filter(ad => 
              filters.platform === 'both' ? ad.platform === 'both' : 
              ad.platform === filters.platform || ad.platform === 'both'
            );
          }

          if (filters.dateRange) {
            filteredData = filteredData.filter(ad => {
              const adStart = new Date(ad.dateRange.startDate);
              const filterStart = new Date(filters.dateRange!.startDate);
              const filterEnd = new Date(filters.dateRange!.endDate);
              return adStart >= filterStart && adStart <= filterEnd;
            });
          }
        }

        resolve(filteredData);
      }, 1000); // 1 second delay to simulate API call
    }));
  }

  getPerformanceSummary(data: AdPerformance[]): PerformanceSummary {
    return {
      totalReach: data.reduce((sum, ad) => sum + ad.reach, 0),
      totalImpressions: data.reduce((sum, ad) => sum + ad.impressions, 0),
      averageCtr: data.length > 0 ? data.reduce((sum, ad) => sum + ad.ctr, 0) / data.length : 0,
      totalEngagement: data.reduce((sum, ad) => sum + ad.engagement.total, 0),
      totalSpend: data.reduce((sum, ad) => sum + ad.totalSpend, 0),
      activeCampaigns: data.filter(ad => ad.campaignStatus === 'active').length
    };
  }

  exportToCSV(data: AdPerformance[]): void {
    const headers = [
      'Post Name',
      'Campaign Name',
      'Reach',
      'Impressions',
      'CTR (%)',
      'Likes',
      'Comments',
      'Shares',
      'Total Engagement',
      'Cost Per Result (€)',
      'Total Spend (€)',
      'Status',
      'Platform',
      'Start Date',
      'End Date'
    ];

    const csvContent = [
      headers.join(','),
      ...data.map(ad => [
        `"${ad.postName}"`,
        `"${ad.campaignName}"`,
        ad.reach,
        ad.impressions,
        ad.ctr.toFixed(2),
        ad.engagement.likes,
        ad.engagement.comments,
        ad.engagement.shares,
        ad.engagement.total,
        ad.costPerResult.toFixed(2),
        ad.totalSpend.toFixed(2),
        ad.campaignStatus,
        ad.platform,
        ad.dateRange.startDate,
        ad.dateRange.endDate
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `ad-performance-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  // Simulate API error for testing
  getPerformanceDataWithError(): Observable<AdPerformance[]> {
    return throwError(() => new Error('Unable to fetch ad performance. Please try again.'));
  }
}