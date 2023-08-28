import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss']
})
export class CreateComponent implements OnInit {

  chain: string = 'KANBAN';
  owners: any = [
    {
      name: '',
      address: ''
    },
    {
      name: '',
      address: ''
    }
  ];
  constructor() { }

  ngOnInit(): void {
  }

}
