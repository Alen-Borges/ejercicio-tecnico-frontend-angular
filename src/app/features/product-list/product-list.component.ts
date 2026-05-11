import {
  Component, OnInit, HostListener
} from '@angular/core';
import { Router } from '@angular/router';
import { Product } from '../../core/models/product.model';
import { ProductService } from '../../core/services/product.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss']
})
export class ProductListComponent implements OnInit {
  products: Product[] = [];
  loading = true;
  errorMessage = '';
  successMessage = '';

  // F2 — Search
  searchTerm = '';

  // F3 — Page size
  pageSize = 5;
  pageSizes = [5, 10, 20];

  // F5/F6 — Dropdown + modal
  openDropdownId: string | null = null;
  selectedProduct: Product | null = null;

  constructor(
    private productService: ProductService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.loading = true;
    this.errorMessage = '';
    this.productService.getProducts().subscribe({
      next: (res) => {
        this.products = res.data;
        this.loading = false;
      },
      error: (err: Error) => {
        this.errorMessage = err.message;
        this.loading = false;
      }
    });
  }

  // F2 — filter
  get filteredProducts(): Product[] {
    if (!this.searchTerm.trim()) return this.products;
    const term = this.searchTerm.toLowerCase().trim();
    return this.products.filter(
      p =>
        p.name.toLowerCase().includes(term) ||
        p.description.toLowerCase().includes(term)
    );
  }

  // F3 — paged
  get pagedProducts(): Product[] {
    return this.filteredProducts.slice(0, this.pageSize);
  }

  onSearchChange(value: string): void {
    this.searchTerm = value;
  }

  onPageSizeChange(value: string): void {
    this.pageSize = Number(value);
  }

  // F4 — Navigate to add
  goToAdd(): void {
    this.router.navigate(['/products/add']);
  }

  // F5 — Dropdown toggle
  toggleDropdown(id: string, event: MouseEvent): void {
    event.stopPropagation();
    this.openDropdownId = this.openDropdownId === id ? null : id;
  }

  @HostListener('document:click')
  closeDropdown(): void {
    this.openDropdownId = null;
  }

  // F5 — Navigate to edit
  goToEdit(product: Product, event: MouseEvent): void {
    event.stopPropagation();
    this.openDropdownId = null;
    this.router.navigate(['/products/edit', product.id]);
  }

  // F6 — Open delete modal
  openDeleteModal(product: Product, event: MouseEvent): void {
    event.stopPropagation();
    this.openDropdownId = null;
    this.selectedProduct = product;
  }

  onDeleteConfirmed(): void {
    if (!this.selectedProduct) return;
    const id = this.selectedProduct.id;
    const name = this.selectedProduct.name;
    this.selectedProduct = null;

    this.productService.deleteProduct(id).subscribe({
      next: () => {
        this.products = this.products.filter(p => p.id !== id);
        this.showSuccess(`El producto "${name}" fue eliminado exitosamente.`);
      },
      error: (err: Error) => {
        this.errorMessage = err.message;
      }
    });
  }

  onDeleteCancelled(): void {
    this.selectedProduct = null;
  }

  private showSuccess(msg: string): void {
    this.successMessage = msg;
    setTimeout(() => (this.successMessage = ''), 4000);
  }
}
