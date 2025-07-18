import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AISuggestion } from '../../../core/models/listing.interface';
import { AISuggestionsService } from '../../../core/services/ai-suggestions.service';

@Component({
  selector: 'app-ai-suggestions',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './ai-suggestions.component.html',
  styleUrls: ['./ai-suggestions.component.css']
})
export class AiSuggestionsComponent implements OnInit {
  @Input() suggestionType: 'listing' | 'campaign' = 'listing';
  @Input() listingData: any;
  @Input() campaignData: any;

  suggestions: AISuggestion[] = [];
  loadingMessage = 'Analyzing your data...';

  constructor(private aiService: AISuggestionsService) {}

  ngOnInit() {
    this.loadSuggestions();
  }

  ngOnChanges() {
    this.loadSuggestions();
  }

  private loadSuggestions() {
    try {
      if (this.suggestionType === 'listing' && this.listingData) {
        this.aiService.generateListingSuggestions(this.listingData).subscribe({
          next: (suggestions) => {
            this.suggestions = suggestions;
            if (suggestions.length === 0) {
              this.loadingMessage = 'Great! No suggestions at the moment.';
            }
          },
          error: (error) => {
            console.log('Error loading listing suggestions:', error);
            this.loadingMessage = 'Unable to load suggestions at the moment.';
          }
        });
      } else if (this.suggestionType === 'campaign' && this.campaignData && this.listingData) {
        this.aiService.generateCampaignSuggestions(this.campaignData, this.listingData).subscribe({
          next: (suggestions) => {
            this.suggestions = suggestions;
            if (suggestions.length === 0) {
              this.loadingMessage = 'Your campaign setup looks optimal!';
            }
          },
          error: (error) => {
            console.log('Error loading campaign suggestions:', error);
            this.loadingMessage = 'Unable to load suggestions at the moment.';
          }
        });
      }
    } catch (error) {
      console.log('Error in loadSuggestions:', error);
      this.loadingMessage = 'Unable to load suggestions at the moment.';
    }
  }

  trackBySuggestion(index: number, suggestion: AISuggestion): string {
    return suggestion.id;
  }
}