// u535au5ba2u6587u7ae0u7c7bu578bu5b9au4e49

// u7528u6237u8d44u6599u7c7bu578b
export interface Profile {
  id: string;
  display_name: string;
  avatar_url?: string;
  role?: string;
}

// u6587u7ae0u5143u6570u636eu7c7bu578b
export interface PostMeta {
  cover_image?: string;
  [key: string]: any;
}

// u6570u636eu5e93u6587u7ae0u7c7bu578b
export interface Post {
  id: number;
  title: string;
  slug: string;
  content?: string;
  excerpt?: string;
  status: 'draft' | 'publish' | 'private';
  published_at?: string;
  created_at?: string;
  updated_at?: string;
  author_id: string;
  meta?: PostMeta;
  profiles?: Profile;
}

// u524du7aefu6587u7ae0u5361u7247u7c7bu578b
export interface ArticleCard {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  author: string;
  date: string;
  readTime: string;
  imageSrc: string;
  content?: string;
}
