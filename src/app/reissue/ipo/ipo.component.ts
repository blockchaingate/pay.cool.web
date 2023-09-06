import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { PayRewardService } from 'src/app/services/payreward.service';

@Component({
  selector: 'app-ipo',
  templateUrl: './ipo.component.html',
  styleUrls: ['./ipo.component.scss']
})
export class IpoComponent implements OnInit {
  user: string;
  liquidity: number;
  amount: number;


  
  constructor(
    private toastr: ToastrService,
    private payrewardServ: PayRewardService) { }

  ngOnInit(): void {

  }

  
  submit() {
    this.payrewardServ.createIpo(this.user, this.amount, this.liquidity).subscribe(
      (ret: any) => {
        this.toastr.success('data was created');
      }
    );
  }
  

  changeListenerEvent(event: any) {
    const files = event.target.files;
    this.changeListener(files);
  }

  changeListener(files: FileList){
    if(files && files.length > 0) {
      let file : File = files.item(0); 

      let reader: FileReader = new FileReader();
      reader.readAsText(file);
      reader.onload = (e) => {
          let csv: string = reader.result as string;

          const list = csv.split('\n');
          const headers = list[0].split(',');
          if((headers[0] != 'User') && (headers[0] != 'user')) {
              this.toastr.error('File format error');
              return;
          }
          const ipos = [];
          for(let i = 1; i < list.length; i++) {
            const item = list[i];

            
            if(!item) {
                continue;
            }
            
            const data = item.split(',');
            
            if(!data || (data.length < 2)) {
                continue;
            }
            const ipo = {
              user: data[0].trim(),
              amount: data[1].trim(),
              liquidity: data[2].trim()
            };
            ipos.push(ipo);
          }
          this.payrewardServ.createIpos(ipos).subscribe(
            (ret: any) => {
              this.toastr.success('data was updated');
            }
          );
        }
      }
    }

    recalculateRewards() {
      this.payrewardServ.recalculateIpoRewards().subscribe(
        (ret: any) => {
          this.toastr.success('recalculated');
        }
      );
    }
}
