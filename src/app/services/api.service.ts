import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import {Balance,  EthTransactionRes
    , FabTransactionResponse, CoinsPrice, BtcUtxo, KEthBalance, FabUtxo, EthTransactionStatusRes, GasPrice,
    FabTokenBalance, FabTransactionJson, BtcTransactionResponse, BtcTransaction} from '../interfaces/balance.interface';
import { HttpClient } from '@angular/common/http';
import { UtilService } from './util.service';

import TronWeb from 'tronweb';

const HttpProvider = TronWeb.providers.HttpProvider;
const fullNode = new HttpProvider(environment.chains.TRX.fullNode);
const solidityNode = new HttpProvider(environment.chains.TRX.solidityNode);
const eventServer = new HttpProvider(environment.chains.TRX.eventServer);
const ADDRESS_PREFIX_REGEX = /^(41)/;

const tronWeb = new TronWeb(
    fullNode,
    solidityNode,
    eventServer
);

@Injectable({ providedIn: 'root' })
export class ApiService {
    constructor(private http: HttpClient, private utilServ: UtilService) {}

    async getTrxTransactionStatus(txid: string) {
        const transactionInfo = await tronWeb.trx.getTransactionInfo(txid);
        if(transactionInfo && transactionInfo.receipt) {
            if(transactionInfo.receipt.result == 'SUCCESS') {
                return 'confirmed';
            } 
            return 'failed';
        }
        return 'pending';
    }
        
    async getBtcUtxos(address: string): Promise<[BtcUtxo]> {
        const url = environment.endpoints.BTC.exchangily + 'getutxos/' + address;

        let response = null;
        try {
            response = await this.http.get(url).toPromise() as [BtcUtxo];
        } catch (e) {}
        return response;
    }

    getEthTransactionStatusSync(txid: string) {
        const url = environment.endpoints.ETH.exchangily + 'gettransactionstatus/' + txid;
        return this.http.get(url);
    }

    getFabTransactionJsonSync(txid: string) {
        txid = this.utilServ.stripHexPrefix(txid);
        const url = environment.endpoints.FAB.exchangily + 'gettransactionjson/' + txid;
        return this.http.get(url);
    }  
     
    getEthTransactionSync(txid: string) {
        const url = environment.endpoints.ETH.exchangily + 'gettransaction/' + txid;
        return this.http.get(url);
    }
    
    getBtcTransactionSync(txid: string) {
        txid = this.utilServ.stripHexPrefix(txid);
        const url = environment.endpoints.BTC.exchangily + 'gettransactionjson/' + txid;
        return this.http.get(url);        
    }

    getEpayHash(paymentAmount: number, paymentUnit: string) {
        const url = environment.endpoints.blockchaingate + 'epay/hash/' + paymentAmount + '/' + paymentUnit;
        return this.http.get(url);       
    }

    chargeOrder(orderID, txhex: string) {
        const url = environment.endpoints.blockchaingate + 'orders/' + orderID + '/charge' ;

        const data = {
            rawTransaction: txhex
        };   
        
        return this.http.post(url, data);
    }

    validate7starOrder(address: string, txid: string) {
        const url = environment.endpoints.blockchaingate + 'bindpay/validate/' + address + '/' + txid;
        const data = {
            address,
            txid
        };
        return this.http.post(url, data);

    }
    getTransactionHistoryEvents(data) {
        const url = environment.endpoints.kanban + 'getTransactionHistoryEvents';
        return this.http.post(url, data);
    }  
      
    async postTx(coin, txHex: string) {
        let txHash = '';
        let errMsg = '';
        const url = environment.endpoints[coin].exchangily + 'postrawtransaction';
        let response = null;
 
        const data = {
         rawtx: txHex
        };
 
        try {
             if (txHex) {
                 response = await this.http.post(url, data).toPromise() as BtcTransactionResponse;
             }
             if (response && response.txid) {
             txHash = '0x' + response.txid;
             }
        } catch (err) {
             if (err.error && err.error.Error) {
             errMsg = err.error.Error;
            }
        }
 
        //return ret;
        return {txHash, errMsg};
     }

