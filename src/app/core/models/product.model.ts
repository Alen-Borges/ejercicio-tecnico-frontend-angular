export interface Product {
  id: string;
  name: string;
  description: string;
  logo: string;
  date_release: string;
  date_revision: string;
}

export interface ProductApiResponse {
  data: Product[];
}

export interface ProductCreateResponse {
  message: string;
  data: Product;
}

export interface ProductUpdateResponse {
  message: string;
  data: Product;
}

export interface ProductDeleteResponse {
  message: string;
}

export interface CreateProductRequest {
  id: string;
  name: string;
  description: string;
  logo: string;
  date_release: string;
  date_revision: string;
}

export interface UpdateProductRequest {
  name: string;
  description: string;
  logo: string;
  date_release: string;
  date_revision: string;
}
