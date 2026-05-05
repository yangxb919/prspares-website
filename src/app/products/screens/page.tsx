import CatalogCategoryPage from '@/components/products/CatalogCategoryPage';
import { productCategoryPages } from '@/data/product-category-pages';

export default function ScreensPage() {
  return <CatalogCategoryPage data={productCategoryPages.screens} />;
}
