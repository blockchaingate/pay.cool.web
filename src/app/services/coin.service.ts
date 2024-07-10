import { Injectable } from '@angular/core';
import { UtilService } from './util.service';
import { ApiService } from './api.service';
import { Web3Service } from './web3.service';
import BigNumber from 'bignumber.js';
import { MyCoin } from '../models/mycoin';
import * as bchaddr from 'bchaddrjs';
import * as Btc from 'bitcoinjs-lib';
// import * as BIP32 from 'bitcoinjs-lib/node_modules/bip32/types/bip32';
import * as BIP32 from 'bip32';
import { environment } from '../../environments/environment';
import * as hdkey from 'ethereumjs-wallet/hdkey';
import * as wif from 'wif';
import { Address } from '../models/address';
import { coin_list } from '../../environments/coins';
import { Signature } from '../interfaces/kanban.interface';
import * as bitcoinMessage from 'bitcoinjs-message';
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
export class CoinService {
    txids: any;
    constructor(private apiServ: ApiService, private web3Serv: Web3Service, private utilServ: UtilService) {
        this.txids = [];
    }

    getAddress(addresses: any, name: string) {
        return addresses.filter(item => item.name === name)[0].address;
    }

    getOriginalMessage(coinType: number, txHash: string, amount: BigNumber, address: string) {
        let buf = '';
        const coinTypeHex = coinType.toString(16);
        buf += this.utilServ.fixedLengh(coinTypeHex, 8);
        buf += this.utilServ.fixedLengh(txHash, 64);
        const hexString = amount.toString(16);
        buf += this.utilServ.fixedLengh(hexString, 64);
        buf += this.utilServ.fixedLengh(address, 64);

        return buf;
    }

    signedMessage(originalMessage: string, keyPair: any) {


        let signature: Signature;
        const name = keyPair.name;
        const tokenType = keyPair.tokenType;

        if (name === 'ETH' || tokenType === 'ETH') {
            signature = this.web3Serv.signMessageWithPrivateKey(originalMessage, keyPair) as Signature;

        } else
            if (name === 'FAB' || name === 'BTC' || tokenType === 'FAB' || name === 'BCH' || name === 'DOGE' || name === 'LTC') {
                // signature = this.web3Serv.signMessageWithPrivateKey(originalMessage, keyPair) as Signature;
                let signBuffer: Buffer;
                // if(name === 'FAB' || name === 'BTC' || tokenType === 'FAB' || name === 'LTC' || name === 'DOGE') {
                const chainName = (tokenType === 'FAB') ? 'FAB' : name;

                const messagePrefix = environment.chains[chainName].network.messagePrefix;


                signBuffer = bitcoinMessage.sign(originalMessage, keyPair.privateKeyBuffer.privateKey,
                    keyPair.privateKeyBuffer.compressed, messagePrefix);

                // const signHex = `${signBuffer.toString('hex')}`;
                const v = `0x${signBuffer.slice(0, 1).toString('hex')}`;
                const r = `0x${signBuffer.slice(1, 33).toString('hex')}`;
                const s = `0x${signBuffer.slice(33, 65).toString('hex')}`;

                signature = { r: r, s: s, v: v };

            }
        return signature;
    }

    getOfficialAddress(coinName: string) {
        if (environment.addresses.exchangilyOfficial[coinName]) {
            return environment.addresses.exchangilyOfficial[coinName];
        }
        return '';
    }

    formMyCoin(addresses: any, name: string) {
        const mycoin = new MyCoin(name);
        mycoin.receiveAdds = [];
        if(['BTC','LTC','DOGE', 'BCH', 'ETH', 'FAB', 'TRX'].indexOf(name) >= 0) {
            if(name == 'ETH') {
                mycoin.decimals = 18;
            } if(name == 'TRX') {
                mycoin.decimals = 6;
            }
            else {
                mycoin.decimals = 8;
            } 

            const address = this.getAddress(addresses, name);
            const addr = new Address(0, address, 0);
            mycoin.receiveAdds.push(addr);
            return mycoin;
        } else
        if(name == 'USDTX') {
            mycoin.tokenType = 'TRX';
            const address = this.getAddress(addresses, 'TRX');
            const addr = new Address(0, address, 0);
            mycoin.receiveAdds.push(addr);
        } else
        if(name == 'EXG' || name == 'DUSD') {
            mycoin.tokenType = 'FAB';
            const address = this.getAddress(addresses, 'FAB');
            const addr = new Address(0, address, 0);
            mycoin.receiveAdds.push(addr);
        } else {
            mycoin.decimals = 18;
            const erc20Tokens8 = [
                'FUN', 'WAX', 'MTL'
            ];
            if(erc20Tokens8.indexOf(name) >= 0) {
                mycoin.decimals = 8;
            }

            const erc20Tokens6 = [
                'USDT', 'POWR'
            ];
            if(erc20Tokens6.indexOf(name) >= 0) {
                mycoin.decimals = 6;
            }

            const erc20Tokens4 = [
                'CEL'
            ];
            if(erc20Tokens4.indexOf(name) >= 0) {
                mycoin.decimals = 4;
            }
            mycoin.tokenType = 'ETH';

            const address = this.getAddress(addresses, 'ETH');
            const addr = new Address(0, address, 0);
            mycoin.receiveAdds.push(addr);
        }
        return mycoin;
    }

