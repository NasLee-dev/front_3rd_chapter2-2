// useCart.ts
import { useState } from "react";
import { CartItem, Coupon, Product } from "../../types";
import {
  calculateCartTotal,
  getRemainingStock,
  updateCartItemQuantity,
} from "./utils/cartUtils";

export const useCart = () => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedCoupon, setSelectedCoupon] = useState<Coupon | null>(null);

  const addToCart = (product: Product) => {
    const remainingStock = getRemainingStock(cart, product);
    if (remainingStock <= 0) return;
    const existingItem = cart.find((item) => item.product.id === product.id);
    if (existingItem) {
      const newQuantity = existingItem.quantity + 1;
      const updatedCart = updateCartItemQuantity(cart, product.id, newQuantity);
      setCart(updatedCart);
    } else {
      setCart([...cart, { product, quantity: 1 }]);
    }
  };

  const removeFromCart = (productId: string) => {
    const updatedCart = cart.filter((item) => item.product.id !== productId);
    setCart(updatedCart);
  };

  const updateQuantity = (productId: string, newQuantity: number) => {
    setCart((prev) => updateCartItemQuantity(prev, productId, newQuantity));
  };

  const applyCoupon = (coupon: Coupon) => {
    setSelectedCoupon(coupon);
  };

  const calculateTotal = () => ({
    ...calculateCartTotal(cart, selectedCoupon),
  });

  return {
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    applyCoupon,
    calculateTotal,
    selectedCoupon,
  };
};
