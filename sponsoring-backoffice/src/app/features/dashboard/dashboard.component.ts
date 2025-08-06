import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminDataService } from '../../core/services/admin-data.service';
import { AdminStats } from '../../core/models/admin.interface';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  stats: AdminStats | null = null;
  isLoading = true;
  currentDate = new Date();

  constructor(private adminDataService: AdminDataService) {}

  ngOnInit() {
    this.loadStats();
  }

  loadStats() {
    this.adminDataService.getAdminStats().subscribe({
      next: (stats) => {
        this.stats = stats;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading stats:', error);
        this.isLoading = false;
      }
    });
  }

  getGrowthIcon(growth: number): string {
    if (growth > 0) {
      return `<svg class="w-4 h-4 text-success-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path>
      </svg>`;
    } else {
      return `<svg class="w-4 h-4 text-danger-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6"></path>
      </svg>`;
    }
  }

  getGrowthColor(growth: number): string {
    return growth > 0 ? 'text-success-600' : 'text-danger-600';
  }
}