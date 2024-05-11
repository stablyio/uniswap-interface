import { ColumnCenter } from 'components/Column'
import { useOnClickOutside } from 'hooks/useOnClickOutside'
import { vars } from 'nft/css/sprinkles.css'
import { useRef, useState } from 'react'
// import { ChevronDown } from 'react-feather';
import styled from 'styled-components'
// import { BREAKPOINTS } from 'theme';

import { Menu } from './Menu'

const Wrapper = styled.div`
  width: 100%;
  display: flex;
  flex: grow;
  justify-content: center;
  align-items: center;
  position: relative;
  margin: 4px 0px;
`
const IconContainer = styled(ColumnCenter)<{ isActive: boolean }>`
  min-height: 100%;
  justify-content: center;
  border-radius: 14px;
  padding: 9px 14px;
  cursor: pointer;
  flex-direction: row;
  font-weight: 700;
  color: ${({ isActive, theme }) => (isActive ? theme.neutral1 : theme.neutral2)};
  transition: color 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;

  .more-dots {
    content: '';
    width: 36px;
    height: 20px;
    background-color: ${({ isActive, theme }) => (isActive ? theme.white : theme.neutral2)};
    -webkit-mask: url('/uniswap-static/images/3dots.svg') no-repeat center;
    mask: url('/uniswap-static/images/3dots.svg') no-repeat center;
    transition: background-color 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;
  }

  :hover,
  .active {
    color: ${({ theme }) => theme.white};
    text-shadow: ${vars.textShadow.white};

    .more-dots {
      background-color: ${({ theme }) => theme.white};
    }
  }
`
// const ChevronIcon = styled(ChevronDown)<{ $rotated: boolean }>`
//   @media screen and (max-width: ${BREAKPOINTS.md}px) {
//     rotate: 180deg;
//   }
//   transition: transform 0.3s ease;
//   transform: ${({ $rotated }) => ($rotated ? 'rotate(180deg)' : 'none')};
// `
export function More() {
  const [isOpen, setIsOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  useOnClickOutside(ref, () => setIsOpen(false))

  return (
    <Wrapper ref={ref}>
      <IconContainer isActive={isOpen} onClick={() => setIsOpen(!isOpen)} data-testid="nav-more-button">
        More <div className="more-dots"></div>
      </IconContainer>
      {isOpen && <Menu close={() => setIsOpen(false)} />}
    </Wrapper>
  )
}
