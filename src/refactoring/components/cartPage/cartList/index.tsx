import { Coupon, Product } from '../../../../types'
import { useCart } from '../../../hooks'
import PriceArea from '../price/PriceArea'
import TitleText from '../../title'
import CartProductList from './CartProductList'
import CouponArea from './CouponArea'
import ProductList from './ProductList'

interface ICartListProps {
  products: Product[]
  coupons: Coupon[]
}

export default function CartList({ products, coupons }: ICartListProps) {
  const {
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    applyCoupon,
    calculateTotal,
    selectedCoupon,
  } = useCart()
  const { totalBeforeDiscount, totalAfterDiscount, totalDiscount } =
    calculateTotal()
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <TitleText isTitle={false} titleText={'상품 목록'} />
        <ProductList products={products} cart={cart} addToCart={addToCart} />
      </div>
      <div>
        <TitleText isTitle={false} titleText={'장바구니 내역'} />
        <CartProductList
          cart={cart}
          updateQuantity={updateQuantity}
          removeFromCart={removeFromCart}
        />

        <CouponArea
          applyCoupon={applyCoupon}
          coupons={coupons}
          selectedCoupon={selectedCoupon}
        />

        <PriceArea
          totalBeforeDiscount={totalBeforeDiscount}
          totalAfterDiscount={totalAfterDiscount}
          totalDiscount={totalDiscount}
        />
      </div>
    </div>
  )
}
