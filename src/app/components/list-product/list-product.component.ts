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
  currentCategoryName!:string;
  searchMode:boolean=false;

  constructor(private productService:ProductService,
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
    const hasCategoryName:boolean=this.activatedRoute.snapshot.paramMap.has('categoryName');

    if(hasCategoryId){
      this.currentCategoryId= +this.activatedRoute.snapshot.paramMap.get('id')!;
      this.currentCategoryName=this.activatedRoute.snapshot.paramMap.get('categoryName')!;

    }else{
      this.currentCategoryId=1;
      this.currentCategoryName="Books";
    }

    this.productService.getProducts(this.currentCategoryId).subscribe(
      data=>this.products=data
    )
  }

  handleSearch(){

    const keyword:string=this.activatedRoute.snapshot.paramMap.get('keyword')!;
    console.log("Keyword: "+keyword+" ");
    this.productService.searchProducts(keyword).subscribe(data=>this.products=data)
  }
}
