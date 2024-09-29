import { useEffect, useState } from 'react';
import { OrderIn, OrderOut } from '../types/order';
import ArcpayStatus from '../types/arcpay';
import {
  useTonAddress,
  useTonConnectModal,
  useTonConnectUI,
} from '@tonconnect/ui-react';

const ARCPAY_URL = 'http://arcpay.online/api/v1/arcpay';
const fetchArcpay = async (
  url: string,
  method?: string,
  headers?: HeadersInit,
  body?: BodyInit | null
) => {
  const response = await fetch(`${ARCPAY_URL}${url}`, {
    method: method || 'GET',
    headers: {
      ...headers,
      'Content-Type': 'application/json',
    },
    body: body,
  });

  if (!response.ok) {
    const errorData = await response.json();
    alert(`Error creating order: ${errorData.message}`);
    throw new Error(`Error creating order: ${errorData.message}`);
  } else {
    const result = await response.json();
    console.log('Order created successfully:', result);
    return result;
  }
};

export default function useArcPay() {
  const userFriendlyAddress = useTonAddress();
  const [tonConnectUI] = useTonConnectUI();
  const { open } = useTonConnectModal();
  const [arcpayStatus, setArcpayStatus] = useState<ArcpayStatus>(
    ArcpayStatus.disconnected
  );

  useEffect(() => {
    if (userFriendlyAddress) {
      setArcpayStatus(ArcpayStatus.connected);
    } else {
      setArcpayStatus(ArcpayStatus.disconnected);
    }
  }, [userFriendlyAddress]);

  return {
    arcPayStatus: arcpayStatus,
    getOrder: async (uuid: string): Promise<OrderOut | undefined> => {
      return await fetchArcpay(`/order/${uuid}`);
    },
    createOrder: async (
      orderData: OrderIn,
      merchantApiKey: string
    ): Promise<OrderOut> => {
      return await fetchArcpay(
        '/order',
        'POST',
        {
          ArcKey: merchantApiKey,
        },
        JSON.stringify(orderData)
      );
    },
    checkoutOrder: async (uuid: string): Promise<OrderOut> => {
      if (arcpayStatus == ArcpayStatus.disconnected) {
        throw new Error(`Wallet disconnected`);
      }
      const response = await fetchArcpay(
        `/order/${uuid}/checkout`,
        'POST',
        {},
        JSON.stringify({
          customerWalletAddress: userFriendlyAddress,
        })
      );
      const messages = response['transactions'];
      const tonConnectResponse = await tonConnectUI.sendTransaction({
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        messages: messages.map((tx: any) => {
          return {
            address: tx.to,
            amount: tx.value.toString(),
            payload: tx.body,
          };
        }),
        validUntil: Date.now() + 10 * 60 * 1000, // 10 minutes for user to approve
      });
      return await fetchArcpay(
        `/order/${uuid}/confirm`,
        'POST',
        {},
        JSON.stringify({
          tonConnectResponse,
        })
      );
    },
    connect: () => {
      return open();
    },
    disconnect: () => {
      if (!tonConnectUI) {
        throw new Error(`tonConnectUI not init`);
      }
      tonConnectUI.disconnect();
    },
  };
}
