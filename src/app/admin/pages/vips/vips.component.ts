import { Component, OnInit } from '@angular/core';
import { StarService } from 'src/app/services/star.service';
import { AngularCsv } from 'angular7-csv';

@Component({
  selector: 'app-vips',
  templateUrl: './vips.component.html',
  styleUrls: ['./vips.component.scss']
})
export class VipsComponent implements OnInit {
  rewards: any;
  walletAddress: string;
  constructor(private starServ: StarService) { }

  ngOnInit(): void {
    this.rewards = [];
    this.walletAddress = '';
    this.starServ.getVipTree().toPromise().then(
      (ret: any) => {
        this.calculateRewards(ret);
      }
    );
  }

  exportFile() {
    var data = this.rewards.filter(item => (item.bst > 0)).map(item => {
      return {
        Address: item.id,
        BST: item.bst
      }
    });
     
    var options = { 
      fieldSeparator: ',',
      quoteStrings: '"',
      decimalseparator: '.',
      showLabels: false, 
      showTitle: false,
      title: 'Your title',
      useBom: true,
      noDownload: false,
      headers: ["Address", "BST"]
    };
    new AngularCsv(data, 'rewards', options);
  }
  
  getLevelPercentage(level) {
    const percentages = [
      0.03,
      0.06,
      0.016,
      0.014,
      0.011,
      0.0055,
      0.0035,
      0.0025
    ];
    if(level <= 0 || level > 8) {
      return 0;
    }
    return percentages[level - 1];
  }


  /*
   0.03 +
        all8levelRefs.level2.length * 0.06 +
        all8levelRefs.level3.length * 0.016 +
        all8levelRefs.level4.length * 0.014 +
        all8levelRefs.level5.length * 0.011 +
        all8levelRefs.level6.length * 0.0055 +
        all8levelRefs.level7.length * 0.0035 +
        all8levelRefs.level8.length * 0.0025;
  */
  updateParentRewards(parentId, level) {
    if(!parentId) {
      return;
    }

    for(let i = 0; i < this.rewards.length; i++) {
      const item = this.rewards[i];
      if(item.id == parentId) {
        this.rewards[i].bst += 20000 * this.getLevelPercentage(level);
        if(item.parentId) {
          this.updateParentRewards(item.parentId, level + 1);
        }
      }
    }
  }

  calculateRewards(children) {
    for(let i = 0; i < children.length; i++) {
      const item = children[i];
      const rewardItem = {
        id: item.id,
        parentId: item.parentId,
        bst: 0,
        children: item.children.map(item => item.id)
      };
      this.rewards.push(rewardItem);
      const parentId = item.parentId;
      this.updateParentRewards(parentId, 1);
      if(item.children && item.children.length > 0) {
        this.calculateRewards(item.children);
      }
    }
  }
}
