import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';


@Component({
  selector: 'app-address',
  templateUrl: './address.component.html',
  styleUrls: ['./address.component.scss']
})
export class AddressComponent implements OnInit {

  constructor() { }

  land: string = "Deutschland"
  plz!: string
  ort!: string
  strasse!: string
  hausnummer!: string
  adresszusatz!: string

  ngOnInit(): void {
  }

  saveAddress(form: NgForm) {
    if (form.valid) {
      console.log(form.value)
    }
  }

}
