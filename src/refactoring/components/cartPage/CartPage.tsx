import { Coupon, Product } from "../../../types.ts";
import CartList from "./cartList/index.tsx";
import TitleText from "./title/index.tsx";

interface ICartPageProps {
  products: Product[];
  coupons: Coupon[];
}

export const CartPage = ({ products, coupons }: ICartPageProps) => {
  return (
    <div className="container mx-auto p-4">
      <TitleText title={"장바구니"} />
      <CartList products={products} coupons={coupons} />
    </div>
  );
};
