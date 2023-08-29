import { Injectable } from '@angular/core';
import Web3 from 'web3';
declare let window: any;
import * as Eth from 'ethereumjs-tx';
import { environment } from '../../environments/environment';
import * as ethUtil from 'ethereumjs-util';
import { UtilService } from './util.service';
import BigNumber from 'bignumber.js';
import Common from 'ethereumjs-common';
import { Signature, EthTransactionObj } from '../interfaces/kanban.interface';
import * as Account from 'eth-lib/lib/account';
import * as  Hash from 'eth-lib/lib/hash';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
//import { Common, Chain } from '@ethereumjs/common';

@Injectable({ providedIn: 'root' })
export class Web3Service {
  constructor(private utilServ: UtilService, private http: HttpClient) {
  }
    
  getWeb3Provider() {
    if (typeof window.web3 !== 'undefined') {
      return new Web3(window.web3.currentProvider);
    } else {
      const web3 = new Web3(Web3.givenProvider);
      return web3;
    }
  }

  decodeData(typeArray, hexString) {
    const web3 = this.getWeb3Provider();
    const data = web3.eth.abi.decodeParameters(typeArray, hexString);
    return data;
  };

  formCreateSmartContractABI(abiArray, bytecode, args) {

    const web3 = this.getWeb3Provider();
    var MyContract = new web3.eth.Contract(abiArray);

    const abi = MyContract.deploy({
        data: bytecode,
        arguments: args
    })
    .encodeABI();   

    return abi;
  }

  getNonce(chain: string, addressHex: string) {
    const url = environment.endpoints.blockchain + chain.toLowerCase() + '/nonce';
    const data = {
      native: addressHex
    }
    return this.http.post(url, data);
  }

  submitMultisigCreation(chain: string, name: string, owners: any, confirmations: number, rawtx: string) {
    const url = environment.endpoints.blockchain + 'multisig';
    const data = {
      chain, 
      name, 
      owners, 
      confirmations, 
      rawtx
    };
    return this.http.post(url, data);
  }

  getCommon(chain: string) {

      const customCommon = Common.forCustomChain(
        environment.chains.ETH.chain,
        {
          name: environment.chains.KANBAN.chain.name,
          networkId: environment.chains[chain].chain.networkId,
          chainId: environment.chains[chain].chain.chainId
        },
        environment.chains.ETH.hardfork,
      );
    return customCommon;
  }

  formCreateSmartContractRawTx(chain: string, privateKey: Buffer, addressHex: string, data: string, gasPrice: number, gasLimit: number) {
    const observable = new Observable((subscriber) => {
      this.getNonce(chain, addressHex).subscribe({
        next: (ret: any) => {
          if(!ret.success) {
            return subscriber.error('Failed to get utxos');
          }
          const nonce = ret.data;

          

          const gasPriceHex = '0x' + new BigNumber(gasPrice).shiftedBy(9).toString(16);
          const txData = {
            to: '0x',
            nonce: nonce,
            data,
            value: '0x0',
            gasLimit: gasLimit,
            gasPrice: gasPriceHex  // in wei
          };
  
          let rawtx = '';
  
          let opts;
          if(chain == 'ETH') {
           opts = { chain: environment.chains.ETH.chain, hardfork: environment.chains.ETH.hardfork };
          } else {
            const common = this.getCommon(chain);
            opts = {common};
          }
          const tx = new Eth.Transaction(txData, opts);

          tx.sign(privateKey);
          const serializedTx = tx.serialize();

          rawtx = '0x' + serializedTx.toString('hex');     

          if(!rawtx) {
              return subscriber.error('Failed to generate rawtx');
          }
          subscriber.next(rawtx);

        },
        error: (error: any) => {
            let statusText = 'Internal error';
            if(error.statusText) {
                statusText = error.statusText;
            }
            return subscriber.error(statusText);
        }
      })
    });
    return observable;
  }


  asciiToHex(str: string) {
    const web3 = new Web3();
    return web3.utils.asciiToHex(str);
  }

  hexToAscii(hex: string) {
    const web3 = new Web3();
    return web3.utils.hexToAscii(hex);    
  }
  
  randomHex(length: number) {
    const web3 = this.getWeb3Provider();
    return web3.utils.randomHex(length);
  }

  getCreateIDABI(typeId: number, hashData: string) {
    const func: any = {
      "constant": false,
      "inputs": [
        {
          "name": "_type",
          "type": "bytes2"
        },
        {
          "name": "_hashData",
          "type": "bytes32"
        }
      ],
      "name": "createID",
      "outputs": [
        
      ],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    };  
    const params = ['0x' + typeId.toString(16), hashData];

    const abiHex = this.getGeneralFunctionABI(func, params);
    return abiHex;
  }
 
