import { Injectable } from '@angular/core';
import {CartItem} from "../common/cart-item";
import {BehaviorSubject, Subject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class CartService {

  cartItems:CartItem[]=[];
  totalPrice:Subject<number>=new BehaviorSubject<number>(0);
  totalQuantity:Subject<number>=new BehaviorSubject<number>(0);

  constructor() { }

  addToCart(cartItem:CartItem){

    let alreadyExistsInCart:boolean=false;
    let existingCartItem:CartItem|undefined=undefined;

    if(this.cartItems.length>0){
      existingCartItem=this.cartItems.find(item=>item.id===cartItem.id);
      alreadyExistsInCart=(existingCartItem!==undefined);
    }

    if(alreadyExistsInCart){
      existingCartItem!.quantity++;
    }else{
      this.cartItems.push(cartItem);
    }

    this.computeCartTotals();
  }

  computeCartTotals() {

    let totalPriceValue:number=0;
    let totalQuantityValue:number=0;

    this.cartItems.forEach(
      item=> {
      totalPriceValue+=item.unitPrice*item.quantity;
      totalQuantityValue+=item.quantity;
      }
    )

    this.totalPrice.next(totalPriceValue);
    this.totalQuantity.next(totalQuantityValue);

  }

  decrementQuantity(cartItem: CartItem) {
    cartItem.quantity--;
    if(cartItem.quantity===0){
      this.remove(cartItem);
    }else{
      this.computeCartTotals();
    }
  }

  remove(cartItem: CartItem) {
    const cartItemIndex:number=this.cartItems.findIndex(item=>item.id===cartItem.id);
    if(cartItemIndex>-1){
      this.cartItems.splice(cartItemIndex,1);
      this.computeCartTotals();
    }
  }
}
