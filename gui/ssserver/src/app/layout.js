export const metadata = {
  title: 'SSServer',
  description: 'A Sparse Set C++ sandbox.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
