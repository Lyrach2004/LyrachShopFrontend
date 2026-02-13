import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Purchase} from "../common/purchase";
import {Observable} from "rxjs";
import {Interface} from "node:readline";

@Injectable({
  providedIn: 'root'
})
export class CheckoutService {

  private purchaseUrl:string="http://localhost:8080/api/checkout/purchase";

  constructor(
    private httpClient:HttpClient
  ) { }

  placeOrder(purchase:Purchase):Observable<GetPurchaseResponse>{
    return this.httpClient.post<GetPurchaseResponse>(this.purchaseUrl,purchase)
  }
}

interface GetPurchaseResponse{
  orderTrackingNumber:string
}
