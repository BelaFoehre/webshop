import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { InventoryModel } from 'src/app/inventory.model';
import { InventoryService } from 'src/app/inventory.service';

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.scss']
})
export class AddProductComponent implements OnInit {

  constructor(private inventoryService: InventoryService) { }

  bezeichnung!: string
  brand!: string
  // category!: {
    main!: string
    sub1!: string
  // }
  price!: number
  availableQty!: number

  ngOnInit(): void {
  }

  addProduct(form: NgForm) {

    if(form.valid){
      let data: InventoryModel = {
        bezeichnung: this.bezeichnung,
        brand: this.brand,
        category: {
          main: this.main,
          sub1: this.sub1
        },
        price: this.price,
        availableQty: this.availableQty,
        tags: []
      }
      this.inventoryService.addNewProduct(data)
    }
  }
}