    async postBchTx(txHex: string) {
        let txHash = '';
        let errMsg = '';
        const url = environment.endpoints.BCH.exchangily + 'postrawtransaction';
        let response = null;
 
        const data = {
         rawtx: txHex
        };
 
        try {
             if (txHex) {
                 response = await this.http.post(url, data).toPromise() as BtcTransactionResponse;
             }
             if (response && response.txid) {
             txHash = '0x' + response.txid;
             }
        } catch (err) {
             if (err.error && err.error.Error) {
             errMsg = err.error.Error;
            }
        }
 
        //return ret;
        return {txHash, errMsg};
     }

     async getEthNonce (address: string) {
        const url = environment.endpoints.ETH.exchangily + 'getnonce/' + address + '/latest';
        const response = await this.http.get(url).toPromise() as string;
        return Number (response);
    }

    async postEthTx(txHex: string) {

        let txHash = '';
        let errMsg = '';
        const url = environment.endpoints.ETH.exchangily + 'sendsignedtransaction';
        const data = {
            signedtx: txHex
        };
        if (txHex) {
            try {
                txHash = await this.http.post(url, data, {responseType: 'text'}).toPromise() as string;
            } catch (err) {
                if (err.error) {
                 errMsg = err.error;
                }
 
            }          
        }    

        return {txHash, errMsg};
    }

     async postDogeTx(txHex: string) {
        let txHash = '';
        let errMsg = '';
        const url = environment.endpoints.DOGE.exchangily + 'postrawtransaction';
        let response = null;
 
        const data = {
         rawtx: txHex
        };
 
        try {
             if (txHex) {
                 response = await this.http.post(url, data).toPromise() as BtcTransactionResponse;
             }
             if (response && response.txid) {
             txHash = '0x' + response.txid;
             }
        } catch (err) {
             if (err.error && err.error.Error) {
             errMsg = err.error.Error;
            }
        }
 
        return {txHash, errMsg};
     }

     async postFabTx(txHex: string) {
        

       const url = environment.endpoints.FAB.exchangily + 'postrawtransaction';

       let txHash = '';
       let errMsg = '';
       const data = {
        rawtx: txHex
       };
       if (txHex) {
           try {
            const json = await this.http.post(url, data).toPromise() as FabTransactionResponse;

            if (json) {
                if (json.txid) {
                    txHash = json.txid;
                } else 
                if (json.Error) {
                    errMsg = json.Error;
                } 
            }
           } catch (err) {
               if (err.error && err.error.Error) {
                errMsg = err.error.Error;
               }

           }

       }       

       return {txHash, errMsg};
    }

     async getFabUtxos(address: string): Promise<[FabUtxo]> {
        const url = environment.endpoints.FAB.exchangily + 'getutxos/' + address;
        const response = await this.http.get(url).toPromise() as [FabUtxo];
        return response;
    }

     async postLtcTx(txHex: string) {
        let txHash = '';
        let errMsg = '';
        const url = environment.endpoints.LTC.exchangily + 'postrawtransaction';
        let response = null;
 
        const data = {
         rawtx: txHex
        };
 
        try {
             if (txHex) {
                 response = await this.http.post(url, data).toPromise() as BtcTransactionResponse;
             }
             if (response && response.txid) {
             txHash = '0x' + response.txid;
             }
        } catch (err) {
             if (err.error && err.error.Error) {
             errMsg = err.error.Error;
            }
        }
 
        //return ret;
        return {txHash, errMsg};
     }   

    async getUtxos(coin: string, address: string): Promise<[BtcUtxo]> {
        const url = environment.endpoints[coin].exchangily + 'getutxos/' + address;
        
        let response = null;
        try {
            response = await this.http.get(url).toPromise() as [BtcUtxo];
        } catch (e) {}
        return response;
    }

    async getBchUtxos(address: string): Promise<[BtcUtxo]> {
        const url = environment.endpoints.BCH.exchangily + 'getutxos/' + address;

        let response = null;
        try {
            response = await this.http.get(url).toPromise() as [BtcUtxo];
        } catch (e) {}
        return response;
    }    
}