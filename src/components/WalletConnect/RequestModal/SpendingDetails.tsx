import React from 'react'
import { useTranslation } from 'react-i18next'
import { CurrencyLogo } from 'src/components/CurrencyLogo'
import { Flex } from 'src/components/layout'
import { Text } from 'src/components/Text'
import { ChainId } from 'src/constants/chains'
import { useUSDValue } from 'src/features/gas/hooks'
import { NativeCurrency } from 'src/features/tokenLists/NativeCurrency'
import { iconSizes } from 'src/styles/sizing'
import { formatCurrencyAmount, formatUSDPrice, NumberType } from 'src/utils/format'
import { tryParseRawAmount } from 'src/utils/tryParseAmount'

export function SpendingDetails({ value, chainId }: { value: string; chainId: ChainId }) {
  const { t } = useTranslation()

  const nativeCurrency = NativeCurrency.onChain(chainId)
  const nativeCurrencyAmount = tryParseRawAmount(value, nativeCurrency)
  const usdValue = useUSDValue(chainId, value)

  return (
    <Flex row alignItems="center" gap="md">
      <Text color="textSecondary" variant="bodySmall">
        {t('Sending')}:
      </Text>
      <Flex row alignItems="center" gap="xxs">
        <CurrencyLogo currency={nativeCurrency} size={iconSizes.sm} />
        <Text variant="bodySmall">
          {formatCurrencyAmount(nativeCurrencyAmount, NumberType.TokenTx)} {nativeCurrency.symbol}
        </Text>
        <Text color="textSecondary" loading={!usdValue} variant="bodySmall">
          ({formatUSDPrice(usdValue)})
        </Text>
      </Flex>
    </Flex>
  )
}