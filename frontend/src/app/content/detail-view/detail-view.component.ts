import { Component, OnInit } from '@angular/core';
import { InventoryModel } from 'src/app/inventory.model';
import { InventoryService } from 'src/app/inventory.service';

@Component({
  selector: 'app-detail-view',
  templateUrl: './detail-view.component.html',
  styleUrls: ['./detail-view.component.scss']
})
export class DetailViewComponent implements OnInit {

  product!: InventoryModel
  itemQty: number = 1
  constructor(private inventoryService: InventoryService) { }

  ngOnInit(): void {
  }

  addToCart(productId: string){
    this.inventoryService.addToCart(productId, this.itemQty)
  }

}
