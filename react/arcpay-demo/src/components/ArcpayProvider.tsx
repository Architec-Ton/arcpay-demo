import { TonConnectUIProvider } from '@tonconnect/ui-react';
import { ReactNode } from 'react';

type Props = {
  children: ReactNode;
  //   baseUrl?: string;
};

export function ArcpayProvider({
  children,
}: //   baseUrl = 'https://arcpay.online/api/v1/arcpay',
Props) {
  return (
    <TonConnectUIProvider manifestUrl="https://arcpay.online/tonconnect-manifest.json">
      {children}
    </TonConnectUIProvider>
  );
}
