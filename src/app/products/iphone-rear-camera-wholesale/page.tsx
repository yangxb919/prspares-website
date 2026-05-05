import CatalogCategoryPage from '@/components/products/CatalogCategoryPage';
import { productCategoryPages } from '@/data/product-category-pages';

export default function iPhoneRearCameraWholesalePage() {
  return <CatalogCategoryPage data={productCategoryPages.iphoneCameras} />;
}
