import { OrderOut } from '../types/order';

type Props = {
  order?: OrderOut;
};

export function DisplayOrder({ order }: Props) {
  if (order)
    return (
      <div>
        <h3>
          {order?.title} ({order.status})
        </h3>
        {order?.items.map((i) => (
          <p
            key={i.itemId}
            style={{
              display: 'flex',
              flexDirection: 'row',
              gap: '1rem',
              alignItems: 'center',
            }}>
            <img
              src={i.imageUrl}
              style={{ width: '50px', height: '50px', borderRadius: '50%' }}
            />
            {i.title} - {i.price} {order.currency} x{i.count}
          </p>
        ))}
        <hr />
        Total: {order.amount} {order.currency}
      </div>
    );
}
