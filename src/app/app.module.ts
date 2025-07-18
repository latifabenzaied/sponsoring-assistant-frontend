import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { App } from './app.component';
import {ReactiveFormsModule} from "@angular/forms";
import {ListingCreationComponent} from "./features/listing/listing-creation/listing-creation.component";


@NgModule({
  declarations: [

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    App

  ],
  providers: [],
  bootstrap: []
})
export class AppModule { }
