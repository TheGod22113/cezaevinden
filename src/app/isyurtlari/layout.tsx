import Link from "next/link";

export default function IsyurtlariLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/isyurtlari" className="text-2xl font-bold text-blue-600">
            İsyurtları Ürünleri
          </Link>
          <div className="flex gap-4">
            <Link href="/isyurtlari/sepet" className="text-blue-600 hover:underline">
              Sepetim
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {children}
      </main>
    </div>
  );
}