  getUpdateIDABI(objectID: string, hashData: string) {
    const sequenceID = this.utilServ.ObjectId2SequenceId(objectID);
    const func: any =  {
      "constant": false,
      "inputs": [
        {
          "name": "_objectID",
          "type": "bytes30"
        },
        {
          "name": "_hashData",
          "type": "bytes32"
        }
      ],
      "name": "updateID",
      "outputs": [
        
      ],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    };  
    const params = ['0x' + sequenceID, hashData];

    console.log('params=', params);
    const abiHex = this.getGeneralFunctionABI(func, params);
    return abiHex;
  }  

  getChangeOwnerABI(objectID: string, newOwner: string) {
    newOwner = this.utilServ.fabToExgAddress(newOwner);
    const sequenceID = this.utilServ.ObjectId2SequenceId(objectID);
    const func: any = {
      "constant": false,
      "inputs": [
        {
          "name": "_objectID",
          "type": "bytes30"
        },
        {
          "name": "_newOwner",
          "type": "address"
        }
      ],
      "name": "changeOwner",
      "outputs": [
        
      ],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    };  

    const params = ['0x' + sequenceID, newOwner];
    console.log('params for getChangeOwnerABI=', params);
    const abiHex = this.getGeneralFunctionABI(func, params);
    return abiHex;
  }  

  getAddRecordABI(sequence: string, hashData: string) {
    const web3 = this.getWeb3Provider();
    const func: any =   {
      "constant": false,
      "inputs": [
        {
          "name": "_sequence",
          "type": "bytes32"
        },
        {
          "name": "_hashData",
          "type": "bytes32"
        }
      ],
      "name": "addRecord",
      "outputs": [
        
      ],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    };  
    const params = [web3.utils.asciiToHex(sequence), hashData];

    console.log('params=', params);
    const abiHex = this.getGeneralFunctionABI(func, params);
    return abiHex;
  }
  
  async signAbiHexWithPrivateKey(abiHex: string, keyPair: any, address: string, nonce: number,
    value = 0, options = { gasPrice: 0, gasLimit: 0 }) {
    if (abiHex.startsWith('0x')) {
      abiHex = abiHex.slice(2);
    }

    let gasPrice = environment.chains.KANBAN.gasPrice;
    let gasLimit = environment.chains.KANBAN.gasLimit;
    if (options) {
      if (options.gasPrice) {
        gasPrice = options.gasPrice;
      }
      if (options.gasLimit) {
        gasLimit = options.gasLimit;
      }
    }
    // console.log('abiHex after', abiHex);

    console.log('gasPrice=', gasPrice);
    console.log('gasLimit=', gasLimit);
    const txObject = {
      to: address,
      nonce: nonce,
      data: '0x' + abiHex,
      value: value,
      gas: gasLimit,

      // coin: '0x',
      gasPrice: gasPrice  // in wei
      // gasPrice: 40  // in wei
    };

    const privKey = keyPair.privateKeyBuffer.privateKey;

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

    tx.sign(privKey);
    const serializedTx = tx.serialize();
    txhex = '0x' + serializedTx.toString('hex');
    return txhex;

    /*
    const web3 = this.getWeb3Provider();

    const signMess = await web3.eth.accounts.signTransaction(txObject, privateKey) as EthTransactionObj;
    console.log('signMess in signMessageWithPrivateKey=');
    console.log(signMess);
    return signMess.rawTransaction;   
    */
  }

  getWithdrawFuncABI(coinType: number, amount: BigNumber, destAddress: string) {

    // let abiHex = '3a5b6c70';

    /*
    const web3 = this.getWeb3Provider();
    const func: any = {
      'constant': false,
      'inputs': [
        {
          'name': '_coinType',
          'type': 'uint32'
        },
        {
          'name': '_value',
          'type': 'uint256'
        },
        {
          'name': '',
          'type': 'bytes32'
        }
      ],
      'name': 'withdraw',
      'outputs': [
        {
          'name': 'success',
          'type': 'bool'
        }
      ],
      'payable': false,
      'stateMutability': 'nonpayable',
      'type': 'function'
    };
    let abiHex = web3.eth.abi.encodeFunctionSignature(func).substring(2);

    */

    let abiHex = '3295d51e';
    // console.log('abiHex there we go:' + abiHex);  
    abiHex += this.utilServ.fixedLengh(coinType.toString(16), 64);
    // console.log('abiHex1=' + abiHex);

    const amountHex = amount.toString(16);
    // console.log('amount=' + amount);
    // console.log('amountHex=' + amountHex);
    abiHex += this.utilServ.fixedLengh(amountHex, 64);
    // console.log('abiHex2=' + abiHex);
    abiHex += this.utilServ.fixedLengh(this.utilServ.stripHexPrefix(destAddress), 64);
    // console.log('abiHex final:' + abiHex);    
    return abiHex;
  }

