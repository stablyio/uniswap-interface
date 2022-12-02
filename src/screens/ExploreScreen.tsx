import { DrawerActions, useScrollToTop } from '@react-navigation/native'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { KeyboardAvoidingView, TextInput, useColorScheme } from 'react-native'
import { GestureDetector } from 'react-native-gesture-handler'
import { FadeIn, FadeOut } from 'react-native-reanimated'
import { ExploreStackParamList, TabNavigationProp } from 'src/app/navigation/types'
import { ExploreSections } from 'src/components/explore/ExploreSections'
import { SearchEmptySection } from 'src/components/explore/search/SearchEmptySection'
import { SearchResultsSection } from 'src/components/explore/search/SearchResultsSection'
import { SearchTextInput } from 'src/components/input/SearchTextInput'
import { AnimatedFlex, Box, Flex } from 'src/components/layout'
import { Screen } from 'src/components/layout/Screen'
import {
  panHeaderGestureAction,
  panSidebarContainerGestureAction,
} from 'src/components/layout/TabHelpers'
import { VirtualizedList } from 'src/components/layout/VirtualizedList'
import { sendAnalyticsEvent } from 'src/features/telemetry'
import { EventName, SectionName } from 'src/features/telemetry/constants'
import { Screens, Tabs } from 'src/screens/Screens'
import { flex } from 'src/styles/flex'
import { Theme } from 'src/styles/theme'
import { useDebounce } from 'src/utils/timing'

const SIDEBAR_SWIPE_CONTAINER_WIDTH = 45

type Props = NativeStackScreenProps<ExploreStackParamList, Screens.Explore>

export function ExploreScreen({ navigation }: Props) {
  const { t } = useTranslation()
  const isDarkMode = useColorScheme() === 'dark'

  const listRef = useRef(null)
  useScrollToTop(listRef)

  const [searchQuery, setSearchQuery] = useState<string>('')
  const debouncedSearchQuery = useDebounce(searchQuery)
  const [isSearchMode, setIsSearchMode] = useState<boolean>(false)
  const textInputRef = useRef<TextInput>(null)

  const onChangeSearchFilter = (newSearchFilter: string) => {
    setSearchQuery(newSearchFilter)
  }

  const onSearchFocus = () => {
    setIsSearchMode(true)
    sendAnalyticsEvent(EventName.Impression, {
      section: SectionName.ExploreSearch,
      screen: Screens.Explore,
    })
  }

  const onSearchCancel = () => {
    setIsSearchMode(false)
  }

  // Reset search mode on tab press
  useEffect(() => {
    const unsubscribe = (navigation.getParent() as TabNavigationProp<Tabs.Explore>).addListener(
      'tabPress',
      () => {
        textInputRef?.current?.clear()
        onSearchCancel()
      }
    )
    return unsubscribe
  }, [navigation])

  const openSidebar = useCallback(() => {
    navigation.dispatch(DrawerActions.openDrawer())
  }, [navigation])

  const panSidebarContainerGesture = useMemo(
    () => panSidebarContainerGestureAction(openSidebar),
    [openSidebar]
  )
  const panHeaderGesture = useMemo(() => panHeaderGestureAction(openSidebar), [openSidebar])

  // Handle special case with design system light colors because background1 is the same as background0
  const contrastBackgroundColor: keyof Theme['colors'] = isDarkMode ? 'background1' : 'background2'
  const searchBarBackgroundColor: keyof Theme['colors'] = isDarkMode ? 'background2' : 'background1'

  return (
    <Screen
      bg={isSearchMode ? 'background0' : 'backgroundBranded'}
      edges={['top', 'left', 'right']}>
      <GestureDetector gesture={panHeaderGesture}>
        <Box p="sm">
          <SearchTextInput
            ref={textInputRef}
            showCancelButton
            backgroundColor={isSearchMode ? contrastBackgroundColor : searchBarBackgroundColor}
            placeholder={t('Search tokens and wallets')}
            showShadow={!isSearchMode}
            value={searchQuery}
            onCancel={onSearchCancel}
            onChangeText={onChangeSearchFilter}
            onFocus={onSearchFocus}
          />
        </Box>
      </GestureDetector>
      <Flex grow>
        {isSearchMode ? (
          <KeyboardAvoidingView behavior="height" style={flex.fill}>
            <AnimatedFlex grow entering={FadeIn} exiting={FadeOut} mx="md">
              <VirtualizedList>
                <Box p="xxs" />
                {debouncedSearchQuery.length === 0 ? (
                  <SearchEmptySection />
                ) : (
                  <SearchResultsSection searchQuery={debouncedSearchQuery} />
                )}
              </VirtualizedList>
            </AnimatedFlex>
          </KeyboardAvoidingView>
        ) : (
          <ExploreSections listRef={listRef} />
        )}
      </Flex>

      <GestureDetector gesture={panSidebarContainerGesture}>
        <Box
          bottom={0}
          height="100%"
          left={0}
          position="absolute"
          top={0}
          width={SIDEBAR_SWIPE_CONTAINER_WIDTH} // Roughly 1/2 icon width on tokens tab
        />
      </GestureDetector>
    </Screen>
  )
}