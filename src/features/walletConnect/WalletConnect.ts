import { NativeModules } from 'react-native'
import { ALL_SUPPORTED_CHAIN_IDS } from 'src/constants/chains'

const { RNWalletConnect } = NativeModules

export const initializeWalletConnect = () => {
  RNWalletConnect.initialize(ALL_SUPPORTED_CHAIN_IDS)
}

export const reconnectAccountSessions = (accounts: string[]) => {
  RNWalletConnect.reconnectAccountSessions(accounts)
}

export const connectToApp = (uri: string, account: string) => {
  RNWalletConnect.connect(uri, account)
}

export const disconnectFromApp = (topic: string, account: string) => {
  RNWalletConnect.disconnect(topic, account)
}

export const settlePendingSession = (chainId: number, account: string, approved: boolean) => {
  RNWalletConnect.settlePendingSession(chainId, account, approved)
}

export const changeChainId = (topic: string, chainId: number, account: string) => {
  RNWalletConnect.changeChainId(topic, chainId, account)
}

export const rejectRequest = (requestInternalId: string, account: string) => {
  RNWalletConnect.rejectRequest(requestInternalId, account)
}

export const sendSignature = (requestInternalId: string, signature: string, account: string) => {
  RNWalletConnect.sendSignature(requestInternalId, signature, account)
}
