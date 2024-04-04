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
import { bufferToHex, ecrecover, pubToAddress } from 'ethereumjs-util'
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

  formCreateSafeContractABI(chain: string, addresses, confirmations: number) {

    const abi = {"inputs":[{"internalType":"address","name":"_singleton","type":"address"},{"internalType":"bytes","name":"initializer","type":"bytes"},{"internalType":"uint256","name":"saltNonce","type":"uint256"}],"name":"createProxyWithNonce","outputs":[{"internalType":"contract SafeProxy","name":"proxy","type":"address"}],"stateMutability":"nonpayable","type":"function"};

    const salt = Date.now();

    const setupAbi = {"inputs":[{"internalType":"address[]","name":"_owners","type":"address[]"},{"internalType":"uint256","name":"_threshold","type":"uint256"},{"internalType":"address","name":"to","type":"address"},{"internalType":"bytes","name":"data","type":"bytes"},{"internalType":"address","name":"fallbackHandler","type":"address"},{"internalType":"address","name":"paymentToken","type":"address"},{"internalType":"uint256","name":"payment","type":"uint256"},{"internalType":"address payable","name":"paymentReceiver","type":"address"}],"name":"setup","outputs":[],"stateMutability":"nonpayable","type":"function"};

    const setupDataArgs = [
      addresses,
      confirmations,
      "0x0000000000000000000000000000000000000000",
      "0x",
      environment.chains[chain].Safes.CompatibilityFallbackHandler,
      "0x0000000000000000000000000000000000000000",
      "0",
      "0x0000000000000000000000000000000000000000"
    ];

    const initializer = this.getGeneralFunctionABI(setupAbi, setupDataArgs);
    const args = [environment.chains[chain].Safes.SafeL2, initializer, salt];
    const data = this.getGeneralFunctionABI(abi, args);
    return data;
  }

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
        'mainnet',
        {
          name: environment.chains.KANBAN.chain.name,
          networkId: environment.chains[chain].chain.networkId,
          chainId: environment.chains[chain].chain.chainId
        },
        'petersburg'
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
            to: environment.chains[chain].Safes.SafeProxyFactory,
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
      'mainnet',
      {
        name: environment.chains.KANBAN.chain.name,
        networkId: environment.chains.KANBAN.chain.networkId,
        chainId: environment.chains.KANBAN.chain.chainId
      },
      'petersburg'
    );
    const tx = new Eth.Transaction(txObject, { common: customCommon });

    tx.sign(privKey);
    const serializedTx = tx.serialize();
    txhex = '0x' + serializedTx.toString('hex');
    return txhex;

  }

  getWithdrawFuncABI(coinType: number, amount: BigNumber, destAddress: string) {

    let abiHex = '3295d51e';
    abiHex += this.utilServ.fixedLengh(coinType.toString(16), 64);


    const amountHex = amount.toString(16);
    abiHex += this.utilServ.fixedLengh(amountHex, 64);
    abiHex += this.utilServ.fixedLengh(this.utilServ.stripHexPrefix(destAddress), 64);
    return abiHex;
  }

  getDepositFuncABI(coinType: number, txHash: string, amount: BigNumber, addressInKanban: string, signedMessage: Signature) {

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

    let abiHex = '379eb862';
    abiHex += this.utilServ.stripHexPrefix(signedMessage.v);
    abiHex += this.utilServ.fixedLengh(coinType.toString(16), 62);
    abiHex += this.utilServ.stripHexPrefix(txHash);
    const amountHex = amount.toString(16);
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
    var messageBuffer = Buffer.from(messageBytes);
    var preamble = '\x17Kanban Signed Message:\n' + messageBytes.length;
    var preambleBuffer = Buffer.from(preamble);
    var ethMessage = Buffer.concat([preambleBuffer, messageBuffer]);
    var hash = Hash.keccak256s(ethMessage);
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

    const privateKey = `0x${keyPair.privateKey.toString('hex')}`;
    const web3 = this.getWeb3Provider();

    const signMess = web3.eth.accounts.sign(message, privateKey);
    return signMess;
  }
    
  signMessageWithPrivateKeyBuffer(message: string, privateKeyBuffer: Buffer) {
    const privateKey = `0x${privateKeyBuffer.toString('hex')}`;
    const web3 = this.getWeb3Provider();
    const signMess = web3.eth.accounts.sign(message, privateKey);
    return signMess;
  }

  adjustVInSignature(
    signingMethod: 'eth_sign' | 'eth_signTypedData',
    signature: string,
    safeTxHash?: string,
    signerAddress?: string
  ): string {
    const ETHEREUM_V_VALUES = [0, 1, 27, 28]
    const MIN_VALID_V_VALUE_FOR_SAFE_ECDSA = 27
    let signatureV = parseInt(signature.slice(-2), 16)
    if (!ETHEREUM_V_VALUES.includes(signatureV)) {
      throw new Error('Invalid signature')
    }
    if (signingMethod === 'eth_sign') {
      /*
        The Safe's expected V value for ECDSA signature is:
        - 27 or 28
        - 31 or 32 if the message was signed with a EIP-191 prefix. Should be calculated as ECDSA V value + 4
        Some wallets do that, some wallets don't, V > 30 is used by contracts to differentiate between
        prefixed and non-prefixed messages. The only way to know if the message was signed with a
        prefix is to check if the signer address is the same as the recovered address.
  
        More info:
        https://docs.safe.global/safe-core-protocol/signatures
      */
      if (signatureV < MIN_VALID_V_VALUE_FOR_SAFE_ECDSA) {
        signatureV += MIN_VALID_V_VALUE_FOR_SAFE_ECDSA
      }
      const adjustedSignature = signature.slice(0, -2) + signatureV.toString(16)
      const signatureHasPrefix = this.isTxHashSignedWithPrefix(
        safeTxHash as string,
        adjustedSignature,
        signerAddress as string
      )
      if (signatureHasPrefix) {
        signatureV += 4
      }
    }
    if (signingMethod === 'eth_signTypedData') {
      // Metamask with ledger returns V=0/1 here too, we need to adjust it to be ethereum's valid value (27 or 28)
      if (signatureV < MIN_VALID_V_VALUE_FOR_SAFE_ECDSA) {
        signatureV += MIN_VALID_V_VALUE_FOR_SAFE_ECDSA
      }
    }
    signature = signature.slice(0, -2) + signatureV.toString(16)
    return signature
  }

  isTxHashSignedWithPrefix(
  txHash: string,
  signature: string,
  ownerAddress: string
): boolean {
  let hasPrefix
  try {
    const rsvSig = {
      r: Buffer.from(signature.slice(2, 66), 'hex'),
      s: Buffer.from(signature.slice(66, 130), 'hex'),
      v: parseInt(signature.slice(130, 132), 16)
    }
    const recoveredData = ecrecover(
      Buffer.from(txHash.slice(2), 'hex'),
      rsvSig.v,
      rsvSig.r,
      rsvSig.s
    )
    const recoveredAddress = bufferToHex(pubToAddress(recoveredData))
    hasPrefix = !this.sameString(recoveredAddress, ownerAddress)
  } catch (e) {
    hasPrefix = true
  }
  return hasPrefix
}

sameString(str1: string, str2: string): boolean {
  return str1.toLowerCase() === str2.toLowerCase()
}

    async signTxWithPrivateKey(txParams: any, keyPair: any) {

        const privKey = keyPair.privateKeyBuffer;

        const EthereumTx = Eth.Transaction;
        const tx = new EthereumTx(txParams, { chain: environment.chains.ETH.chain, hardfork: environment.chains.ETH.hardfork });
        tx.sign(privKey);
        const serializedTx = tx.serialize();
        const txhex = '0x' + serializedTx.toString('hex');
        return txhex;
      }

      getRawTx(chain, privateKey, txParams) {
        const EthereumTx = Eth.Transaction;
        let options;
        if(chain == 'ETH') {
          options = { chain: environment.chains.ETH.chain, hardfork: environment.chains.ETH.hardfork }
        } else {
          
          const customCommon = Common.forCustomChain(
            'mainnet',
            {
              name: environment.chains[chain].chain.name,
              networkId: environment.chains[chain].chain.networkId,
              chainId: environment.chains[chain].chain.chainId
            },
            'petersburg'
          );
          options = { common: customCommon };
        }
        const tx = new EthereumTx(txParams, options);
        tx.sign(privateKey);
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