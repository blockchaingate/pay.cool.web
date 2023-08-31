import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-create-go',
  templateUrl: './create-go.component.html',
  styleUrls: ['./create-go.component.scss']
})
export class CreateGoComponent implements OnInit {
  @Input() contractAddress: string;
  @Input() txid: string;
  constructor() { }

  ngOnInit(): void {
  }

}
