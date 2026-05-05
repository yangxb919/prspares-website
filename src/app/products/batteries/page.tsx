import CatalogCategoryPage from '@/components/products/CatalogCategoryPage';
import { productCategoryPages } from '@/data/product-category-pages';

export default function BatteriesPage() {
  return <CatalogCategoryPage data={productCategoryPages.batteries} />;
}
