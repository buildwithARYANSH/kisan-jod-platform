import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { HeartHandshake, Plus, ShoppingBag, Layers, UserCheck } from 'lucide-react';

export const WomenEnterprisesSection: React.FC = () => {
  const { womenProducts, womenResources, addWomenProduct, addWomenResource, t } = useApp();

  const [activeTab, setActiveTab] = useState<'sell' | 'list'>('sell');
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [isResourceModalOpen, setIsResourceModalOpen] = useState(false);

  // Product Form State
  const [productName, setProductName] = useState('Homemade Mango Pickle');
  const [productQty, setProductQty] = useState<number>(30);
  const [productPrice, setProductPrice] = useState<number>(450);
  const [productDesc, setProductDesc] = useState('Pure homemade Punjabi pickle in mustard oil');
  const [sellerName, setSellerName] = useState('Sunita Devi');

  // Resource Form State
  const [resourceName, setResourceName] = useState('Dried Cow Dung Fuel Cakes');
  const [resourceQty, setResourceQty] = useState<number>(1000);
  const [resourceDesc, setResourceDesc] = useState('Organically dried bio-energy fuel cakes');

  const handleProductSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!productName) return;
    addWomenProduct({
      productName,
      quantity: productQty,
      unit: 'pcs',
      expectedPrice: productPrice,
      description: productDesc,
      category: 'Processed Food',
      sellerName,
    });
    setIsProductModalOpen(false);
  };

  const handleResourceSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!resourceName) return;
    addWomenResource({
      itemName: resourceName,
      quantity: resourceQty,
      unit: 'pcs',
      description: resourceDesc,
    });
    setIsResourceModalOpen(false);
  };

  return (
    <section className="my-6 px-4 max-w-5xl mx-auto">
      {/* Header Banner */}
      <div className="bg-white p-5 sm:p-6 rounded-3xl border border-pink-200 shadow-md mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="px-3 py-1 rounded-full bg-pink-100 text-pink-950 text-xs font-black uppercase tracking-wider">
            Rural Women Empowerment Stream
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2 mt-1.5 font-fraunces">
            <HeartHandshake className="w-6 h-6 text-pink-600" />
            {t.womenSectionTitle}
          </h2>
          <p className="text-xs sm:text-sm text-slate-700 font-semibold mt-1">
            Empowering rural women through direct product selling & local raw resource listing
          </p>
        </div>

        <button
          onClick={() => (activeTab === 'sell' ? setIsProductModalOpen(true) : setIsResourceModalOpen(true))}
          className="py-3 px-5 rounded-2xl bg-pink-600 hover:bg-pink-700 text-white font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md transition-transform hover:scale-102 shrink-0 cursor-pointer"
        >
          <Plus className="w-5 h-5" />
          {activeTab === 'sell' ? t.addProduct : t.addResource}
        </button>
      </div>

      {/* Tabs Switcher */}
      <div className="flex border-b border-slate-200 mb-6">
        <button
          onClick={() => setActiveTab('sell')}
          className={`py-3 px-6 text-sm font-extrabold border-b-2 flex items-center gap-2 transition-colors cursor-pointer ${
            activeTab === 'sell'
              ? 'border-pink-600 text-pink-700'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <ShoppingBag className="w-4 h-4" />
          {t.tabSell} ({womenProducts.length})
        </button>
        <button
          onClick={() => setActiveTab('list')}
          className={`py-3 px-6 text-sm font-extrabold border-b-2 flex items-center gap-2 transition-colors cursor-pointer ${
            activeTab === 'list'
              ? 'border-pink-600 text-pink-700'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Layers className="w-4 h-4" />
          {t.tabList} ({womenResources.length})
        </button>
      </div>

      {/* Tab A: Sell Finished Products */}
      {activeTab === 'sell' && (
        <div>
          {womenProducts.length === 0 ? (
            <div className="p-10 text-center bg-white rounded-3xl border border-dashed border-pink-300 text-slate-600 font-bold">
              {t.noProductsYet}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {womenProducts.map((prod) => (
                <div
                  key={prod.id}
                  className="p-5 sm:p-6 rounded-3xl bg-white border border-pink-100 shadow-md flex items-start gap-4"
                >
                  {prod.image && (
                    <img
                      src={prod.image}
                      alt={prod.productName}
                      className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover border border-pink-200 shrink-0 shadow-xs"
                    />
                  )}
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <span className="text-[10px] font-black px-2.5 py-0.5 rounded-full bg-pink-100 text-pink-900 border border-pink-200">
                        {prod.category}
                      </span>
                      <span className="text-base sm:text-lg font-black text-pink-700">
                        ₹{prod.expectedPrice}
                      </span>
                    </div>

                    <h3 className="text-base font-black text-slate-900 font-fraunces mt-1">
                      {prod.productName}
                    </h3>
                    <p className="text-xs text-slate-700 font-semibold mt-1 line-clamp-2">
                      {prod.description}
                    </p>

                    <div className="mt-3 flex items-center justify-between text-xs text-slate-600 font-semibold pt-2 border-t border-slate-100">
                      <span className="flex items-center gap-1 font-bold text-pink-700">
                        <UserCheck className="w-3.5 h-3.5 text-pink-600" />
                        {prod.sellerName}
                      </span>
                      <span>Stock: <strong className="text-slate-900 font-bold">{prod.quantity} {prod.unit}</strong></span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab B: List Raw Resources */}
      {activeTab === 'list' && (
        <div>
          {womenResources.length === 0 ? (
            <div className="p-10 text-center bg-white rounded-3xl border border-dashed border-pink-300 text-slate-600 font-bold">
              {t.noResourcesYet}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {womenResources.map((res) => (
                <div
                  key={res.id}
                  className="p-5 sm:p-6 rounded-3xl bg-white border border-pink-100 shadow-md flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-black px-2.5 py-0.5 rounded-md bg-slate-100 text-slate-800 border border-slate-200">
                        {res.status}
                      </span>
                      {res.assignedPrice && (
                        <span className="text-xs font-black text-pink-700">
                          Assigned: ₹{res.assignedPrice}/unit
                        </span>
                      )}
                    </div>
                    <h3 className="text-base font-black text-slate-900 font-fraunces mt-1">
                      {res.itemName}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-700 font-semibold mt-1">
                      {res.description}
                    </p>
                    <p className="text-xs text-slate-900 font-bold mt-2.5">
                      Quantity: {res.quantity.toLocaleString()} {res.unit}
                    </p>
                  </div>
                  <p className="text-[11px] text-slate-500 font-medium mt-3 pt-2 border-t border-slate-100">
                    Platform will assign final price after buyer match
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Add Product Modal */}
      {isProductModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full border border-pink-200 shadow-2xl animate-in fade-in zoom-in duration-200">
            <h3 className="text-xl font-black text-slate-900 mb-4 font-fraunces">
              {t.addProduct}
            </h3>

            <form onSubmit={handleProductSubmit} className="space-y-4 text-xs sm:text-sm">
              <div>
                <label className="block font-bold text-slate-800 mb-1">
                  Product Name
                </label>
                <input
                  type="text"
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                  placeholder="e.g. Homemade Pickle, Ghee, Handicraft"
                  className="w-full p-3 rounded-xl border border-slate-300 bg-slate-50 text-slate-900 font-bold focus:ring-2 focus:ring-pink-500"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-800 mb-1">
                  Quantity
                </label>
                <input
                  type="number"
                  value={productQty}
                  onChange={(e) => setProductQty(Number(e.target.value))}
                  className="w-full p-3 rounded-xl border border-slate-300 bg-slate-50 text-slate-900 font-bold focus:ring-2 focus:ring-pink-500"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-800 mb-1">
                  Expected Price (₹)
                </label>
                <input
                  type="number"
                  value={productPrice}
                  onChange={(e) => setProductPrice(Number(e.target.value))}
                  className="w-full p-3 rounded-xl border border-slate-300 bg-slate-50 text-slate-900 font-bold focus:ring-2 focus:ring-pink-500"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-800 mb-1">
                  Seller / SHG Name
                </label>
                <input
                  type="text"
                  value={sellerName}
                  onChange={(e) => setSellerName(e.target.value)}
                  className="w-full p-3 rounded-xl border border-slate-300 bg-slate-50 text-slate-900 font-bold focus:ring-2 focus:ring-pink-500"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-800 mb-1">
                  Description
                </label>
                <textarea
                  value={productDesc}
                  onChange={(e) => setProductDesc(e.target.value)}
                  rows={2}
                  className="w-full p-3 rounded-xl border border-slate-300 bg-slate-50 text-slate-900 font-bold focus:ring-2 focus:ring-pink-500"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsProductModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-bold cursor-pointer"
                >
                  {t.cancel}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-pink-600 hover:bg-pink-700 text-white font-extrabold shadow-md cursor-pointer"
                >
                  List Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Resource Modal */}
      {isResourceModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full border border-pink-200 shadow-2xl animate-in fade-in zoom-in duration-200">
            <h3 className="text-xl font-black text-slate-900 mb-4 font-fraunces">
              {t.addResource}
            </h3>

            <form onSubmit={handleResourceSubmit} className="space-y-4 text-xs sm:text-sm">
              <div>
                <label className="block font-bold text-slate-800 mb-1">
                  Resource Name
                </label>
                <input
                  type="text"
                  value={resourceName}
                  onChange={(e) => setResourceName(e.target.value)}
                  placeholder="e.g. Cow Dung, Fiber, Stalks"
                  className="w-full p-3 rounded-xl border border-slate-300 bg-slate-50 text-slate-900 font-bold focus:ring-2 focus:ring-pink-500"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-800 mb-1">
                  Quantity
                </label>
                <input
                  type="number"
                  value={resourceQty}
                  onChange={(e) => setResourceQty(Number(e.target.value))}
                  className="w-full p-3 rounded-xl border border-slate-300 bg-slate-50 text-slate-900 font-bold focus:ring-2 focus:ring-pink-500"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-800 mb-1">
                  Description
                </label>
                <textarea
                  value={resourceDesc}
                  onChange={(e) => setResourceDesc(e.target.value)}
                  rows={2}
                  className="w-full p-3 rounded-xl border border-slate-300 bg-slate-50 text-slate-900 font-bold focus:ring-2 focus:ring-pink-500"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsResourceModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-bold cursor-pointer"
                >
                  {t.cancel}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-pink-600 hover:bg-pink-700 text-white font-extrabold shadow-md cursor-pointer"
                >
                  Submit Raw Resource
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};
