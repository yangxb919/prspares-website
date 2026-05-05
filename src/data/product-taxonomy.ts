export type ProductMenuIcon =
  | 'screens'
  | 'batteries'
  | 'smallParts'
  | 'tools'
  | 'tabletWatch'
  | 'catalog';

export type ProductMenuItem = {
  name: string;
  path: string;
  detail: string;
  count: string;
  icon: ProductMenuIcon;
  chips?: readonly string[];
  children?: readonly {
    name: string;
    path: string;
    count?: string;
  }[];
};

export type ProductMenuGroup = {
  label: string;
  items: readonly ProductMenuItem[];
};

export const productMenuCategories: readonly ProductMenuItem[] = [
  {
    name: 'Screens',
    path: '/products/screens',
    detail: 'LCD, OLED, Incell and with-frame assemblies',
    count: '5,263 SKUs',
    icon: 'screens',
    chips: ['LCD/OLED', 'With frame'],
    children: [
      { name: 'LCD & OLED Screens', path: '/products/screens', count: '5,263 SKUs' },
      { name: 'Screen Assembly with Frame', path: '/products/screens#catalog-skus', count: '770 SKUs' },
    ],
  },
  {
    name: 'Batteries',
    path: '/products/batteries',
    detail: 'Phone batteries with export packing discussion',
    count: '1,500 SKUs',
    icon: 'batteries',
    chips: ['iPhone', 'Android'],
    children: [
      { name: 'Phone Batteries', path: '/products/batteries', count: '1,500 SKUs' },
      { name: 'iPad Batteries', path: '/products/ipad-battery-replacement-factory', count: '1,000 iPad SKUs' },
    ],
  },
  {
    name: 'Small Parts',
    path: '/products/small-parts',
    detail: 'Camera, charging, flex, housing and speaker lines',
    count: '14,000+ SKUs',
    icon: 'smallParts',
    chips: ['Camera', 'Charging', 'Flex'],
    children: [
      { name: 'Camera Modules', path: '/products/iphone-rear-camera-wholesale', count: '2,522 SKUs' },
      { name: 'Charging Ports', path: '/products/small-parts#catalog-skus', count: '1,886 SKUs' },
      { name: 'Flex Cables', path: '/products/small-parts#catalog-skus', count: '2,861 SKUs' },
      { name: 'Back Covers & Housing', path: '/products/small-parts#catalog-skus', count: '2,797 SKUs' },
    ],
  },
  {
    name: 'IC Chips & Repair Tools',
    path: '/products/repair-tools',
    detail: 'Programmers, hand tools, IC chips and test cables',
    count: '2,080 SKUs',
    icon: 'tools',
    chips: ['Tools', 'IC chips'],
    children: [
      { name: 'Repair Tools', path: '/products/repair-tools', count: '2,080 SKUs' },
      { name: 'Programmers & Test Cables', path: '/products/repair-tools#catalog-skus' },
      { name: 'IC Chips', path: '/products/repair-tools#catalog-skus', count: '185 SKUs' },
    ],
  },
  {
    name: 'Tablet & Watch Parts',
    path: '/products/tablet-watch',
    detail: 'iPad, Galaxy Tab, Apple Watch and smartwatch repair parts',
    count: '1,800+ SKUs',
    icon: 'tabletWatch',
    chips: ['iPad', 'Watch'],
    children: [
      { name: 'Tablet & Watch Parts', path: '/products/tablet-watch', count: '1,800+ SKUs' },
      { name: 'iPad Batteries', path: '/products/ipad-battery-replacement-factory', count: '1,000 iPad SKUs' },
      { name: 'Galaxy Tab Parts', path: '/products/tablet-watch#catalog-skus', count: '900 SKUs' },
      { name: 'Smartwatch Parts', path: '/products/tablet-watch#catalog-skus', count: '800 SKUs' },
    ],
  },
];

export const productMenuAllCatalog: ProductMenuItem = {
  name: 'All Product Catalog',
  path: '/products',
  detail: 'Updated catalog overview by product category',
  count: '27,783 SKUs',
  icon: 'catalog',
};

export const productMenuGroups: readonly ProductMenuGroup[] = [
  {
    label: 'Product categories',
    items: productMenuCategories,
  },
];
