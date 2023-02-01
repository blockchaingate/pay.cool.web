import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpService } from './http.service';
import { HttpHeaders } from '@angular/common/http';
import { KanbanGetBanalceResponse, KanbanNonceResponse, DepositStatusResp, TransactionAccountResponse } from '../interfaces/kanban.interface';
import { UtilService } from './util.service';
import { Web3Service } from './web3.service';
import BigNumber from 'bignumber.js';
import Common from 'ethereumjs-common';
import * as Eth from 'ethereumjs-tx';

@Injectable({ providedIn: 'root' })
export class KanbanService {
    baseUrl = environment.endpoints.kanban;

    constructor(private utilServ: UtilService, private web3Serv: Web3Service, private http: HttpService) {
    }

    async kanbanCallAsync(to: string, abiData: string) {
        const res = await this.kanbanCall(to, abiData).toPromise();
        return res;
    }
    
    decode(txid: string) {
        const path = environment.endpoints.blockchaingate + 'kanban/decode/' + txid;
        return this.http.getRaw(path);
    }
    
    getTransactionReceipt(txid: string) {
        const path = this.baseUrl + 'kanban/gettransactionreceipt/' + txid;
        return this.http.getRaw(path);
    }
    signJsonData(privateKey: any, data: any) {

        var queryString = Object.keys(data).filter((k) => (data[k] != null) && (data[k] != undefined))
        .map(key => key + '=' + (typeof data[key] === 'string' ? data[key] : JSON.stringify(data[key]))).sort().join('&');

        console.log('queryString===', queryString);
        //const test = this.web3Serv.signMessageTest(queryString, privateKey);
        const signature = this.web3Serv.signKanbanMessageWithPrivateKey(queryString, privateKey);
        //console.log('signature here=', signature);
        return signature;  
    }

    kanbanCall(to: string, abihex: string) {

        
        const data = {
          transactionOptions: {
              to,
              data: abihex
          }
        };          
        const path = this.baseUrl + 'kanban/call';
        return this.http.postRaw(path, data);
    }

    async seedGas(fromPrivateKey: Buffer, fromAddress: string, toAddress: string, amount: number) {
        let gasPrice = environment.chains.KANBAN.gasPrice;
        let gasLimit = 8000000;
        const nonce = await this.getTransactionCount(this.utilServ.fabToExgAddress(fromAddress));
    
        const txObject = {
            to: this.utilServ.fabToExgAddress(toAddress),
            nonce: nonce,
            value: '0x' + new BigNumber(amount).shiftedBy(18).toString(16),
            gas: gasLimit,
            gasPrice: gasPrice // in wei     
        };
        
        let txhex = '';
    
    
        const customCommon = Common.forCustomChain(
          environment.chains.ETH.chain,
          {
            name: environment.chains.KANBAN.chain.name,
            networkId: environment.chains.KANBAN.chain.networkId,
            chainId: environment.chains.KANBAN.chain.chainId
          },
          environment.chains.ETH.hardfork,
        );
        const tx = new Eth.Transaction(txObject, { common: customCommon });
    
        tx.sign(fromPrivateKey);
        const serializedTx = tx.serialize();
        txhex = '0x' + serializedTx.toString('hex');    
        const resp = await this.sendRawSignedTransactionPromise(txhex);
        return resp; 
    }

    async sendRawSignedTransactionPromise(txhex: string) {
        const url = environment.endpoints.api + 'kanban/v2/sendRawTransactionPromise' ;
        //const url = this.baseUrl + 'kanban/sendRawTransaction';
        const data = {
            signedTransactionData: txhex,
        };
        let resp;
        try {
            resp = await this.http.postRaw(url, data).toPromise();
        } catch (e) {
        }

        return resp;
      }
    
    getKanbanBalance(address: string) {
        const path = this.baseUrl + 'kanban/getBalance/' + address;
        // console.log('path1=' + path);
        return this.http.getRaw(path);
    }    

    submitDeposit(rawTransaction: string, rawKanbanTransaction: string) {
        const data = {
            'rawTransaction': rawTransaction,
            'rawKanbanTransaction': rawKanbanTransaction
        };
        const httpHeaders = new HttpHeaders({
            'Content-Type': 'application/json',
            'Cache-Control': 'no-cache'
        });
        const options = {
            headers: httpHeaders
        };
        // console.log('data for submitDeposit=', data);       
        const path = this.baseUrl + 'submitDeposit';
        return this.http.postRaw(path, data, options);
    }

