import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {LyrachShopFormService} from "../../services/lyrach-shop-form.service";
import {Country} from "../../common/country";
import {State} from "../../common/state";
import {LyrachShopValidators} from "../../validators/lyrach-shop-validators";
import {CartService} from "../../services/cart.service";
import {CheckoutService} from "../../services/checkout.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {

  checkoutFormGroup!:FormGroup;
  totalPrice:number=0.00;
  totalQuantity:number=0;
  creditCardYears:number[]=[];
  creditCardMonths:number[]=[];
  countries:Country[]=[];
  shippingAddressStates!:State[];
  billingAddressStates!:State[];

  constructor(
    private formBuilder:FormBuilder,
    private lyrachShopFormService:LyrachShopFormService,
    private cartService:CartService,
    private checkoutService:CheckoutService,
    private router:Router
  ) { }

  ngOnInit(): void {
    this.checkoutFormGroup=this.formBuilder.group({
      customer:this.formBuilder.group({
        firstName:new FormControl('',[Validators.required,Validators.minLength(2),LyrachShopValidators.notOnlyWhitespace]),
        lastName:new FormControl('',[Validators.required,Validators.minLength(2),LyrachShopValidators.notOnlyWhitespace]),
        email:new FormControl('',[Validators.required,
          Validators.pattern("[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$")])
      }),
      shippingAddress:this.formBuilder.group({
        street:new FormControl('',[Validators.required,Validators.minLength(2),LyrachShopValidators.notOnlyWhitespace]),
        city:new FormControl('',[Validators.required,Validators.minLength(2),LyrachShopValidators.notOnlyWhitespace]),
        state:new FormControl('',[Validators.required]),
        country:new FormControl('',[Validators.required]),
        zipCode:new FormControl('',[Validators.required,Validators.minLength(2),LyrachShopValidators.notOnlyWhitespace])
        }
      ),
      billingAddress:this.formBuilder.group({
          street:new FormControl('',[Validators.required,Validators.minLength(2),LyrachShopValidators.notOnlyWhitespace]),
          city:new FormControl('',[Validators.required,Validators.minLength(2),LyrachShopValidators.notOnlyWhitespace]),
          state:new FormControl('',[Validators.required,Validators.minLength(2),LyrachShopValidators.notOnlyWhitespace]),
          country:new FormControl('',[Validators.required,Validators.minLength(2),LyrachShopValidators.notOnlyWhitespace]),
          zipCode:new FormControl('',[Validators.required,Validators.minLength(2),LyrachShopValidators.notOnlyWhitespace])
        }
      ),
      creditCard:this.formBuilder.group({
          cardType:new FormControl('',[Validators.required]),
          nameOnCard:new FormControl('',[Validators.required,Validators.minLength(2),LyrachShopValidators.notOnlyWhitespace]),
          cardNumber:new FormControl('',[Validators.required,Validators.pattern("[0-9]{16}")]),
          securityCode:new FormControl('',[Validators.required,Validators.pattern("[0-9]{3}")]),
          expirationMonth:[''],
          expirationYear:['']
        }
      )
    })

    this.reviewCardDetails();

    //populate credit card months
    const startMonth:number=new Date().getMonth()+1;
    this.lyrachShopFormService.getCreditCardMonths(startMonth).subscribe(
      data=>this.creditCardMonths=data
    );

    //populate credit card years
    this.lyrachShopFormService.getCreditCardYears().subscribe(
      data=>this.creditCardYears=data
    )

    //populate countries
    this.lyrachShopFormService.getCountries().subscribe(
      data=>{
        this.countries=data
      }
    )
  }

  get firstName(){
    return this.checkoutFormGroup.get('customer.firstName');
  }

  get lastName(){
    return this.checkoutFormGroup.get('customer.lastName');
  }

  get email(){
    return this.checkoutFormGroup.get('customer.email');
  }

  get shippingAddressStreet(){
    return this.checkoutFormGroup.get('shippingAddress.street');
  }

  get shippingAddressCity(){
    return this.checkoutFormGroup.get('shippingAddress.city');
  }

  get shippingAddressState(){
    return this.checkoutFormGroup.get('shippingAddress.state');
  }

  get shippingAddressCountry(){
    return this.checkoutFormGroup.get('shippingAddress.country');
  }

  get shippingAddressZipCode(){
    return this.checkoutFormGroup.get('shippingAddress.zipCode');
  }

  get billingAddressStreet(){
    return this.checkoutFormGroup.get('billingAddress.street');
  }

  get billingAddressCity(){
    return this.checkoutFormGroup.get('billingAddress.city');
  }

  get billingAddressState(){
    return this.checkoutFormGroup.get('billingAddress.state');
  }

  get billingAddressCountry(){
    return this.checkoutFormGroup.get('billingAddress.country');
  }

  get billingAddressZipCode(){
    return this.checkoutFormGroup.get('billingAddress.zipCode');
  }

  get creditCardType(){
    return this.checkoutFormGroup.get('creditCard.cardType');
  }

  get creditCardNameOnCard(){
    return this.checkoutFormGroup.get('creditCard.nameOnCard');
  }

  get creditCardNumber(){
    return this.checkoutFormGroup.get('creditCard.cardNumber');
  }

  get creditCardSecurityCode(){
    return this.checkoutFormGroup.get('creditCard.securityCode');
  }


  onSubmit(){

    if(this.checkoutFormGroup.invalid){
      this.checkoutFormGroup.markAllAsTouched();
      return;
    }
  }

  copyShippingAddressToBillingAddress(event:any){
    if(event.target.checked){
      this.checkoutFormGroup.get('billingAddress')?.setValue(
        this.checkoutFormGroup.get('shippingAddress')?.value
      )
      this.billingAddressStates=this.shippingAddressStates;
    }else{
      this.checkoutFormGroup.get('billingAddress')?.reset();
      this.billingAddressStates=[];
    }
  }

  handleYearsAndMonth() {

    const creditCardFormGroup:FormGroup=this.checkoutFormGroup.get('creditCard') as FormGroup;
    const currentYear:number=new Date().getFullYear();
    const selectedYear:number=Number(creditCardFormGroup.get('expirationYear')?.value);

    let startMonth!:number;
    if(currentYear===selectedYear){
      startMonth=new Date().getMonth() + 1;
    }else{
      startMonth=1;
    }

    this.lyrachShopFormService.getCreditCardMonths(startMonth).subscribe(
      data=>this.creditCardMonths=data
    )

  }

  getStates(formGroupName: string) {
    const formGroup:FormGroup=this.checkoutFormGroup.get(formGroupName) as FormGroup;
    const countryCode:string=formGroup.value.country.code;
    const countryName:string=formGroup.value.country.name;

    console.log(`Country code:${countryCode} and country name:${countryName}`);

    this.lyrachShopFormService.getStates(countryCode).subscribe(
      data=>{
        if(formGroupName==='shippingAddress'){
          this.shippingAddressStates=data;
        }else{
          this.billingAddressStates=data;
        }
        formGroup.get('state')?.setValue(data[0]);
      }
    )


  }

  private reviewCardDetails() {
    this.cartService.totalPrice.subscribe(price=>this.totalPrice=price);
    this.cartService.totalQuantity.subscribe(quantity=>this.totalQuantity=quantity);
  }
}
