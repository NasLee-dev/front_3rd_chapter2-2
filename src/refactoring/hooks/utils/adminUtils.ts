import { Discount, Product } from '../../../types'

//  새로운 Product를 생성하는 함수
export const createProduct = (productData: Omit<Product, 'id'>): Product => ({
  ...productData,
  id: `p${Date.now()}`,
})

//  새로운 Product의 초기 상태를 반환하는 함수
export const getInitialProductState = (): Omit<Product, 'id'> => ({
  name: '',
  price: 0,
  stock: 0,
  discounts: [],
})

//  새로운 Discount의 초기 상태를 반환하는 함수
export const getInitialDiscountState = (): Discount => ({
  quantity: 0,
  rate: 0,
})

//  Product의 특정 필드를 업데이트하는 함수
export const updateProductField = <K extends keyof Product>(
  product: Product,
  field: K,
  value: Product[K],
): Product => ({
  ...product,
  [field]: value,
})

//  Product에 Discount를 추가하는 함수
export const addDiscountToProduct = (
  product: Product,
  discount: Discount,
): Product => {
  return {
    ...product,
    discounts: [...product.discounts, discount],
  }
}

//  Product에서 Discount를 제거하는 함수
export const removeDiscountFromProduct = (
  product: Product,
  indexToRemove: number,
): Product => {
  return {
    ...product,
    discounts: product.discounts.filter((_, index) => index !== indexToRemove),
  }
}
