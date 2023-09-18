import { NativeStackScreenProps } from '@react-navigation/native-stack'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ScrollView } from 'react-native'
import { SettingsStackParamList } from 'src/app/navigation/types'
import { Button, ButtonEmphasis } from 'src/components/buttons/Button'
import { BackHeader } from 'src/components/layout/BackHeader'
import { Screen } from 'src/components/layout/Screen'
import { BottomSheetModal } from 'src/components/modals/BottomSheetModal'
import { IS_ANDROID } from 'src/constants/globals'
import { CloudBackupPasswordForm } from 'src/features/CloudBackup/CloudBackupPasswordForm'
import { ElementName, ModalName } from 'src/features/telemetry/constants'
import { Screens } from 'src/screens/Screens'
import { Flex, Icons, Text, useSporeColors } from 'ui/src'
import { iconSizes } from 'ui/src/theme'

type Props = NativeStackScreenProps<
  SettingsStackParamList,
  Screens.SettingsCloudBackupPasswordCreate
>

// This screen is visited when no iCloud backup exists (checked from settings)
export function SettingsCloudBackupPasswordCreateScreen({
  navigation,
  route: {
    params: { address },
  },
}: Props): JSX.Element {
  const { t } = useTranslation()
  const colors = useSporeColors()

  const [showCloudBackupInfoModal, setShowCloudBackupInfoModal] = useState(true)

  const navigateToNextScreen = ({ password }: { password: string }): void => {
    navigation.navigate({
      name: Screens.SettingsCloudBackupPasswordConfirm,
      params: {
        password,
        address,
      },
      merge: true,
    })
  }

  return (
    <Screen mx="$spacing16" my="$spacing16">
      <BackHeader mb="$spacing16" />
      <ScrollView bounces={false} keyboardShouldPersistTaps="handled">
        <Flex alignItems="center" justifyContent="space-between" mb="$spacing24" mx="$spacing12">
          <Text variant="headlineSmall">
            {IS_ANDROID ? t('Back up to Google Drive') : t('Back up to iCloud')}
          </Text>
          <Text color="$neutral2" textAlign="center" variant="bodySmall">
            {IS_ANDROID
              ? t(
                  'Setting a password will encrypt your recovery phrase backup, adding an extra level of protection if your Google Drive account is ever compromised.'
                )
              : t(
                  'Setting a password will encrypt your recovery phrase backup, adding an extra level of protection if your iCloud account is ever compromised.'
                )}
          </Text>
        </Flex>
        <CloudBackupPasswordForm navigateToNextScreen={navigateToNextScreen} />
        {showCloudBackupInfoModal && (
          <BottomSheetModal backgroundColor={colors.surface2.val} name={ModalName.CloudBackupInfo}>
            <Flex gap="$none" mb="$spacing36" px="$spacing16" py="$spacing12">
              <Flex centered gap="$spacing16">
                <Flex
                  borderColor="$accent1"
                  borderRadius="$rounded12"
                  borderWidth={1}
                  gap="$none"
                  padding="$spacing12">
                  <Icons.OSDynamicCloudIcon
                    color={colors.accent1.val}
                    height={iconSizes.icon20}
                    width={iconSizes.icon20}
                  />
                </Flex>
                <Text textAlign="center" variant="buttonLabelMedium">
                  {IS_ANDROID
                    ? t('Back up recovery phrase to Google Drive?')
                    : t('Back up recovery phrase to iCloud?')}
                </Text>
                <Text color="$neutral2" textAlign="center" variant="bodySmall">
                  {IS_ANDROID
                    ? t(
                        'It looks like you haven’t backed up your recovery phrase to Google Drive yet. By doing so, you can recover your wallet just by being logged into Google Drive on any device.'
                      )
                    : t(
                        'It looks like you haven’t backed up your recovery phrase to iCloud yet. By doing so, you can recover your wallet just by being logged into iCloud on any device.'
                      )}
                </Text>
              </Flex>
              <Flex centered row gap="$spacing12" pt="$spacing24">
                <Button
                  fill
                  emphasis={ButtonEmphasis.Tertiary}
                  label={t('Cancel')}
                  onPress={(): void => navigation.goBack()}
                />
                <Button
                  fill
                  label={t('Back up')}
                  testID={ElementName.Confirm}
                  onPress={(): void => setShowCloudBackupInfoModal(false)}
                />
              </Flex>
            </Flex>
          </BottomSheetModal>
        )}
      </ScrollView>
    </Screen>
  )
}
