import CatalogCategoryPage from '@/components/products/CatalogCategoryPage';
import WholesaleScreenTable from '@/components/products/WholesaleScreenTable';
import { productCategoryPages } from '@/data/product-category-pages';

export default function ScreensPage() {
  return (
    <>
      <CatalogCategoryPage data={productCategoryPages.screens} />
      <WholesaleScreenTable />
    </>
  );
}
