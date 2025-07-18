import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppLayoutComponent } from './shared/components/layout/app-layout.component';
import { DashboardComponent } from './features/dashboard/dashboard.component';
import { ListingCreationComponent } from './features/listing/listing-creation/listing-creation.component';
import { CampaignCreationComponent } from './features/campaign/campaign-creation/campaign-creation.component';
import { AiSuggestionsPageComponent } from './features/ai-suggestions-page/ai-suggestions-page.component';
import { SettingsComponent } from './features/settings/settings.component';
import { PerformanceDashboardComponent } from './features/performance/performance-dashboard.component';

const routes: Routes = [
  {
    path: '',
    component: AppLayoutComponent,
    children: [
      { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: DashboardComponent },
      { path: 'listing', component: ListingCreationComponent },
      { path: 'campaign/:id', component: CampaignCreationComponent },
      { path: 'performance', component: PerformanceDashboardComponent },
      { path: 'ai-suggestions', component: AiSuggestionsPageComponent },
      { path: 'settings', component: SettingsComponent }
    ]
  },
  { path: '**', redirectTo: '/dashboard' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