    async depositFab(scarContractAddress: string, seed: any, mycoin: MyCoin, amount: number) {
        // sendTokens in https://github.com/ankitfa/Fab_sc_test1/blob/master/app/walletManager.js
        const gasLimit = 800000;
        const gasPrice = 40;

        const totalAmount = gasLimit * gasPrice / 1e8;
        // let cFee = 3000 / 1e8 // fee for the transaction

        let totalFee = totalAmount;

        // -----------------------------------------------------------------------
        const addDepositFunc: any = {
            'constant': false,
            'inputs': [],
            'name': 'addDeposit',
            'outputs': [
                {
                    'name': '',
                    'type': 'address'
                }
            ],
            'payable': true,
            'stateMutability': 'payable',
            'type': 'function'
        };

        let fxnCallHex = this.web3Serv.getGeneralFunctionABI(addDepositFunc, []);
        fxnCallHex = this.utilServ.stripHexPrefix(fxnCallHex);

        const contract = Btc.script.compile([
            84,
            this.utilServ.number2Buffer(gasLimit),
            this.utilServ.number2Buffer(gasPrice),
            this.utilServ.hex2Buffer(fxnCallHex),
            this.utilServ.hex2Buffer(scarContractAddress),
            194
        ]);

        const contractSize = contract.toJSON.toString().length;

        totalFee += this.utilServ.convertLiuToFabcoin(contractSize * 10);

        const res = await this.getFabTransactionHex(seed, mycoin, contract, amount, totalFee,
            environment.chains.FAB.satoshisPerBytes, environment.chains.FAB.bytesPerInput, false);

        const txHex = res.txHex;
        let errMsg = res.errMsg;
        let txHash = '';
        if (!errMsg) {
            const res2 = await this.apiServ.postFabTx(txHex);
            txHash = res2.txHash;
            errMsg = res2.errMsg;
        }
        return { txHash: txHash, errMsg: errMsg };
    }

    getCoinTypeIdByName(name: string) {
        name = name.toUpperCase();
        for (let i = 0; i < coin_list.length; i++) {
            const coin = coin_list[i];
            if (coin.name === name) {
                return coin.id;
            }
        }
        return -1;
    }

    getCoinNameByTypeId(id: number) {

        for (let i = 0; i < coin_list.length; i++) {
            const coin = coin_list[i];
            if (coin.id === id) {
                return coin.name;
            }
        }
        return '';
    }

