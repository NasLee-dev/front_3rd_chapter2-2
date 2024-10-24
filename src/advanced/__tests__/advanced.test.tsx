import { useState } from 'react'
import { describe, expect, test, vi } from 'vitest'
import {
  act,
  fireEvent,
  render,
  renderHook,
  screen,
  within,
} from '@testing-library/react'
import { CartPage } from '../../refactoring/components/cartPage/CartPage'
import { CartItem, Coupon, Product } from '../../types'
import { AdminPage } from '../../refactoring/components/adminPage/AdminPage'
import {
  findApplicableDiscount,
  getRemainingStock,
} from '../../refactoring/hooks/utils/cartUtils'
import useAccordion from '../../refactoring/hooks/admin/useAccordion'
import useCouponManagement from '../../refactoring/hooks/admin/useCouponManagement'
import useProductManagement from '../../refactoring/hooks/admin/useProductManagement'
import {
  createProduct,
  updateProductField,
} from '../../refactoring/hooks/utils/adminUtils'

const mockProducts: Product[] = [
  {
    id: 'p1',
    name: '상품1',
    price: 10000,
    stock: 20,
    discounts: [{ quantity: 10, rate: 0.1 }],
  },
  {
    id: 'p2',
    name: '상품2',
    price: 20000,
    stock: 20,
    discounts: [{ quantity: 10, rate: 0.15 }],
  },
  {
    id: 'p3',
    name: '상품3',
    price: 30000,
    stock: 20,
    discounts: [{ quantity: 10, rate: 0.2 }],
  },
]

const mockCartItem: CartItem[] = [
  { product: mockProducts[0], quantity: 10 },
  { product: mockProducts[1], quantity: 20 },
  { product: mockProducts[2], quantity: 40 },
]

const mockCoupons: Coupon[] = [
  {
    name: '5000원 할인 쿠폰',
    code: 'AMOUNT5000',
    discountType: 'amount',
    discountValue: 5000,
  },
  {
    name: '10% 할인 쿠폰',
    code: 'PERCENT10',
    discountType: 'percentage',
    discountValue: 10,
  },
]

const TestAdminPage = () => {
  const [products, setProducts] = useState<Product[]>(mockProducts)
  const [coupons, setCoupons] = useState<Coupon[]>(mockCoupons)

  const handleProductUpdate = (updatedProduct: Product) => {
    setProducts((prevProducts) =>
      prevProducts.map((p) =>
        p.id === updatedProduct.id ? updatedProduct : p,
      ),
    )
  }

  const handleProductAdd = (newProduct: Product) => {
    setProducts((prevProducts) => [...prevProducts, newProduct])
  }

  const handleCouponAdd = (newCoupon: Coupon) => {
    setCoupons((prevCoupons) => [...prevCoupons, newCoupon])
  }

  return (
    <AdminPage
      products={products}
      coupons={coupons}
      onProductUpdate={handleProductUpdate}
      onProductAdd={handleProductAdd}
      onCouponAdd={handleCouponAdd}
    />
  )
}

