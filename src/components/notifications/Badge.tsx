import React, { memo, PropsWithChildren } from 'react'
import { Box } from 'src/components/layout/Box'
import { Theme } from 'src/styles/theme'

const NOTIFICATION_DOT_SIZE = 10

type Props = {
  children: PropsWithChildren<any>
  showIndicator?: boolean
  borderColor?: keyof Theme['colors']
}

function _NotificationBadge({ borderColor = 'background0', children, showIndicator }: Props) {
  return (
    <Box position="relative">
      {showIndicator && (
        <>
          <Box
            backgroundColor="userThemeMagenta"
            borderRadius="full"
            height={NOTIFICATION_DOT_SIZE - 2}
            position="absolute"
            right={1}
            top={1}
            width={NOTIFICATION_DOT_SIZE - 2}
            zIndex="popover"
          />
          <Box
            backgroundColor="none"
            borderColor={borderColor}
            borderRadius="full"
            borderWidth={2}
            height={NOTIFICATION_DOT_SIZE}
            position="absolute"
            right={0}
            top={0}
            width={NOTIFICATION_DOT_SIZE}
            zIndex="popover"
          />
        </>
      )}
      {children}
    </Box>
  )
}

export const NotificationBadge = memo(_NotificationBadge)