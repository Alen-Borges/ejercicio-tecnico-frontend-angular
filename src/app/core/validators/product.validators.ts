import { AbstractControl, ValidationErrors, ValidatorFn, AsyncValidatorFn } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { map, catchError, debounceTime, switchMap, first } from 'rxjs/operators';
import { ProductService } from '../services/product.service';

/**
 * Validates that the date is >= today (local time).
 */
export function minTodayValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) return null;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    // Use T00:00:00 to avoid timezone offset shifting the day
    const inputDate = new Date(control.value + 'T00:00:00');
    return inputDate >= today ? null : { pastDate: true };
  };
}

/**
 * Validates that date_revision is exactly 1 year after date_release.
 * @param dateReleaseControlName name of the sibling control
 */
export function reviseDateValidator(dateReleaseControlName: string): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const parent = control.parent;
    if (!parent) return null;
    const releaseValue: string = parent.get(dateReleaseControlName)?.value;
    if (!releaseValue || !control.value) return null;

    const release = new Date(releaseValue + 'T00:00:00');
    const revision = new Date(control.value + 'T00:00:00');
    const expected = new Date(releaseValue + 'T00:00:00');
    expected.setFullYear(expected.getFullYear() + 1);

    const valid =
      revision.getFullYear() === expected.getFullYear() &&
      revision.getMonth() === expected.getMonth() &&
      revision.getDate() === expected.getDate();

    return valid ? null : { invalidReviseDate: true };
  };
}

/**
 * Async validator factory: checks whether the given product ID already exists.
 */
export function idExistsValidator(productService: ProductService): AsyncValidatorFn {
  return (control: AbstractControl): Observable<ValidationErrors | null> => {
    if (!control.value || control.value.length < 3) {
      return of(null);
    }
    return of(control.value).pipe(
      debounceTime(400),
      switchMap(id =>
        productService.verifyId(id).pipe(
          map(exists => (exists ? { idExists: true } : null)),
          catchError(() => of(null))
        )
      ),
      first()
    );
  };
}
