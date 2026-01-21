import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Product} from "../common/product";
import {map, Observable} from "rxjs";
import {ProductCategory} from "../common/product-category";


@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private baseUrl:string='http://localhost:8080/api/products';

  private categoryUrl:string='http://localhost:8080/api/product-category';

  constructor(private httpClient:HttpClient) { }

  getProducts(categoryId:number):Observable<Product[]>{

    const searchUrl=`${this.baseUrl}/search/findByCategoryId?id=${categoryId}`;

    return this.httpClient.get<GetResponseProducts>(searchUrl).pipe(
      map(response=>response._embedded.products)
    )
  }

  getProductCategories():Observable<ProductCategory[]>{

    return this.httpClient.get<GetResponseProductCategoryList>(this.categoryUrl).pipe(
      map(response=> response._embedded.productCategory
      )
    )
  }

  getCategory(categoryId:number):Observable<ProductCategory>{
    const categoryUrl=`${this.categoryUrl}/${categoryId}`;
    return this.httpClient.get<ProductCategory>(categoryUrl);
  }
}

interface GetResponseProducts{
  _embedded:{
    products:Product[]
  }
}

interface GetResponseProductCategoryList{
  _embedded:{
    productCategory:ProductCategory[]
  }
}

