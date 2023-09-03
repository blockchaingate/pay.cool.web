import EthersAdapter from '@safe-global/safe-ethers-lib'
import { ethers } from 'ethers'
import type { JsonRpcProvider, Web3Provider } from '@ethersproject/providers'

export const createEthersAdapter = (provider: Web3Provider, signer = null) => {
  if(!signer) {
    signer = provider.getSigner(0);
  }
  return new EthersAdapter({
    ethers,
    signerOrProvider: signer,
  })
}
