import CatalogCategoryPage from '@/components/products/CatalogCategoryPage';
import { productCategoryPages } from '@/data/product-category-pages';

export default function TabletWatchPage() {
  return <CatalogCategoryPage data={productCategoryPages.tabletWatch} />;
}
