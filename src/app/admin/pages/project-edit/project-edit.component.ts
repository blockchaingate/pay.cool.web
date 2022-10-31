import { Component, OnInit } from '@angular/core';
import { ProjectService } from 'src/app/services/project.service';
import { ActivatedRoute, Router, ParamMap } from '@angular/router';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { PasswordModalComponent } from '../../../shared/modals/password-modal/password-modal.component';
import { DataService } from 'src/app/services/data.service';
import { CoinService } from 'src/app/services/coin.service';
import { KanbanService } from 'src/app/services/kanban.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-project-edit',
  templateUrl: './project-edit.component.html',
  styleUrls: ['./project-edit.component.scss']
})
export class ProjectEditComponent implements OnInit {
  id: string;
  images: any;
  projectId: string;
  name: string;
  nameChinese: string;
  description: string;
  descriptionChinese: string;
  kvalue: number;
  wallet: any;
  modalRef: BsModalRef;
  constructor(
    private router: Router,
    private modalService: BsModalService,
    private dataServ: DataService,
    private route: ActivatedRoute,
    private toastr: ToastrService,
    private coinServ: CoinService,
    private kanbanServ: KanbanService,
    private projectServ: ProjectService) { }

  ngOnInit(): void {
    this.dataServ.currentWallet.subscribe(
      (wallet: any) => {
        this.wallet = wallet;
      }
    ); 
    this.route.paramMap.subscribe(
      (param: ParamMap) => {
        const id = param.get('id');
        this.id = id;
        this.projectServ.getProject(id).subscribe(
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
              if(project.kvalue) {
                this.kvalue = project.kvalue;
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
      this.updateProjectDo(seed);
    });
  }

  updateProjectDo(seed: Buffer) {
    const data = {
      name: {
        en: this.name,
        sc: this.nameChinese
      },
      description: {
        en: this.description,
        sc: this.descriptionChinese
      },
      kvalue: this.kvalue
    }

    if(this.images && (this.images.length > 0)) {
      data['image'] = this.images[0];
    }
    const keyPair = this.coinServ.getKeyPairs('FAB', seed, 0, 0, 'b');
    const privateKey = keyPair.privateKeyBuffer.privateKey;
    const sig = this.kanbanServ.signJsonData(privateKey, data);
    data['sig'] = sig.signature;  

    this.projectServ.updateProject(this.id, data).subscribe(
      async (res: any) => {
        if(res && res._id) {
          this.toastr.success('project was updated successfully');
          this.router.navigate(['/admin/projects']);
        } else {
          this.toastr.error('Error while adding project');
        }
      });
  }
}
