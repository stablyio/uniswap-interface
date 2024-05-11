import React from 'react'
import { useTheme } from 'styled-components'
import { Button } from 'ui/src'

export interface HeaderButtonProps {
  id: string
  children: React.ReactNode
  onClick?: any
}

export const HeaderButton = ({ id, children, onClick }: HeaderButtonProps) => {
  const theme = useTheme()

  return (
    <Button
      hoverStyle={{
        backgroundColor: '#757575',
      }}
      id={id}
      onPress={onClick}
      style={{
        minWidth: 'unset',
        height: '40px',
        padding: '6px',
        borderRadius: '8px',
        backgroundColor: theme.surface1,
        color: '#ffffff',
      }}
      $sm={{ width: 40 }}
    >
      {children}
    </Button>
  )
}
