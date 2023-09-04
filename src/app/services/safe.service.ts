import { Injectable } from '@angular/core';
import { SafeFactory } from '@safe-global/safe-core-sdk';
import type { PredictSafeProps } from '@safe-global/safe-core-sdk/dist/src/safeFactory'
import {createEthersAdapter } from '../hooks/coreSDK/safeCoreSDK';
import { Observable } from 'rxjs';
var Web3 = require('web3');
import { ethers } from 'ethers';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Web3Service } from './web3.service';
@Injectable()
export class SafeService {

    constructor(private http: HttpClient, private web3Serv: Web3Service) {}
    signTransaction(chain: string, privateKey: Buffer, nonce: number, to: string, tokenId: string, decimals: number, amount: number) {
        
        const observable = new Observable((observer) => {
            const url = environment.endpoints.blockchain + 'multisig/getTransactionHash';
            const body = {
                chain,
                nonce,
                to,
                tokenId,
                amount,
                decimals,
                address: environment.chains[chain].Safes.SafeL2
            }
            this.http.post(url, body).subscribe(
                (ret: any) => {
                    if(ret.success) {
                        const data = ret.data;
                        const transactionHash = data.hash;
                        const transaction = data.transaction;
                        const signature = this.web3Serv.signMessageWithPrivateKeyBuffer(transactionHash, privateKey);

                        observer.next({transaction, transactionHash, signature: signature.signature});
                    } else {
                        observer.error('cannot get transaction hash');
                    }
                }
            );
            /*
            const transactionData = {
                to: to,
                value: '0x' + new BigNumber(amount).toString(16),
                data: '0x',
                operation: 0,
                baseGas: '0',
                gasPrice: '0',
                gasToken: '0x0000000000000000000000000000000000000000',
                refundReceiver: '0x0000000000000000000000000000000000000000',
                nonce,
                safeTxGas: '0'
            };
            */
           /*
            const abi = {"inputs":[{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"value","type":"uint256"},{"internalType":"bytes",
            "name":"data","type":"bytes"},{"internalType":"enum Enum.Operation","name":"operation","type":"uint8"},
            {"internalType":"uint256","name":"safeTxGas","type":"uint256"},{"internalType":"uint256","name":"baseGas",
            "type":"uint256"},{"internalType":"uint256","name":"gasPrice","type":"uint256"},{"internalType":"address","name":
            "gasToken","type":"address"},{"internalType":"address","name":"refundReceiver","type":"address"},{"internalType"
            :"uint256","name":"_nonce","type":"uint256"}],"name":"getTransactionHash",
            "outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"stateMutability":"view","type":"function"};
            */

        });
        return observable;
    }

    async predictSafeAddress (chain: string, props: PredictSafeProps)  {

        const provider = new ethers.providers.Web3Provider(new Web3.providers.HttpProvider('http://localhost:8545'));
        console.log('provider=', provider);
        const ethAdapter = createEthersAdapter(provider);
        const safeFactory = await SafeFactory.create({ ethAdapter })
        return safeFactory.predictSafeAddress(props)

    }

}