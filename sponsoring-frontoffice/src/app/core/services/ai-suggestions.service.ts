import { Injectable } from '@angular/core';
import { BehaviorSubject, delay, Observable, of } from 'rxjs';
import {AISuggestion, Campaign, SitePost} from '../models/listing.interface';

@Injectable({
  providedIn: 'root'
})
export class AISuggestionsService {
  private suggestionsSubject = new BehaviorSubject<AISuggestion[]>([]);
  public suggestions$ = this.suggestionsSubject.asObservable();

  generateListingSuggestions(listing: Partial<SitePost>): Observable<AISuggestion[]> {
    const suggestions: AISuggestion[] = [];

    try {
      if (!listing.photoUrls || listing.photoUrls.length < 3) {
        suggestions.push({
          id: 'photos-1',
          type: 'listing',
          category: 'improvement',
          title: 'Add more photos',
          description: 'Properties with 5+ photos get 40% more views. Consider adding exterior, interior, and neighborhood shots.',
          actionable: true,
          priority: 'high'
        });
      }

      if (!listing.description || listing.description.length < 100) {
        suggestions.push({
          id: 'description-1',
          type: 'listing',
          category: 'improvement',
          title: 'Enhance description',
          description: 'A detailed description with local amenities and transportation links increases engagement by 35%.',
          actionable: true,
          priority: 'medium'
        });
      }

      if (listing.price && listing.area && listing.price / listing.area > 5000) {
        suggestions.push({
          id: 'price-1',
          type: 'listing',
          category: 'optimization',
          title: 'Price analysis',
          description: 'This price is above market average. Consider highlighting premium features to justify the value.',
          actionable: true,
          priority: 'medium'
        });
      }

      if (!listing.availability) {
        suggestions.push({
          id: 'availability-1',
          type: 'listing',
          category: 'tip',
          title: 'Set availability date',
          description: 'Adding an availability date helps potential buyers plan their move.',
          actionable: true,
          priority: 'low'
        });
      }
    } catch (error) {
      console.log('Error generating suggestions:', error);
    }

    return of(suggestions).pipe(delay(500));
  }

  generateCampaignSuggestions(campaign: Partial<Campaign>, listing: SitePost): Observable<AISuggestion[]> {
    const suggestions: AISuggestion[] = [];

    try {
      if (campaign.budget && campaign.budget < 500) {
        suggestions.push({
          id: 'budget-1',
          type: 'campaign',
          category: 'optimization',
          title: 'Increase budget for better reach',
          description: 'A minimum budget of €500 is recommended for effective real estate campaigns.',
          actionable: true,
          priority: 'medium'
        });
      }

      if (campaign.duration && campaign.duration < 7) {
        suggestions.push({
          id: 'duration-1',
          type: 'campaign',
          category: 'optimization',
          title: 'Extend campaign duration',
          description: 'Real estate campaigns perform better with 2-3 weeks duration for optimal exposure.',
          actionable: true,
          priority: 'medium'
        });
      }

      if (listing.propertyType === 'APARTMENT' && campaign.targeting?.ageRange?.min && campaign.targeting.ageRange.min > 35) {
        suggestions.push({
          id: 'targeting-1',
          type: 'campaign',
          category: 'tip',
          title: 'Adjust age targeting',
          description: 'Apartments typically attract buyers aged 25-45. Consider expanding your age range.',
          actionable: true,
          priority: 'low'
        });
      }

      if (campaign.platforms && !campaign.platforms.includes('facebook')) {
        suggestions.push({
          id: 'platform-1',
          type: 'campaign',
          category: 'tip',
          title: 'Add Facebook advertising',
          description: 'Facebook shows 60% higher conversion rates for real estate listings.',
          actionable: true,
          priority: 'medium'
        });
      }
    } catch (error) {
      console.log('Error generating campaign suggestions:', error);
    }

    return of(suggestions).pipe(delay(300));
  }
}
