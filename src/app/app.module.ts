import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { ListProductComponent } from './components/list-product/list-product.component';
import {HttpClientModule} from "@angular/common/http";
import {ProductService} from "./services/product.service";

@NgModule({
  declarations: [
    AppComponent,
    ListProductComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule
  ],
  providers: [ProductService],
  bootstrap: [AppComponent]
})
export class AppModule { }
