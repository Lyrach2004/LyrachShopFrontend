import { Component, OnInit } from '@angular/core';
import {ProductService} from "../../services/product.service";
import {Product} from "../../common/product";
import {ActivatedRoute} from "@angular/router";
import {CartItem} from "../../common/cart-item";
import {CartService} from "../../services/cart.service";

@Component({
  selector: 'app-list-product',
  templateUrl: './list-product-table-grid.component.html',
  styleUrls: ['./list-product.component.css']
})
export class ListProductComponent implements OnInit {

  products:Product[]=[];
  currentCategoryId:number=1;
  previousCategoryId:number=1;
  searchMode:boolean=false;

  pageNumber:number=1;
  pageSize:number=5;
  totalElements:number=0;

  previousKeyWord:string='';

  constructor(private productService:ProductService,
              private cartService:CartService,
              private activatedRoute:ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe(() => {
      this.listProducts();
    })
  }


  listProducts():void{

    this.searchMode=this.activatedRoute.snapshot.paramMap.has('keyword');

    if(this.searchMode){
      this.handleSearch();
    }else{
      this.handleProducts();
    }
  }

  handleProducts(){
    const hasCategoryId:boolean=this.activatedRoute.snapshot.paramMap.has('id');

    if(hasCategoryId){
      this.currentCategoryId= +this.activatedRoute.snapshot.paramMap.get('id')!;

    }else{
      this.currentCategoryId=1;
    }

    if(this.previousCategoryId!==this.currentCategoryId){
      this.pageNumber=1;
    }

    this.previousCategoryId=this.currentCategoryId;

    this.productService.getProductsListPaginate(this.pageNumber-1,
                                                this.pageSize,
                                                this.currentCategoryId
      ).subscribe(this.processResult())
  }

  handleSearch(){

    const keyword:string=this.activatedRoute.snapshot.paramMap.get('keyword')!;

    if(this.previousKeyWord!==keyword){
      this.pageNumber=1;
    }

    this.previousKeyWord=keyword;

    this.productService.searchProductsPaginate(this.pageNumber-1,
                                               this.pageSize,
                                               keyword
    ).subscribe(this.processResult())
  }

  updatePageSize() {
    this.pageNumber=1;
    this.listProducts();
  }

  processResult(){
    return (data:any)=>{
      this.products=data._embedded.products;
      this.pageNumber=data.page.number+1;
      this.pageSize=data.page.size;
      this.totalElements=data.page.totalElements;
  }
  }

  addToCart(product: Product) {
    const cartItem:CartItem=new CartItem(product);
    this.cartService.addToCart(cartItem);


  }
}
