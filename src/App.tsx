import { ZenProvider, useZen } from './state'
import { DemoStrip, Footer, Header, StoreTabs } from './components/SiteChrome'
import { ZenMatchBar } from './components/ZenMatchBar'
import { ProductSection } from './components/ProductSection'
import { RelatedItems } from './components/RelatedItems'
import { BrowsePage } from './components/BrowsePage'
import { WarehouseDrawer } from './components/WarehouseDrawer'

function Page() {
  const { route } = useZen()
  return route.page === 'item' ? (
    <>
      <ProductSection />
      <RelatedItems />
    </>
  ) : (
    <BrowsePage />
  )
}

export default function App() {
  return (
    <ZenProvider>
      <DemoStrip />
      <Header />
      <StoreTabs />
      <ZenMatchBar />
      <main className="pb-8">
        <Page />
      </main>
      <Footer />
      <WarehouseDrawer />
    </ZenProvider>
  )
}