    sendRawSignedTransaction(txhex: string) {
        const data = {
            signedTransactionData: txhex
        };
        return this.http.postRaw(this.baseUrl + 'kanban/sendRawTransaction', data);
    }

    async getCoinPoolAddress() {
        const headers = new HttpHeaders().set('Content-Type', 'text/plain; charset=utf-8');
        let path = 'exchangily/getCoinPoolAddress';
        path = this.baseUrl + path;
        let addr = '';
        try {
            addr = await this.http.getRaw(path, { headers, responseType: 'text' }).toPromise() as string;
        } catch (e) {
        }

        return addr;
    }

    async getRecordAddress() {
        const headers = new HttpHeaders().set('Content-Type', 'text/plain; charset=utf-8');
        let path = 'ecombar/getIddockAddress'; 
        path = this.baseUrl + path;
        // console.log('nouse in here:', path);
        const res = await this.http.getRaw(path, { headers, responseType: 'text' }).toPromise() as string;
        return res;
    }
    
    async getTransactionCount(address: string) {
        //return this.getNonce(address);

        let path = 'kanban/getTransactionCount/' + address; 
        path = this.baseUrl + path;
        // console.log('nouse in here:', path);
        const res = await this.http.getRaw(path).toPromise() as TransactionAccountResponse;
        return res.transactionCount;

    }

    getExchangeBalance(address) {
        const path = this.baseUrl + 'exchangily/getBalances/' + address;
        return this.http.getRaw(path);        
    }

    async getScarAddress() {
        const headers = new HttpHeaders().set('Content-Type', 'text/plain; charset=utf-8');
        let path = 'kanban/getScarAddress';
        path = this.baseUrl + path;
        const addr = await this.http.getRaw(path, { headers, responseType: 'text' }).toPromise() as string;
        return addr;
    }

    getBalance(address: string) {
        const url = 'exchangily/getBalances/' + address;
        return this.http.getRaw(this.baseUrl + url);
    }

    getTransactionStatusSync(txid: string) {
        return this.http.get(this.baseUrl + 'kanban/getTransactionReceipt/' + txid);
    }

    getDepositStatusSync(txid: string) {
        txid = this.utilServ.stripHexPrefix(txid);
        return this.http.get(this.baseUrl + 'checkstatus/' + txid);
    }    

    getOrdersByAddressStatus(address: string, status: string, start: number = 0, count: number = 200) {
        let path = 'ordersbyaddresspaged/' + address + '/' + start + '/' + count + '/' + status;
        path = environment.endpoints.kanban + path;
        console.log('path for getOrdersByAddress=' + path);
        const res = this.http.get(path);
        return res;
    }

    getWalletBalances(addresses: any) {
        let btcAddress = '';
        let ethAddress = '';
        let fabAddress = '';
        let bchAddress = '';
        let dogeAddress = '';
        let ltcAddress = '';
        let trxAddress = '';

        for(let i=0;i<addresses.length;i++) {
            const addr = addresses[i];
            if(addr.name == 'BTC') {
                btcAddress = addr.address;
            } else 
            if(addr.name == 'ETH') {
                ethAddress = addr.address;
            } else 
            if(addr.name == 'FAB') {
                fabAddress = addr.address;
            } else  
            if(addr.name == 'BCH') {
                bchAddress = addr.address;
            } else  
            if(addr.name == 'DOGE') {
                dogeAddress = addr.address;
            } else   
            if(addr.name == 'LTC') {
                ltcAddress = addr.address;
            }  else   
            if(addr.name == 'TRX') {
                trxAddress = addr.address;
            }                                            
        }
        const data = {
            btcAddress: btcAddress,
            ethAddress: ethAddress,
            fabAddress: fabAddress,
            bchAddress: bchAddress,
            dogeAddress: dogeAddress,
            ltcAddress: ltcAddress,
            trxAddress: trxAddress
        }

        const url = this.baseUrl + 'walletBalances';
        return this.http.postRaw(url, data, {});
    }

    // Get a pair last price, pair should be in BTC_USDT format.
    getTiker() {
        const url = 'publicapi/ticker';
        return this.http.getAbsoluteUrl(this.baseUrl + url).toPromise();
    }
}