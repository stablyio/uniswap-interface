import {
  AuthenticationType,
  hasHardwareAsync,
  isEnrolledAsync,
  supportedAuthenticationTypesAsync,
} from 'expo-local-authentication'
import { useEffect, useState } from 'react'
import { useAppSelector } from 'src/app/hooks'
import { BiometricAuthenticationStatus, tryLocalAuthenticate } from 'src/features/biometrics'
import { useBiometricContext } from 'src/features/biometrics/context'
import { BiometricSettingsState } from 'src/features/biometrics/slice'

/**
 * Hook shortcut to use the biometric prompt.
 * @returns trigger Trigger the OS biometric flow and invokes successCallback on success.
 */
export function useBiometricPrompt(successCallback?: (params?: any) => void) {
  const { setAuthenticationStatus } = useBiometricContext()

  const trigger = async (params?: any) => {
    setAuthenticationStatus(BiometricAuthenticationStatus.Authenticating)
    const authStatus = await tryLocalAuthenticate()

    setAuthenticationStatus(authStatus)

    if (
      biometricAuthenticationSuccessful(authStatus) ||
      biometricAuthenticationDisabledByOS(authStatus)
    ) {
      successCallback?.(params)
    }
  }

  return { trigger }
}

export function biometricAuthenticationSuccessful(status: BiometricAuthenticationStatus) {
  return status === BiometricAuthenticationStatus.Authenticated
}

export function biometricAuthenticationDisabledByOS(status: BiometricAuthenticationStatus) {
  return (
    status === BiometricAuthenticationStatus.Unsupported ||
    status === BiometricAuthenticationStatus.MissingEnrollment
  )
}

/**
 * Check function of biometric (faceId specific) device support
 * @returns deviceSupportsFaceId Boolean value representing faceId Support availability
 */

export function useDeviceSupportsFaceId() {
  // check if device supports faceId authentication, if not, hide faceId option
  const [deviceSupportsFaceId, setDeviceSupportsFaceId] = useState<boolean | null>(null)
  useEffect(() => {
    // TODO: Move into a saga
    const checkAuthenticationTypes = async () => {
      const res = await supportedAuthenticationTypesAsync()
      setDeviceSupportsFaceId(res?.includes(AuthenticationType.FACIAL_RECOGNITION))
    }
    checkAuthenticationTypes()
  }, [])

  return deviceSupportsFaceId
}

export function useOSFaceIdEnabled() {
  // check if OS settings for Face ID are enabled
  const [osFaceIdEnabled, setOsFaceIdEnabled] = useState<boolean | null>(null)
  useEffect(() => {
    const checkOsFaceIdEnabled = async () => {
      const compatible = await hasHardwareAsync()
      const enrolled = await isEnrolledAsync()
      setOsFaceIdEnabled(compatible && enrolled)
    }
    checkOsFaceIdEnabled()
  }, [])

  return osFaceIdEnabled
}

export function useBiometricAppSettings(): BiometricSettingsState {
  const biometricSettings = useAppSelector((state) => state.biometricSettings)
  return biometricSettings
}
