import React, { useEffect, useState } from 'react';
import categoryService from '../services/categoryService';
import type { Category } from '../types/category';

interface CategorySelectProps {
  value: string;
  onChange: (categoryId: string) => void;
  className?: string;
  required?: boolean;
}

const CategorySelect: React.FC<CategorySelectProps> = ({
  value,
  onChange,
  className = '',
  required = false
}) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const data = await categoryService.getCategories();
        setCategories(data);
        setError(null);
      } catch (err) {
        console.error('Erro ao buscar categorias:', err);
        setError('Não foi possível carregar as categorias. Tente novamente mais tarde.');
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  return (
    <div>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`shadow-sm focus:ring-orange-500 focus:border-orange-500 block w-full sm:text-sm border-gray-300 rounded-md ${className}`}
        disabled={loading}
        required={required}
      >
        <option value="">Selecione uma categoria</option>
        {categories.map((category) => (
          <option key={category.id} value={category.id}>
            {category.name}
          </option>
        ))}
      </select>
      {loading && <p className="mt-1 text-sm text-gray-500">Carregando categorias...</p>}
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  );
};

export default CategorySelect;
