import EthersAdapter from '@safe-global/safe-ethers-lib'
import { ethers } from 'ethers'
import type { JsonRpcProvider, Web3Provider } from '@ethersproject/providers'

export const createEthersAdapter = (provider: Web3Provider) => {
  const signer = provider.getSigner(0)
  return new EthersAdapter({
    ethers,
    signerOrProvider: signer,
  })
}
