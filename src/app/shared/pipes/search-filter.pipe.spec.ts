import { SearchFilterPipe } from './search-filter.pipe';
import { Product } from '../../core/models/product.model';

const makeProduct = (id: string, name: string, description: string): Product => ({
  id, name, description, logo: '', date_release: '', date_revision: ''
});

describe('SearchFilterPipe', () => {
  let pipe: SearchFilterPipe;

  beforeEach(() => { pipe = new SearchFilterPipe(); });

  it('should return all items when search term is empty', () => {
    const products = [makeProduct('1', 'Visa', 'Tarjeta'), makeProduct('2', 'Master', 'Crédito')];
    expect(pipe.transform(products, '')).toEqual(products);
  });

  it('should return all items when search term is whitespace', () => {
    const products = [makeProduct('1', 'Visa', 'Tarjeta')];
    expect(pipe.transform(products, '   ')).toEqual(products);
  });

  it('should filter by name case-insensitively', () => {
    const products = [makeProduct('1', 'Tarjeta VISA', 'Desc'), makeProduct('2', 'MasterCard', 'Desc2')];
    const result = pipe.transform(products, 'visa');
    expect(result.length).toBe(1);
    expect(result[0].id).toBe('1');
  });

  it('should filter by description', () => {
    const products = [
      makeProduct('1', 'Visa', 'Tarjeta de crédito'),
      makeProduct('2', 'Débito', 'Cuenta corriente')
    ];
    const result = pipe.transform(products, 'corriente');
    expect(result.length).toBe(1);
    expect(result[0].id).toBe('2');
  });

  it('should return empty array when no products match', () => {
    const products = [makeProduct('1', 'Visa', 'Crédito')];
    expect(pipe.transform(products, 'xyz-inexistente')).toEqual([]);
  });

  it('should return empty array for empty product list', () => {
    expect(pipe.transform([], 'visa')).toEqual([]);
  });

  it('should return empty array for null list', () => {
    expect(pipe.transform(null as any, 'visa')).toEqual([]);
  });

  it('should match multiple products when term appears in both', () => {
    const products = [
      makeProduct('1', 'Visa Clásica', 'Desc'),
      makeProduct('2', 'Visa Signature', 'Desc2'),
      makeProduct('3', 'MasterCard', 'Desc3')
    ];
    expect(pipe.transform(products, 'Visa').length).toBe(2);
  });
});
