import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { InventoryModel } from 'src/app/inventory.model';
import { InventoryService } from 'src/app/inventory.service';

@Component({
  selector: 'app-manage-products',
  templateUrl: './manage-products.component.html',
  styleUrls: ['./manage-products.component.scss']
})
export class ManageProductsComponent implements OnInit, OnDestroy {

  products: InventoryModel[] | undefined
  productsSub!: Subscription

  constructor(private inventoryService: InventoryService) { }

  ngOnInit(){
    this.loadProducts()
  }

  private loadProducts(){
    this.inventoryService.getAllProducts()
    this.productsSub = this.inventoryService.getProductUpdateListener()
      .subscribe((products: any) => {
        this.products = products[0]
      });
  }

  ngOnDestroy(): void {
      this.productsSub.unsubscribe()
  }

}