describe('advanced > ', () => {
  describe('시나리오 테스트 > ', () => {
    test('장바구니 페이지 테스트 > ', async () => {
      render(<CartPage products={mockProducts} coupons={mockCoupons} />)
      const product1 = screen.getByTestId('product-p1')
      const product2 = screen.getByTestId('product-p2')
      const product3 = screen.getByTestId('product-p3')
      const addToCartButtonsAtProduct1 =
        within(product1).getByText('장바구니에 추가')
      const addToCartButtonsAtProduct2 =
        within(product2).getByText('장바구니에 추가')
      const addToCartButtonsAtProduct3 =
        within(product3).getByText('장바구니에 추가')

      // 1. 상품 정보 표시
      expect(product1).toHaveTextContent('상품1')
      expect(product1).toHaveTextContent('10,000원')
      expect(product1).toHaveTextContent('재고: 20개')
      expect(product2).toHaveTextContent('상품2')
      expect(product2).toHaveTextContent('20,000원')
      expect(product2).toHaveTextContent('재고: 20개')
      expect(product3).toHaveTextContent('상품3')
      expect(product3).toHaveTextContent('30,000원')
      expect(product3).toHaveTextContent('재고: 20개')

      // 2. 할인 정보 표시
      expect(screen.getByText('10개 이상: 10% 할인')).toBeInTheDocument()

      // 3. 상품1 장바구니에 상품 추가
      fireEvent.click(addToCartButtonsAtProduct1) // 상품1 추가

      // 4. 할인율 계산
      expect(screen.getByText('상품 금액: 10,000원')).toBeInTheDocument()
      expect(screen.getByText('할인 금액: 0원')).toBeInTheDocument()
      expect(screen.getByText('최종 결제 금액: 10,000원')).toBeInTheDocument()

      // 5. 상품 품절 상태로 만들기
      for (let i = 0; i < 19; i++) {
        fireEvent.click(addToCartButtonsAtProduct1)
      }

      // 6. 품절일 때 상품 추가 안 되는지 확인하기
      expect(product1).toHaveTextContent('재고: 0개')
      fireEvent.click(addToCartButtonsAtProduct1)
      expect(product1).toHaveTextContent('재고: 0개')

      // 7. 할인율 계산
      expect(screen.getByText('상품 금액: 200,000원')).toBeInTheDocument()
      expect(screen.getByText('할인 금액: 20,000원')).toBeInTheDocument()
      expect(screen.getByText('최종 결제 금액: 180,000원')).toBeInTheDocument()

      // 8. 상품을 각각 10개씩 추가하기
      fireEvent.click(addToCartButtonsAtProduct2) // 상품2 추가
      fireEvent.click(addToCartButtonsAtProduct3) // 상품3 추가

      const increaseButtons = screen.getAllByText('+')
      for (let i = 0; i < 9; i++) {
        fireEvent.click(increaseButtons[1]) // 상품2
        fireEvent.click(increaseButtons[2]) // 상품3
      }

      // 9. 할인율 계산
      expect(screen.getByText('상품 금액: 700,000원')).toBeInTheDocument()
      expect(screen.getByText('할인 금액: 110,000원')).toBeInTheDocument()
      expect(screen.getByText('최종 결제 금액: 590,000원')).toBeInTheDocument()

      // 10. 쿠폰 적용하기
      const couponSelect = screen.getByRole('combobox')
      fireEvent.change(couponSelect, { target: { value: '1' } }) // 10% 할인 쿠폰 선택

      // 11. 할인율 계산
      expect(screen.getByText('상품 금액: 700,000원')).toBeInTheDocument()
      expect(screen.getByText('할인 금액: 169,000원')).toBeInTheDocument()
      expect(screen.getByText('최종 결제 금액: 531,000원')).toBeInTheDocument()

      // 12. 다른 할인 쿠폰 적용하기
      fireEvent.change(couponSelect, { target: { value: '0' } }) // 5000원 할인 쿠폰
      expect(screen.getByText('상품 금액: 700,000원')).toBeInTheDocument()
      expect(screen.getByText('할인 금액: 115,000원')).toBeInTheDocument()
      expect(screen.getByText('최종 결제 금액: 585,000원')).toBeInTheDocument()
    })

    test('관리자 페이지 테스트 > ', async () => {
      render(<TestAdminPage />)

      const $product1 = screen.getByTestId('product-1')

      // 1. 새로운 상품 추가
      fireEvent.click(screen.getByText('새 상품 추가'))

      fireEvent.change(screen.getByLabelText('상품명'), {
        target: { value: '상품4' },
      })
      fireEvent.change(screen.getByLabelText('가격'), {
        target: { value: '15000' },
      })
      fireEvent.change(screen.getByLabelText('재고'), {
        target: { value: '30' },
      })

      fireEvent.click(screen.getByText('추가'))

      const $product4 = screen.getByTestId('product-4')

      expect($product4).toHaveTextContent('상품4')
      expect($product4).toHaveTextContent('15000원')
      expect($product4).toHaveTextContent('재고: 30')

      // 2. 상품 선택 및 수정
      fireEvent.click($product1)
      fireEvent.click(within($product1).getByTestId('toggle-button'))
      fireEvent.click(within($product1).getByTestId('modify-button'))

      act(() => {
        fireEvent.change(within($product1).getByDisplayValue('20'), {
          target: { value: '25' },
        })
        fireEvent.change(within($product1).getByDisplayValue('10000'), {
          target: { value: '12000' },
        })
        fireEvent.change(within($product1).getByDisplayValue('상품1'), {
          target: { value: '수정된 상품1' },
        })
      })

      fireEvent.click(within($product1).getByText('수정 완료'))

      expect($product1).toHaveTextContent('수정된 상품1')
      expect($product1).toHaveTextContent('12000원')
      expect($product1).toHaveTextContent('재고: 25')

      // 3. 상품 할인율 추가 및 삭제
      fireEvent.click($product1)
      fireEvent.click(within($product1).getByTestId('modify-button'))

      // 할인 추가
      act(() => {
        fireEvent.change(screen.getByPlaceholderText('수량'), {
          target: { value: '5' },
        })
        fireEvent.change(screen.getByPlaceholderText('할인율 (%)'), {
          target: { value: '5' },
        })
      })
      fireEvent.click(screen.getByText('할인 추가'))

      expect(screen.queryByText('5개 이상 구매 시 5% 할인')).toBeInTheDocument()

      // 할인 삭제
      fireEvent.click(screen.getAllByText('삭제')[0])
      expect(
        screen.queryByText('10개 이상 구매 시 10% 할인'),
      ).not.toBeInTheDocument()
      expect(screen.queryByText('5개 이상 구매 시 5% 할인')).toBeInTheDocument()

      fireEvent.click(screen.getAllByText('삭제')[0])
      expect(
        screen.queryByText('10개 이상 구매 시 10% 할인'),
      ).not.toBeInTheDocument()
      expect(
        screen.queryByText('5개 이상 구매 시 5% 할인'),
      ).not.toBeInTheDocument()

      // 4. 쿠폰 추가
      fireEvent.change(screen.getByPlaceholderText('쿠폰 이름'), {
        target: { value: '새 쿠폰' },
      })
      fireEvent.change(screen.getByPlaceholderText('쿠폰 코드'), {
        target: { value: 'NEW10' },
      })
      fireEvent.change(screen.getByRole('combobox'), {
        target: { value: 'percentage' },
      })
      fireEvent.change(screen.getByPlaceholderText('할인 값'), {
        target: { value: '10' },
      })

      fireEvent.click(screen.getByText('쿠폰 추가'))

      const $newCoupon = screen.getByTestId('coupon-3')

      expect($newCoupon).toHaveTextContent('새 쿠폰 (NEW10):10% 할인')
    })
  })

  describe('자유롭게 작성해보세요.', () => {
    test('적용 가능한 할인율을 찾아서 반환하는가', () => {
      const foundDiscount = findApplicableDiscount(
        mockProducts[0].discounts,
        10,
      )
      expect(foundDiscount).toEqual({ quantity: 10, rate: 0.1 })
    })

    test('상품의 재고를 확인하는가', () => {
      const remainingStock = getRemainingStock(mockCartItem, mockProducts[0])
      expect(remainingStock).toBe(10)
    })

    test('관리자 페이지 유틸 함수(createProduct)가 잘 작동하는가', () => {
      const newProduct = {
        name: 'new product',
        price: 100000,
        stock: 100,
        discounts: [],
      }
      const createdProduct = createProduct(newProduct)
      expect(createdProduct).toEqual({
        ...newProduct,
        id: expect.any(String),
      })
    })

    test('관리자 페이지 유틸 함수(updateProduct)가 잘 작동하는가', () => {
      const updatedProduct = {
        ...mockProducts[0],
        name: 'updated product',
      }
      const updatedProductName = updateProductField(
        updatedProduct,
        'name',
        'updated product',
      )
      expect(updatedProductName).toEqual({
        ...mockProducts[0],
        name: 'updated product',
      })
    })

    test('관리자 페이지 아코디언 훅이 잘 작동하는가 ', () => {
      const { result } = renderHook(() => useAccordion())
      act(() => {
        result.current.toggleProductAccordion('p1')
      })
      expect(result.current.openProductIds.has('p1')).toBe(true)
    })

    test('관리자 페이지 쿠폰 매니지먼트 훅이 잘 작동하는가', () => {
      const { result } = renderHook(() =>
        useCouponManagement({ onCouponAdd: vi.fn() }),
      )
      act(() => {
        result.current.setNewCoupon({
          name: 'new coupon',
          code: 'NEW10',
          discountType: 'percentage',
          discountValue: 10,
        })
      })
      expect(result.current.newCoupon).toEqual({
        name: 'new coupon',
        code: 'NEW10',
        discountType: 'percentage',
        discountValue: 10,
      })
    })

    test('관리자 페이지 컴포넌트가 잘 렌더링 되는가', () => {
      render(<TestAdminPage />)
      expect(screen.getByText('상품 관리')).toBeInTheDocument()
      expect(screen.getByText('쿠폰 관리')).toBeInTheDocument()
      expect(screen.getByText('새 상품 추가')).toBeInTheDocument()
      expect(screen.getByText('쿠폰 추가')).toBeInTheDocument()
      expect(screen.getByText('쿠폰 관리')).toBeInTheDocument()
    })

    test('관리자 페이지 상품 매니지먼트 훅이 잘 작동하는가', () => {
      const { result } = renderHook(() =>
        useProductManagement({
          onProductAdd: vi.fn(),
          onProductUpdate: vi.fn(),
        }),
      )
      act(() => {
        result.current.handleEditProduct(mockProducts[0])
      })
      act(() => {
        result.current.handleProductNameUpdate('p1', 'new product')
      })
      expect(result.current.editProduct).toEqual({
        ...mockProducts[0],
        name: 'new product',
      })
    })
  })
})
