import { useCurrency } from 'hooks/Tokens';
import { Swap } from 'pages/Swap';
import { useEffect, useState } from 'react';
import styled, { css, keyframes } from 'styled-components';

import { Box } from '../components/Generics';
import { RiseIn } from '../components/animations';

const Container = styled(Box)`
  min-width: 100%;
  padding-top: 72px;
`;
const LandingSwapContainer = styled(Box)`
  width: 480px;
  padding: 8px;
  border-radius: 8px;
  background: ${({ theme }) => theme.surface1};
  @media (max-width: 768px) {
    width: 100%;
  }
`;
const LandingSwap = styled(Swap)`
  position: relative;
  width: 100%;

  & > div:first-child {
    padding: 0px;
  }
  & > div:first-child > div:first-child {
    display: none;
  }
`;
// const StyledH1 = styled(H1)`
//   @media (max-width: 768px) {
//     font-size: 52px;
//   }
//   @media (max-width: 464px) {
//     font-size: 36px;
//   }
//   @media (max-height: 668px) {
//     font-size: 28px;
//   }
// `
const shrinkAndFade = keyframes`
  0% {
    transform: scale(1);
    opacity: 1;
  }
  100% {
    transform: scale(0.8);
    opacity: 0;
  }
`;
const Center = styled(Box)<{ transition?: boolean }>`
  width: unset;
  pointer-events: none;
  padding: 48px 0px;
  @media (max-width: 464px), (max-height: 700px) {
    padding-top: 24px;
  }
  @media (max-width: 464px), (max-height: 668px) {
    padding-top: 8px;
  }
  gap: 24px;
  @media (max-height: 800px) {
    gap: 16px;
  }
  ${({ transition }) =>
    transition &&
    css`
      animation: ${shrinkAndFade} 1s ease-in-out forwards;
    `};
`;
// const LearnMoreContainer = styled(Box)`
//   bottom: 48px;
//   @media (max-width: ${BREAKPOINTS.md}px) {
//     bottom: 64px;
//   }

//   @media (max-height: ${heightBreakpoints.short}px) {
//     display: none;
//   }
// `

interface HeroProps {
  scrollToRef: () => void;
  transition?: boolean;
}

export function Hero({ transition }: HeroProps) {
  const [scrollPosition, setScrollPosition] = useState(0);
  const handleScroll = () => {
    const position = window.scrollY;
    setScrollPosition(position);
  };
  const initialInputCurrency = useCurrency('ETH');

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const translateY = -scrollPosition / 7;
  const opacityY = 1 - scrollPosition / 1000;

  return (
    <Container
      position="relative"
      height="100vh"
      justify="center"
      style={{
        transform: `translate(0px, ${translateY}px)`,
        opacity: opacityY,
      }}
    >
      <Center
        direction="column"
        align="center"
        maxWidth="85vw"
        transition={transition}
        style={{
          transform: `translate(0px, ${translateY}px)`,
          opacity: opacityY,
        }}
      >
        <RiseIn delay={0.4}>
          <LandingSwapContainer>
            <LandingSwap
              syncTabToUrl={false}
              initialInputCurrency={initialInputCurrency}
            />
          </LandingSwapContainer>
        </RiseIn>
      </Center>
    </Container>
  );
}