    async getFabTransactionHex(seed: any, mycoin: MyCoin, to: any, amount: number, extraTransactionFee: number,
        satoshisPerBytes: number, bytesPerInput: number, getTransFeeOnly: boolean) {
            extraTransactionFee = Number(extraTransactionFee);
            amount = Number(amount);
        let index = 0;
        let finished = false;
        let address = '';
        let totalInput = 0;
        let transFee = 0;
        let amountInTx = new BigNumber(0);
        const txids = [];
        const feePerInput = bytesPerInput * satoshisPerBytes;
        const receiveAddsIndexArr = [];
        const changeAddsIndexArr = [];
        const totalAmount = Number(amount) + Number(extraTransactionFee);

        let amountNum = new BigNumber(this.utilServ.toBigNumber(totalAmount, 8)).toNumber();

        amountNum += (2 * 34) * satoshisPerBytes;

        const network = environment.chains.BTC.network;

        const txb = new Btc.TransactionBuilder(network);

        let txHex = '';

        for (index = 0; index < mycoin.receiveAdds.length; index++) {
            address = mycoin.receiveAdds[index].address;

            const fabUtxos = await this.apiServ.getFabUtxos(address);

            if (fabUtxos && fabUtxos.length) {

                for (let i = 0; i < fabUtxos.length; i++) {
                    const utxo = fabUtxos[i];
                    const idx = utxo.idx;


                    const txidItem = {
                        txid: utxo.txid,
                        idx: idx
                    };

                    let existed = false;
                    for (let iii = 0; iii < this.txids.length; iii++) {
                        const ttt = this.txids[iii];
                        if ((ttt.txid === txidItem.txid) && (ttt.idx === txidItem.idx)) {

                            existed = true;
                            break;
                        }
                    }

                    if (existed) {
                        continue;
                    }

                    txids.push(txidItem);

                    txb.addInput(utxo.txid, idx);

                    receiveAddsIndexArr.push(index);
                    totalInput += utxo.value;
                    amountNum -= utxo.value;
                    amountNum += feePerInput;
                    if (((amount > 0) || (mycoin.tokenType === 'FAB')) && (amountNum <= 0)) {

                        finished = true;
                        break;
                    }
                }
            }
            if (finished) {
                break;
            }
        }


        if (!finished) {
            for (index = 0; index < mycoin.changeAdds.length; index++) {

                address = mycoin.changeAdds[index].address;

                const fabUtxos = await this.apiServ.getFabUtxos(address);

                if (fabUtxos && fabUtxos.length) {
                    for (let i = 0; i < fabUtxos.length; i++) {
                        const utxo = fabUtxos[i];
                        const idx = utxo.idx;

                        /*
                        const isLocked = await this.apiService.isFabTransactionLocked(utxo.txid, idx);
                        if (isLocked) {
                            continue;
                        }
                        */

                        const txidItem = {
                            txid: utxo.txid,
                            idx: idx
                        };

                        let existed = false;
                        for (let iii = 0; iii < this.txids.length; iii++) {
                            const ttt = this.txids[iii];
                            if ((ttt.txid === txidItem.txid) && (ttt.idx === txidItem.idx)) {

                                existed = true;
                                break;
                            }
                        }

                        if (existed) {
                            continue;
                        }
                        txids.push(txidItem);

                        txb.addInput(utxo.txid, idx);

                        receiveAddsIndexArr.push(index);
                        totalInput += utxo.value;

                        amountNum -= utxo.value;
                        amountNum += feePerInput;
                        if (((amount > 0) || (mycoin.tokenType === 'FAB')) && (amountNum <= 0)) {
                            finished = true;
                            break;
                        }
                    }
                }
                if (finished) {
                    break;
                }
            }
        }
        if ((amount > 0) && !finished) {
            return { txHex: '', errMsg: 'not enough fab coin to make the transaction.', transFee: 0, txids: txids };
        }

        const changeAddress = mycoin.receiveAdds[0];

        let outputNum = 2;
        if ((mycoin.tokenType === '') && (amount === 0)) {
            outputNum = 1;
        }
        transFee = ((receiveAddsIndexArr.length + changeAddsIndexArr.length) * bytesPerInput + outputNum * 34) * satoshisPerBytes;

        const output1 = Math.round(totalInput
            - new BigNumber(this.utilServ.toBigNumber(amount + extraTransactionFee, 8)).toNumber()
            - transFee);


        if (getTransFeeOnly) {
            return { txHex: '', errMsg: '', transFee: transFee + new BigNumber(this.utilServ.toBigNumber(extraTransactionFee, 8)).toNumber(), amountInTx: amountInTx };
        }
        // const output2 = Math.round(amount * 1e8);
        const output2 = new BigNumber(this.utilServ.toBigNumber(amount, 8));
        amountInTx = output2;


        if (output1 < 0) {

            return {
                txHex: '',
                errMsg: 'Not enough FAB or utxos for this transaction',
                transFee: 0, amountInTx: amountInTx, txids: txids
            };
        }

        if ((amount > 0) || (mycoin.tokenType == 'FAB')) {

            txb.addOutput(changeAddress.address, output1);
            txb.addOutput(to, output2.toNumber());
        } else {
            txb.addOutput(to, output1);
        }


        for (index = 0; index < receiveAddsIndexArr.length; index++) {
            const keyPair = this.getKeyPairs(mycoin.tokenType ? mycoin.tokenType : mycoin.name, seed, 0, receiveAddsIndexArr[index], 'b');
            const alice = Btc.ECPair.fromWIF(keyPair.privateKey, network);
            txb.sign(index, alice);
        }

        for (index = 0; index < changeAddsIndexArr.length; index++) {
            const keyPair = this.getKeyPairs(mycoin.tokenType ? mycoin.tokenType : mycoin.name, seed, 1, changeAddsIndexArr[index], 'b');
            const alice = Btc.ECPair.fromWIF(keyPair.privateKey, network);
            txb.sign(receiveAddsIndexArr.length + index, alice);
        }

        txHex = txb.build().toHex();
        return { txHex: txHex, errMsg: '', transFee: transFee, amountInTx: amountInTx, txids: txids };
    }

    getTransactionHistoryEvents(addresses) {

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

        return this.apiServ.getTransactionHistoryEvents(data);
    }

