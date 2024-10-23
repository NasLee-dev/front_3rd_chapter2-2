import { useState } from 'react'
import { Coupon } from '../../../types'

interface ICouponManagement {
  onCouponAdd: (newCoupon: Coupon) => void
}

export default function useCouponManagement({
  onCouponAdd,
}: ICouponManagement) {
  const [newCoupon, setNewCoupon] = useState<Coupon>({
    name: '',
    code: '',
    discountType: 'percentage',
    discountValue: 0,
  })

  const handleAddCoupon = () => {
    onCouponAdd(newCoupon)
    setNewCoupon({
      name: '',
      code: '',
      discountType: 'percentage',
      discountValue: 0,
    })
  }

  return {
    newCoupon,
    setNewCoupon,
    handleAddCoupon,
  }
}
