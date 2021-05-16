import { ethers } from 'ethers'
import { Server, Light, ERC20 } from '@airswap/protocols'
import { LightOrder } from '@airswap/types'
import { toAtomicString } from '@airswap/utils'

export function requestOrder(
  url: string,
  chainId: string,
  signerToken: string,
  senderToken: string,
  senderAmount: string,
  senderWallet: string,
) {
  return new Promise<any>(async (resolve, reject) => {
    try {
      const server = new Server(url, Light.getAddress(chainId))
      resolve(
        await server.getSignerSideOrder(
          toAtomicString(senderAmount, 18),
          signerToken,
          senderToken,
          senderWallet,
        ),
      )
    } catch (e) {
      reject(e)
    }
  })
}

export function approveToken(
  senderToken: string,
  provider: ethers.providers.Web3Provider,
) {
  return new Promise<any>(async (resolve, reject) => {
    try {
      const spender = Light.getAddress(String(provider.network.chainId))
      resolve(new ERC20(senderToken).approve(spender, provider.getSigner()))
    } catch (e) {
      reject(e)
    }
  })
}

export function takeOrder(
  order: LightOrder,
  provider: ethers.providers.Web3Provider,
) {
  return new Promise<any>(async (resolve, reject) => {
    try {
      resolve(
        new Light(String(provider.network.chainId), provider).swap(
          order,
          provider.getSigner(),
        ),
      )
    } catch (e) {
      reject(e)
    }
  })
}
