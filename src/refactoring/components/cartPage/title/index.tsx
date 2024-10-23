export default function TitleText({
  isTitle,
  titleText,
}: {
  isTitle: boolean
  titleText: string
}) {
  return isTitle ? (
    <h1 className="text-3xl font-bold mb-6">{titleText}</h1>
  ) : (
    <h2 className="text-2xl font-semibold mb-4">{titleText}</h2>
  )
}
