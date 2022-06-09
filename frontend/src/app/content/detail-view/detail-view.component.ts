import { Component } from '@angular/core';
import { InventoryModel } from 'src/app/models/inventory.model';
import { InventoryService } from 'src/app/services/inventory.service';

@Component({
  selector: 'app-detail-view',
  templateUrl: './detail-view.component.html',
  styleUrls: ['./detail-view.component.scss']
})
export class DetailViewComponent {

  product!: InventoryModel
  itemQty: number = 1

/**
 * The constructor function is a default function that runs whenever a new instance of the class is
 * created
 * @param {InventoryService} inventoryService - This is the name of the parameter.
 */
  constructor(private inventoryService: InventoryService) { }

/**
 * The function takes a productId as a parameter, and then calls the addToCart function in the
 * inventoryService, passing in the productId and the itemQty
 * @param {string} productId - The id of the product that is being added to the cart.
 */
  addToCart(productId: string){
    this.inventoryService.addToCart(productId, this.itemQty)
  }
}
