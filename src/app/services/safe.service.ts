import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Web3Service } from './web3.service';
import BigNumber from 'bignumber.js';

@Injectable()
export class SafeService {

    constructor(
        private http: HttpClient, 
        private web3Serv: Web3Service) {}

    executeTransaction(chain: string, privateKey: Buffer, addressHex: string, proposal: any, signaturesArray: any) {
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
                            
                            signaturesArray = signaturesArray.sort((a, b) => a.signer > b.signer ? 1 : -1);
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
                                            return observer.error(ret.message ? ret.message : 'Error while submiting raw transaction');
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


        });
        return observable;
    }
    confirmTransaction(chain: string, privateKey: Buffer, from: string, proposal: any) {
        const transactionHash = proposal.transactionHash;
        let signature = this.web3Serv.signMessageWithPrivateKeyBuffer(transactionHash, privateKey).signature;

        //if(chain != 'BNB') {
        signature = this.web3Serv.adjustVInSignature('eth_sign', signature, transactionHash, from);
        //}
        

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


}