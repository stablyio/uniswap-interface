import React from 'react'
import { ExperimentsModal } from 'src/app/modals/ExperimentsModal'
import { SwapModal } from 'src/app/modals/SwapModal'
import { TransferTokenModal } from 'src/app/modals/TransferTokenModal'
import { ForceUpgradeModal } from 'src/components/forceUpgrade/ForceUpgradeModal'
import { WalletConnectModals } from 'src/components/WalletConnect/WalletConnectModals'
import { LockScreenModal } from 'src/features/authentication/LockScreenModal'
import { FiatOnRampModal } from 'src/features/fiatOnRamp/FiatOnRampModal'

export function AppModals() {
  return (
    <>
      <ExperimentsModal />
      <FiatOnRampModal />
      <ForceUpgradeModal />
      <LockScreenModal />
      <SwapModal />
      <TransferTokenModal />
      <WalletConnectModals />
    </>
  )
}