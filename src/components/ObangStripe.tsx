export function ObangStripe({ className = '' }: { className?: string }) {
  return (
    <span className={`flex border border-obang-black ${className}`}>
      <span className="flex-1 bg-obang-blue" />
      <span className="flex-1 bg-obang-red" />
      <span className="flex-1 bg-obang-yellow" />
      <span className="flex-1 bg-obang-white" />
      <span className="flex-1 bg-obang-black" />
    </span>
  )
}
