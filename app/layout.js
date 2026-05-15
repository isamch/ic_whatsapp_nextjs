import './globals.css'
import Providers from '@/components/Providers'

export const metadata = {
  title: 'WhatsApp CRM',
  description: 'WhatsApp CRM Platform',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}
