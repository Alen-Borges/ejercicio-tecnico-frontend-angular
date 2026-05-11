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

  // Pagination
  currentPage = 1;

  // F5/F6 — Dropdown + modal
  openDropdownId: string | null = null;
  dropdownPosition = { top: 0, right: 0 };
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
  get totalPages(): number {
    return Math.max(1, Math.ceil(this.filteredProducts.length / this.pageSize));
  }

  get pagedProducts(): Product[] {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.filteredProducts.slice(start, start + this.pageSize);
  }

  onSearchChange(value: string): void {
    this.searchTerm = value;
    this.currentPage = 1;
  }

  onPageSizeChange(value: string): void {
    this.pageSize = Number(value);
    this.currentPage = 1;
  }

  prevPage(): void {
    if (this.currentPage > 1) this.currentPage--;
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) this.currentPage++;
  }

  // F4 — Navigate to add
  goToAdd(): void {
    this.router.navigate(['/products/add']);
  }

  // F5 — Dropdown toggle
  toggleDropdown(id: string, event: MouseEvent): void {
    event.stopPropagation();
    if (this.openDropdownId === id) {
      this.openDropdownId = null;
    } else {
      const btn = event.currentTarget as HTMLElement | null;
      if (btn) {
        const rect = btn.getBoundingClientRect();
        this.dropdownPosition = {
          top: rect.bottom + 4,
          right: window.innerWidth - rect.right
        };
      }
      this.openDropdownId = id;
    }
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

  onImageError(event: Event): void {
    const img = event.target as HTMLImageElement;
    // Remove the error handler FIRST to prevent an infinite loop
    // if the fallback itself fails to load
    img.onerror = null;
    img.src =
      'data:image/svg+xml;utf8,' +
      encodeURIComponent(
        '<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48">' +
        '<rect width="48" height="48" rx="8" fill="#e2e8f0"/>' +
        '<text x="50%" y="54%" dominant-baseline="middle" text-anchor="middle" ' +
        'font-size="22" fill="#94a3b8">🖼</text></svg>'
      );
  }

  private showSuccess(msg: string): void {
    this.successMessage = msg;
    setTimeout(() => (this.successMessage = ''), 4000);
  }
}
