import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss']
})
export class CheckoutComponent implements OnInit {
  title: String = 'Checkout';

  constructor() { }

  ngOnInit(): void {
  }

  onSelectLan(language: string) {
  }

}
