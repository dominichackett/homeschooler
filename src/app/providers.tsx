'use client';

import * as React from 'react';
import {Chain,
  RainbowKitProvider,
  getDefaultWallets,
  getDefaultConfig,
} from '@rainbow-me/rainbowkit';
import {
  argentWallet,
  trustWallet,
  ledgerWallet,
} from '@rainbow-me/rainbowkit/wallets';
import {
  sepolia,avalancheFuji,
} from 'wagmi/chains';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WagmiProvider } from 'wagmi';

const { wallets } = getDefaultWallets();
const Galadriel: Chain = {
  id: 696969,
  name: 'Galadriel',
  network: 'Galadriel',
  iconBackground: '#3e6957',
  nativeCurrency: {
    decimals: 18,
    name: 'GAL',
    symbol: 'GAL',
  },
  rpcUrls: {
    public: { http: ['https://devnet.galadriel.com/'] },
    default: { http: ['https://devnet.galadriel.com/'] },
  },
  blockExplorers: {
    default: { name: 'Galadriel Devnet explorer', url: 'https://explorer.galadriel.com' },
    etherscan: { name: 'Galadriel Devnet explorer', url: 'https://explorer.galadriel.com' },
  },

  testnet: true,
};

const config = getDefaultConfig({
  appName: 'RainbowKit demo',
  projectId: 'YOUR_PROJECT_ID',
  wallets: [
    ...wallets,
    {
      groupName: 'Other',
      wallets: [argentWallet, trustWallet, ledgerWallet],
    },
  ],
  chains: [
    Galadriel
    
  ],
  ssr: true,
});

const queryClient = new QueryClient();

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>{children}</RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