    getKeyPairs(name: string, seed: Buffer, chain: number, index: number, type: string, extraPath: string = '') {

        let addr = '';
        const addrHash = '';
        let priKey;
        let pubKey = '';
        let priKeyHex = '';
        let priKeyDisp = '';
        let buffer = Buffer.alloc(32);

        if (!seed) {
            return null;
        }


        let path = 'm/44\'/' + environment.CoinType[(name == 'KANBAN') ? 'FAB' : name] + '\'/0\'/' + chain + '/' + index;

        if (name === 'BTC' || name === 'FAB'  || name == 'KANBAN' || name === 'LTC' || name === 'DOGE' || name === 'BCH') {

            const root = BIP32.fromSeed(seed, environment.chains[(name == 'KANBAN') ? 'FAB' : name]['network']);

            let childNode = root.derivePath(path);
            if(extraPath) {
                childNode = childNode.derivePath(extraPath);
            }
            const { address } = Btc.payments.p2pkh({
                pubkey: childNode.publicKey,
                network: environment.chains[name]['network']
            });

            if (name === 'BCH') {
                addr = bchaddr.toCashAddress(address);
            } else 
            if(name == 'KANBAN') {
                addr = this.utilServ.fabToExgAddress(address);
            } else
            {

                addr = address;
            }
            
            priKey = childNode.toWIF();
            pubKey = `0x${childNode.publicKey.toString('hex')}`;

            buffer = wif.decode(priKey);
            priKeyDisp = priKey;
        } else
        if(name == 'TRX') {
            const root = BIP32.fromSeed(seed);
            const childNode = root.derivePath(path);
            priKey = childNode.privateKey;

            buffer = wif.decode(childNode.toWIF());
            addr = 
            TronWeb.utils.crypto.getBase58CheckAddress(TronWeb.utils.crypto.getAddressFromPriKey(priKey));
      
        } else {
            path = 'm/44\'/' + environment.CoinType.ETH + '\'/0\'/' + chain + '/' + index;
            const root = hdkey.default.fromMasterSeed(seed);
            const childNode = root.derivePath(path);

            const wallet = childNode.getWallet();
            const address = `0x${wallet.getAddress().toString('hex')}`;
            addr = address;
            buffer = wallet.getPrivateKey();
            priKey = wallet.getPrivateKey();
            priKeyDisp = buffer.toString('hex');
        }
        /*
        const keyPairs = {
            address: addr,
            addressHash: addrHash,
            privateKey: priKey,
            privateKeyHex: priKeyHex,
            privateKeyBuffer: buffer,
            privateKeyDisplay: priKeyDisp,
            publicKey: pubKey,
            name: name
        };

        return keyPairs;
        */
       if(type == 'a') {
        return addr;
       } else
       if(type == 'p') {
           return priKey;
       }

       const keyPairs = {
        address: addr,
        addressHash: addrHash,
        privateKey: priKey,
        privateKeyHex: priKeyHex,
        privateKeyBuffer: buffer,
        privateKeyDisplay: priKeyDisp,
        publicKey: pubKey,
        name: name
        };

        return keyPairs;
    }

