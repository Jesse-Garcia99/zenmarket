import { ZenProvider } from './state'
import { DemoStrip, Footer, Header, StoreTabs } from './components/SiteChrome'
import { ZenMatchBar } from './components/ZenMatchBar'
import { ProductSection } from './components/ProductSection'
import { RelatedItems } from './components/RelatedItems'
import { WarehouseDrawer } from './components/WarehouseDrawer'

export default function App() {
  return (
    <ZenProvider>
      <DemoStrip />
      <Header />
      <StoreTabs />
      <ZenMatchBar />
      <main className="pb-8">
        <ProductSection />
        <RelatedItems />
      </main>
      <Footer />
      <WarehouseDrawer />
    </ZenProvider>
  )
}
