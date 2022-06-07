import React, { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useAppTheme } from 'src/app/hooks'
import Check from 'src/assets/icons/check.svg'
import { NetworkLogo } from 'src/components/CurrencyLogo/NetworkLogo'
import { Box, Flex } from 'src/components/layout'
import { Separator } from 'src/components/layout/Separator'
import { ActionSheetModal } from 'src/components/modals/ActionSheetModal'
import { Text } from 'src/components/Text'
import { ChainId, CHAIN_INFO } from 'src/constants/chains'
import { useActiveChainIds } from 'src/features/chains/utils'
import { ElementName, ModalName } from 'src/features/telemetry/constants'
import { WalletConnectSession } from 'src/features/walletConnect/walletConnectSlice'

type Props = {
  pendingSession: WalletConnectSession
  selectedChainId: ChainId
  onPressChain: (chainId: ChainId) => void
  onPressDisconnect: () => void
  onClose: () => void
}

export const PendingConnectionSwitchNetworkModal = ({
  pendingSession,
  selectedChainId,
  onPressChain,
  onPressDisconnect,
  onClose,
}: Props) => {
  const activeChains = useActiveChainIds()
  const theme = useAppTheme()
  const { t } = useTranslation()

  const options = useMemo(
    () =>
      activeChains
        .map((chainId) => {
          const info = CHAIN_INFO[chainId]
          return {
            key: `${ElementName.NetworkButton}-${chainId}`,
            onPress: () => onPressChain(chainId),
            render: () => (
              <>
                <Separator />
                <Flex row alignItems="center" justifyContent="space-between" px="lg" py="md">
                  <NetworkLogo chainId={chainId} size={24} />
                  <Text color="neutralTextPrimary" variant="subHead1">
                    {info.label}
                  </Text>
                  <Box height={24} width={24}>
                    {chainId === selectedChainId && (
                      <Check color={theme.colors.neutralTextSecondary} height={24} width={24} />
                    )}
                  </Box>
                </Flex>
              </>
            ),
          }
        })
        .concat([
          {
            key: ElementName.Disconnect,
            onPress: onPressDisconnect,
            render: () => (
              <>
                <Separator />
                <Flex centered row px="lg" py="md">
                  <Text color="accentBackgroundFailure" variant="subHead1">
                    {t('Disconnect')}
                  </Text>
                </Flex>
              </>
            ),
          },
        ]),
    [
      activeChains,
      selectedChainId,
      onPressChain,
      onPressDisconnect,
      t,
      theme.colors.neutralTextSecondary,
    ]
  )

  return (
    <ActionSheetModal
      header={
        <Flex centered gap="xxs" py="md">
          <Text variant="mediumLabel">{t('Switch Network')}</Text>
          <Text color="accentBackgroundActive" variant="caption">
            {pendingSession.dapp.url}
          </Text>
        </Flex>
      }
      isVisible={true}
      name={ModalName.NetworkSelector}
      options={options}
      onClose={onClose}
    />
  )
}
