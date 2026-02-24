import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Purchase} from "../common/purchase";
import {Observable} from "rxjs";
import {Interface} from "node:readline";
import {environment} from "../../environments/environment";
import {PaymentInfo} from "../common/payment-info";

@Injectable({
  providedIn: 'root'
})
export class CheckoutService {

  private purchaseUrl:string=environment.lyrachShopApiUrl+"/checkout/purchase";

  private paymentIntentUrl:string=environment.lyrachShopApiUrl+"/checkout/payment-intent";

  constructor(
    private httpClient:HttpClient
  ) { }

  placeOrder(purchase:Purchase):Observable<GetPurchaseResponse>{
    return this.httpClient.post<GetPurchaseResponse>(this.purchaseUrl,purchase)
  }

  createPaymentIntent(paymentInfo:PaymentInfo):Observable<any>{

    return this.httpClient.post<any>(this.purchaseUrl,paymentInfo)

  }
}

interface GetPurchaseResponse{
  orderTrackingNumber:string
}
