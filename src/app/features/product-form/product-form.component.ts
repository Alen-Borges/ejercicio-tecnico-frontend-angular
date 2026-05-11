import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ProductService } from '../../core/services/product.service';
import {
  minTodayValidator,
  reviseDateValidator,
  idExistsValidator
} from '../../core/validators/product.validators';

@Component({
  selector: 'app-product-form',
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.scss']
})
export class ProductFormComponent implements OnInit, OnDestroy {
  form!: FormGroup;
  isEditMode = false;
  productId = '';
  loading = false;
  submitting = false;
  errorMessage = '';
  successMessage = '';
  submitted = false;

  private releaseSub?: Subscription;

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.productId = this.route.snapshot.params['id'] || '';
    this.isEditMode = !!this.productId;
    this.buildForm();

    if (this.isEditMode) {
      this.loading = true;
      this.productService.getProducts().subscribe({
        next: (res) => {
          const product = res.data.find(p => p.id === this.productId);
          if (product) {
            this.form.patchValue(product);
            this.form.get('id')?.disable();
          } else {
            this.errorMessage = 'Producto no encontrado.';
          }
          this.loading = false;
        },
        error: (err: Error) => {
          this.errorMessage = err.message;
          this.loading = false;
        }
      });
    }

    // Auto-calculate date_revision when date_release changes
    this.releaseSub = this.form.get('date_release')!.valueChanges.subscribe(value => {
      if (value) {
        const release = new Date(value + 'T00:00:00');
        release.setFullYear(release.getFullYear() + 1);
        const yyyy = release.getFullYear();
        const mm = String(release.getMonth() + 1).padStart(2, '0');
        const dd = String(release.getDate()).padStart(2, '0');
        this.form.get('date_revision')!.setValue(`${yyyy}-${mm}-${dd}`, { emitEvent: false });
        this.form.get('date_revision')!.updateValueAndValidity();
      }
    });
  }

  ngOnDestroy(): void {
    this.releaseSub?.unsubscribe();
  }

  private buildForm(): void {
    this.form = this.fb.group({
      id: [
        '',
        {
          validators: [
            Validators.required,
            Validators.minLength(3),
            Validators.maxLength(10)
          ],
          asyncValidators: this.isEditMode
            ? []
            : [idExistsValidator(this.productService)],
          updateOn: 'blur'
        }
      ],
      name: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(100)]],
      description: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(200)]],
      logo: ['', Validators.required],
      date_release: ['', [Validators.required, minTodayValidator()]],
      date_revision: [{ value: '', disabled: true }, [Validators.required, reviseDateValidator('date_release')]]
    });
  }

  // Convenience getters for template
  get f() { return this.form.controls; }

  hasError(field: string, error: string): boolean {
    const ctrl = this.form.get(field);
    return !!(ctrl && ctrl.hasError(error) && (ctrl.touched || this.submitted));
  }

  isInvalid(field: string): boolean {
    const ctrl = this.form.get(field);
    return !!(ctrl && ctrl.invalid && (ctrl.touched || this.submitted));
  }

  onSubmit(): void {
    this.submitted = true;
    this.errorMessage = '';

    if (this.form.invalid || this.form.pending) return;

    this.submitting = true;
    const raw = this.form.getRawValue(); // includes disabled fields

    if (this.isEditMode) {
      const { id, ...updateData } = raw;
      this.productService.updateProduct(this.productId, updateData).subscribe({
        next: () => {
          this.submitting = false;
          this.router.navigate(['/products']);
        },
        error: (err: Error) => {
          this.errorMessage = err.message;
          this.submitting = false;
        }
      });
    } else {
      this.productService.createProduct(raw).subscribe({
        next: () => {
          this.submitting = false;
          this.router.navigate(['/products']);
        },
        error: (err: Error) => {
          this.errorMessage = err.message;
          this.submitting = false;
        }
      });
    }
  }

  onReset(): void {
    this.submitted = false;
    this.errorMessage = '';
    this.successMessage = '';
    this.form.reset();
    if (this.isEditMode) {
      this.form.get('id')?.disable();
    }
  }

  goBack(): void {
    this.router.navigate(['/products']);
  }
}
