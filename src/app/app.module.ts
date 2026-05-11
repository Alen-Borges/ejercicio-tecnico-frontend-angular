import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule, DatePipe } from '@angular/common';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

// Features
import { ProductListComponent } from './features/product-list/product-list.component';
import { ProductFormComponent } from './features/product-form/product-form.component';

// Shared
import { SkeletonLoaderComponent } from './shared/components/skeleton-loader/skeleton-loader.component';
import { ConfirmModalComponent } from './shared/components/confirm-modal/confirm-modal.component';
import { SearchFilterPipe } from './shared/pipes/search-filter.pipe';

@NgModule({
  declarations: [
    AppComponent,
    ProductListComponent,
    ProductFormComponent,
    SkeletonLoaderComponent,
    ConfirmModalComponent,
    SearchFilterPipe,
  ],
  imports: [
    BrowserModule,
    CommonModule,
    HttpClientModule,
    ReactiveFormsModule,
    AppRoutingModule,
  ],
  providers: [DatePipe],
  bootstrap: [AppComponent]
})
export class AppModule {}
