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
import BigNumber from 'bignumber.js';
@Injectable()
export class SafeService {

    constructor(
        private http: HttpClient, 
        private web3Serv: Web3Service) {}

    executeTransaction(chain: string, privateKey: Buffer, addressHex: string, proposal: any) {
        const observable = new Observable((observer) => {
            const url = environment.endpoints.blockchain + chain.toLowerCase() + '/nonce';
            const body = {
                native: addressHex
            };
            this.http.post(url, body).subscribe(
                {
                    next: (ret: any) => {
                        if(ret && ret.success) {
                            const nonce = ret.data;

                            const abi = {
                                "inputs":[
                                    {"internalType":"address","name":"to","type":"address"},
                                    {"internalType":"uint256","name":"value","type":"uint256"},
                                    {"internalType":"bytes","name":"data","type":"bytes"},
                                    {"internalType":"enum Enum.Operation","name":"operation","type":"uint8"},
                                    {"internalType":"uint256","name":"safeTxGas","type":"uint256"},
                                    {"internalType":"uint256","name":"baseGas","type":"uint256"},
                                    {"internalType":"uint256","name":"gasPrice","type":"uint256"},
                                    {"internalType":"address","name":"gasToken","type":"address"},
                                    {"internalType":"address payable","name":"refundReceiver","type":"address"},
                                    {"internalType":"bytes","name":"signatures","type":"bytes"}
                                ],"name":"execTransaction","outputs":[{"internalType":"bool","name":"success","type":"bool"}],"stateMutability":"payable","type":"function"};
                            const transaction = proposal.transaction;
                
                            let signatures = '0x';
                            
                            let signaturesArray = proposal.signatures;
                            console.log('signaturesArray before sort=', signaturesArray);
                            signaturesArray = signaturesArray.sort((a, b) => a.signer > b.signer ? 1 : -1);
                            console.log('signaturesArray after sort=', signaturesArray);
                            for(let i = 0; i < signaturesArray.length; i++) {
                                const signature = signaturesArray[i];
                                signatures += signature.data.substring(2);
                            }
                            const args = [
                                transaction.to, 
                                transaction.value, 
                                transaction.data, 
                                transaction.operation,
                                transaction.safeTxGas,
                                transaction.baseGas,
                                transaction.gasPrice,
                                transaction.gasToken,
                                transaction.refundReceiver,
                                signatures
                            ];
                
                            console.log('args for execTransaction=', args);
                            const abihex = this.web3Serv.getGeneralFunctionABI(abi, args);
                
                            let gasPriceBig = new BigNumber(environment.chains[chain].gasPrice);
                            if(chain !== 'KANBAN') {
                                gasPriceBig = gasPriceBig.shiftedBy(9)
                            }
                            const txParam = {
                                to: proposal.multisig.address,
                                nonce,
                                value: '0x0',
                                data: abihex,
                                gasPrice: '0x' + gasPriceBig.toString(16),
                                gas: environment.chains[chain].gasLimitToken ? environment.chains[chain].gasLimitToken : environment.chains[chain].gasLimit
                            };

                            const rawtx = this.web3Serv.getRawTx(chain, privateKey, txParam);


                            const url = environment.endpoints.blockchain + 'multisigproposal/execute';
                            const body = {
                                rawtx,
                                chain,
                                _id: proposal._id
                            };
                            this.http.post(url, body).subscribe(
                                {
                                    next: (ret: any) => {
                                        if(ret && ret.success) {
                                            observer.next(ret.data);
                                        } else {
                                            return observer.error('Error while submiting raw transaction');
                                        }
                                    },
                                    error: (error) => {
                                        return observer.error(error);
                                    }
                                });


                        } else {
                            return observer.error('Failed to get nonce');
                        }
                    },
                    error: (error: any) => {
                        return observer.error(error);
                    }
                }
            );

            /*
            const txParams = {
                nonce: nonce,
                gasPrice: gasPriceFinal,
                gasLimit: gasLimit,
                to: toAddress,
                value: '0x' + amountNum.toString(16)
            };

            // console.log('txParams=', txParams);
            txHex = await this.web3Serv.signTxWithPrivateKey(txParams, keyPair);
            */

        });
        return observable;
    }
    confirmTransaction(chain: string, privateKey: Buffer, from: string, proposal: any) {
        const transactionHash = proposal.transactionHash;
        let signature = this.web3Serv.signMessageWithPrivateKeyBuffer(transactionHash, privateKey).signature;

        signature = this.web3Serv.adjustVInSignature('eth_sign', signature, transactionHash, from);

        return signature;
    }

    signTransaction(chain: string, smartContractAddress: string, privateKey: Buffer, from: string, nonce: number, to: string, tokenId: string, decimals: number, amount: number) {
        
        const observable = new Observable((observer) => {
            const url = environment.endpoints.blockchain + 'multisig/getTransactionHash';
            const body = {
                chain,
                nonce,
                to,
                tokenId,
                amount,
                decimals,
                address: smartContractAddress
            }
            this.http.post(url, body).subscribe(
                (ret: any) => {
                    if(ret.success) {
                        const data = ret.data;
                        let transactionHash = data.hash;
                        const transaction = data.transaction;

                        let signature = this.web3Serv.signMessageWithPrivateKeyBuffer(transactionHash, privateKey).signature;

                        signature = this.web3Serv.adjustVInSignature('eth_sign', signature, transactionHash, from)
                        console.log('signature in hree=', signature);
                        observer.next({transaction, transactionHash, signature: signature});
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