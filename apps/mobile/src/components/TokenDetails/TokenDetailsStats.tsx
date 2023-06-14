import React, { useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { ScrollView } from 'react-native'
import { useAppTheme } from 'src/app/hooks'
import { Flex } from 'src/components/layout'
import { Text } from 'src/components/Text'
import { LongText } from 'src/components/text/LongText'
import { useIsDarkMode } from 'src/features/appearance/hooks'
import { ElementName } from 'src/features/telemetry/constants'
import { ExplorerDataType, getExplorerLink, getTwitterLink } from 'src/utils/linking'
import StatsIcon from 'ui/assets/icons/chart-bar.svg'
import GlobeIcon from 'ui/assets/icons/globe-filled.svg'
import AddressIcon from 'ui/assets/icons/sticky-note-text-square.svg'
import TwitterIcon from 'ui/assets/icons/twitter.svg'
import EtherscanLogoDark from 'ui/assets/logos/etherscan-logo-dark.svg'
import EtherscanLogoLight from 'ui/assets/logos/etherscan-logo-light.svg'
import { TokenDetailsScreenQuery } from 'wallet/src/data/__generated__/types-and-hooks'
import { sanitizeAddressText, shortenAddress } from 'wallet/src/utils/addresses'
import { currencyIdToAddress, currencyIdToChain } from 'wallet/src/utils/currencyId'
import { formatNumber, NumberType } from 'wallet/src/utils/format'
import { LinkButton, LinkButtonType } from './LinkButton'

function StatsRow({
  label,
  children,
  tokenColor,
}: {
  label: string
  children: JSX.Element
  tokenColor?: Nullable<string>
}): JSX.Element {
  const theme = useAppTheme()
  return (
    <Flex row justifyContent="space-between" paddingLeft="spacing2">
      <Flex row alignItems="center" gap="spacing8" justifyContent="flex-start">
        <StatsIcon
          color={tokenColor ?? theme.colors.textTertiary}
          height={theme.iconSizes.icon12}
          width={theme.iconSizes.icon12}
        />
        <Text color="textPrimary" variant="bodySmall">
          {label}
        </Text>
      </Flex>
      {children}
    </Flex>
  )
}

export function TokenDetailsMarketData({
  marketCap,
  volume,
  priceLow52W,
  priceHight52W,
  isLoading = false,
  tokenColor,
}: {
  marketCap?: number
  volume?: number
  priceLow52W?: number
  priceHight52W?: number
  isLoading?: boolean
  tokenColor?: Nullable<string>
}): JSX.Element {
  const { t } = useTranslation()

  // Utility component to render formatted values
  const FormattedValue = useCallback(
    ({ value, numberType }: { value?: number; numberType: NumberType }) => {
      return (
        <Text loading={isLoading} variant="buttonLabelSmall">
          {formatNumber(value, numberType)}
        </Text>
      )
    },
    [isLoading]
  )

  return (
    <Flex gap="spacing8">
      <StatsRow label={t('24h Uniswap volume')} tokenColor={tokenColor}>
        <FormattedValue numberType={NumberType.FiatTokenStats} value={volume} />
      </StatsRow>
      <StatsRow label={t('Market cap')} tokenColor={tokenColor}>
        <FormattedValue numberType={NumberType.FiatTokenStats} value={marketCap} />
      </StatsRow>
      <StatsRow label={t('52W high')} tokenColor={tokenColor}>
        <FormattedValue numberType={NumberType.FiatTokenDetails} value={priceHight52W} />
      </StatsRow>
      <StatsRow label={t('52W low')} tokenColor={tokenColor}>
        <FormattedValue numberType={NumberType.FiatTokenDetails} value={priceLow52W} />
      </StatsRow>
    </Flex>
  )
}

export function TokenDetailsStats({
  currencyId,
  data,
  tokenColor,
}: {
  currencyId: string
  data: TokenDetailsScreenQuery | undefined
  tokenColor?: Maybe<string>
}): JSX.Element {
  const { t } = useTranslation()
  const theme = useAppTheme()

  const tokenData = data?.token
  const tokenProjectData = tokenData?.project

  const marketData = tokenProjectData?.markets ? tokenProjectData.markets[0] : null

  const chainId = currencyIdToChain(currencyId)
  const address = currencyIdToAddress(currencyId)

  const explorerLink = getExplorerLink(chainId, address, ExplorerDataType.TOKEN)

  return (
    <Flex gap="spacing24">
      {tokenProjectData?.description && (
        <Flex gap="spacing4">
          {tokenProjectData?.name && (
            <Text color="textTertiary" variant="subheadSmall">
              {t('About {{ token }}', { token: tokenProjectData.name })}
            </Text>
          )}
          <Flex gap="spacing16">
            <LongText
              gap="spacing2"
              initialDisplayedLines={5}
              linkColor={tokenColor ?? theme.colors.textPrimary}
              readMoreOrLessColor={tokenColor ?? theme.colors.accentAction}
              text={tokenProjectData.description.trim()}
            />
          </Flex>
        </Flex>
      )}
      <Flex gap="spacing4">
        <Text color="textTertiary" variant="subheadSmall">
          {t('Stats')}
        </Text>
        <TokenDetailsMarketData
          marketCap={marketData?.marketCap?.value}
          priceHight52W={marketData?.priceHigh52W?.value}
          priceLow52W={marketData?.priceLow52W?.value}
          tokenColor={tokenColor}
          volume={tokenData?.market?.volume?.value}
        />
      </Flex>
      <Flex gap="spacing8">
        <Text color="textTertiary" variant="subheadSmall">
          {t('Links')}
        </Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <Flex row gap="spacing8">
            {tokenData?.address && (
              <LinkButton
                Icon={AddressIcon}
                buttonType={LinkButtonType.Copy}
                element={ElementName.TokenAddress}
                label={sanitizeAddressText(shortenAddress(tokenData?.address)) ?? ''}
                value={tokenData?.address}
              />
            )}
            {tokenProjectData?.homepageUrl && (
              <LinkButton
                Icon={GlobeIcon}
                buttonType={LinkButtonType.Link}
                element={ElementName.TokenLinkWebsite}
                label={t('Website')}
                value={tokenProjectData.homepageUrl}
              />
            )}
            {tokenProjectData?.twitterName && (
              <LinkButton
                Icon={TwitterIcon}
                buttonType={LinkButtonType.Link}
                element={ElementName.TokenLinkTwitter}
                label={t('Twitter')}
                value={getTwitterLink(tokenProjectData.twitterName)}
              />
            )}
            <LinkButton
              Icon={useIsDarkMode() ? EtherscanLogoDark : EtherscanLogoLight}
              buttonType={LinkButtonType.Link}
              element={ElementName.TokenLinkEtherscan}
              label={t('Etherscan')}
              value={explorerLink}
            />
          </Flex>
        </ScrollView>
      </Flex>
    </Flex>
  )
}