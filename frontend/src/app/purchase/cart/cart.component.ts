
import { Component, OnInit } from '@angular/core';
import { NbDialogService } from '@nebular/theme';
import { Subscription } from 'rxjs';
import { CartModel } from 'src/app/cart.model';
import { AddressComponent } from '../address/address.component';
import { StepperComponent } from '../stepper/stepper.component';
import { CartService } from './cart.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit {
  cart!: CartModel
  cartSub!: Subscription
  constructor(private cartService: CartService, private dialogService: NbDialogService) {}

  ngOnInit(): void {
    this.loadCart();
  }

  changeQuantity(id: any, quantity: number): void {
    this.cartService.addToCart(id, quantity).subscribe((res) => {
      this.loadCart()
    });
  }
  emptyCart(): void {
    this.cartService.emptyCart().subscribe(() => {
      this.loadCart()
    });
  }

  private loadCart(){
    this.cartService.getCart()
    this.cartSub = this.cartService.getCartUpdateListener()
      .subscribe((cart: CartModel) => {
        this.cart = cart
      })
  }

  checkout(){
    this.dialogService.open(StepperComponent, { context: { cart: this.cart }, closeOnBackdropClick: false })
    // this.cartService.checkout()
  }

}
