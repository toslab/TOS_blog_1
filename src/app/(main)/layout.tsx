import { Layout } from '@/components/Layout'

export default function MainLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex w-full bg-zinc-50 dark:bg-black">
      <Layout>{children}</Layout>
    </div>
  )
}
