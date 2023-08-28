import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-multisig',
  templateUrl: './multisig.component.html',
  styleUrls: ['./multisig.component.scss']
})
export class MultisigComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  create() {
    this.router.navigate(['/wallet/multisig/create']);
  }

  import() {
    this.router.navigate(['/wallet/multisig/import']);
  }
}
