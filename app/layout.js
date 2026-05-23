export const metadata = {
    title: 'Retellings Dubliners',
    description: 'Where History and Literature Meet',
  }
  
  export default function RootLayout({ children }) {
    return (
      <html lang="en">
        <body>{children}</body>
      </html>
    )
  }