import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { PasswordModalComponent } from '../../../shared/modals/password-modal/password-modal.component';
import { ToastrService } from 'ngx-toastr';
import { DataService } from 'src/app/services/data.service';
import { ProjectService } from 'src/app/services/project.service';
import { CoinService } from 'src/app/services/coin.service';
import { KanbanService } from 'src/app/services/kanban.service';
@Component({
  selector: 'app-project-package-edit',
  templateUrl: './project-package-edit.component.html',
  styleUrls: ['./project-package-edit.component.scss']
})
export class ProjectPackageEditComponent implements OnInit {
  id: string;
  selectedUSDC: boolean;
  selectedUSDT: boolean;
  selectedDUSD: boolean;
  images: any;
  projectId: string;
  name: string;
  value: number;
  nameChinese: string;
  description: string;
  descriptionChinese: string;
  wallet: any;
  modalRef: BsModalRef;

  constructor(
    private router: Router,
    private dataServ: DataService,
    private toastr: ToastrService,
    private route: ActivatedRoute,
    private projectServ: ProjectService,
    private modalService: BsModalService,
    private coinServ: CoinService,
    private kanbanServ: KanbanService
  ) { }

  ngOnInit(): void {
    this.selectedUSDC = false;
    this.selectedUSDT = false;
    this.selectedDUSD = false;
    this.dataServ.currentWallet.subscribe(
      (wallet: any) => {
        this.wallet = wallet;
      }
    ); 

    this.route.paramMap.subscribe(
      (param: ParamMap) => {
        const id = param.get('id');
        this.id = id;
        this.projectServ.getProjectPackage(id).subscribe(
          (project: any) => {
            if(project) {
              if(project.image) {
                this.images = [project.image];
              }
              if(project.name) {
                this.name = project.name.en;
                this.nameChinese = project.name.sc;
              }
              if(project.description) {
                this.description = project.description.en;
                this.descriptionChinese = project.description.sc;
              }
              this.value = project.value;
              if(project.coins.indexOf('USDT') >= 0) {
                this.selectedUSDT = true;
              }
              if(project.coins.indexOf('DUSD') >= 0) {
                this.selectedDUSD = true;
              }
              if(project.coins.indexOf('USDC') >= 0) {
                this.selectedUSDC = true;
              }
            }
          }
        );
      }
    );
  }

  confirm() {
    const initialState = {
      pwdHash: this.wallet.pwdHash,
      encryptedSeed: this.wallet.encryptedSeed
    };          
    if(!this.wallet || !this.wallet.pwdHash) {
      this.router.navigate(['/wallet']);
      return;
    }
    this.modalRef = this.modalService.show(PasswordModalComponent, { initialState });

    this.modalRef.content.onClose.subscribe( (seed: Buffer) => {
      this.addProjectPackageDo(seed);
    });
  }

  addProjectPackageDo(seed: Buffer) {


    const data = {
      id: this.projectId,
      name: {
        en: this.name,
        sc: this.nameChinese
      },
      description: {
        en: this.description,
        sc: this.descriptionChinese
      },
      value: this.value
    }

    if(this.images && (this.images.length > 0)) {
      data['image'] = this.images[0];
    }
    const coins = [];
    if(this.selectedDUSD) {
      coins.push('DUSD');
    }
    if(this.selectedUSDC) {
      coins.push('USDC');
    }
    if(this.selectedUSDT) {
      coins.push('USDT');
    }
    data['coins'] = coins;
    const keyPair = this.coinServ.getKeyPairs('FAB', seed, 0, 0, 'b');
    const privateKey = keyPair.privateKeyBuffer.privateKey;
    const sig = this.kanbanServ.signJsonData(privateKey, data);
    data['sig'] = sig.signature;  

    this.projectServ.updateProjectPackage(this.id, data).subscribe(
      async (res: any) => {
        if(res && res._id) {
          this.toastr.success('project package was updated successfully');
          this.router.navigate(['/admin/project-packages']);
        } else {
          this.toastr.error('Error while updating project package');
        }
      }
    );

  }

}
