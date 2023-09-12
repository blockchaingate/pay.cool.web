import { Injectable } from '@angular/core';
import { StorageMap } from '@ngx-pwa/local-storage';
import { TransactionItem } from '../models/transaction-item';
import {Transaction} from '../interfaces/kanban.interface';
import { Wallet } from '../models/wallet';

@Injectable()
export class StorageService {
    constructor(private storage: StorageMap) {

    }

    
    async getWallets() {
        const wallets = await this.storage.get('ecomwallets').toPromise() as Wallet[];
        return wallets;
    }   

    addTradeTransaction(tx: Transaction) {
        this.storage.watch('mytransactions').subscribe((transactions: Transaction[]) => {
            if (!transactions) {
                transactions = [];
            }
            transactions.push(tx);
            return this.storage.set('mytransactions', transactions).subscribe(() => {
            });
        });
    }

    storeRef(refAddress: string) {
        this.storage.set('customer_ref', refAddress).subscribe(ret => { });
    }

    getStoreRef() {
        return this.storage.watch('customer_ref');
    }

    storeFavoritePairs(favoritePairs: string[] ) {
        return this.storage.set('favoritePairs', favoritePairs).subscribe(() => {});
    }

    getFavoritePairs() {
        return this.storage.watch('favoritePairs');
    }   

    storeToken(token: string) {
        return this.storage.set('token', token).subscribe(() => {});
    }

    getToken() {
        return this.storage.watch('token');
    }
    
    removeToken(){
        return this.storage.delete('token').subscribe(() => {});
    }

    storeCampaignQualify() {
        return this.storage.set('campaignQualify', true).subscribe(() => {});
    }

    getCampaignQualify() {
        return this.storage.watch('campaignQualify');
    }
    
    removeCampaignQualify(){
        return this.storage.delete('campaignQualify').subscribe(() => {});
    }



    storeToTransactionHistoryList(transactionItem: TransactionItem) {
        this.getTransactionHistoryList().subscribe((transactionHistory: TransactionItem[]) => {
            if (!transactionHistory) {
                transactionHistory = [];
            }
            transactionHistory.push(transactionItem);
            return this.storage.set('transactions', transactionHistory).subscribe(() => {});
        });
    }  

    updateTransactionHistoryList(transactionItem: TransactionItem) {
        this.getTransactionHistoryList().subscribe((transactionHistory: TransactionItem[]) => {
            if (!transactionHistory) {
                transactionHistory = [];
            }
            for (let i = 0; i < transactionHistory.length; i++) {
                if (transactionHistory[i].txid === transactionItem.txid) {
                    transactionHistory[i].status = transactionItem.status;
                    break;
                }
            }
            return this.storage.set('transactions', transactionHistory).subscribe(() => {});
        });
    }     
    getTransactionHistoryList() {
        return this.storage.watch('transactions');
    }    

    getCurrentLang(){
        return this.storage.watch('Lan');
    }


}
