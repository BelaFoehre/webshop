
import { Component, OnInit } from '@angular/core';
import { NbDialogRef, NbDialogService } from '@nebular/theme';
import { Subscription } from 'rxjs';
import { CartModel } from 'src/app/models/cart.model';
import { StepperComponent } from '../stepper/stepper.component';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit {
  cart!: CartModel
  cartSub!: Subscription
  dialogRef!: NbDialogRef<StepperComponent>;

/**
 * The constructor function is a special function that is called when a new instance of the class is
 * created
 * @param {CartService} cartService - This is the service that we created in the previous step.
 * @param {NbDialogService} dialogService - NbDialogService - This is the service that will be used to
 * open the dialog.
 */
  constructor(private cartService: CartService, private dialogService: NbDialogService) {}

/**
 * The function is called when the component is initialized
 */
  ngOnInit(): void {
    this.loadCart();
  }

/**
 * It takes the product id and quantity as parameters, and then calls the addToCart() function in the
 * cart service, which returns an observable. The observable is then subscribed to, and the loadCart()
 * function is called
 * @param {any} id - The id of the product you want to change the quantity of.
 * @param {number} quantity - number - the quantity of the product to be added to the cart
 */
  changeQuantity(id: any, quantity: number): void {
    this.cartService.addToCart(id, quantity).subscribe((res) => {
      this.loadCart()
    });
  }

/**
 * It calls the emptyCart() method of the cartService, and when the observable returned by that method
 * completes, it calls the loadCart() method to refresh the cart
 */
  emptyCart(): void {
    this.cartService.emptyCart().subscribe(() => {
      this.loadCart()
    });
  }

/**
 * We subscribe to the cart service's getCartUpdateListener() function, which returns an observable.
 * When the observable emits a new value, we update the cart variable
 */
  private loadCart(){
    this.cartService.getCart()
    this.cartSub = this.cartService.getCartUpdateListener()
      .subscribe((cart: CartModel) => {
        this.cart = cart
      })
  }

/**
 * We open a dialog with the StepperComponent, passing in the cart as a context, and setting the
 * backdrop to true
 */
  checkout(){
    this.dialogRef = this.dialogService.open(StepperComponent, { context: { cart: this.cart }, hasBackdrop: true, closeOnBackdropClick: true })

    this.dialogRef.onClose.subscribe(() => {
      window.location.reload()
    })
  }
}
