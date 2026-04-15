'use client';

import { useEffect, useState } from 'react';
import { LuPlus, LuTrash2, LuTag } from 'react-icons/lu';

interface Category { id: string; name: string; slug: string; description?: string; _count: { products: number }; }

function slugify(t: string) {
  return t.toLowerCase()
    .replace(/ğ/g,'g').replace(/ü/g,'u').replace(/ş/g,'s')
    .replace(/ı/g,'i').replace(/ö/g,'o').replace(/ç/g,'c')
    .replace(/[^a-z0-9\s-]/g,'').trim().replace(/\s+/g,'-');
}

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading]       = useState(true);
  const [saving, setSaving]         = useState(false);
  const [form, setForm]             = useState({ name: '', slug: '', description: '' });
  const [error, setError]           = useState('');

  const load = () => {
    fetch('/api/admin/categories').then((r) => r.json()).then((d) => {
      setCategories(Array.isArray(d) ? d : []);
      setLoading(false);
    });
  };

  useEffect(() => { load(); }, []);

  const set = (k: string, v: string) => setForm((f) => ({
    ...f, [k]: v,
    ...(k === 'name' ? { slug: slugify(v) } : {}),
  }));

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    const res = await fetch('/api/admin/categories', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    if (res.ok) {
      setForm({ name: '', slug: '', description: '' });
      load();
    } else {
      const d = await res.json();
      setError(d.error || 'Hata oluştu');
    }
    setSaving(false);
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`"${name}" kategorisi ve içindeki tüm ürünler silinecek. Emin misiniz?`)) return;
    await fetch(`/api/admin/categories/${id}`, { method: 'DELETE' });
    load();
  };

  return (
    <div className="max-w-2xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Kategoriler</h1>
        <p className="text-gray-500 text-sm mt-1">{categories.length} kategori</p>
      </div>

      {/* Add form */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-5">
        <h2 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <LuPlus size={16} color="#FF6000" /> Yeni Kategori
        </h2>
        <form onSubmit={handleAdd} className="space-y-4">
          {error && <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl">{error}</div>}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Kategori Adı *</label>
              <input value={form.name} onChange={(e) => set('name', e.target.value)} required
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#FF6000] focus:ring-1 focus:ring-[#FF6000]"
                placeholder="Gıda Ürünleri" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Slug *</label>
              <input value={form.slug} onChange={(e) => set('slug', e.target.value)} required
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#FF6000] focus:ring-1 focus:ring-[#FF6000] font-mono"
                placeholder="gida-urunleri" />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Açıklama</label>
              <input value={form.description} onChange={(e) => set('description', e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#FF6000] focus:ring-1 focus:ring-[#FF6000]"
                placeholder="Opsiyonel açıklama" />
            </div>
          </div>
          <button type="submit" disabled={saving}
            className="bg-[#FF6000] hover:bg-[#e55500] disabled:bg-orange-300 text-white font-semibold px-6 py-2.5 rounded-xl text-sm transition-colors flex items-center gap-2"
          >
            <LuPlus size={15} /> {saving ? 'Ekleniyor...' : 'Ekle'}
          </button>
        </form>
      </div>

      {/* List */}
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-gray-400 text-sm">Yükleniyor...</div>
        ) : categories.length === 0 ? (
          <div className="p-12 text-center text-gray-400 text-sm">Kategori yok</div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Kategori</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide hidden sm:table-cell">Slug</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Ürün</th>
                <th className="px-5 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {categories.map((cat) => (
                <tr key={cat.id} className="hover:bg-gray-50">
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-orange-50 rounded-lg flex items-center justify-center">
                        <LuTag size={14} color="#FF6000" />
                      </div>
                      <span className="font-semibold text-gray-900">{cat.name}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 hidden sm:table-cell">
                    <span className="font-mono text-xs text-gray-400">{cat.slug}</span>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className="bg-blue-50 text-blue-700 text-xs font-semibold px-2.5 py-1 rounded-full">
                      {cat._count.products} ürün
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    <button
                      onClick={() => handleDelete(cat.id, cat.name)}
                      className="w-8 h-8 bg-gray-100 hover:bg-red-100 text-gray-500 hover:text-red-600 rounded-lg flex items-center justify-center ml-auto transition-colors"
                    >
                      <LuTrash2 size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
