import { Component, ViewChild, Input, OnInit } from '@angular/core';
import { AirdropService } from '../../../services/airdrop.service';
import { HttpClient } from '@angular/common/http';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
    selector: 'get-free-fab-modal',
    templateUrl: './get-free-fab.modal.html',
    styleUrls: ['./get-free-fab.modal.scss']
})
export class GetFreeFabModal implements OnInit {
    //@ViewChild('getFreeFabModal', { static: true }) public getFreeFabModal: ModalDirective;
    address: string;
    question: string;
    questionair_id: string;
    answer: string;
    error: string;
    
    publicIP: string;
    constructor(
        private modalRef: BsModalRef,
        private airdropServ: AirdropService, 
        private http: HttpClient) {

    }

    ngOnInit() {
        this.http.get('https://api.ipify.org?format=json').toPromise().then(data => {
            this.publicIP = data['ip'];

            this.airdropServ.getQuestionair(this.address, this.publicIP).subscribe(
                (res: any) => {
                    if (res) {
                        const data = res._body;
                        if (res.ok) {
    
                            this.question = data.question;
                            this.questionair_id = data._id;
                        } else {
                            this.error = data;
                        }
    
                    }
                }
            );            
        });
    }

    onSubmit() {
        this.airdropServ.answerQuestionair(this.address, this.questionair_id, this.answer).subscribe(
            (res: any) => {
                if (res) {
                    if (res.ok) {
                        this.close();
                        //return this.alertServ.openSnackBarSuccess('Congrat, you will get free Gas shortly', 'Ok');
                    }
                    //return this.alertServ.openSnackBar(res._body, 'Ok');
                }

            }
        );
    }

    close() {
        this.modalRef.hide();
    }      
}
