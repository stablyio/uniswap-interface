import React from 'react'
import { IS_IOS } from 'src/constants/globals'
import { Flex, FlexProps } from 'ui/src'
import { zIndices } from 'ui/src/theme'

// Fills up entire parent by default
export function GradientBackground({ children, ...rest }: FlexProps): JSX.Element {
  return (
    <Flex
      bottom={0}
      gap="$none"
      left={0}
      position="absolute"
      right={0}
      top={0}
      zIndex={IS_IOS ? '$background' : zIndices.background}
      {...rest}>
      {children}
    </Flex>
  )
}
