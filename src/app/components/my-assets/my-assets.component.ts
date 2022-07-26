import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-my-assets',
  providers: [],
  templateUrl: './my-assets.component.html',
  styleUrls: ['./my-assets.component.scss']
})
export class MyAssetsComponent implements OnInit {
  selected = 0;

  constructor(private route: ActivatedRoute, private router: Router) { }

  ngOnInit() {
  }

}