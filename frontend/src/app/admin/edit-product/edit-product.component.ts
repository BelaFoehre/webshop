import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NbDialogRef, NbTagComponent, NbTagInputAddEvent } from '@nebular/theme';
import { ToastrService } from 'ngx-toastr';
import { InventoryModel } from 'src/app/models/inventory.model';
import { InventoryService } from 'src/app/services/inventory.service';

@Component({
  selector: 'app-edit-product',
  templateUrl: './edit-product.component.html',
  styleUrls: ['./edit-product.component.scss']
})
export class EditProductComponent implements OnInit {

/**
 * The constructor function is used to inject the services that we need to use in this component
 * @param dialogRef - NbDialogRef<EditProductComponent> - This is the reference to the dialog that is
 * being opened.
 * @param {InventoryService} inventoryService - This is the service that we created earlier.
 * @param {ToastrService} toastr - This is a service that allows us to display messages to the
 * user.
 */
  constructor(
    private dialogRef: NbDialogRef<EditProductComponent>,
    private inventoryService: InventoryService,
    private toastr: ToastrService
  ) { }

  isNew!: boolean
  id!: string
  name!: string
  brand!: string
  main!: string
  sub1!: string
  price!: number
  availableQty!: number
  description!: string

  imageSrc!: string
  trees: Set<string> = new Set()

/**
 * It gets the product from the database and sets the values of the variables in the component to the
 * values of the product
 */
  ngOnInit() {
    if(!this.isNew){
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
    }
  }

/**
 * It takes the form data, creates a new object with the data and sends it to the server
 * @param {NgForm} form - NgForm - The form that was submitted
 */
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

      if(this.isNew){
        this.inventoryService.addNewProduct(data).subscribe((res) => {
          if(res.status == 200){
            this.toastr.success('Produkt erfolgreich aktualisiert!', 'Erfolg', { timeOut: 2000 })
            .onHidden.subscribe(() => {
              form.reset()
              this.dialogRef.close()
            })
          } else {
            this.toastr.error('Produkt konnte nicht geändert werden!', 'Fehler', { timeOut: 2000 })
            .onHidden.subscribe(() => {
              this.dialogRef.close()
            })
          }
        })
      } else {
        this.inventoryService.updateProduct(this.id, data).subscribe((res) => {
          if(res.status == 200){
            this.toastr.success('Produkt erfolgreich aktualisiert!', 'Erfolg', { timeOut: 2000 })
            .onHidden.subscribe(() => {
              form.reset()
              this.dialogRef.close()
            })
          } else {
            this.toastr.error('Produkt konnte nicht geändert werden!', 'Fehler', { timeOut: 2000 })
            .onHidden.subscribe(() => {
              this.dialogRef.close()
            })
          }
        })
      }

    }
  }

/**
 * It removes the tag from the list of tags.
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
  }
}

