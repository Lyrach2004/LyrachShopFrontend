import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { LyrachShopFormService } from "../../services/lyrach-shop-form.service";
import { Country } from "../../common/country";
import { State } from "../../common/state";
import { LyrachShopValidators } from "../../validators/lyrach-shop-validators";
import { CartService } from "../../services/cart.service";
import { CheckoutService } from "../../services/checkout.service";
import { Router } from "@angular/router";
import { Order } from "../../common/order";
import { OrderItem } from "../../common/order-item";
import { Purchase } from "../../common/purchase";
import { environment } from "../../../environments/environment";
import { PaymentInfo } from "../../common/payment-info";

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {

  checkoutFormGroup!: FormGroup;
  totalPrice: number = 0.00;
  totalQuantity: number = 0;
  creditCardYears: number[] = [];
  creditCardMonths: number[] = [];
  countries: Country[] = [];
  shippingAddressStates!: State[];
  billingAddressStates!: State[];

  localStorage: Storage = localStorage;
  sessionStorage: Storage = sessionStorage;

  //initialize Stripe API
  stripe = Stripe(environment.stripePublisableKey);
  paymentInfo: PaymentInfo = new PaymentInfo();
  cardElement: any;
  displayError: any = "";

  isDisabled:boolean=false;

  constructor(
    private formBuilder: FormBuilder,
    private lyrachShopFormService: LyrachShopFormService,
    private cartService: CartService,
    private checkoutService: CheckoutService,
    private router: Router
  ) { }

  ngOnInit(): void {
    //setup Stripe payment form
    this.setupStripePaymentForm();

    const theEmail = JSON.parse(this.sessionStorage.getItem('userEmail')!);
    this.checkoutFormGroup = this.formBuilder.group({
      customer: this.formBuilder.group({
        firstName: new FormControl('', [Validators.required, Validators.minLength(2), LyrachShopValidators.notOnlyWhitespace]),
        lastName: new FormControl('', [Validators.required, Validators.minLength(2), LyrachShopValidators.notOnlyWhitespace]),
        email: new FormControl(theEmail, [Validators.required,
        Validators.pattern("[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$")])
      }),
      shippingAddress: this.formBuilder.group({
        street: new FormControl('', [Validators.required, Validators.minLength(2), LyrachShopValidators.notOnlyWhitespace]),
        city: new FormControl('', [Validators.required, Validators.minLength(2), LyrachShopValidators.notOnlyWhitespace]),
        state: new FormControl('', [Validators.required]),
        country: new FormControl('', [Validators.required]),
        zipCode: new FormControl('', [Validators.required, Validators.minLength(2), LyrachShopValidators.notOnlyWhitespace])
      }
      ),
      billingAddress: this.formBuilder.group({
        street: new FormControl('', [Validators.required, Validators.minLength(2), LyrachShopValidators.notOnlyWhitespace]),
        city: new FormControl('', [Validators.required, Validators.minLength(2), LyrachShopValidators.notOnlyWhitespace]),
        state: new FormControl('', [Validators.required, Validators.minLength(2), LyrachShopValidators.notOnlyWhitespace]),
        country: new FormControl('', [Validators.required, Validators.minLength(2), LyrachShopValidators.notOnlyWhitespace]),
        zipCode: new FormControl('', [Validators.required, Validators.minLength(2), LyrachShopValidators.notOnlyWhitespace])
      }
      ),
      creditCard: this.formBuilder.group({
        /*
          cardType:new FormControl('',[Validators.required]),
          nameOnCard:new FormControl('',[Validators.required,Validators.minLength(2),LyrachShopValidators.notOnlyWhitespace]),
          cardNumber:new FormControl('',[Validators.required,Validators.pattern("[0-9]{16}")]),
          securityCode:new FormControl('',[Validators.required,Validators.pattern("[0-9]{3}")]),
          expirationMonth:[''],
          expirationYear:['']

         */
      }
      )
    })

    this.reviewCardDetails();

    //populate countries
    this.lyrachShopFormService.getCountries().subscribe(
      data => {
        this.countries = data
      }
    )
  }

  get firstName() {
    return this.checkoutFormGroup.get('customer.firstName');
  }

  get lastName() {
    return this.checkoutFormGroup.get('customer.lastName');
  }

  get email() {
    return this.checkoutFormGroup.get('customer.email');
  }

  get shippingAddressStreet() {
    return this.checkoutFormGroup.get('shippingAddress.street');
  }

  get shippingAddressCity() {
    return this.checkoutFormGroup.get('shippingAddress.city');
  }

  get shippingAddressState() {
    return this.checkoutFormGroup.get('shippingAddress.state');
  }

  get shippingAddressCountry() {
    return this.checkoutFormGroup.get('shippingAddress.country');
  }

  get shippingAddressZipCode() {
    return this.checkoutFormGroup.get('shippingAddress.zipCode');
  }

  get billingAddressStreet() {
    return this.checkoutFormGroup.get('billingAddress.street');
  }

  get billingAddressCity() {
    return this.checkoutFormGroup.get('billingAddress.city');
  }

  get billingAddressState() {
    return this.checkoutFormGroup.get('billingAddress.state');
  }

  get billingAddressCountry() {
    return this.checkoutFormGroup.get('billingAddress.country');
  }

  get billingAddressZipCode() {
    return this.checkoutFormGroup.get('billingAddress.zipCode');
  }

  get creditCardType() {
    return this.checkoutFormGroup.get('creditCard.cardType');
  }

  get creditCardNameOnCard() {
    return this.checkoutFormGroup.get('creditCard.nameOnCard');
  }

  get creditCardNumber() {
    return this.checkoutFormGroup.get('creditCard.cardNumber');
  }

  get creditCardSecurityCode() {
    return this.checkoutFormGroup.get('creditCard.securityCode');
  }


  onSubmit() {

    if (this.checkoutFormGroup.invalid) {
      this.checkoutFormGroup.markAllAsTouched();
      return;
    }
    //set up order
    let order = new Order();
    order.totalPrice = this.totalPrice;
    order.totalQuantity = this.totalQuantity;
    //get cart items
    const cartItems = this.cartService.cartItems;
    //create orderItems from cartItems
    let orderItems: OrderItem[] = cartItems.map(tempCartItem => new OrderItem(tempCartItem));

    let purchase = new Purchase();
    //populate purchase - Customer
    purchase.customer = this.checkoutFormGroup.controls['customer'].value;

    //populate purchase - shippingAddress
    purchase.shippingAddress = this.checkoutFormGroup.controls['shippingAddress'].value;
    const shippingState: State = JSON.parse(JSON.stringify(purchase.shippingAddress.state));
    const shippingCountry: Country = JSON.parse(JSON.stringify(purchase.shippingAddress.country));
    purchase.shippingAddress.state = shippingState.name;
    purchase.shippingAddress.country = shippingCountry.name;

    //populate purchase - billing address
    purchase.billingAddress = this.checkoutFormGroup.controls['billingAddress'].value;
    const billingState: State = JSON.parse(JSON.stringify(purchase.billingAddress.state));
    const billingCountry: Country = JSON.parse(JSON.stringify(purchase.billingAddress.country));
    purchase.billingAddress.state = billingState.name;
    purchase.billingAddress.country = billingCountry.name;

    //populate purchase - order and orderItems
    purchase.order = order;
    purchase.orderItems = orderItems;

    //compute payment info
    this.paymentInfo.amount = Math.round(this.totalPrice * 100);
    this.paymentInfo.currency = "USD";
    this.paymentInfo.receiptEmail = purchase.customer.email;

    console.log(`this.paymentInfo.amount: ${this.paymentInfo.amount}`);

    //if valid form then
    //-create payment intent
    //-confirm card payment
    //-place order


    if (!this.checkoutFormGroup.invalid && this.displayError.textContent === "") {
      this.isDisabled=true;
      this.checkoutService.createPaymentIntent(this.paymentInfo).subscribe(
        (paymentIntentResponse) => {
          this.stripe.confirmCardPayment(paymentIntentResponse.client_secret,
            {
              payment_method: {
                card: this.cardElement,
                billing_details:{
                  email:purchase.customer.email,
                  name:`${purchase.customer.firstName} ${purchase.customer.lastName}`,
                  address:{
                    line1:purchase.billingAddress.street,
                    city:purchase.billingAddress.city,
                    state:purchase.billingAddress.state,
                    postal_code:purchase.billingAddress.zipCode,
                    country:this.billingAddressCountry?.value?.code
                  }
                }

              }
            }, { handleActions: true })
            .then((result: any) => {
              if (result.error) {
                //inform the customer there was an error
                alert(`There was an error:${result.error.message}`);
                this.isDisabled=false;
              } else {
                //call REST API via checkoutService
                this.checkoutService.placeOrder(purchase).subscribe({
                  next: (response: any) => {
                    alert(`Your order has been received.\nOrder tracking number: ${response.orderTrackingNumber}`);
                    //reset cart
                    this.resetCart();
                    this.isDisabled=false;
                  },
                  error: (error: any) => {
                    alert(`There was an error : ${error.message}`);
                    this.isDisabled=false;
                  }
                })
              }
            })
            .catch((error: any) => {
              console.error("Stripe promise error:", error);
            })
        }
      );
    } else {
      this.checkoutFormGroup.markAllAsTouched();
      return;
    }
  }

  copyShippingAddressToBillingAddress(event: any) {
    if (event.target.checked) {
      this.checkoutFormGroup.get('billingAddress')?.setValue(
        this.checkoutFormGroup.get('shippingAddress')?.value
      )
      this.billingAddressStates = this.shippingAddressStates;
    } else {
      this.checkoutFormGroup.get('billingAddress')?.reset();
      this.billingAddressStates = [];
    }
  }

  handleYearsAndMonth() {

    const creditCardFormGroup: FormGroup = this.checkoutFormGroup.get('creditCard') as FormGroup;
    const currentYear: number = new Date().getFullYear();
    const selectedYear: number = Number(creditCardFormGroup.get('expirationYear')?.value);

    let startMonth!: number;
    if (currentYear === selectedYear) {
      startMonth = new Date().getMonth() + 1;
    } else {
      startMonth = 1;
    }

    this.lyrachShopFormService.getCreditCardMonths(startMonth).subscribe(
      data => this.creditCardMonths = data
    )

  }

  getStates(formGroupName: string) {
    const formGroup: FormGroup = this.checkoutFormGroup.get(formGroupName) as FormGroup;
    const countryCode: string = formGroup.value.country.code;
    const countryName: string = formGroup.value.country.name;

    this.lyrachShopFormService.getStates(countryCode).subscribe(
      data => {
        if (formGroupName === 'shippingAddress') {
          this.shippingAddressStates = data;
        } else {
          this.billingAddressStates = data;
        }
        formGroup.get('state')?.setValue(data[0]);
      }
    )


  }

  private reviewCardDetails() {
    this.cartService.totalPrice.subscribe(price => this.totalPrice = price);
    this.cartService.totalQuantity.subscribe(quantity => this.totalQuantity = quantity);
  }

  resetCart() {
    //reset cart data
    this.cartService.cartItems = [];
    this.cartService.totalPrice.next(0);
    this.cartService.totalQuantity.next(0);
    this.cartService.persistCartItems();
    //reset the form
    this.checkoutFormGroup.reset();
    //navigate back to the products page
    this.router.navigateByUrl("/products");
  }

  setupStripePaymentForm() {
    //get a handle to stripe elements
    var elements = this.stripe.elements();

    //create a card element and hide the zip-code field
    this.cardElement = elements.create('card', { hidePostalCode: true });

    //add an instance of card UI component into the 'card-element' div
    this.cardElement.mount("#card-element");

    //add event binding for the 'change' event on the card element
    this.cardElement.on('change', (event: any) => {

      //get a handle to card-errors element
      this.displayError = document.getElementById('card-errors');
      if (event.complete) {
        this.displayError.textContent = "";
      } else if (event.error) {
        //show validation error to customer
        this.displayError.textContent = event.error.message;
      }
    })

  }
}
