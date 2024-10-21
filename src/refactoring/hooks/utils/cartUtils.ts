import { CartItem, Coupon, Discount } from "../../../types";

export const findApplicableDiscount = (
  discounts: Discount[],
  quantity: number
) => {
  return discounts.find((discount) => quantity >= discount.quantity);
};

export const calculateDiscountedPrice = (
  price: number,
  discount: Discount | undefined
) => {
  return discount ? price * (1 - discount.rate) : price;
};

export const calculateItemTotal = (item: CartItem) => {
  const { product, quantity } = item;
  const discount = findApplicableDiscount(product.discounts, quantity);
  const discountedPrice = calculateDiscountedPrice(product.price, discount);
  return (
    discountedPrice * quantity + (product.price - discountedPrice) * quantity
  );
};

export const getMaxApplicableDiscount = (item: CartItem) => {
  const { product, quantity } = item;
  const discount = findApplicableDiscount(product.discounts, quantity);
  return discount ? product.price * discount.rate * quantity : 0;
};

export const calculateCartTotal = (
  cart: CartItem[],
  selectedCoupon: Coupon | null
) => {
  const totalBeforeDiscount = cart.reduce(
    (total, item) => total + calculateItemTotal(item),
    0
  );
  let totalDiscount = cart.reduce(
    (total, item) => total + getMaxApplicableDiscount(item),
    0
  );

  let totalAfterDiscount = totalBeforeDiscount - totalDiscount;

  if (selectedCoupon) {
    selectedCoupon.discountType === "amount"
      ? (totalAfterDiscount -= selectedCoupon.discountValue)
      : (totalAfterDiscount *= 1 - selectedCoupon.discountValue / 100);
  }
  totalDiscount = totalBeforeDiscount - totalAfterDiscount;

  return {
    totalBeforeDiscount: Math.round(totalBeforeDiscount),
    totalAfterDiscount: Math.round(totalAfterDiscount),
    totalDiscount: Math.round(totalDiscount),
  };
};

export const updateCartItemQuantity = (
  cart: CartItem[],
  productId: string,
  newQuantity: number
): CartItem[] => {
  const updatedCart = cart.map((item) => {
    if (item.product.id === productId) {
      return { ...item, quantity: newQuantity };
    }
    return item;
  });
  return updatedCart;
};
