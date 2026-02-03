import { Component, OnInit } from '@angular/core';
import {Product} from "../../common/product";
import {ProductService} from "../../services/product.service";
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.css']
})
export class ProductDetailsComponent implements OnInit {

  product!:Product;

  constructor(private productService:ProductService,
              private activatedRoute:ActivatedRoute

  ) { }

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe(
      ()=>this.handleProduct()
    )
  }

  handleProduct(){

    const productId:number=+this.activatedRoute.snapshot.paramMap.get('id')!;
    this.productService.getProduct(productId).subscribe(data=>this.product=data);
  }

}
