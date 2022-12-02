import { Currency, Price, TradeType } from '@uniswap/sdk-core'
import { BigNumber, BigNumberish } from 'ethers'
import { TFunction } from 'i18next'
import { WRAPPED_NATIVE_CURRENCY } from 'src/constants/tokens'
import { DEFAULT_SLIPPAGE_TOLERANCE_PERCENT } from 'src/features/transactions/swap/hooks'
import { Trade } from 'src/features/transactions/swap/useTrade'
import { WrapType } from 'src/features/transactions/swap/wrapSaga'
import {
  ExactInputSwapTransactionInfo,
  ExactOutputSwapTransactionInfo,
  TransactionType,
} from 'src/features/transactions/types'
import { areAddressesEqual } from 'src/utils/addresses'
import { currencyId } from 'src/utils/currencyId'
import { formatPrice, NumberType } from 'src/utils/format'

export function serializeQueryParams(
  params: Record<string, Parameters<typeof encodeURIComponent>[0]>
) {
  let queryString = []
  for (const param in params) {
    queryString.push(`${encodeURIComponent(param)}=${encodeURIComponent(params[param])}`)
  }
  return queryString.join('&')
}

export function formatExecutionPrice(price: Price<Currency, Currency> | undefined) {
  if (!price) return '-'

  return `1 ${price.quoteCurrency?.symbol} = ${formatPrice(price, NumberType.FiatTokenPrice)} ${
    price?.baseCurrency.symbol
  }`
}

export function getWrapType(
  inputCurrency: Currency | null | undefined,
  outputCurrency: Currency | null | undefined
): WrapType {
  if (!inputCurrency || !outputCurrency || inputCurrency.chainId !== outputCurrency.chainId) {
    return WrapType.NotApplicable
  }

  const weth = WRAPPED_NATIVE_CURRENCY[inputCurrency.chainId]

  if (inputCurrency.isNative && outputCurrency.equals(weth)) {
    return WrapType.Wrap
  } else if (outputCurrency.isNative && inputCurrency.equals(weth)) {
    return WrapType.Unwrap
  }

  return WrapType.NotApplicable
}

export function isWrapAction(wrapType: WrapType): wrapType is WrapType.Unwrap | WrapType.Wrap {
  return wrapType === WrapType.Unwrap || wrapType === WrapType.Wrap
}

export function tradeToTransactionInfo(
  trade: Trade
): ExactInputSwapTransactionInfo | ExactOutputSwapTransactionInfo {
  return trade.tradeType === TradeType.EXACT_INPUT
    ? {
        type: TransactionType.Swap,
        inputCurrencyId: currencyId(trade.inputAmount.currency),
        outputCurrencyId: currencyId(trade.outputAmount.currency),
        tradeType: TradeType.EXACT_INPUT,
        inputCurrencyAmountRaw: trade.inputAmount.quotient.toString(),
        expectedOutputCurrencyAmountRaw: trade.outputAmount.quotient.toString(),
        minimumOutputCurrencyAmountRaw: trade
          .minimumAmountOut(DEFAULT_SLIPPAGE_TOLERANCE_PERCENT)
          .quotient.toString(),
      }
    : {
        type: TransactionType.Swap,
        inputCurrencyId: currencyId(trade.inputAmount.currency),
        outputCurrencyId: currencyId(trade.outputAmount.currency),
        tradeType: TradeType.EXACT_OUTPUT,
        outputCurrencyAmountRaw: trade.outputAmount.quotient.toString(),
        expectedInputCurrencyAmountRaw: trade.inputAmount.quotient.toString(),
        maximumInputCurrencyAmountRaw: trade
          .maximumAmountIn(DEFAULT_SLIPPAGE_TOLERANCE_PERCENT)
          .quotient.toString(),
      }
}

export function requireAcceptNewTrade(
  oldTrade: NullUndefined<Trade>,
  newTrade: NullUndefined<Trade>
) {
  return oldTrade?.quote?.methodParameters?.calldata !== newTrade?.quote?.methodParameters?.calldata
}

export const getRateToDisplay = (trade: Trade, showInverseRate: boolean) => {
  const price = showInverseRate ? trade.executionPrice.invert() : trade.executionPrice
  const formattedPrice = formatPrice(price, NumberType.TokenTx)
  const { quoteCurrency, baseCurrency } = trade.executionPrice
  const rate = `1 ${quoteCurrency.symbol} = ${formattedPrice} ${baseCurrency.symbol}`
  const inverseRate = `1 ${baseCurrency.symbol} = ${formattedPrice} ${quoteCurrency.symbol}`
  return showInverseRate ? rate : inverseRate
}

export const formatAsHexString = (input?: BigNumberish) =>
  input !== undefined ? BigNumber.from(input).toHexString() : input

export const getActionName = (t: TFunction, wrapType: WrapType) => {
  switch (wrapType) {
    case WrapType.Unwrap:
      return t('Unwrap')
    case WrapType.Wrap:
      return t('Wrap')
    default:
      return t('Swap')
  }
}

export const getReviewActionName = (t: TFunction, wrapType: WrapType) => {
  switch (wrapType) {
    case WrapType.Unwrap:
      return t('Review unwrap')
    case WrapType.Wrap:
      return t('Review wrap')
    default:
      return t('Review swap')
  }
}

export function sumGasFees(gasFee1?: string | undefined, gasFee2?: string): string | undefined {
  if (!gasFee1 || !gasFee2) return gasFee1 || gasFee2

  return BigNumber.from(gasFee1).add(gasFee2).toString()
}

export const clearStaleTrades = (
  trade: Trade,
  currencyIn: NullUndefined<Currency>,
  currencyOut: NullUndefined<Currency>
): Trade | null => {
  const currencyInAddress = currencyIn?.wrapped.address
  const currencyOutAddress = currencyOut?.wrapped.address

  const inputsMatch =
    !!currencyInAddress &&
    areAddressesEqual(currencyInAddress, trade?.inputAmount.currency.wrapped.address)
  const outputsMatch =
    !!currencyOutAddress &&
    areAddressesEqual(currencyOutAddress, trade?.outputAmount.currency.wrapped.address)

  // if the addresses entered by the user don't match what is being returned by the quote endpoint
  // then set `trade` to null
  return inputsMatch && outputsMatch ? trade : null
}