import { BrowserModule } from '@angular/platform-browser';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import { FlexLayoutModule } from '@angular/flex-layout';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BillingComponent } from './billing/billing.component';
import { ActivationComponent } from './activation/activation.component';

@NgModule({
  declarations: [
    AppComponent,
    BillingComponent,
    ActivationComponent
  ],
  imports: [
    MatButtonModule, MatCardModule,
    FlexLayoutModule,
    BrowserModule,
    NoopAnimationsModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
