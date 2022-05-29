import { Component, Inject, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NbDialogRef, NbTagComponent, NbTagInputAddEvent } from '@nebular/theme';
import { InventoryModel } from 'src/app/inventory.model';
import { InventoryService } from 'src/app/inventory.service';

@Component({
  selector: 'app-edit-product',
  templateUrl: './edit-product.component.html',
  styleUrls: ['./edit-product.component.scss']
})
export class EditProductComponent implements OnInit {
  constructor(private dialogRef: NbDialogRef<EditProductComponent>, private inventoryService: InventoryService) { }

  id!: string
  bezeichnung!: string
  brand!: string
  main!: string
  sub1!: string
  price!: number
  availableQty!: number

  ngOnInit() {
    this.inventoryService.getProduct(this.id).subscribe((res) => {
      this.bezeichnung = res.bezeichnung
      this.brand = res.brand
      this.main = res.category.main
      this.sub1 = res.category.sub1
      this.price = res.price
      this.availableQty = res.availableQty
      this.trees = new Set(res.tags)
    })
  }

  editProduct(form: NgForm) {

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
        tags: Array.from(this.trees)
      }
      this.inventoryService.updateProduct(this.id, data).subscribe((res) => {
        if(res.status == 200){
          form.reset()
          this.dialogRef.close()
        } else {
          //inform user that request failed TODO
        }
      })
    }
  }

  trees: Set<string> = new Set()

  onTagRemove(tagToRemove: NbTagComponent): void {
    this.trees.delete(tagToRemove.text);
  }

  onTagAdd({ value, input }: NbTagInputAddEvent): void {
    if (value) {
      this.trees.add(value)
    }
    input.nativeElement.value = '';
  }
}

