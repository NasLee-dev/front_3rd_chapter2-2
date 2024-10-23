import TitleText from '../../title'

interface IPriceAreaProps {
  totalBeforeDiscount: number
  totalAfterDiscount: number
  totalDiscount: number
}

export default function PriceArea({
  totalBeforeDiscount,
  totalAfterDiscount,
  totalDiscount,
}: IPriceAreaProps) {
  return (
    <div className="mt-6 bg-white p-4 rounded shadow">
      <TitleText isTitle={true} titleText={'주문 요약'} />
      <div className="space-y-1">
        <p>상품 금액: {totalBeforeDiscount.toLocaleString()}원</p>
        <p className="text-green-600">
          할인 금액: {totalDiscount.toLocaleString()}원
        </p>
        <p className="text-xl font-bold">
          최종 결제 금액: {totalAfterDiscount.toLocaleString()}원
        </p>
      </div>
    </div>
  )
}
