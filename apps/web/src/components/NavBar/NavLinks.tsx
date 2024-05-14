import { BookOpenIcon, CashIcon, QuestionMarkCircleIcon } from '@heroicons/react/outline'
import { ReactNode } from 'react'

interface Navigation {
  link: string
  title: string
  isVisible?: () => boolean | undefined
  dataCy?: string
  reloadDocument?: boolean
  dataTestId: string
}

export const UNISWAP_ROUTES = {
  dashboard: '/',
  lendingBorrow: '/aave/lending-borrow/',
  liquidity: '/pool',
  moneyMarket: '/aave/money-markets/',
  swap: '/swap',
  incentivize: '/incentivize',
  staking: '/aave/staking/',
  governance: '/aave/governance',
  faucet: '/faucet',
}

export const uniswapNavigation: Navigation[] = [
  {
    link: UNISWAP_ROUTES.swap,
    title: `Swap`,
    dataCy: 'menuSwap',
    dataTestId: 'swap-link',
  },
  {
    link: UNISWAP_ROUTES.liquidity,
    title: `Liquidity`,
    dataCy: 'menuLiquidity',
    dataTestId: 'liquidity-link',
  },
  {
    link: UNISWAP_ROUTES.moneyMarket,
    title: `Markets`,
    dataCy: 'menuMarkets',
    dataTestId: 'markets-link',
    reloadDocument: true,
  },
  {
    link: UNISWAP_ROUTES.lendingBorrow,
    title: `Lend/Borrow`,
    dataCy: 'menuDashboard',
    dataTestId: 'lend-borrow-link',
    reloadDocument: true,
  },
  {
    link: UNISWAP_ROUTES.incentivize,
    title: `Incentivize`,
    dataCy: 'menuIncentivize',
    dataTestId: 'incentivize-link',
    reloadDocument: true,
  },
]

interface MoreMenuItem extends Navigation {
  icon: ReactNode
  makeLink?: (walletAddress: string) => string
}

const moreUniswapMenuItems: MoreMenuItem[] = [
  {
    link: 'https://docs.aave.com/faq/',
    title: `FAQ`,
    icon: <QuestionMarkCircleIcon color="#757575" width="20px" height="20px" />,
    dataTestId: 'faq-link',
  },
  {
    link: 'https://docs.aave.com/portal/',
    title: `Developers`,
    icon: <BookOpenIcon color="#757575" width="20px" height="20px" />,
    dataTestId: 'developers-link',
  },
  {
    link: UNISWAP_ROUTES.faucet,
    title: `Faucet`,
    icon: <CashIcon color="#757575" width="20px" height="20px" />,
    isVisible: () => false,
    dataTestId: 'faucet-link',
  },
]

export const moreUniswapNavigation: MoreMenuItem[] = [...moreUniswapMenuItems]
