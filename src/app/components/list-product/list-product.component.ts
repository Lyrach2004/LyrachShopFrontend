import { Component, OnInit } from '@angular/core';
import {ProductService} from "../../services/product.service";
import {Product} from "../../common/product";
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-list-product',
  templateUrl: './list-product-table-grid.component.html',
  styleUrls: ['./list-product.component.css']
})
export class ListProductComponent implements OnInit {

  products!:Product[];
  currentCategoryId!:number;

  constructor(private productService:ProductService,
              private activatedRoute:ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe(() => {
      this.listProducts()
    })
  }


  listProducts():void{

    const hasCategoryId:boolean=this.activatedRoute.snapshot.paramMap.has('id');

    if(hasCategoryId){
      this.currentCategoryId= +this.activatedRoute.snapshot.paramMap.get('id')!;
    }else{
      this.currentCategoryId=1;
    }

    this.productService.getProducts(this.currentCategoryId).subscribe(
      data=>this.products=data
    )
  }
}
