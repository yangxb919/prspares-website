import CatalogCategoryPage from '@/components/products/CatalogCategoryPage';
import WholesaleBatteryTable from '@/components/products/WholesaleBatteryTable';
import { productCategoryPages } from '@/data/product-category-pages';
import BuyingQuestions from '@/components/products/BuyingQuestions';
import { batteriesBuyingFaqs } from '@/data/category-buying-faqs';

export default function BatteriesPage() {
  return (
    <>
      <CatalogCategoryPage data={productCategoryPages.batteries} />
      <WholesaleBatteryTable />
      <BuyingQuestions title="Battery buying questions" faqs={batteriesBuyingFaqs()} />
    </>
  );
}
