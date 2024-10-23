export default function TitleText({ title }: { title: string }) {
  return (
    title === '장바구니' ? (
      <h1 className="text-3xl font-bold mb-6">장바구니</h1>
    ) : (
      <h2 className="text-2xl font-semibold mb-4">{title}</h2>
    )
  )
}