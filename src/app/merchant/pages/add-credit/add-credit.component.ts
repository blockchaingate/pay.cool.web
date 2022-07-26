import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-add-credit',
  templateUrl: './add-credit.component.html',
  styleUrls: ['./add-credit.component.scss']
})
export class AddCreditComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  confirm() {
    const abi = {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "address",
          "name": "_merchant",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint32",
          "name": "_coinType",
          "type": "uint32"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "_value",
          "type": "uint256"
        }
      ],
      "name": "AddCredit",
      "type": "event"
    };
  }
}
