import '../src/styles/tokens.css'
import '../src/styles/typography.css'
import '../src/styles.css'
import '../src/final-polish.css'
import '../src/styles/design-system.css'
import '../src/styles/product-ui.css'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>NEXVORA</title>
      </head>
      <body>{children}</body>
    </html>
  )
}
