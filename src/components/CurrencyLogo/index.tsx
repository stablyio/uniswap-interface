import { ShadowProps } from '@shopify/restyle'
import { Currency } from '@uniswap/sdk-core'
import React from 'react'
import { Image } from 'react-native'
import { SvgUri } from 'react-native-svg'
import { ETHEREUM_LOGO } from 'src/assets'
import { NetworkLogo } from 'src/components/CurrencyLogo/NetworkLogo'
import { style } from 'src/components/CurrencyLogo/styles'
import { getCurrencyLogoSrcs, maybeReplaceIPFSScheme } from 'src/components/CurrencyLogo/utils'
import { Box } from 'src/components/layout/Box'
import { ChainId } from 'src/constants/chains'
import { Theme } from 'src/styles/theme'

const DEFAULT_SIZE = 40
const NETWORK_LOGO_SIZE = 16

const SHADOW_OFFSET: ShadowProps<Theme>['shadowOffset'] = { width: 0, height: 2 }

interface CurrencyLogoProps {
  currency: Currency
  size?: number
}

export function CurrencyLogo(props: CurrencyLogoProps) {
  const { size, currency } = props
  const currencyLogoSize = (size ?? DEFAULT_SIZE) - 4
  const networkSize = NETWORK_LOGO_SIZE
  return (
    <Box alignItems="center" height={size} justifyContent="center" width={size}>
      <CurrencyLogoOnly currency={currency} size={currencyLogoSize} />
      {currency.chainId !== ChainId.Mainnet && (
        <Box
          bottom={0}
          position="absolute"
          right={0}
          shadowColor="black"
          shadowOffset={SHADOW_OFFSET}
          shadowOpacity={0.1}
          shadowRadius={4}>
          <NetworkLogo chainId={currency.chainId} size={networkSize} />
        </Box>
      )}
    </Box>
  )
}

export function CurrencyLogoOnly({ currency, size = 40 }: CurrencyLogoProps) {
  const srcs: string[] = getCurrencyLogoSrcs(currency)

  if (currency?.isNative) {
    return (
      <Image
        source={ETHEREUM_LOGO}
        style={[style.image, { width: size, height: size, borderRadius: size / 2 }]}
      />
    )
  }

  // TODO(#95): Currently just uses the first URL in the source because unclear when we want to use a different one

  if (srcs.length > 0) {
    const src = srcs[0].toLowerCase()
    if (src.includes('.svg')) {
      return <SvgUri height={size} uri={srcs[0]} width={size} />
    }
    return (
      <Image
        source={srcs.map(maybeReplaceIPFSScheme)}
        style={[style.image, { width: size, height: size, borderRadius: size / 2 }]}
      />
    )
  }

  return null
}
