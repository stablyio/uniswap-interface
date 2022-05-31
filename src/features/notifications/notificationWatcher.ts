import { TradeType } from '@uniswap/sdk-core'
import { AssetType } from 'src/entities/assets'
import { pushNotification } from 'src/features/notifications/notificationSlice'
import { AppNotificationType } from 'src/features/notifications/types'
import { finalizeTransaction } from 'src/features/transactions/slice'
import { TransactionStatus, TransactionType } from 'src/features/transactions/types'
import { logger } from 'src/utils/logger'
import { put, takeLatest } from 'typed-redux-saga'

export function* notificationWatcher() {
  yield* takeLatest(finalizeTransaction.type, pushTransactionNotification)
}

export function* pushTransactionNotification(action: ReturnType<typeof finalizeTransaction>) {
  const { chainId, status, typeInfo, hash, from } = action.payload

  // TODO: Build notifications for `cancelled` txs
  if (status === TransactionStatus.Cancelled) {
    logger.info(
      'notificationWatcher',
      'pushTransactionNotification',
      'Notifications for cancelled transactions are not yet built'
    )
    return
  }

  const baseNotificationData = {
    txStatus: status,
    chainId,
    txHash: hash,
    address: from,
  }

  switch (typeInfo.type) {
    case TransactionType.Approve:
      yield* put(
        pushNotification({
          ...baseNotificationData,
          type: AppNotificationType.Transaction,
          txType: TransactionType.Approve,
          tokenAddress: typeInfo.tokenAddress,
          spender: typeInfo.spender,
        })
      )
      break
    case TransactionType.Swap:
      const inputCurrencyAmountRaw =
        typeInfo.tradeType === TradeType.EXACT_INPUT
          ? typeInfo.inputCurrencyAmountRaw
          : typeInfo.expectedInputCurrencyAmountRaw
      const outputCurrencyAmountRaw =
        typeInfo.tradeType === TradeType.EXACT_OUTPUT
          ? typeInfo.outputCurrencyAmountRaw
          : typeInfo.expectedOutputCurrencyAmountRaw

      yield* put(
        pushNotification({
          ...baseNotificationData,
          type: AppNotificationType.Transaction,
          txType: TransactionType.Swap,
          inputCurrencyId: typeInfo.inputCurrencyId,
          outputCurrencyId: typeInfo.outputCurrencyId,
          inputCurrencyAmountRaw,
          outputCurrencyAmountRaw,
          tradeType: typeInfo.tradeType,
        })
      )
      break
    case TransactionType.Send:
      if (typeInfo?.assetType === AssetType.Currency && typeInfo?.currencyAmountRaw) {
        yield* put(
          pushNotification({
            ...baseNotificationData,
            type: AppNotificationType.Transaction,
            txType: TransactionType.Send,
            assetType: typeInfo.assetType,
            tokenAddress: typeInfo.tokenAddress,
            currencyAmountRaw: typeInfo.currencyAmountRaw,
            recipient: typeInfo.recipient,
          })
        )
      } else if (
        (typeInfo?.assetType === AssetType.ERC1155 || typeInfo?.assetType === AssetType.ERC721) &&
        typeInfo?.tokenId
      ) {
        yield* put(
          pushNotification({
            ...baseNotificationData,
            type: AppNotificationType.Transaction,
            txType: TransactionType.Send,
            assetType: typeInfo.assetType,
            tokenAddress: typeInfo.tokenAddress,
            tokenId: typeInfo.tokenId,
            recipient: typeInfo.recipient,
          })
        )
      }
      break
    case TransactionType.Receive:
      if (
        typeInfo?.assetType === AssetType.Currency &&
        typeInfo?.currencyAmountRaw &&
        typeInfo?.sender
      ) {
        yield* put(
          pushNotification({
            ...baseNotificationData,
            type: AppNotificationType.Transaction,
            txType: TransactionType.Receive,
            assetType: typeInfo.assetType,
            tokenAddress: typeInfo.tokenAddress,
            currencyAmountRaw: typeInfo.currencyAmountRaw,
            sender: typeInfo.sender,
          })
        )
      } else if (
        (typeInfo?.assetType === AssetType.ERC1155 || typeInfo?.assetType === AssetType.ERC721) &&
        typeInfo?.tokenId
      ) {
        yield* put(
          pushNotification({
            ...baseNotificationData,
            type: AppNotificationType.Transaction,
            txType: TransactionType.Receive,
            assetType: typeInfo.assetType,
            tokenAddress: typeInfo.tokenAddress,
            tokenId: typeInfo.tokenId,
            sender: typeInfo.sender,
          })
        )
      }
      break
    case TransactionType.Unknown:
      yield* put(
        pushNotification({
          ...baseNotificationData,
          type: AppNotificationType.Transaction,
          txType: TransactionType.Unknown,
          tokenAddress: typeInfo?.tokenAddress,
        })
      )
      break
  }
}
