import { XIcon } from '@heroicons/react/outline'
import { Box } from 'nft/components/Box'
import { Row } from 'nft/components/Flex'
import { NavLink } from 'react-router-dom'
import styled, { useTheme } from 'styled-components'
import { Divider } from 'theme/components'
import { Text } from 'ui/src'
import { moreUniswapNavigation, uniswapNavigation } from './NavLinks'
import * as styles from './style.css'

const MobileMenuSlider = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  height: 100vh;
  width: 100vw;
  background-color: ${({ theme }) => theme.surface2};
`

export const MobileMenuButton = styled.div<{ isOpen?: boolean }>`
  height: 36px;
  width: 36px;
  background-color: ${({ isOpen, theme }) => (isOpen ? 'transparent' : theme.accent2)};
  border-radius: 8px;
  display: flex;
  justify-content: center;
  align-items: center;
`

const HeaderBackdrop = styled(Row)`
  background-color: ${({ theme }) => theme.black};
  display: flex;
  justify-content: space-between;
  padding: 8px 8px 8px 20px;
`

const DrawerWrapper = styled(Box)`
  padding-top: 24px;
`

type MobileNavProps = {
  isMobileNavOpen: boolean
  handleMobileNav: () => void
  handleLogoClick: () => void
}

export const MobileMenu = ({ isMobileNavOpen, handleMobileNav, handleLogoClick }: MobileNavProps) => {
  const theme = useTheme()
  return (
    <>
      {isMobileNavOpen && (
        <MobileMenuSlider style={{ zIndex: 1100 }}>
          <Box>
            <HeaderBackdrop>
              <MobileMenuButton onClick={handleMobileNav} isOpen={isMobileNavOpen}>
                <Box
                  className={styles.logoContainer}
                  onClick={handleLogoClick}
                  style={{ paddingLeft: '36px', marginTop: '-4px' }}
                >
                  <img src="/uniswap-static/images/trinity.svg" height="40px" width="40px" alt="Trinity" />
                </Box>
              </MobileMenuButton>
              <MobileMenuButton onClick={handleMobileNav} isOpen={isMobileNavOpen}>
                <XIcon color="#F1F1F3" width="32px" height="32px" />
              </MobileMenuButton>
            </HeaderBackdrop>
            <DrawerWrapper>
              <MenuWrapper title="Menu">
                {uniswapNavigation.map((item, index) => {
                  return (
                    <NavLink
                      to={item.link}
                      id={`${item.dataCy}_menu`}
                      style={{ textDecoration: 'none' }}
                      data-testid={item.dataTestId}
                      reloadDocument={item.reloadDocument}
                      key={`${index}-menu-links`}
                    >
                      <Box key={index} padding="16">
                        <Text fontSize={16} fontWeight="700" style={{ color: theme.white }}>
                          {item.title}
                        </Text>
                      </Box>
                    </NavLink>
                  )
                })}
              </MenuWrapper>
              <MenuWrapper title="Links" isLast>
                {moreUniswapNavigation.map((item, index) => {
                  return (
                    <NavLink
                      to={item.link}
                      id={`${item.dataCy}_links`}
                      style={{ textDecoration: 'none' }}
                      data-testid={item.dataTestId}
                      reloadDocument={item.reloadDocument}
                      key={`${index}-more-links`}
                    >
                      <Box key={index} padding="16">
                        <Row>
                          {item.icon}
                          <Text fontSize={16} fontWeight="700" style={{ color: theme.white, marginLeft: '12px' }}>
                            {item.title}
                          </Text>
                        </Row>
                      </Box>
                    </NavLink>
                  )
                })}
              </MenuWrapper>
            </DrawerWrapper>
          </Box>
        </MobileMenuSlider>
      )}
    </>
  )
}

const MenuWrapper = ({ title, children, isLast }: { title: string; children?: React.ReactNode; isLast?: boolean }) => {
  return (
    <Box marginBottom="24">
      <Box paddingX="8">
        <Text fontWeight="500" fontSize={12} color="#A5A8B6" style={{ padding: '16px' }}>
          {title}
        </Text>
        {children}
      </Box>
      {!isLast && <Divider style={{ borderColor: '#F2F3F729', marginTop: '24px' }} />}
    </Box>
  )
}
