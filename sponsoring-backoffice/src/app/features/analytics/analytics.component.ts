import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminDataService } from '../../core/services/admin-data.service';
import { AnalyticsData } from '../../core/models/admin.interface';

@Component({
  selector: 'app-analytics',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './analytics.component.html',
  styleUrls: ['./analytics.component.css']
})
export class AnalyticsComponent implements OnInit {
  analyticsData: AnalyticsData | null = null;
  isLoading = true;

  constructor(private adminDataService: AdminDataService) {}

  ngOnInit() {
    this.loadAnalytics();
  }

  loadAnalytics() {
    this.adminDataService.getAnalyticsData().subscribe({
      next: (data) => {
        this.analyticsData = data;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading analytics:', error);
        this.isLoading = false;
      }
    });
  }
}