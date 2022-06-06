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
  name!: string
  brand!: string
  main!: string
  sub1!: string
  price!: number
  availableQty!: number
  description!: string

  imageSrc!: string

  ngOnInit() {
    this.inventoryService.getProduct(this.id).subscribe((res) => {
      this.name = res.name
      this.brand = res.brand
      this.main = res.category.main
      this.sub1 = res.category.sub1
      this.price = res.price
      this.availableQty = res.availableQty
      this.trees = new Set(res.tags)
      this.imageSrc = res.imgBase64
    })
    console.log(this.imageSrc)
  }

  editProduct(form: NgForm) {

    if(form.valid){
      let data: InventoryModel = {
        name: this.name,
        brand: this.brand,
        category: {
          main: this.main,
          sub1: this.sub1
        },
        description: this.description,
        price: this.price,
        availableQty: this.availableQty,
        tags: Array.from(this.trees),
        imgBase64: this.imageSrc
      }
      console.log('11', data)
      this.inventoryService.updateProduct(this.id, data).subscribe((res) => {
        console.log('res from inv service updateproduct: ', res)
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

  onFileChange(e: any) {
    var file = e.dataTransfer ? e.dataTransfer.files[0] : e.target.files[0];
    var pattern = /image-*/;
    var reader = new FileReader();
    if (!file.type.match(pattern)) {
      alert('invalid format');
      return;
    }
    reader.onload = this._handleReaderLoaded.bind(this);
    reader.readAsDataURL(file);
  }

  _handleReaderLoaded(e: any) {
    let reader = e.target;
    this.imageSrc = reader.result;
    console.log(this.imageSrc)
  }
}

