import { Injectable } from '@angular/core';
import { SafeFactory } from '@safe-global/safe-core-sdk';
import type { PredictSafeProps } from '@safe-global/safe-core-sdk/dist/src/safeFactory'
import {createEthersAdapter } from '../hooks/coreSDK/safeCoreSDK';
var Web3 = require('web3');
import { ethers } from 'ethers';
@Injectable()
export class SafeService {
    async predictSafeAddress (chain: string, props: PredictSafeProps)  {

        const provider = new ethers.providers.Web3Provider(new Web3.providers.HttpProvider('http://localhost:8545'));
        console.log('provider=', provider);
        const ethAdapter = createEthersAdapter(provider);
        const safeFactory = await SafeFactory.create({ ethAdapter })
        return safeFactory.predictSafeAddress(props)

    }

}