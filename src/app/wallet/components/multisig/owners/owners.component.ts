import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-owners',
  templateUrl: './owners.component.html',
  styleUrls: ['./owners.component.scss']
})
export class OwnersComponent implements OnInit {
  @Output() ownersChange = new EventEmitter();
  @Input() owners: any;

  constructor() { }

  ngOnInit(): void {
  }

  addOwner() {
    this.owners.push(
      {
        name: '',
        address: ''
      }
    );
  }

  delete(index: number) {
    if(index >= 2) {
      this.owners.splice(index, 1);
    }
    
  }
}
