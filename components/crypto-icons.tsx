export function BitcoinIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 32 32" fill="none">
      <circle cx="16" cy="16" r="16" fill="#F7931A" />
      <path
        d="M23.189 14.02c.314-2.096-.128-3.227-.987-3.975-.626-.546-1.495-.8-2.566-.8h-.989V6.578c0-.2-.165-.365-.365-.365h-1.389c-.2 0-.365.165-.365.365v2.667h-1.108V6.578c0-.2-.165-.365-.365-.365h-1.389c-.2 0-.365.165-.365.365v2.667H12.18c-.2 0-.365.165-.365.365v1.389c0 .2.165.365.365.365h.554v7.722H12.18c-.2 0-.365.165-.365.365v1.389c0 .2.165.365.365.365h1.746v2.844c0 .2.165.365.365.365h1.389c.2 0 .365-.165.365-.365v-2.844h1.108v2.844c0 .2.165.365.365.365h1.389c.2 0 .365-.165.365-.365v-2.844h.989c1.684 0 2.844-.342 3.558-1.048.714-.706 1.084-1.791 1.084-3.238 0-.906-.247-1.695-.741-2.333.495-.638.741-1.427.741-2.333zm-2.734 5.488c-.459.459-1.143.683-2.051.683h-2.438v-2.733h2.438c.908 0 1.592.224 2.051.683.459.459.683.908.683 1.367s-.224.908-.683 1zm-.683-4.099c-.412.412-1.025.612-1.825.612h-1.981v-2.244h1.981c.8 0 1.413.2 1.825.612.412.412.612.8.612 1.188s-.2.78-.612 1.188z"
        fill="white"
      />
    </svg>
  )
}

export function EthereumIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 32 32" fill="none">
      <circle cx="16" cy="16" r="16" fill="#627EEA" />
      <path d="M16.498 4v8.87l7.497 3.35-7.497-12.22z" fill="#C0CBF6" fillOpacity="0.602" />
      <path d="M16.498 4L9 16.22l7.498-3.35V4z" fill="white" />
      <path d="M16.498 21.968v6.027L24 17.616l-7.502 4.352z" fill="#C0CBF6" fillOpacity="0.602" />
      <path d="M16.498 27.995v-6.028L9 17.616l7.498 10.38z" fill="white" />
      <path d="M16.498 20.573l7.497-4.353-7.497-3.348v7.701z" fill="#8A92B2" fillOpacity="0.2" />
      <path d="M9 16.22l7.498 4.353v-7.701L9 16.22z" fill="#C0D4F0" fillOpacity="0.602" />
    </svg>
  )
}

export function SolanaIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 32 32" fill="none">
      <defs>
        <linearGradient id="solanaGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#00D4AA" />
          <stop offset="50%" stopColor="#4E44CE" />
          <stop offset="100%" stopColor="#9945FF" />
        </linearGradient>
      </defs>
      <circle cx="16" cy="16" r="16" fill="url(#solanaGradient)" />
      <path
        d="M6.5 20.5c0-.276.224-.5.5-.5h17.5c.276 0 .5.224.5.5v1c0 .276-.224.5-.5.5H7c-.276 0-.5-.224-.5-.5v-1z"
        fill="white"
      />
      <path
        d="M6.5 15.5c0-.276.224-.5.5-.5h17.5c.276 0 .5.224.5.5v1c0 .276-.224.5-.5.5H7c-.276 0-.5-.224-.5-.5v-1z"
        fill="white"
      />
      <path
        d="M6.5 10.5c0-.276.224-.5.5-.5h17.5c.276 0 .5.224.5.5v1c0 .276-.224.5-.5.5H7c-.276 0-.5-.224-.5-.5v-1z"
        fill="white"
      />
      <path d="M24.5 9.5L22 7h-15c-.276 0-.5.224-.5.5v1c0 .276.224.5.5.5h17z" fill="white" />
      <path d="M24.5 22.5L22 25H7c-.276 0-.5-.224-.5-.5v-1c0-.276.224-.5.5-.5h17.5z" fill="white" />
    </svg>
  )
}

export function getCryptoIcon(symbol: string, className?: string) {
  switch (symbol.toUpperCase()) {
    case "BTC":
    case "BITCOIN":
      return <BitcoinIcon className={className} />
    case "ETH":
    case "ETHEREUM":
      return <EthereumIcon className={className} />
    case "SOL":
    case "SOLANA":
      return <SolanaIcon className={className} />
    default:
      return null
  }
}
