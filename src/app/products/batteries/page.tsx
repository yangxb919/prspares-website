import CatalogCategoryPage from '@/components/products/CatalogCategoryPage';
import WholesaleBatteryTable from '@/components/products/WholesaleBatteryTable';
import { productCategoryPages } from '@/data/product-category-pages';

export default function BatteriesPage() {
  return (
    <>
      <CatalogCategoryPage data={productCategoryPages.batteries} />
      <WholesaleBatteryTable />
    </>
  );
}
