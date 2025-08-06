import { bootstrapApplication } from '@angular/platform-browser';
import { App } from './app/app.component';
import { importProvidersFrom } from '@angular/core';
import { AppRoutingModule } from './app/app-routing.module';
import {provideHttpClient, withInterceptorsFromDi} from "@angular/common/http";

bootstrapApplication(App, {
  providers: [
    importProvidersFrom(AppRoutingModule),
    provideHttpClient(withInterceptorsFromDi())
  ]
})
  .catch(err => console.error(err));
