import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Web3Service } from './web3.service';

@Injectable()
export class UserpayService {
   constructor(
      private web3Serv: Web3Service,
      private http: HttpClient) { }

   getCampaigns() {
      const url = environment.endpoints.blockchaingate + 'campaigns';
      return this.http.get(url);
   }

   async createOrderFromTemplatePromise(templateId: string): Promise<any> {
      const url = environment.endpoints.api + 'userpay/createOrderFromTemplate';
      const body = {
         id: templateId
      }

      return await this.http.post(url, body).toPromise();
   }

   async createOrderFromAddressPromise(address: string, amount: number): Promise<any> {
      const url = environment.endpoints.api + 'userpay/createOrderFromAddress';
      const body = {
         address,
         amount
      }

      return await this.http.post(url, body).toPromise();
   }

   getReissueSummary() {
      const url = environment.endpoints.blockchaingate + '7star-charge-fund/reissue/summary';
      return this.http.get(url);
   }

   get7StarMerchantCredits() {
      const url = environment.endpoints.blockchaingate + '7star-merchant-credit';
      return this.http.get(url);
   }
   
   getStarChargeFunds(pageNum: number, pageSize: number) {
      const url = environment.endpoints.blockchaingate + '7star-charge-fund/regular/' + pageNum + '/' + pageSize;
      return this.http.get(url);
   }

   get7StarCustomerByAddress(from) {
      const url = environment.endpoints.blockchaingate + '7star-customer/address/' + from;
      return this.http.get(url);
   }

   getCoinValue(coinType: number, block: string) {
      const url = environment.endpoints.kanban + 'kanban/call';
      const abi = {
         "inputs": [
            {
               "internalType": "uint32",
               "name": "_token",
               "type": "uint32"
            }
         ],
         "name": "getExchangeRate",
         "outputs": [
            {
               "internalType": "uint256",
               "name": "",
               "type": "uint256"
            }
         ],
         "stateMutability": "view",
         "type": "function"
      };
      const args = [coinType];
      const abihex = this.web3Serv.getGeneralFunctionABI(abi, args);
      const data = {
         transactionOptions:{
            to: environment.addresses.smartContract.exchangeRate2,
            data: abihex
         },
         defaultBlock: block
      }

      return this.http.post(url, data);
   }

   getStarCustomers() {
      const url = environment.endpoints.blockchaingate + '7star-customer';
      return this.http.get(url);
   }
   
   getOrderVersion(id: string) {
      const url = environment.endpoints.blockchaingate + '7star-charge-fund/' + id + '/version';
      return this.http.get(url);
   }

   getStarChargeFundFromCredits() {
      const url = environment.endpoints.blockchaingate + '7star-charge-fund/from-credit';
      return this.http.get(url);
   }

   getRewardsByOrderId(orderId: string) {
      const url = environment.endpoints.blockchaingate + '7star-locker/orderId/' + orderId;
      return this.http.get(url);      
   }

   get7StarMerchantCreditsByStore(storeId: string) {
      const url = environment.endpoints.blockchaingate + '7star-merchant-credit/store/' + storeId;
      return this.http.get(url);
   }
   
   createOrder(item: any) {
      const url = environment.endpoints.blockchaingate + '7star-order/create';
      return this.http.post(url, item);
   }

   getOrder(id: string) {
      const url = environment.endpoints.blockchaingate + '7star-order/' + id;
      return this.http.get(url);
   }

   getOrdersByAddress(address: string) {
      const url = environment.endpoints.blockchaingate + '7star-order/address/' + address;
      return this.http.get(url);
   }

   getOrderByAddressCampaignId(address: string, campaignId: number) {
      const url = environment.endpoints.blockchaingate + '7star-order/address-campaign/' + address + '/' + campaignId;
      return this.http.get(url);
   }

   // Get many orders
   getOrdersByWalletAddress(address: string) {
      const url = environment.endpoints.blockchaingate + '7star-order/wallet/' + address;
      return this.http.get(url);
   }


   getVipTree() {
      const url = environment.endpoints.blockchaingate + '7star-ref/vips';
      return this.http.get(url);
   }

