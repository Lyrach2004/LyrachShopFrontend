import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { ListProductComponent } from './components/list-product/list-product.component';
import {HttpClientModule} from "@angular/common/http";
import {ProductService} from "./services/product.service";
import {RouterModule, Routes} from "@angular/router";
import { ProductCategoryMenuComponent } from './components/product-category-menu/product-category-menu.component';
import { SearchComponent } from './components/search/search.component';
import { ProductDetailsComponent } from './components/product-details/product-details.component';
import {NgbModule} from "@ng-bootstrap/ng-bootstrap";
import {FormsModule} from "@angular/forms";
import { CartStatusComponent } from './components/cart-status/cart-status.component';

const routes:Routes=[
  {path:'products/:id',component:ProductDetailsComponent},
  {path:'search/:keyword',component:ListProductComponent},
  {path:'category',component:ListProductComponent},
  {path:'category/:id/:categoryName',component:ListProductComponent},
  {path:'products',component:ListProductComponent},
  {path:'',redirectTo:'/products',pathMatch:'full'},
  {path:'**',redirectTo:'/products',pathMatch:'full'}
]

@NgModule({
  declarations: [
    AppComponent,
    ListProductComponent,
    ProductCategoryMenuComponent,
    SearchComponent,
    ProductDetailsComponent,
    CartStatusComponent
  ],
  imports: [
    RouterModule.forRoot(routes),
    BrowserModule,
    HttpClientModule,
    NgbModule,
    FormsModule
  ],
  providers: [ProductService],
  bootstrap: [AppComponent]
})
export class AppModule { }
