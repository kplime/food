const ACCENT_CLASS: Record<string, string> = {
  blue: 'bg-obang-blue',
  red: 'bg-obang-red',
  yellow: 'bg-obang-yellow',
  white: 'bg-obang-white border border-obang-black/20',
  black: 'bg-obang-black',
}

export function AccentDot({ accent }: { accent: string }) {
  return <span className={`inline-block h-2.5 w-2.5 rounded-full ${ACCENT_CLASS[accent]}`} />
}
