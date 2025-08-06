import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent {
  // General Settings
  siteName = 'RealEstate CRM';
  siteDescription = 'Professional real estate management platform';
  contactEmail = 'admin@realestate.com';
  supportPhone = '+33 1 23 45 67 89';

  // Email Settings
  emailNotifications = true;
  marketingEmails = false;
  weeklyReports = true;

  // Security Settings
  twoFactorAuth = false;
  sessionTimeout = 30;
  passwordExpiry = 90;

  // API Settings
  apiRateLimit = 1000;
  apiTimeout = 30;

  // Notification Settings
  pushNotifications = true;
  emailAlerts = true;
  smsAlerts = false;

  saveGeneralSettings() {
    // Mock save operation
    console.log('General settings saved');
    // In a real app, this would call a service to save settings
  }

  saveEmailSettings() {
    console.log('Email settings saved');
  }

  saveSecuritySettings() {
    console.log('Security settings saved');
  }

  saveApiSettings() {
    console.log('API settings saved');
  }

  saveNotificationSettings() {
    console.log('Notification settings saved');
  }
}