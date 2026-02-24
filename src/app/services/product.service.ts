import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Product} from "../common/product";
import {map, Observable} from "rxjs";
import {ProductCategory} from "../common/product-category";
import {environment} from "../../environments/environment";


@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private baseUrl:string=environment.lyrachShopApiUrl+'/products';

  private categoryUrl:string=environment.lyrachShopApiUrl+'/product-category';

  constructor(private httpClient:HttpClient) { }


  getProductsListPaginate(page:number,
                          size:number,
                          categoryId:number):Observable<GetResponseProducts>{

    const searchUrl=`${this.baseUrl}/search/findByCategoryId?id=${categoryId}`
                            +`&page=${page}&size=${size}`;
    return this.httpClient.get<GetResponseProducts>(searchUrl);
  }

  getProductsList(categoryId:number):Observable<Product[]>{

    const searchUrl=`${this.baseUrl}/search/findByCategoryId?id=${categoryId}`;
    return this.getProducts(searchUrl);
  }

  getProductCategories():Observable<ProductCategory[]>{

    return this.httpClient.get<GetResponseProductCategoryList>(this.categoryUrl).pipe(
      map(response=> response._embedded.productCategory
      )
    )
  }


  searchProducts(keyword: string):Observable<Product[]> {

    const searchUrl=`${this.baseUrl}/search/findByNameContaining?keyword=${keyword}`;
    return this.getProducts(searchUrl);
  }

  searchProductsPaginate( page:number,
                          size:number,
                          keyword:string):Observable<GetResponseProducts>{

    const searchUrl=`${this.baseUrl}/search/findByNameContaining?keyword=${keyword}`
                            +`&page=${page}&size=${size}`;
    return this.httpClient.get<GetResponseProducts>(searchUrl);
  }


  getProduct(productId:number):Observable<Product>{
    const searchUrl:string=`${this.baseUrl}/${productId}`;
    return this.httpClient.get<Product>(searchUrl);
  }

  private getProducts(searchUrl: string) {
    return this.httpClient.get<GetResponseProducts>(searchUrl).pipe(
      map(response => response._embedded.products))
  }
}

interface GetResponseProducts{
  _embedded:{
    products:Product[]
  },
  page:{
    size:number,
    totalElements:number,
    totalPages:number,
    number:number
  }
}

interface GetResponseProductCategoryList{
  _embedded:{
    productCategory:ProductCategory[]
  }
}