  getDepositFuncABI(coinType: number, txHash: string, amount: BigNumber, addressInKanban: string, signedMessage: Signature) {

    // console.log('params for getDepositFuncABI:');
    // console.log('coinType=' + coinType + ',txHash=' + txHash + ',amount=' + amount + ',addressInKanban=' + addressInKanban);
    console.log('signedMessage=', signedMessage);
    const web3 = this.getWeb3Provider();
    const func: any = {
      'constant': false,
      'inputs': [
        {
          'name': '_coinType',
          'type': 'uint32'
        },
        {
          'name': '',
          'type': 'bytes32'
        },
        {
          'name': '_value',
          'type': 'uint256'
        },
        {
          'name': '_addressInKanban',
          'type': 'address'
        },
        {
          'name': '',
          'type': 'bytes32'
        },
        {
          'name': '',
          'type': 'bytes32'
        }
      ],
      'name': 'deposit',
      'outputs': [
        {
          'name': 'success',
          'type': 'bool'
        }
      ],
      'payable': false,
      'stateMutability': 'nonpayable',
      'type': 'function'
    };
    //let abiHex = this.utilServ.stripHexPrefix(web3.eth.abi.encodeFunctionSignature(func));
    // console.log('abiHex for addDeposit=', abiHex);
    let abiHex = '379eb862';
    abiHex += this.utilServ.stripHexPrefix(signedMessage.v);
    abiHex += this.utilServ.fixedLengh(coinType.toString(16), 62);
    abiHex += this.utilServ.stripHexPrefix(txHash);
    const amountHex = amount.toString(16);
    console.log('amountHex=', this.utilServ.fixedLengh(amountHex, 64));
    abiHex += this.utilServ.fixedLengh(amountHex, 64);
    abiHex += this.utilServ.fixedLengh(this.utilServ.stripHexPrefix(addressInKanban), 64);
    abiHex += this.utilServ.stripHexPrefix(signedMessage.r);
    abiHex += this.utilServ.stripHexPrefix(signedMessage.s);

    return abiHex;

  }

  getChargeFundsWithFeeABI(num, parents, coinTypeId, totalSale, totalTax) {
    const abi = {
      "constant": false,
      "inputs": [
        {
          "name": "_orderID",
          "type": "bytes32"
        },
        {
          "name": "_coinType",
          "type": "uint32"
        },
        {
          "name": "_totalAmount",
          "type": "uint256"
        },
        {
          "name": "_tax",
          "type": "uint256"
        },
        {
          "name": "_regionalAgents",
          "type": "address[]"
        },
        {
          "name": "_rewardBeneficiary",
          "type": "address[]"
        }
      ],
      "name": "chargeFundsWithFee",
      "outputs": [
        {
          "name": "",
          "type": "bool"
        }
      ],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    };
    const args = [
      num, 
      coinTypeId, 
      '0x' + new BigNumber(totalSale).shiftedBy(18).toString(16), 
      '0x' + new BigNumber(totalTax).shiftedBy(18).toString(16),
      [],
      parents
    ];
    const abiHex = this.getGeneralFunctionABI(abi, args);

    return abiHex;
  }
  

  getTransferFuncABI(coin: number, address: string, amount: number) {
    const web3 = this.getWeb3Provider();
    let value = '0x' + new BigNumber(amount).shiftedBy(18).toString(16);
    value = value.split('.')[0];
    const params = [this.utilServ.fabToExgAddress(address), coin, value, web3.utils.asciiToHex('')];

    const func = {
      'constant': false,
      'inputs': [
        {
          'name': '_to',
          'type': 'address'
        },
        {
          'name': '_coinType',
          'type': 'uint32'
        },
        {
          'name': '_value',
          'type': 'uint256'
        },
        {
          "name": "_comment",
          "type": "bytes32"
        }
      ],
      'name': 'transfer',
      'outputs': [
        {
          'name': 'success',
          'type': 'bool'
        }
      ],
      'payable': false,
      'stateMutability': 'nonpayable',
      'type': 'function'
    };

    const abiHex = this.getGeneralFunctionABI(func, params);

    return abiHex;
  }

