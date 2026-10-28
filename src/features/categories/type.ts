export interface CRUDCategory {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  created_at: Date;
  updated_at: Date;
}

export type CategoryPayload = {
  name: string;
  slug: string;
  description?: string | null;
};
