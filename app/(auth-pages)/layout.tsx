'use client'

import dynamic from 'next/dynamic'

function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="relative flex min-h-screen flex-col" suppressHydrationWarning>
      <div className="flex min-h-screen flex-col items-center justify-center" suppressHydrationWarning>
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" suppressHydrationWarning />
        <div className="absolute inset-0 -z-10 bg-gradient-to-tr from-transparent via-transparent to-primary/10" suppressHydrationWarning />
        {children}
      </div>
    </div>
  )
}

export default dynamic(() => Promise.resolve(AuthLayout), {
  ssr: true
})
