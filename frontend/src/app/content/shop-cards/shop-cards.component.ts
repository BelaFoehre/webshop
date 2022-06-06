import { Component, OnInit } from '@angular/core';
import { NbDialogRef, NbDialogService } from '@nebular/theme';
import { Subscription } from 'rxjs';
import { InventoryModel } from 'src/app/inventory.model';
import { InventoryService } from 'src/app/inventory.service';
import { DetailViewComponent } from '../detail-view/detail-view.component';

@Component({
  selector: 'app-shop-cards',
  templateUrl: './shop-cards.component.html',
  styleUrls: ['./shop-cards.component.scss']
})
export class ShopCardsComponent implements OnInit {
  productsSub!: Subscription
  products: InventoryModel[] = [];

  private dialogRef!: NbDialogRef<DetailViewComponent>;

  constructor(private inventoryService: InventoryService, private dialogService: NbDialogService) { }

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
    this.inventoryService.addToCart(productId, 1)
  }

  /**
   * The function takes a productId as a parameter, finds the product with that id in the products
   * array, and then opens a dialog with the DetailViewComponent, passing the product as a context
   * @param {string} productId - string - The product id of the product that was clicked on.
   */
  openDetails(productId: string){
    let product = this.products.find(product => product._id === productId)
    this.dialogRef = this.dialogService.open(DetailViewComponent, {
      context: {
        product: product
      }, hasBackdrop: true, closeOnBackdropClick: true
    })
  }

  searchInput(event: any){
    let searchValue = event.target.value
    let filteredProducts = this.products.filter(product => product.name.toLowerCase().includes(searchValue.toLowerCase()))
    this.products = filteredProducts
  }

}
