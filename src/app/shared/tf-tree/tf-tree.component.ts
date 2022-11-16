import { Component, OnInit, Input } from '@angular/core';
import {FlatTreeControl} from '@angular/cdk/tree';
import {MatTreeFlatDataSource, MatTreeFlattener} from '@angular/material/tree';

/**
 * Food data with nested structure.
 * Each node has a name and an optional list of children.
 */
 interface FoodNode {
  user: string;
  children?: FoodNode[];
  smartContractAdd: string;
}

const TREE_DATA: FoodNode[] = [
  /*
  {
    name: 'Fruit',
    children: [
      {name: 'Apple'},
      {name: 'Banana'},
      {name: 'Fruit loops'},
    ]
  }, {
    name: 'Vegetables',
    children: [
      {
        name: 'Green',
        children: [
          {name: 'Broccoli'},
          {name: 'Brussels sprouts'},
        ]
      }, {
        name: 'Orange',
        children: [
          {name: 'Pumpkins'},
          {name: 'Carrots'},
        ]
      },
    ]
  },
  */
];

/** Flat node with expandable and level information */
interface ExampleFlatNode {
  expandable: boolean;
  user: string;
  downlines: number;
  keyNode: boolean;
  level: number;
}

@Component({
  selector: 'app-tf-tree',
  templateUrl: './tf-tree.component.html',
  styleUrls: ['./tf-tree.component.scss']
})

export class TfTreeComponent implements OnInit {
  @Input() children: FoodNode[];
  @Input() walletAddress: string;

  ngOnInit(): void {
    console.log('this.children in init=', this.children);
    this.dataSource.data = this.children;
  }

  private _transformer = (node: FoodNode, level: number) => {
    return {
      expandable: !!node.children && node.children.length > 0,
      user: node.user,
      downlines: !!node.children && node.children.length > 0 ? node.children.length : 0,
      keyNode: node.smartContractAdd ? true : false,
      level: level,
    };
  }

  treeControl = new FlatTreeControl<ExampleFlatNode>(
      node => node.level, node => node.expandable);

  treeFlattener = new MatTreeFlattener(
      this._transformer, node => node.level, node => node.expandable, node => node.children);

  dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);

  constructor() {
    
  }

  hasChild = (_: number, node: ExampleFlatNode) => node.expandable;  

}
