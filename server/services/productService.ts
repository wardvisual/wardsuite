import { Product } from '../types/models';
import { CreateProductDto, UpdateProductDto } from '../dto/product.dto';

let skuCounter = 5;

function nextSku() {
  return `SKU-${String(skuCounter++).padStart(4, '0')}`;
}

class ProductService {
  private products: Product[] = [
    { id: '1', sku: 'SKU-0001', name: 'Laptop Pro 15"', category: 'Electronics', unit: 'pcs', costPrice: 800, sellingPrice: 1200, currentStock: 45, reorderLevel: 10, status: 'active', createdAt: '2025-01-15T08:00:00Z', updatedAt: '2025-01-15T08:00:00Z' },
    { id: '2', sku: 'SKU-0002', name: 'Wireless Mouse', category: 'Accessories', unit: 'pcs', costPrice: 12, sellingPrice: 25, currentStock: 200, reorderLevel: 50, status: 'active', createdAt: '2025-01-15T08:00:00Z', updatedAt: '2025-01-15T08:00:00Z' },
    { id: '3', sku: 'SKU-0003', name: 'USB-C Hub', category: 'Accessories', unit: 'pcs', costPrice: 18, sellingPrice: 40, currentStock: 8, reorderLevel: 15, status: 'active', createdAt: '2025-02-01T08:00:00Z', updatedAt: '2025-02-01T08:00:00Z' },
    { id: '4', sku: 'SKU-0004', name: 'Monitor 27"', category: 'Electronics', unit: 'pcs', costPrice: 250, sellingPrice: 450, currentStock: 3, reorderLevel: 5, status: 'active', createdAt: '2025-02-10T08:00:00Z', updatedAt: '2025-02-10T08:00:00Z' },
  ];

  async getAll(search?: string): Promise<Product[]> {
    if (!search) return this.products;
    const q = search.toLowerCase();
    return this.products.filter(p =>
      p.name.toLowerCase().includes(q) ||
      p.sku.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q)
    );
  }

  async getById(id: string): Promise<Product | undefined> {
    return this.products.find(p => p.id === id);
  }

  async create(dto: CreateProductDto): Promise<Product> {
    const now = new Date().toISOString();
    const item: Product = {
      id: Math.random().toString(36).substring(2, 11),
      sku: dto.sku ?? nextSku(),
      name: dto.name,
      category: dto.category,
      unit: dto.unit,
      costPrice: dto.costPrice,
      sellingPrice: dto.sellingPrice,
      currentStock: dto.currentStock,
      reorderLevel: dto.reorderLevel,
      status: dto.status ?? 'active',
      createdAt: now,
      updatedAt: now,
    };
    this.products.push(item);
    return item;
  }

  async update(id: string, dto: UpdateProductDto): Promise<Product | undefined> {
    const index = this.products.findIndex(p => p.id === id);
    if (index === -1) return undefined;
    this.products[index] = { ...this.products[index], ...dto, updatedAt: new Date().toISOString() };
    return this.products[index];
  }

  async delete(id: string): Promise<boolean> {
    const initial = this.products.length;
    this.products = this.products.filter(p => p.id !== id);
    return this.products.length < initial;
  }

  getLowStockCount(): number {
    return this.products.filter(p => p.currentStock <= p.reorderLevel).length;
  }

  count(): number {
    return this.products.length;
  }

  adjustStock(productId: string, delta: number): void {
    const p = this.products.find(p => p.id === productId);
    if (p) {
      p.currentStock = Math.max(0, p.currentStock + delta);
      p.updatedAt = new Date().toISOString();
    }
  }
}

export const productService = new ProductService();
