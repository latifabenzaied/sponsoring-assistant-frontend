import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
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
export class AiSuggestionsComponent implements OnInit,OnChanges  {
  @Input() suggestionType: 'listing' | 'campaign' = 'listing';
  @Input() listingData: any;
  @Input() campaignData: any;
  @Input() suggestions: { [key: string]: string } = {};
  @Input() imageSuggestions: { [key: string]: string } = {};
  @Output() suggestionApplied = new EventEmitter<{ field: string, value: string }>();
 // suggestions: AISuggestion[] = [];
  loadingMessage = 'Analyzing your data...';

  constructor(private aiService: AISuggestionsService) {}

  ngOnInit() {
    this.loadSuggestions();
    console.log('✅ Suggestions received in child:', this.suggestions);
  }


  ngOnChanges(changes: SimpleChanges) {
    if (changes['suggestions']) {
      console.log("hihihihi");
      console.log('🧠 Nouvelles suggestions reçues :', changes['suggestions'].currentValue);
    }
    if (changes['imageSuggestions']) {
      console.log('🖼️ imageSuggestions updated:', changes['imageSuggestions'].currentValue);
console.log(this.imageSuggestions)

    }

    this.loadSuggestions();
  }

  hasSuggestions(): boolean {
    return Object.keys(this.suggestions).length > 0;
  }
  getSuggestionKeys(): string[] {
    return Object.keys(this.suggestions);
  }


  getAllSuggestions(): { [key: string]: string } {
    return {
      ...this.suggestions,
      ...this.imageSuggestions
    };
  }

  getAllSuggestionKeys(): string[] {
    return Object.keys(this.getAllSuggestions());
  }
  // applySuggestion(field: string): void {
  //   // ici tu mets le code pour appliquer la suggestion, ex :
  //   // this.formFields[field] = this.suggestions[field];
  //   console.log(`Applying suggestion for ${field}:`, this.suggestions[field]);
  // }

  getExplanation(fullText: string): string {
    return fullText.split("Suggestion:")[0].replace("Explanation:", "").trim();
  }

  getSuggestion(fullText: string): string {
    return fullText.split("Suggestion:")[1]?.trim();
  }


  applySuggestion(field: string): void {
    // console.log(this.getSuggestion(this.suggestions[field]));
    // this.appliedSuggestions[field] = true;
    const value = this.getSuggestion(this.suggestions[field]);
    setTimeout(() => {
      delete this.suggestions[field];
    }, 300); //
    this.suggestionApplied.emit({ field, value });
  }
  private loadSuggestions() {
    // try {
    //   if (this.suggestionType === 'listing' && this.listingData) {
    //     this.aiService.generateListingSuggestions(this.listingData).subscribe({
    //       next: (suggestions) => {
    //         this.suggestions = suggestions;
    //         if (suggestions.length === 0) {
    //           this.loadingMessage = 'Great! No suggestions at the moment.';
    //         }
    //       },
    //       error: (error) => {
    //         console.log('Error loading listing suggestions:', error);
    //         this.loadingMessage = 'Unable to load suggestions at the moment.';
    //       }
    //     });
    //   } else if (this.suggestionType === 'campaign' && this.campaignData && this.listingData) {
    //     this.aiService.generateCampaignSuggestions(this.campaignData, this.listingData).subscribe({
    //       next: (suggestions) => {
    //         this.suggestions = suggestions;
    //         if (suggestions.length === 0) {
    //           this.loadingMessage = 'Your campaign setup looks optimal!';
    //         }
    //       },
    //       error: (error) => {
    //         console.log('Error loading campaign suggestions:', error);
    //         this.loadingMessage = 'Unable to load suggestions at the moment.';
    //       }
    //     });
    //   }
    // } catch (error) {
    //   console.log('Error in loadSuggestions:', error);
    //   this.loadingMessage = 'Unable to load suggestions at the moment.';
    // }
  }

  trackBySuggestion(index: number, suggestion: AISuggestion): string {
    return suggestion.id;
  }
}
