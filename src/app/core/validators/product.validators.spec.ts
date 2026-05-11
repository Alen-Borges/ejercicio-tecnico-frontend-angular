import {
  minTodayValidator,
  reviseDateValidator,
  idExistsValidator
} from './product.validators';
import { FormControl, FormGroup } from '@angular/forms';
import { of } from 'rxjs';

// Helper to get today/yesterday/tomorrow strings
const toISO = (d: Date) => d.toISOString().slice(0, 10);
const today = () => toISO(new Date());
const yesterday = () => {
  const d = new Date(); d.setDate(d.getDate() - 1); return toISO(d);
};
const tomorrow = () => {
  const d = new Date(); d.setDate(d.getDate() + 1); return toISO(d);
};
const plusOneYear = (dateStr: string) => {
  const d = new Date(dateStr + 'T00:00:00');
  d.setFullYear(d.getFullYear() + 1);
  return toISO(d);
};

describe('minTodayValidator', () => {
  const validator = minTodayValidator();

  it('should return null for today', () => {
    const ctrl = new FormControl(today());
    expect(validator(ctrl)).toBeNull();
  });

  it('should return null for future date', () => {
    const ctrl = new FormControl(tomorrow());
    expect(validator(ctrl)).toBeNull();
  });

  it('should return pastDate error for yesterday', () => {
    const ctrl = new FormControl(yesterday());
    expect(validator(ctrl)).toEqual({ pastDate: true });
  });

  it('should return null when value is empty', () => {
    const ctrl = new FormControl('');
    expect(validator(ctrl)).toBeNull();
  });
});

describe('reviseDateValidator', () => {
  const buildGroup = (release: string, revision: string) => {
    const group = new FormGroup({
      date_release: new FormControl(release),
      date_revision: new FormControl(revision, reviseDateValidator('date_release'))
    });
    group.get('date_revision')?.updateValueAndValidity();
    return group;
  };

  it('should return null when revision is exactly 1 year after release', () => {
    const release = tomorrow();
    const revision = plusOneYear(release);
    const g = buildGroup(release, revision);
    expect(g.get('date_revision')!.errors).toBeNull();
  });

  it('should return invalidReviseDate when revision is same day as release', () => {
    const release = tomorrow();
    const g = buildGroup(release, release);
    expect(g.get('date_revision')!.errors).toEqual({ invalidReviseDate: true });
  });

  it('should return invalidReviseDate when revision is 1 year + 1 day', () => {
    const release = tomorrow();
    const d = new Date(plusOneYear(release) + 'T00:00:00');
    d.setDate(d.getDate() + 1);
    const g = buildGroup(release, toISO(d));
    expect(g.get('date_revision')!.errors).toEqual({ invalidReviseDate: true });
  });

  it('should return null when release is empty', () => {
    const g = buildGroup('', tomorrow());
    expect(g.get('date_revision')!.errors).toBeNull();
  });
});

describe('idExistsValidator', () => {
  it('should return null when id is too short', done => {
    const mockService = { verifyId: jest.fn() } as any;
    const ctrl = new FormControl('ab');
    const validator = idExistsValidator(mockService);
    (validator(ctrl) as any).subscribe((result: any) => {
      expect(result).toBeNull();
      expect(mockService.verifyId).not.toHaveBeenCalled();
      done();
    });
  });

  it('should return idExists:true when API returns true', done => {
    const mockService = { verifyId: jest.fn().mockReturnValue(of(true)) } as any;
    const ctrl = new FormControl('abc');
    const validator = idExistsValidator(mockService);
    (validator(ctrl) as any).subscribe((result: any) => {
      expect(result).toEqual({ idExists: true });
      done();
    });
  });

  it('should return null when API returns false', done => {
    const mockService = { verifyId: jest.fn().mockReturnValue(of(false)) } as any;
    const ctrl = new FormControl('nuevo');
    const validator = idExistsValidator(mockService);
    (validator(ctrl) as any).subscribe((result: any) => {
      expect(result).toBeNull();
      done();
    });
  });
});
