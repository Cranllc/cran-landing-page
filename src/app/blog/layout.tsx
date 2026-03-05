import SiteHeader from "@/components/SiteHeader"
import SiteFooter from "@/components/SiteFooter"

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SiteHeader forceLightMode={true} />
      {children}
      <SiteFooter />
    </>
  )
}