   createRef(data: any) {
      const url = environment.endpoints.blockchaingate + '7star-ref/create';
      return this.http.post(url, data);
   }



   getParents(address: string) {
      const url = environment.endpoints.blockchaingate + '7star-ref/parents/' + address;
      return this.http.get(url);
   }

   getPaycoolRewardInfoWithPayType(id: string, address: string, payType: string) {
      const url = environment.endpoints.api + 'userpay/order/' + id + '/' + address + '/rewardInfo/' + payType;
      return this.http.get(url);
   }

   getPaycoolRewardInfo(id: string, address: string) {
      const url = environment.endpoints.api + 'userpay/order/' + id + '/' + address + '/rewardInfo';
      return this.http.get(url);
   }

   getOrderByCode(code: string) {
      const url = environment.endpoints.api + 'userpay/order/code/' + code;
      return this.http.get(url);
   }

   getAllFiatOrders(pageSize: number, pageNum: number) {
      const url = environment.endpoints.api + 'userpay/fiat-order/' + pageSize + '/' + pageNum;
      return this.http.get(url);
   }

   claimReward(code: string, address: string) {
      const data = {
         code,
         address
      };
      const url = environment.endpoints.api + 'userpay/order/claim';
      return this.http.post(url, data);
   }

   ///order/:id/:address/rewardInfo

   async get7StarPayOrderPromise(id: string, address: string): Promise<any> {
      const url = environment.endpoints.blockchaingate + 'orders/' + id + '/7starpay';
      const data = {
         address
      };
      return this.http.post(url, data).toPromise();
   }

   getLockers(fabAddress: string) {
      const url = environment.endpoints.blockchaingate + '7star-locker/ownedBy/' + fabAddress;
      
      return this.http.get(url);      
   }

   transferLockersOwnership(address: string, id: string) {
      const url = environment.endpoints.api + 'payreward/transfer/' + id + '/' + address;
      return this.http.get(url);      
   }

   getAgents(address: string) {
      const url = environment.endpoints.blockchaingate + '7star-agent/smartContractAdd/' + address;
      return this.http.get(url);
   }

   getTransactionHisotryForCustomer(walletAddress: string) {
      const path = environment.endpoints.blockchaingate + '7star-charge-fund/customer/' + walletAddress;
      const res = this.http.get(path);
      return res;
   }

   getTransactionHisotryForMerchant(walletAddress: string) {
      const path = environment.endpoints.blockchaingate + '7star-charge-fund/merchant/' + walletAddress;
      const res = this.http.get(path);
      return res;
   }

   savePayment(address: string, txid: string) {
      const data = {
         address,
         txid
      };
      const url = environment.endpoints.blockchaingate + '7star-ref/savePayment';
      return this.http.post(url, data);
   }

   isContractOwner(address: string) {
      const url = environment.endpoints.blockchaingate + '7star-ref/isContractOwner/' + address;
      return this.http.get(url);
   }

   getPayment(id: string) {
      const url = environment.endpoints.blockchaingate + '7star-payment/order/' + id;
      return this.http.get(url);
   }

   changeOrderStatus(id: string, status: number) {
      const url = environment.endpoints.blockchaingate + '7star-order/update';
      const body = {
         id: id,
         status: status
      }
      return this.http.post(url, body);
   }

   changePaymentStatus(payment_id: string, status: number) {
      const url = environment.endpoints.blockchaingate + '7star-payment/update';
      const body = {
         id: payment_id,
         status: status
      }
      return this.http.post(url, body);
   }

   addPayment(orderId: string, paymentMethod: string, amount: number, txid: string) {
      const item = {
         orderId: orderId,
         amount: amount,
         paymentMethod: paymentMethod,
         transactionId: txid
      };
      const url = environment.endpoints.blockchaingate + '7star-payment/create';
      return this.http.post(url, item);
   }
   /*
    orderId: { type: Schema.Types.ObjectId, ref: 'StarOrder' },
    amount: Number,
    paymentMethod: String,
    transactionId: {
        type: String,
        unique: true
    },
   */
}

