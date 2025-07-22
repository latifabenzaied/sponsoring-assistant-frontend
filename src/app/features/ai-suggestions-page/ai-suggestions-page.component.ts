import {Component, Input, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-ai-suggestions-page',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './ai-suggestions-page.component.html',
  styleUrls: ['./ai-suggestions-page.component.css']
})
export class AiSuggestionsPageComponent{


  suggestion = [
    {
      id: '1',
      type: 'listing',
      category: 'improvement',
      title: 'Optimize your property photos',
      description: 'Properties with professional photos get 40% more views. Consider hiring a photographer for better results.',
      priority: 'high',
      actionable: true
    },
    {
      id: '2',
      type: 'campaign',
      category: 'optimization',
      title: 'Increase your campaign budget',
      description: 'Your current budget might limit reach. Consider increasing by 30% for better performance.',
      priority: 'medium',
      actionable: true
    },
    {
      id: '3',
      type: 'listing',
      category: 'tip',
      title: 'Add virtual tour links',
      description: 'Virtual tours increase engagement by 60%. Consider adding 360° photos or video tours.',
      priority: 'medium',
      actionable: true
    },
    {
      id: '4',
      type: 'campaign',
      category: 'warning',
      title: 'Campaign performance declining',
      description: 'Your recent campaign CTR has dropped by 15%. Review targeting settings and ad creative.',
      priority: 'high',
      actionable: true
    }
  ];

  filterBy: 'all' | 'listing' | 'campaign' = 'all';
  sortBy: 'priority' | 'type' | 'recent' = 'priority';

  get filteredSuggestions() {
    // let filtered = this.suggestions;
    //
    // if (this.filterBy !== 'all') {
    //   // filtered = filtered.filter(s => s.type === this.filterBy);
    // }
    //
    // // return filtered.sort((a, b) => {
    // //   if (this.sortBy === 'priority') {
    // //     const priorityOrder = { 'high': 3, 'medium': 2, 'low': 1 };
    // //     return priorityOrder[b.priority as keyof typeof priorityOrder] - priorityOrder[a.priority as keyof typeof priorityOrder];
    // //   }
      return 0;
    // // });
  }

  getPriorityColor(priority: string) {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'low': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  }

  getCategoryIcon(category: string) {
    switch (category) {
      case 'improvement':
        return `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
        </svg>`;
      case 'optimization':
        return `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
        </svg>`;
      case 'warning':
        return `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
        </svg>`;
      case 'tip':
        return `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
        </svg>`;
      default:
        return `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>`;
    }
  }

  trackBySuggestion(index: number, suggestion: any): string {
    return suggestion.id;
  }
}
