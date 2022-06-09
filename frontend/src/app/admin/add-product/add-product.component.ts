import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NbTagComponent, NbTagInputAddEvent } from '@nebular/theme';
import { InventoryModel } from 'src/app/models/inventory.model';
import { InventoryService } from 'src/app/services/inventory.service';

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.scss']
})
export class AddProductComponent {

/**
 * The constructor function is a default function that runs whenever a new instance of the class is
 * created
 * @param {InventoryService} inventoryService - This is the name of the parameter.
 */
  constructor(private inventoryService: InventoryService) { }

  name!: string
  brand!: string
  main!: string
  sub1!: string
  price!: number
  availableQty!: number
  description!: string

  imageSrc!: string

/**
 * It takes the form data, creates a new object, and sends it to the server
 * @param {NgForm} form - NgForm - This is the form that we are going to submit.
 */
  addProduct(form: NgForm) {
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
        imgBase64: ""
      }
      this.inventoryService.addNewProduct(data).subscribe((res) => {
        if(res.status == 201){
          form.reset()
        }
      })
    }
  }

  trees: Set<string> = new Set()

/**
 * When a tag is removed, remove the corresponding tree from the list of trees
 * @param {NbTagComponent} tagToRemove - NbTagComponent - the tag that was removed
 */
  onTagRemove(tagToRemove: NbTagComponent): void {
    this.trees.delete(tagToRemove.text);
  }

/**
 * When a tag is added, if the tag is not empty, add it to the list of trees
 * @param {NbTagInputAddEvent}  - NbTagInputAddEvent
 */
  onTagAdd({ value, input }: NbTagInputAddEvent): void {
    if (value) {
      this.trees.add(value)
    }
    input.nativeElement.value = '';
  }

/**
 * It takes the file that was selected by the user, checks to make sure it's an image, and then
 * converts it to a base64 string
 * @param {any} e - any - The event object
 * @returns The file is being returned as a base64 encoded string.
 */
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

/**
 * _handleReaderLoaded() is a function that takes an event as an argument and sets the imageSrc
 * property to the result of the event
 * @param {any} e - any - This is the event that is triggered when the image is loaded.
 */
  _handleReaderLoaded(e: any) {
    let reader = e.target;
    this.imageSrc = reader.result;
    console.log(this.imageSrc)
  }
}
