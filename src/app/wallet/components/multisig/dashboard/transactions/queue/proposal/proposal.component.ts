import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-proposal',
  templateUrl: './proposal.component.html',
  styleUrls: ['./proposal.component.scss']
})
export class ProposalComponent {
  @Input() proposal: any;
  isCollapsed: boolean = true;
  constructor() {
  }
}
