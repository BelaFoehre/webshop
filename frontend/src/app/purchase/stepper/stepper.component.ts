import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/auth.service';
import { CartModel } from 'src/app/cart.model';
import { OrderModel } from 'src/app/order.model';
import { OrderService } from 'src/app/order.service';
import { UserModel } from 'src/app/user.model';
import { CartService } from '../cart/cart.service';


@Component({
  selector: 'app-stepper',
  templateUrl: './stepper.component.html',
  styleUrls: ['./stepper.component.scss']
})
export class StepperComponent implements OnInit {

  firstForm!: FormGroup;
  secondForm!: FormGroup;
  thirdForm!: FormGroup;

  constructor(private fb: FormBuilder, private orderService: OrderService, private cartService: CartService, private authService: AuthService) {
  }

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
    console.log(this.firstForm.controls)
  }

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

  onSecondSubmit() {
    console.log(this.user)
    console.log('ort ' + this.ort)
    console.log(this.firstForm.value)
    this.secondForm.markAsDirty();
    this.zahlungsOption = this.secondForm.value.zahlungsOptionen
    this.createOrder()
  }

  onThirdSubmit() {
    this.cartService.emptyCart().subscribe((res) => {
      this.createInvoice()
    })
  }

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

  createInvoice(){
    const element = document.getElementById('invoice');
    const opt = {
      filename: 'myPage.pdf',
      margin: 2,
      image: {type: 'jpeg', quality: 0.9},
      jsPDF: {format: 'letter', orientation: 'portrait'}
    };

    let htmlInvoice = element?.innerHTML;

    let data = {
      htmlInvoice: JSON.stringify(htmlInvoice),
      userId: this.user._id || '404',
    }
    this.orderService.sendInvoice(data).subscribe((res) => {console.log(res)})
    // html2pdf().set(opt).from(element).save();
    // // Old monolithic-style usage:
    // html2pdf(element, opt);
  }

}
