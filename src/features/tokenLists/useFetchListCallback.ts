// Copied from https://github.com/Uniswap/interface/blob/main/src/hooks/useFetchListCallback.ts
// But with the ENS resolutions simplified using latest Ethers utils

import { nanoid } from '@reduxjs/toolkit'
import { TokenList } from '@uniswap/token-lists'
import { useCallback } from 'react'
import { useAppDispatch } from 'src/app/hooks'
import { useProvider } from 'src/app/walletContext'
import { ChainId } from 'src/constants/chains'
import { fetchTokenList } from 'src/features/tokenLists/actions'
import { getTokenList } from 'src/features/tokenLists/getTokenList'
import { logger } from 'src/utils/logger'

// Returns a callback which can be used to fetch a specific list
// Automatically resolves ENS names in the list
// Relies on getTokenList util to do the actual fetching
export function useFetchListCallback(
  chainId: ChainId
): (
  listUrl: string,
  sendDispatch?: boolean,
  skipValidation?: boolean
) => Promise<TokenList | null> {
  const dispatch = useAppDispatch()

  const provider = useProvider(chainId)

  const ensResolver = useCallback(
    async (ensName: string) => {
      if (!ensName) throw new Error('No ENS name provided to resolve')
      if (!provider) throw new Error('Contract not ready for ENS resolver')
      const resolver = await provider.getResolver(ensName)
      if (!resolver) throw new Error(`No resolver found for ${ensName}`)
      return resolver.getContentHash()
    },
    [provider]
  )

  // note: prevent dispatch if using for list search or unsupported list
  return useCallback(
    (listUrl: string, sendDispatch = true, skipValidation?: boolean) => {
      return new Promise(async (resolve) => {
        const requestId = nanoid()
        sendDispatch && dispatch(fetchTokenList.pending({ requestId, url: listUrl }))
        try {
          const tokenList = await getTokenList(listUrl, ensResolver, skipValidation)
          logger.debug('useFetchListCallback', '', 'Fetched list successfully for:', listUrl)
          sendDispatch && dispatch(fetchTokenList.fulfilled({ url: listUrl, tokenList, requestId }))
          resolve(tokenList)
        } catch (error) {
          logger.debug('useFetchListCallback', '', `Failed to get list at url ${listUrl}`, error)
          sendDispatch &&
            dispatch(
              fetchTokenList.rejected({
                url: listUrl,
                requestId,
                errorMessage: (error as Error).message,
              })
            )
          resolve(null)
        }
      })
    },
    [dispatch, ensResolver]
  )
}