    async sendTransaction(mycoin: MyCoin, seed: Buffer, toAddress: any, amount: number,
        options: any, doSubmit: boolean) {

        let index = 0;
        let finished = false;
        let address = '';
        let totalInput = 0;

        let gasPrice = 0;
        let gasLimit = 0;
        let satoshisPerBytes = 0;
        let bytesPerInput = 0;
        let feeLimit = 0;
        let txHex = '';
        let txHash = '';
        let errMsg = '';
        let transFee = 0;
        let tranFeeUnit = '';
        let txids = [];
        let amountInTx = new BigNumber(0);
        let getTransFeeOnly = false;
        if (options) {
            if (options.gasPrice) {
                gasPrice = options.gasPrice;
            }
            if (options.gasLimit) {
                gasLimit = options.gasLimit;
            }
            if (options.satoshisPerBytes) {
                satoshisPerBytes = options.satoshisPerBytes;
            }
            if (options.bytesPerInput) {
                bytesPerInput = options.bytesPerInput;
            }
            if (options.getTransFeeOnly) {
                getTransFeeOnly = options.getTransFeeOnly;
            }
            if(options.feeLimit) {
                feeLimit = options.feeLimit;
            }
        }
        const receiveAddsIndexArr = [];
        const changeAddsIndexArr = [];


        // let amountNum = amount * Math.pow(10, this.utilServ.getDecimal(mycoin));
        let amountNum = new BigNumber(amount).multipliedBy(new BigNumber(Math.pow(10, this.utilServ.getDecimal(mycoin))));
        // it's for all coins.
        amountNum = amountNum.plus((2 * 34) * satoshisPerBytes);

        if (mycoin.name === 'BTC' || mycoin.name === 'LTC' || mycoin.name === 'DOGE' || mycoin.name === 'BCH') { // btc address format
            if (mycoin.name === 'BCH') {
                toAddress = bchaddr.toLegacyAddress(toAddress);
            }
            if (!satoshisPerBytes) {
                satoshisPerBytes = environment.chains[mycoin.name].satoshisPerBytes;
            }
            if (!bytesPerInput) {
                bytesPerInput = environment.chains[mycoin.name].bytesPerInput;
            }
            const BtcNetwork = environment.chains[mycoin.name].network;
            const txb = new Btc.TransactionBuilder(BtcNetwork);

            for (index = 0; index < mycoin.receiveAdds.length; index++) {

                address = mycoin.receiveAdds[index].address;
                const balanceFull = await this.apiServ.getUtxos(mycoin.name, address);
                for (let i = 0; i < balanceFull.length; i++) {
                    const tx = balanceFull[i];

                    if (tx.idx < 0) {
                        continue;
                    }


                    const txidItem = {
                        txid: tx.txid,
                        idx: tx.idx
                    };

                    let existed = false;
                    for (let iii = 0; iii < this.txids.length; iii++) {
                        const ttt = this.txids[iii];
                        if ((ttt.txid === txidItem.txid) && (ttt.idx === txidItem.idx)) {
                            existed = true;
                            break;
                        }
                    }

                    if (existed) {
                        continue;
                    }

                    txids.push(txidItem);

                    txb.addInput(tx.txid, tx.idx);
                    amountNum = amountNum.minus(tx.value);
                    amountNum = amountNum.plus(bytesPerInput * satoshisPerBytes);
                    totalInput += tx.value;
                    receiveAddsIndexArr.push(index);
                    if ((amount > 0) && (amountNum.isLessThanOrEqualTo(0))) {
                        finished = true;
                        break;
                    }
                }
                if (finished) {
                    break;
                }
            }
            if (!finished) {
                for (index = 0; index < mycoin.changeAdds.length; index++) {
                    /*
                    balance = mycoin.changeAdds[index].balance;
                    if (balance <= 0) {
                        continue;
                    }
                    */
                    address = mycoin.changeAdds[index].address;
                    const balanceFull = await this.apiServ.getBtcUtxos(address);
                    for (let i = 0; i < balanceFull.length; i++) {
                        const tx = balanceFull[i];

                        if (tx.idx < 0) {
                            continue;
                        }

                        const txidItem = {
                            txid: tx.txid,
                            idx: tx.idx
                        };
                        let existed = false;
                        for (let iii = 0; iii < this.txids.length; iii++) {
                            const ttt = this.txids[iii];
                            if ((ttt.txid === txidItem.txid) && (ttt.idx === txidItem.idx)) {
                                existed = true;
                                break;
                            }
                        }

                        if (existed) {
                            continue;
                        }
                        txids.push(txidItem);
                        txb.addInput(tx.txid, tx.idx);
                        amountNum = amountNum.minus(tx.value);
                        amountNum = amountNum.plus(bytesPerInput * satoshisPerBytes);
                        totalInput += tx.value;
                        changeAddsIndexArr.push(index);

                        if ((amount > 0) && (amountNum.isLessThanOrEqualTo(0))) {
                            finished = true;
                            break;
                        }
                    }
                    if (finished) {
                        break;
                    }
                }
            }

            if ((amount > 0) && !finished) {
                txHex = '';
                txHash = '';
                errMsg = 'not enough fund.';
                return { txHex: txHex, txHash: txHash, errMsg: errMsg, amountInTx: amountInTx, txids: txids };
            }

            let outputNum = 2;
            if (amount === 0) {
                outputNum = 1;
            }

            transFee = ((receiveAddsIndexArr.length + changeAddsIndexArr.length) * bytesPerInput + outputNum * 34 + 10) * satoshisPerBytes;

            const changeAddress = mycoin.receiveAdds[0];

            const output1 = Math.round(new BigNumber(totalInput - new BigNumber(amount).multipliedBy(new BigNumber(1e8)).toNumber() - transFee).toNumber());

            if (output1 < 2730) {
                transFee += output1;
            }
            transFee = new BigNumber(transFee).dividedBy(new BigNumber(1e8)).toNumber();

            if (getTransFeeOnly) {
                return { txHex: '', txHash: '', errMsg: '', transFee: transFee, amountInTx: amountInTx, txids: txids };
            }

            const output2 = new BigNumber(this.utilServ.toBigNumber(amount, 8));

            amountInTx = output2;
            if (amount > 0) {
                if (output1 >= 2730) {
                    txb.addOutput(changeAddress.address, output1);
                }
                txb.addOutput(toAddress, output2.toNumber());
            } else {
                txb.addOutput(toAddress, output1);
            }


            for (index = 0; index < receiveAddsIndexArr.length; index++) {
                const keyPair = this.getKeyPairs(mycoin.tokenType ? mycoin.tokenType : mycoin.name, seed, 0, receiveAddsIndexArr[index], 'b');
                const alice = Btc.ECPair.fromWIF(keyPair.privateKey, BtcNetwork);
                txb.sign(index, alice);
            }

            for (index = 0; index < changeAddsIndexArr.length; index++) {
                const keyPair = this.getKeyPairs(mycoin.tokenType ? mycoin.tokenType : mycoin.name, seed, 1, changeAddsIndexArr[index], 'b');
                const alice = Btc.ECPair.fromWIF(keyPair.privateKey, BtcNetwork);
                txb.sign(receiveAddsIndexArr.length + index, alice);
            }

            txHex = txb.build().toHex();
            if (doSubmit) {
                const res = await this.apiServ.postTx(mycoin.name, txHex);
                txHash = res.txHash;
                errMsg = res.errMsg;

            } else {
                const tx = Btc.Transaction.fromHex(txHex);
                txHash = '0x' + tx.getId();
            }
        } else
            if (mycoin.name === 'FAB') {
                if (!satoshisPerBytes) {
                    satoshisPerBytes = environment.chains.FAB.satoshisPerBytes;
                }
                if (!bytesPerInput) {
                    bytesPerInput = environment.chains.FAB.bytesPerInput;
                }

                const res1 = await this.getFabTransactionHex(seed, mycoin, toAddress, amount, 0,
                    satoshisPerBytes, bytesPerInput, getTransFeeOnly);

                txHex = res1.txHex;
                errMsg = res1.errMsg;
                transFee = res1.transFee;
                amountInTx = res1.amountInTx;
                txids = res1.txids;
                transFee = new BigNumber(transFee).dividedBy(new BigNumber(1e8)).toNumber();

                if (getTransFeeOnly) {
                    return { 
                        txHex: '', txHash: '', errMsg: '', 
                        transFee: transFee, 
                        tranFeeUnit: mycoin.name,
                        amountInTx: amountInTx 
                    };
                }

                if (!errMsg && txHex) {
                    if (doSubmit) {
                        const res = await this.apiServ.postFabTx(txHex);
                        txHash = res.txHash;
                        errMsg = res.errMsg;
                    } else {
                        const tx = Btc.Transaction.fromHex(txHex);
                        txHash = '0x' + tx.getId();
                    }
                }

            } else
                if (mycoin.name === 'ETH') {
                    if (!gasPrice) {
                        gasPrice = environment.chains.ETH.gasPrice;
                    }
                    if (!gasLimit) {
                        gasLimit = environment.chains.ETH.gasLimit;
                    }
                    transFee = Number(new BigNumber(gasPrice).multipliedBy(new BigNumber(gasLimit)).dividedBy(new BigNumber(1e9)).toFixed(6));
                    if (getTransFeeOnly) {
                        return { txHex: '', txHash: '', errMsg: '', 
                        transFee: transFee, 
                        tranFeeUnit: mycoin.name,
                        amountInTx: amountInTx, txids: txids };
                    }
                    // amountNum = amount * 1e18;
                    amountNum = new BigNumber(amount).multipliedBy(new BigNumber(Math.pow(10, 18)));
                    const address1 = mycoin.receiveAdds[0];
                    const currentIndex = address1.index;

                    const keyPair = this.getKeyPairs(mycoin.tokenType?mycoin.tokenType:mycoin.name, seed, 0, currentIndex,'b');
                    const nonce = await this.apiServ.getEthNonce(address1.address);
                    const gasPriceFinal = new BigNumber(gasPrice).multipliedBy(new BigNumber(1e9)).toNumber();

                    amountInTx = amountNum;

                    const txParams = {
                        nonce: nonce,
                        gasPrice: gasPriceFinal,
                        gasLimit: gasLimit,
                        to: toAddress,
                        value: '0x' + amountNum.toString(16)
                    };

                    txHex = await this.web3Serv.signTxWithPrivateKey(txParams, keyPair);

                    if (doSubmit) {
                        const retEth = await this.apiServ.postEthTx(txHex);
                        txHash = retEth.txHash;
                        errMsg = retEth.errMsg;
                        if (txHash.indexOf('txerError') >= 0) {
                            errMsg = txHash;
                            txHash = '';
                        }
                    } else {
                        txHash = this.web3Serv.getTransactionHash(txHex);
                    }
                } else
                    if (mycoin.tokenType === 'ETH') { // etheruem tokens
                        const address1 = mycoin.receiveAdds[0];
                        if (!gasPrice) {
                            gasPrice = environment.chains.ETH.gasPrice;
                        }
                        if (!gasLimit) {
                            gasLimit = environment.chains.ETH.gasLimitToken;
                        }
                        transFee = new BigNumber(gasPrice).multipliedBy(new BigNumber(gasLimit)).dividedBy(new BigNumber(1e9)).toNumber();
                        if (getTransFeeOnly) {
                            return { txHex: '', txHash: '', errMsg: '', 
                            transFee: transFee, 
                            tranFeeUnit: mycoin.tokenType,
                            amountInTx: amountInTx, txids: txids };
                        }
                        const currentIndex = address1.index;
                        const keyPair = this.getKeyPairs(mycoin.tokenType ? mycoin.tokenType : mycoin.name, seed, 0, currentIndex, 'b');
                        const nonce = await this.apiServ.getEthNonce(address1.address);

                        let decimals = mycoin.decimals;

                        if (!decimals) {
                            decimals = 18;
                        }

                        const amountSent = new BigNumber(amount).multipliedBy(new BigNumber(Math.pow(10, decimals)));
                        const toAccount = toAddress;
                        let contractAddress = environment.addresses.smartContract[mycoin.name];
                        if(contractAddress.ETH) {
                            contractAddress = contractAddress.ETH;
                        }
                        const func = {
                            'constant': false,
                            'inputs': [
                                {
                                    'name': 'recipient',
                                    'type': 'address'
                                },
                                {
                                    'name': 'amount',
                                    'type': 'uint256'
                                }
                            ],
                            'name': 'transfer',
                            'outputs': [
                                {
                                    'name': '',
                                    'type': 'bool'
                                }
                            ],
                            'payable': false,
                            'stateMutability': 'nonpayable',
                            'type': 'function'
                        };

                        const abiHex = this.web3Serv.getFuncABI(func);

                        const gasPriceFinal = new BigNumber(gasPrice).multipliedBy(new BigNumber(1e9)).toNumber();

                        amountInTx = amountSent;
                        const txData = {
                            nonce: nonce,
                            gasPrice: gasPriceFinal,
                            gasLimit: gasLimit,
                            // to: contractAddress,
                            from: keyPair.address,
                            value: Number(0),
                            to: contractAddress,
                            data: '0x' + abiHex + this.utilServ.fixedLengh(toAccount.slice(2), 64) +
                                this.utilServ.fixedLengh(amountSent.toString(16), 64)
                        };
                        txHex = await this.web3Serv.signTxWithPrivateKey(txData, keyPair);

                        if (doSubmit) {
                            const retEth = await this.apiServ.postEthTx(txHex);
                            txHash = retEth.txHash;
                            errMsg = retEth.errMsg;

                            if (txHash.indexOf('txerError') >= 0) {
                                errMsg = txHash;
                                txHash = '';
                            }
                        } else {
                            txHash = this.web3Serv.getTransactionHash(txHex);
                        }
                    } else
                    if (mycoin.tokenType === 'FAB') { // fab tokens
                            if (!gasPrice) {
                                gasPrice = environment.chains.FAB.gasPrice;
                            }
                            if (!gasLimit) {
                                gasLimit = environment.chains.FAB.gasLimit;
                            }
                            if (!satoshisPerBytes) {
                                satoshisPerBytes = environment.chains.FAB.satoshisPerBytes;
                            }
                            if (!bytesPerInput) {
                                bytesPerInput = environment.chains.FAB.bytesPerInput;
                            }
                            let decimals = mycoin.decimals;
                            if (!decimals) {
                                decimals = 18;
                            }
                            // const amountSent = BigInt(amount * Math.pow(10, decimals));
                            // const amountSent = new BigNumber(amount).multipliedBy(new BigNumber(Math.pow(10, decimals)));
                            const amountSent = this.utilServ.toBigNumber(amount, decimals);
                            // const abiHex = this.web3Serv.getFabTransferABI([toAddress, amountSent.toString()]);

                            const funcTransfer: any = {
                                'constant': false,
                                'inputs': [
                                    {
                                        'name': 'to',
                                        'type': 'address'
                                    },
                                    {
                                        'name': 'value',
                                        'type': 'uint256'
                                    }
                                ],
                                'name': 'transfer',
                                'outputs': [
                                    {
                                        'name': '',
                                        'type': 'bool'
                                    }
                                ],
                                'payable': false,
                                'stateMutability': 'nonpayable',
                                'type': 'function'
                            };

                            amountInTx = new BigNumber(amountSent);
                            let fxnCallHex = this.web3Serv.getGeneralFunctionABI(funcTransfer, 
                                [this.utilServ.fabToExgAddress(toAddress), amountSent]);

                            fxnCallHex = this.utilServ.stripHexPrefix(fxnCallHex);
                            let contractAddress = mycoin.contractAddr;
                            if (mycoin.name === 'EXG') {
                                contractAddress = environment.addresses.smartContract.EXG;
                            } else if (mycoin.name === 'DUSD') {
                                contractAddress = environment.addresses.smartContract.DUSD;
                            }

                            // const keyPair = this.getKeyPairs(mycoin, seed, 0, 0);

                            // contractAddress = '0x28a6efffaf9f721a1e95667e3de54c622edc5ffa';
                            contractAddress = this.utilServ.stripHexPrefix(contractAddress);


                            const totalAmount = gasLimit * gasPrice / 1e8;

                            let totalFee = totalAmount;
                            const contract = Btc.script.compile([
                                84,
                                this.utilServ.number2Buffer(gasLimit),
                                this.utilServ.number2Buffer(gasPrice),
                                this.utilServ.hex2Buffer(fxnCallHex),
                                this.utilServ.hex2Buffer(contractAddress),
                                194
                            ]);

                            const contractSize = contract.toJSON.toString().length;

                            totalFee += this.utilServ.convertLiuToFabcoin(contractSize * 10);

                            const baseCoin = this.formMyCoin([{name: 'FAB', address: mycoin.receiveAdds[0].address}], 'FAB');
                            
                            baseCoin.tokenType = 'FAB';
                            const res1 = await this.getFabTransactionHex(seed, baseCoin, contract, 0, totalFee,
                                satoshisPerBytes, bytesPerInput, getTransFeeOnly);

                            baseCoin.tokenType = '';

                            txHex = res1.txHex;
                            errMsg = res1.errMsg;
                            transFee = res1.transFee;
                            txids = res1.txids;
                            transFee = new BigNumber(transFee).dividedBy(new BigNumber(1e8)).toNumber();

                            if (getTransFeeOnly) {
                                return { txHex: '', txHash: '', errMsg: '', 
                                transFee: transFee, 
                                tranFeeUnit: mycoin.tokenType,
                                amountInTx: amountInTx, txids: txids };
                            }

                            if (txHex) {
                                if (doSubmit) {
                                    const res = await this.apiServ.postFabTx(txHex);
                                    txHash = res.txHash;
                                    errMsg = res.errMsg;
                                } else {
                                    const tx = Btc.Transaction.fromHex(txHex);
                                    txHash = '0x' + tx.getId();
                                }
                            }
                    }

                    else if (mycoin.name == 'TRX') {
            
                        if (getTransFeeOnly) {
                            return { txHex: '', txHash: '', errMsg: '', 
                            transFee: feeLimit, 
                            tranFeeUnit: mycoin.name,
                            amountInTx: 0, txids: '' };
                        }            
                        const address1 = mycoin.receiveAdds[0];
                        const currentIndex = address1.index;            
                        const keyPair = this.getKeyPairs('TRX', seed, 0, currentIndex, 'b');;
                        let priKeyDisp = keyPair.privateKey.toString('hex');
            
                        
            
                        amountInTx = new BigNumber(this.utilServ.toBigNumber(amount, 6));
                        const amountNum = amountInTx.toNumber();
            
                        const tradeobj = await tronWeb.transactionBuilder.sendTrx(toAddress, amountNum, keyPair.address);
            
                        const txHexObj = await tronWeb.trx.sign(tradeobj, priKeyDisp);
            
                        if (txHexObj) {
                            if (doSubmit) {
                                const receipt = await tronWeb.trx.sendRawTransaction(txHexObj);
                                txHex = txHexObj.raw_data_hex;
                                txHash = receipt.transaction.txID;
                                errMsg = '';
                            } else {
                                txHex = txHexObj.raw_data_hex;
                                txHash = txHexObj.txID;
            
                                const raw_dat_hex = txHexObj.raw_data_hex;
                                txHash = txHexObj.txID;
                                txHex = '0a' + (raw_dat_hex.length / 2).toString(16) + '01' + raw_dat_hex + '1241' + txHexObj.signature;
                                  
                            }
                        }
                    } else 
                    if (mycoin.tokenType == 'TRX') {
            
                        if (getTransFeeOnly) {
                            return { txHex: '', txHash: '', errMsg: '', 
                            transFee: feeLimit, 
                            tranFeeUnit: mycoin.tokenType,
                            amountInTx: 0, txids: '' };
                        }   
                        let coinName = mycoin.name;
                        if(mycoin.name == 'USDTX') {
                            coinName = 'USDT';
                        }           
                        const trc20ContractAddress = environment.addresses.smartContract[coinName]['TRX'];//contract address
                        const address1 = mycoin.receiveAdds[0];
                        const currentIndex = address1.index;            
                        const keyPair = this.getKeyPairs('TRX', seed, 0, currentIndex, 'b');
                        let priKeyDisp = keyPair.privateKey.toString('hex');
                        const tronWeb = new TronWeb(
                            fullNode,
                            solidityNode,
                            eventServer,
                            priKeyDisp
                        );

                        amountInTx = new BigNumber(this.utilServ.toBigNumber(amount, 6));
                        const amountNum = amountInTx.toNumber();            
                        
                        
                        try {
                            let contract = await tronWeb.contract().at(trc20ContractAddress);

                            //Use call to execute a pure or view smart contract method.
                            // These methods do not modify the blockchain, do not cost anything to execute and are also not broadcasted to the network.
                            if (doSubmit) {
            
                                txHash = await contract.transfer(
                                    toAddress, //address _to
                                    amountNum   //amount
                                ).send({
                                    feeLimit: Math.round(feeLimit * 1e6) 
                                });
                            } else {

            
                               const functionSelector = 'transfer(address,uint256)';
            
                               const options= {
                                   feeLimit: environment.chains.TRX.feeLimitToken,
                                   callValue: 0,
                                   userFeePercentage: 100,
                                   shouldPollResponse: false,
                                   from: tronWeb.address.toHex(keyPair.address)
                               };
                        
                               const parameters = [
                                   {
                                     type: 'address',
                                     value: tronWeb.address.toHex(toAddress).replace(ADDRESS_PREFIX_REGEX, '0x')
                                   },
                                   { type: 'uint256', value: amountNum }
                               ];
            
                                const transaction = await tronWeb.transactionBuilder.triggerSmartContract(
                                    tronWeb.address.toHex(trc20ContractAddress),
                                   functionSelector,
                                   options,
                                   parameters,
                                   tronWeb.address.toHex(keyPair.address)
                               );
                        
                               const txHexObj = await tronWeb.trx.sign(transaction.transaction, priKeyDisp);
                               const raw_dat_hex = txHexObj.raw_data_hex;
                               txHash = txHexObj.txID;
                               txHex = '0a' + (raw_dat_hex.length / 2).toString(16) + '01' + raw_dat_hex + '1241' + txHexObj.signature;

                            }
                            
                            
                        } catch(error) {
                            console.error("trigger smart contract error",error)
                        }            
                    }
            

        const ret = { txHex: txHex, txHash: txHash, errMsg: errMsg, 
            transFee: transFee, tranFeeUnit: tranFeeUnit,
            amountInTx: amountInTx, txids: txids };
        return ret;
    }
}