import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { OrderService } from 'src/app/order.service';

@Component({
  selector: 'app-stepper',
  templateUrl: './stepper.component.html',
  styleUrls: ['./stepper.component.scss']
})
export class StepperComponent implements OnInit {

  firstForm!: FormGroup;
  secondForm!: FormGroup;
  thirdForm!: FormGroup;

  constructor(private fb: FormBuilder, private orderService: OrderService) {
  }

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
    { value: '3dsds', label: '2' },
    { value: 'Zahlung mit Paypal', label: 'Paypal', disabled: true },
    { value: 'Einzug via Lastschrift', label: 'SEPA Lastschrift', disabled: true },
  ];
  zahlungsOption: any

  ngOnInit() {
    this.firstForm = this.fb.group({
      plzCtrl: [this.plz, Validators.required],
      ortCtrl: [this.ort, Validators.required],
      strasseCtrl: [this.strasse, Validators.required],
      hausnummerCtrl: [this.hausnummer, Validators.required],
      zusatzCtrl: [this.adresszusatz, Validators.required]
      // checkboxCtrl: [this.checkbox, Validators.required]
    });

    this.secondForm = this.fb.group({
      zahlungsOptionenCtrl: ['', Validators.required],
    });

    this.thirdForm = this.fb.group({
      thirdCtrl: ['', Validators.required],
    });
  }

  checkboxChange(e: any) {
    if(e.target.checked){
      this.firstForm.addControl('r_plzCtrl', this.fb.control(this.r_plz, Validators.required))
      this.firstForm.addControl('r_ortCtrl', this.fb.control(this.r_ort, Validators.required))
      this.firstForm.addControl('r_strasseCtrl', this.fb.control(this.r_strasse, Validators.required))
      this.firstForm.addControl('r_hausnummerCtrl', this.fb.control(this.r_hausnummer, Validators.required))
      this.firstForm.addControl('r_zusatzCtrl', this.fb.control(this.r_adresszusatz, Validators.required))
      this.seperateRechnung = true
    } else {
      this.seperateRechnung = false
      this.firstForm.removeControl('r_plzCtrl')
      this.firstForm.removeControl('r_ortCtrl')
      this.firstForm.removeControl('r_strasseCtrl')
      this.firstForm.removeControl('r_hausnummerCtrl')
      this.firstForm.removeControl('r_zusatzCtrl')
    }
    console.log(this.firstForm.controls)
  }

  onFirstSubmit() {
    console.log('test')
    this.firstForm.markAsDirty();
    // this.orderService.addAdress(this.firstForm)
  }

  onSecondSubmit() {
    console.log('test2')
    console.log(this.firstForm.value)
    this.secondForm.markAsDirty();
  }

  onThirdSubmit() {
    this.thirdForm.markAsDirty();
  }

}
