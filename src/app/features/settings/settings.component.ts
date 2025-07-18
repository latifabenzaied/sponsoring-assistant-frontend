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
  settings = {
    profile: {
      name: 'John Doe',
      email: 'john.doe@example.com',
      company: 'Real Estate Pro',
      phone: '+33 1 23 45 67 89'
    },
    notifications: {
      emailNotifications: true,
      pushNotifications: false,
      campaignAlerts: true,
      weeklyReports: true
    },
    preferences: {
      currency: 'EUR',
      language: 'en',
      timezone: 'Europe/Paris',
      autoSave: true
    }
  };

  currencies = [
    { value: 'EUR', label: '€ Euro' },
    { value: 'USD', label: '$ US Dollar' },
    { value: 'GBP', label: '£ British Pound' }
  ];

  languages = [
    { value: 'en', label: 'English' },
    { value: 'fr', label: 'Français' },
    { value: 'es', label: 'Español' }
  ];

  timezones = [
    { value: 'Europe/Paris', label: 'Europe/Paris' },
    { value: 'Europe/London', label: 'Europe/London' },
    { value: 'America/New_York', label: 'America/New_York' }
  ];

  saveSettings() {
    console.log('Settings saved:', this.settings);
    // Here you would typically send the settings to your backend
    alert('Settings saved successfully!');
  }

  resetSettings() {
    if (confirm('Are you sure you want to reset all settings to default?')) {
      // Reset to default values
      console.log('Settings reset to default');
    }
  }
}