  hashKanbanMessage(data) {
    const web3 = this.getWeb3Provider();
    var messageHex = web3.utils.isHexStrict(data) ? data : web3.utils.utf8ToHex(data);
    var messageBytes = web3.utils.hexToBytes(messageHex);
    console.log('messageBytes=', messageBytes);
    var messageBuffer = Buffer.from(messageBytes);
    console.log('messageBuffer=', messageBuffer.toString('hex'));
    console.log('messageBytes.length===', messageBytes.length);
    var preamble = '\x17Kanban Signed Message:\n' + messageBytes.length;
    var preambleBuffer = Buffer.from(preamble);
    console.log('preambleBuffer===', preambleBuffer.toString('hex'));
    var ethMessage = Buffer.concat([preambleBuffer, messageBuffer]);
    console.log('ethMessage===', ethMessage.toString('hex'));
    var hash = Hash.keccak256s(ethMessage);    
    console.log('hash1=', hash);
    return hash;
  }

  signKanbanMessageWithPrivateKey(message: string, privateKey: any) {
    var hash = this.hashKanbanMessage(message);
    return this.signKanbanMessageHashWithPrivateKey(hash, privateKey);
  }

  signKanbanMessageHashWithPrivateKey(hash: string, privateKey: any) {

    const privateKeyHex = `0x${privateKey.toString('hex')}`;
    // 64 hex characters + hex-prefix
    if (privateKeyHex.length !== 66) {
        throw new Error("Private key must be 32 bytes long");
    }    
    var signature = Account.sign(hash, privateKeyHex);
    var vrs = Account.decodeSignature(signature);
    return {
        messageHash: hash,
        v: vrs[0],
        r: vrs[1],
        s: vrs[2],
        signature: signature
    };
  }
  
  decodeParameter(type, hexString){
    const web3 = new Web3();
    return web3.eth.abi.decodeParameter(type, hexString);
  }

  signMessageWithPrivateKey(message: string, keyPair: any) {
    console.log('message==', message);
    console.log('keyPair==', keyPair);
    const privateKey = `0x${keyPair.privateKey.toString('hex')}`;
    console.log('privateKey==', privateKey);
    //const privateKey = keyPair.privateKey;
    const web3 = this.getWeb3Provider();

    const signMess = web3.eth.accounts.sign(message, privateKey);
    return signMess;
  }
    
    async signTxWithPrivateKey(txParams: any, keyPair: any) {
        /*
        const privateKey = `0x${keyPair.privateKey.toString('hex')}`;
    
        console.log('in signTxWithPrivateKey');
        const web3 = this.getWeb3Provider();
        console.log('in111');
        console.log(txParams);
        console.log(privateKey);
        const signMess = await web3.eth.accounts.signTransaction(txParams, privateKey) as EthTransactionObj;
        console.log('in222');
        console.log(signMess);
        return signMess.rawTransaction;
        */
        const privKey = keyPair.privateKeyBuffer;
        console.log('privKey=====', privKey);
        console.log('txParams=====', txParams);
        const EthereumTx = Eth.Transaction;
        const tx = new EthereumTx(txParams, { chain: environment.chains.ETH.chain, hardfork: environment.chains.ETH.hardfork });
        tx.sign(privKey);
        const serializedTx = tx.serialize();
        const txhex = '0x' + serializedTx.toString('hex');
        return txhex;
      }

      getFuncABI(func) {
        const web3 = this.getWeb3Provider();
        const abiHex = web3.eth.abi.encodeFunctionSignature(func).substring(2);
        return abiHex;
      }   

      getGeneralFunctionABI(func, paramsArray) {
        const web3 = this.getWeb3Provider();
        const abiHex = web3.eth.abi.encodeFunctionCall(func, paramsArray);
        return abiHex;
      }  
          
      getHash(input: string) {
        const web3 = this.getWeb3Provider();
        return web3.utils.sha3(input);
      }

      sha3(s: string) {
        const web3 = this.getWeb3Provider();
        return web3.utils.sha3(s);
      }      

      getTransferFunctionABI(to, coin, value, comment) {
        const web3 = this.getWeb3Provider();
        const func = {
          'constant': false,
          'inputs': [
            {
              'name': '_to',
              'type': 'address'
            },
            {
              'name': '_coinType',
              'type': 'uint32'
            },
            {
              'name': '_value',
              'type': 'uint256'
            },
            {
              "name": "_comment",
              "type": "bytes32"
            }
          ],
          'name': 'transfer',
          'outputs': [
            {
              'name': 'success',
              'type': 'bool'
            }
          ],
          'payable': false,
          'stateMutability': 'nonpayable',
          'type': 'function'
        };
    
        const params = [to, coin, value, web3.utils.asciiToHex(comment)];
        const abiHex = this.getGeneralFunctionABI(func, params);
        return abiHex;
      }

      getTransactionHash(txhex: string) {
        const buff = Buffer.from(txhex);
        const hash = ethUtil.keccak(buff).toString('hex');
        return '0x' + hash;
      }    
}