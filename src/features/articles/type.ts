export interface Article {
  id: string;
  title: string;
  slug: string;
  description: string;
  content: string;
  thumbnail_url: string | null;
  category_id: string;
  author_id: string;
  is_published: boolean;
  published_at: Date | null;
  created_at: Date;
  updated_at: Date;
}

export interface CRUDArticle {
  id: string;
  title: string;
  slug?: string;
  description?: string;
  content: string;
  thumbnail?: string;
  category_id: string;
  category_name?: string;
  created_at?: string;
}

export type ArticlePayload = Omit<
  Article,
  "id" | "slug" | "category_name" | "created_at"
>;

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
}
