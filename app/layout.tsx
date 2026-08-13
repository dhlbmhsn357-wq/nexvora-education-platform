import '../src/styles.css'

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
