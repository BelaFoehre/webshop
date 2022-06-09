import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { CartModel } from 'src/app/models/cart.model';
import { OrderModel } from 'src/app/models/order.model';
import { OrderService } from 'src/app/services/order.service';
import { UserModel } from 'src/app/models/user.model';
import { CartService } from '../../services/cart.service';


@Component({
  selector: 'app-stepper',
  templateUrl: './stepper.component.html',
  styleUrls: ['./stepper.component.scss']
})
export class StepperComponent implements OnInit {

  firstForm!: FormGroup;
  secondForm!: FormGroup;
  thirdForm!: FormGroup;

/**
 * The constructor function is a special function that is called when a new instance of the class is created
 * @param {FormBuilder} fb - FormBuilder - This is an Angular service that we use to create forms.
 * @param {OrderService} orderService - This is the service that will be used to send the order to the server.
 * @param {CartService} cartService - This is the service that we created in the previous section.
 * @param {AuthService} authService - We need this to get the current user's id.
 */
  constructor(private fb: FormBuilder, private orderService: OrderService, private cartService: CartService, private authService: AuthService) {}

  cart!: CartModel
  order!: OrderModel
  user!: UserModel

  land: string = "Deutschland"
  plz!: string
  ort!: string
  strasse!: string
  hausnummer!: string
  adresszusatz!: string
  checkbox: boolean = false
  seperateRechnung: boolean = false
  r_plz!: string
  r_ort!: string
  r_strasse!: string
  r_hausnummer!: string
  r_adresszusatz!: string

  zahlungsOptionen = [
    { value: 'Kauf auf Rechnung', label: 'Rechnung' },
    { value: 'Zahlung mit Paypal', label: 'Paypal', disabled: true },
    { value: 'Einzug via Lastschrift', label: 'SEPA Lastschrift', disabled: true },
  ];
  zahlungsOption: any
  lastStep: boolean = false

/**
 * It creates a form group with the given controls and validators
 */
  ngOnInit() {
    let user = this.authService.getUser()
    if(user != null) this.user = user as UserModel
    this.firstForm = this.fb.group({
      plz: ['',Validators.required],
      ort: ['',Validators.required],
      strasse: ['',Validators.required],
      hausnummer: ['',Validators.required],
      adresszusatz: ['',Validators.required]
    });

    this.secondForm = this.fb.group({
      zahlungsOptionen: ['',Validators.required],
    });

    this.thirdForm = this.fb.group({
      thirdCtrl: [Validators.required],
    });
  }

/**
 * If the checkbox is checked, add the controls to the form, otherwise remove them
 * @param {any} e - any - The event that is triggered when the checkbox is clicked.
 */
  checkboxChange(e: any) {
    if(e.target.checked){
      this.firstForm.addControl('r_plz', this.fb.control('',Validators.required))
      this.firstForm.addControl('r_ort', this.fb.control('',Validators.required))
      this.firstForm.addControl('r_strasse', this.fb.control('',Validators.required))
      this.firstForm.addControl('r_hausnummer', this.fb.control('',Validators.required))
      this.firstForm.addControl('r_adresszusatz', this.fb.control('',Validators.required))
      this.seperateRechnung = true
    } else {
      this.seperateRechnung = false
      this.firstForm.removeControl('r_plz')
      this.firstForm.removeControl('r_ort')
      this.firstForm.removeControl('r_strasse')
      this.firstForm.removeControl('r_hausnummer')
      this.firstForm.removeControl('r_adresszusatz')
    }
  }

/**
 * It takes the values from the first form and saves them in variables
 */
  onFirstSubmit() {
    this.ort = this.firstForm.value.ort
    this.plz = this.firstForm.value.plz
    this.strasse = this.firstForm.value.strasse
    this.hausnummer = this.firstForm.value.hausnummer
    this.adresszusatz = this.firstForm.value.adresszusatz
    if(this.seperateRechnung){
      this.r_ort = this.firstForm.value.r_ort
      this.r_plz = this.firstForm.value.r_plz
      this.r_strasse = this.firstForm.value.r_strasse
      this.r_hausnummer = this.firstForm.value.r_hausnummer
      this.r_adresszusatz = this.firstForm.value.r_adresszusatz
    } else {
      this.r_ort = this.ort
      this.r_plz = this.plz
      this.r_strasse = this.strasse
      this.r_hausnummer = this.hausnummer
      this.r_adresszusatz = this.adresszusatz
    }
    this.firstForm.markAsDirty();
  }

/**
 * The function is called when the user clicks on the "Bestellen" button. It checks if the form is
 * valid and if it is, it sets the payment option to the value of the form and calls the createOrder()
 * function.
 */
  onSecondSubmit() {
    this.secondForm.markAsDirty();
    this.zahlungsOption = this.secondForm.value.zahlungsOptionen
    this.createOrder()
  }

/**
 * We're calling the emptyCart() function from the cart service, which will empty the cart, and then
 * we're calling the createInvoice() function, which will create the invoice
 */
  onThirdSubmit() {
    this.cartService.emptyCart().subscribe((res) => {
      this.createInvoice()
    })
  }

/**
 * It takes the cart and user data from the component, and sends it to the order service, which then
 * sends it to the server
 */
  createOrder(){
    let orderData = {
      cartId: this.cart._id || '404',
      userId: this.user._id || '404'
    }
    this.orderService.addNewOrder(orderData).subscribe((res) => {
      if(res.ok){
        if(res.body){
          this.order = res.body
          this.lastStep = true
        }
      }
    })
  }

/**
 * It takes the HTML of the invoice, converts it to a string, and sends it to the server
 */
  createInvoice(){
    const element = document.getElementById('invoice');
    let htmlInvoice = element?.innerHTML;

    let data = {
      htmlInvoice: JSON.stringify(htmlInvoice),
      userId: this.user._id || '404',
    }
    this.orderService.sendInvoice(data).subscribe(() => {})
  }
}
