import { CartItem, Coupon, Discount, Product } from "../../../types";

export const getRemainingStock = (cart: CartItem[], product: Product) => {
  const cartItem = cart.find((item) => item.product.id === product.id);
  return product.stock - (cartItem?.quantity || 0);
};

export const findApplicableDiscount = (
  discounts: Discount[],
  quantity: number
) => {
  return discounts
    .filter((discount) => quantity >= discount.quantity)
    .reduce((maxDiscount, currentDiscount) => {
      if (!maxDiscount || currentDiscount.rate > maxDiscount.rate) {
        return currentDiscount;
      }
      return maxDiscount;
    }, undefined as Discount | undefined);
};

export const calculateDiscountedPrice = (
  price: number,
  discount: Discount | undefined
) => {
  return discount ? price * (1 - discount.rate) : price;
};

export const calculateItemTotal = (item: CartItem) => {
  const { product, quantity } = item;
  const discount = getMaxApplicableDiscount(item);

  return product.price * quantity * (1 - discount);
};

export const getMaxApplicableDiscount = (item: CartItem) => {
  const { product, quantity } = item;
  const discount = findApplicableDiscount(product.discounts, quantity);
  return discount ? discount.rate : 0;
};

export const calculateCartTotal = (
  cart: CartItem[],
  selectedCoupon: Coupon | null
) => {
  const totalBeforeDiscount = cart.reduce((total, item) => {
    return total + item.product.price * item.quantity;
  }, 0);

  let totalAfterDiscount = cart.reduce((total, item) => {
    return total + calculateItemTotal(item);
  }, 0);

  let totalDiscount = totalBeforeDiscount - totalAfterDiscount;

  if (selectedCoupon) {
    if (selectedCoupon.discountType === "amount") {
      totalAfterDiscount = Math.max(
        0,
        totalAfterDiscount - selectedCoupon.discountValue
      );
    } else {
      totalAfterDiscount *= 1 - selectedCoupon.discountValue / 100;
    }
    totalDiscount = totalBeforeDiscount - totalAfterDiscount;
  }
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
  return cart
    .map((item) => {
      if (item.product.id === productId) {
        const maxQuantity = item.product.stock;
        const updatedQuantity = Math.max(0, Math.min(newQuantity, maxQuantity));
        return updatedQuantity > 0
          ? { ...item, quantity: updatedQuantity }
          : null;
      }
      return item;
    })
    .filter((item): item is CartItem => item !== null);
};
