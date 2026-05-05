import CatalogCategoryPage from '@/components/products/CatalogCategoryPage';
import { productCategoryPages } from '@/data/product-category-pages';

export default function SmallPartsPage() {
  return <CatalogCategoryPage data={productCategoryPages.smallParts} />;
}
