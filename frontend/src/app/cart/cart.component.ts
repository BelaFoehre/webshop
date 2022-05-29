import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { CartService } from './cart.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit {
  cart: any
  cartSub!: Subscription
  constructor(private cartService: CartService) {}

  changeQuantity(id: any, quantity: any): void {
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
      .subscribe((cart: any) => {
        this.cart = cart
      })
  }
  ngOnInit(): void {
    this.loadCart();
  }

}
