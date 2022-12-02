import { useMemo } from 'react'
import { useAppSelector } from 'src/app/hooks'
import { selectWCModalState } from 'src/features/modals/modalSlice'
import {
  selectPendingRequests,
  selectPendingSession,
  selectSessions,
} from 'src/features/walletConnect/selectors'

export function useWalletConnect(address: NullUndefined<string>) {
  const sessionSelector = useMemo(() => selectSessions(address), [address])
  const sessions = useAppSelector(sessionSelector)
  const pendingRequests = useAppSelector(selectPendingRequests)
  const modalState = useAppSelector(selectWCModalState)
  const pendingSession = useAppSelector(selectPendingSession)

  return { sessions, pendingRequests, modalState, pendingSession }
}