import { Injectable } from '@angular/core';
import { HttpService } from './http.service';
import { KanbanSmartContractService } from './kanban.smartcontract.service';
import { Web3Service } from './web3.service';

@Injectable()
export class OrderService {
    constructor(
        private http: HttpService, 
        private kanbanSmartContractServ: KanbanSmartContractService,
        private web3Serv: Web3Service) { }
    get7StarPayments() {
        const path = 'orders/7StarOrder';
        return this.http.get(path, false);
    }
    
    getOrderByCode(code) {
        const path = 'orders/code/' + code;
        return this.http.get(path, false);
    }

    get7StarPaymentDetails(id: string) {
        const path = 'orders/7StarOrder/' + id;
        return this.http.get(path, false);
    }
    set7StarPaymentFinished(id: string) {
        const path = 'orders/7StarOrder/' + id + '/finished';
        return this.http.get(path, false);
    }
    payOrder(privateKey, address, feeChargerSmartContractAddress, num, parents, coinTypeId, totalSale, totalTax) {
        const abiHex = this.web3Serv.getChargeFundsWithFeeABI(num, parents, coinTypeId, totalSale, totalTax);
        const res = this.kanbanSmartContractServ.execSmartContractAbiHexFromPrivateKey(privateKey, address, feeChargerSmartContractAddress, abiHex, 8000000);
        return res;
    }
    getRefund(orderID: string) {
        return this.http.get('orders/' + orderID + '/7starpay/refund', false);
    }
    requestRefund(id, data) {
        return this.http.post('orders/' + id + '/requestRefund',  data, false);
    }

    get(orderID: string) {
        return this.http.get('orders/public/' + orderID, false);
    }
    
    cancelrequestRefundV2(data: any) {
        return this.http.post('orders/cancelrequestRefundV2', data, false);
    }
}