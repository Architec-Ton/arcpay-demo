import { useEffect, useState } from 'react';
import useArcPay from './hooks/useArcpay';
import ArcpayStatus from './types/arcpay';
import { OrderOut, OrderStatus } from './types/order';
import { DisplayOrder } from './components/DisplayOrder';

const testForOrder = {
  title: 'Sample selling box',
  orderId: `INV-${Date.now()}`,
  currency: 'ARC',
  items: [
    {
      title: 'Travel',
      description: 'Sample description here',
      imageUrl: 'https://www.gstatic.com/webp/gallery/1.webp',
      price: 0.125,
      count: 1,
      itemId: 'id-123456',
    },
    {
      title: 'Travel bag',
      description: 'Sample description here',
      imageUrl: 'https://picsum.photos/id/33/200/300',
      price: 0.025,
      count: 2,
      itemId: 'id-123457',
    },
  ],
  meta: {
    customer_id: 'user-1234567',
  },
};

const MERCHANT_API_KEY = import.meta.env.VITE_MERCHANT_API_KEY;

function Pay() {
  const arcPay = useArcPay();

  const [flowStatus, setFlowStatus] = useState<string>('create');
  const [order, setOrder] = useState<OrderOut | undefined>();

  // Pooling while we waiting transaction execution
  useEffect(() => {
    const fetchData = async () => {
      if (order && order.status == OrderStatus.processing) {
        const order_respopnse = await arcPay.getOrder(order.uuid);
        setOrder(order_respopnse);
        if (order_respopnse?.status == OrderStatus.received) {
          setFlowStatus(OrderStatus.received);
        }
      }
    };
    const intervalId = setInterval(fetchData, 3000);
    return () => clearInterval(intervalId);
  }, [order]);

  // Case 1
  if (!MERCHANT_API_KEY) {
    return <h2>Please setup merchant API key (only for demo)</h2>;
  }

  // Case 2
  if (arcPay.arcPayStatus == ArcpayStatus.disconnected) {
    return (
      <>
        <button onClick={() => arcPay.connect()}>Connect wallet</button>
      </>
    );
  }

  // Case 3
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <DisplayOrder order={order} />

      {flowStatus == 'create' && (
        <button
          onClick={async () => {
            setFlowStatus('ready-for-pay');
            setOrder(await arcPay.createOrder(testForOrder, MERCHANT_API_KEY));
          }}>
          Create order (recommend impl on backend side)
        </button>
      )}

      {flowStatus == 'ready-for-pay' && order && (
        <button
          onClick={async () => {
            setFlowStatus('processing');
            setOrder(await arcPay.checkoutOrder(order.uuid));
          }}>
          Pay ({order.amount} {order.currency})
        </button>
      )}

      {flowStatus == 'processing' && order && (
        <div>
          <img
            src="https://arcpay.online/logo.png"
            className="logo arcprocessing"
          />
        </div>
      )}

      {flowStatus == 'received' && order && (
        <div>
          <h2>Order received from {order.customer?.wallet}</h2>
          <a
            href={`https://testnet.tonviewer.com/transaction/${order.txn?.hash}`}>
            View transaction
          </a>
        </div>
      )}

      <button onClick={() => arcPay.disconnect()}>Disconnect wallet</button>
    </div>
  );
}

export default Pay;
