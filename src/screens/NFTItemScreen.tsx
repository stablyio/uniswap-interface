import { utils } from 'ethers'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { useAppDispatch, useAppTheme } from 'src/app/hooks'
import { HomeStackScreenProp } from 'src/app/navigation/types'
import SendIcon from 'src/assets/icons/send.svg'
import VerifiedIcon from 'src/assets/icons/verified.svg'
import OpenSeaIcon from 'src/assets/logos/opensea.svg'
import { BackButton } from 'src/components/buttons/BackButton'
import { Button } from 'src/components/buttons/Button'
import { PrimaryButton } from 'src/components/buttons/PrimaryButton'
import { Chevron } from 'src/components/icons/Chevron'
import { NFTViewer } from 'src/components/images/NFTViewer'
import { Box, Flex } from 'src/components/layout'
import { HeaderScrollScreen } from 'src/components/layout/screens/HeaderScrollScreen'
import { Text } from 'src/components/Text'
import { LongText } from 'src/components/text/LongText'
import { ChainId } from 'src/constants/chains'
import { AssetType } from 'src/entities/assets'
import { openModal } from 'src/features/modals/modalSlice'
import { useNFT } from 'src/features/nfts/hooks'
import { ElementName, ModalName } from 'src/features/telemetry/constants'
import {
  CurrencyField,
  TransactionState,
} from 'src/features/transactions/transactionState/transactionState'
import { useActiveAccountAddress } from 'src/features/wallet/hooks'
import { Screens } from 'src/screens/Screens'
import { openUri } from 'src/utils/linking'

const MAX_NFT_IMAGE_SIZE = 512

export function NFTItemScreen({
  navigation,
  route: {
    params: { owner, address, token_id },
  },
}: HomeStackScreenProp<Screens.NFTItem>) {
  const theme = useAppTheme()
  const { t } = useTranslation()
  const dispatch = useAppDispatch()

  const { asset } = useNFT(owner, address, token_id)
  const accountAddress = useActiveAccountAddress()

  // TODO: better handle error / loading states
  if (!asset) return null

  const onPressCollection = () =>
    navigation.navigate(Screens.NFTCollection, {
      collectionAddress: utils.getAddress(asset.asset_contract.address),
      owner,
      slug: asset.collection.slug,
    })

  const onPressSend = () => {
    const transferFormState: TransactionState = {
      exactCurrencyField: CurrencyField.INPUT,
      exactAmountToken: '',
      [CurrencyField.INPUT]: {
        chainId: ChainId.Mainnet,
        address: asset.asset_contract.address,
        tokenId: asset.token_id,
        type: asset.asset_contract.schema_name === 'ERC1155' ? AssetType.ERC1155 : AssetType.ERC721,
      },
      [CurrencyField.OUTPUT]: null,
    }
    dispatch(openModal({ name: ModalName.Send, initialState: transferFormState }))
  }

  const isMyNFT = owner && owner === accountAddress

  return (
    <HeaderScrollScreen
      contentHeader={<BackButton showButtonLabel />}
      fixedHeader={<BackButton showButtonLabel />}>
      <Flex my="sm">
        <Flex centered>
          <NFTViewer autoplay maxHeight={MAX_NFT_IMAGE_SIZE} uri={asset.image_url} />
        </Flex>

        <Flex mx="md">
          <Flex gap="xs">
            <Text variant="headlineSmall">{asset?.name}</Text>

            {/* Collection info */}
            <Button onPress={onPressCollection}>
              <Flex
                row
                alignItems="center"
                borderColor="backgroundOutline"
                borderRadius="md"
                borderWidth={1}
                justifyContent="space-between"
                p="sm">
                <Flex row gap="md">
                  {asset.collection.image_url ? (
                    <Box borderRadius="full" height={32} overflow="hidden" width={32}>
                      <NFTViewer uri={asset.collection.image_url} />
                    </Box>
                  ) : null}
                  <Flex centered row gap="xs">
                    <Text color="textPrimary" variant="subhead">
                      {asset.collection.name}
                    </Text>
                    {asset.collection.safelist_request_status === 'verified' && (
                      <VerifiedIcon height={16} width={16} />
                    )}
                  </Flex>
                </Flex>

                <Chevron color={theme.colors.textSecondary} direction="e" />
              </Flex>
            </Button>
          </Flex>

          {/* Action buttons */}
          <Flex centered row gap="xs">
            <PrimaryButton
              borderRadius="md"
              flex={1}
              icon={<OpenSeaIcon color={theme.colors.textPrimary} height={20} width={20} />}
              label="OpenSea"
              name={ElementName.NFTAssetViewOnOpensea}
              testID={ElementName.NFTAssetViewOnOpensea}
              variant="transparent"
              onPress={() => openUri(asset.permalink)}
            />
            {isMyNFT && (
              <PrimaryButton
                borderRadius="md"
                flex={1}
                icon={
                  <SendIcon
                    height={20}
                    stroke={theme.colors.textPrimary}
                    strokeWidth={2}
                    width={20}
                  />
                }
                label={t('Send')}
                name={ElementName.Send}
                testID={ElementName.Send}
                variant="transparent"
                onPress={onPressSend}
              />
            )}
          </Flex>

          {/* Metadata */}
          <Flex gap="sm">
            <Flex gap="sm">
              <Text color="textSecondary" variant="headlineSmall">
                {t('Description')}
              </Text>
              <LongText
                color="textPrimary"
                initialDisplayedLines={5}
                text={asset.collection.description}
                variant="bodySmall"
              />
            </Flex>
          </Flex>
        </Flex>
      </Flex>
    </HeaderScrollScreen>
  )
}
