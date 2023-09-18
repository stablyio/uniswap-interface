import React from 'react'
import { useTranslation } from 'react-i18next'
import { TouchableArea } from 'src/components/buttons/TouchableArea'
import { SpinningLoader } from 'src/components/loading/SpinningLoader'
import { InlineNetworkPill } from 'src/components/Network/NetworkPill'
import { Flex, Text, useSporeColors } from 'ui/src'
import InfoCircleSVG from 'ui/src/assets/icons/info-circle.svg'
import { iconSizes } from 'ui/src/theme'
import { formatUSDPrice, NumberType } from 'utilities/src/format/format'
import { ChainId } from 'wallet/src/constants/chains'

export function NetworkFee({
  chainId,
  gasFeeUSD,
  gasFallbackUsed,
  onShowGasWarning,
}: {
  chainId: ChainId
  gasFeeUSD?: string
  gasFallbackUsed?: boolean
  onShowGasWarning?: () => void
}): JSX.Element {
  const { t } = useTranslation()
  const colors = useSporeColors()

  const feeSectionContent = (
    <>
      <Text
        color={gasFallbackUsed && gasFeeUSD ? '$DEP_accentWarning' : '$neutral1'}
        variant="subheadSmall">
        {formatUSDPrice(gasFeeUSD, NumberType.FiatGasPrice)}
      </Text>
      {gasFallbackUsed && gasFeeUSD && (
        <Flex gap="$none" ml="$spacing4">
          <InfoCircleSVG
            color={colors.DEP_accentWarning.val}
            height={iconSizes.icon20}
            width={iconSizes.icon20}
          />
        </Flex>
      )}
    </>
  )

  return (
    <Flex row alignItems="center" justifyContent="space-between">
      <Text variant="subheadSmall">{t('Network fee')}</Text>
      <Flex row alignItems="center" gap="$spacing8">
        <InlineNetworkPill chainId={chainId} />
        <Text variant="subheadSmall">•</Text>
        {!gasFeeUSD ? (
          <SpinningLoader size={iconSizes.icon20} />
        ) : gasFallbackUsed && onShowGasWarning ? (
          <TouchableArea
            alignItems="center"
            flexDirection="row"
            justifyContent="space-between"
            onPress={onShowGasWarning}>
            {feeSectionContent}
          </TouchableArea>
        ) : (
          <Flex row alignItems="center" justifyContent="space-between">
            {feeSectionContent}
          </Flex>
        )}
      </Flex>
    </Flex>
  )
}
