import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { InventoryModel } from 'src/app/inventory.model';
import { InventoryService } from 'src/app/inventory.service';

@Component({
  selector: 'app-shop-cards',
  templateUrl: './shop-cards.component.html',
  styleUrls: ['./shop-cards.component.scss']
})
export class ShopCardsComponent implements OnInit {
  productsSub!: Subscription
  products: InventoryModel[] = [];

  constructor(private inventoryService: InventoryService) { }

  ngOnInit(): void {
    this.loadProducts()
  }

  /**
   * This function is called when the component is loaded, and it calls the getAllProducts() function
   * in the inventoryService, which returns an observable of all the products in the database. The
   * subscribe() function is called on the observable, and the products are stored in the products
   * variable
   */
  private loadProducts(){
    this.inventoryService.getAllProducts()
    this.productsSub = this.inventoryService.getProductUpdateListener()
      .subscribe((products: any) => {
        this.products = products[0]
      });
  }

  /**
   * The addToCart function takes a productId as an argument and calls the addToCart function in the
   * inventoryService
   * @param {String} productId - The id of the product to be added to the cart.
   */
  addToCart(productId: String){
    this.inventoryService.addToCart(productId)
  }
}
