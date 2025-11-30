import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { Edit, Trash2 } from "lucide-react";
import AddProductForm from "./AddProductForm";
import EditProductDialog from "./EditProductDialog";
import { useProductStore } from "@/store/product.store";

export default function ProductsContent() {
  const [showAddForm, setShowAddForm] = useState(false);
  const [editSlug, setEditSlug] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const { fetchProducts, products, deleteProduct, total } = useProductStore();

  const [filters, setFilters] = useState({ page: 1, limit: 15 });

  useEffect(() => {
    fetchProducts(filters);
  }, [filters, fetchProducts]);

  const productList = Array.isArray(products)
    ? products
    : products?.products || [];
  const totalPages = Math.ceil(total / filters.limit) || 1;

  const handleEdit = (slug) => {
    setEditSlug(slug);
    setDialogOpen(true);
  };

  const handleDelete = (slug) => {
    toast((t) => (
      <div className="flex flex-col gap-2">
        <p>Are you sure you want to delete this product?</p>
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="destructive"
            onClick={async () => {
              await deleteProduct(slug);
              toast.dismiss(t);
              toast.success("Product deleted!");

              // ✅ Maintain current page after delete
              fetchProducts(filters);
            }}
          >
            Yes, Delete
          </Button>
          <Button size="sm" variant="outline" onClick={() => toast.dismiss(t)}>
            Cancel
          </Button>
        </div>
      </div>
    ));
  };

  return (
    <>
      {/* Header */}
      <div className="flex justify-between items-center mb-5">
        <h2 className="text-2xl font-semibold text-[#02066F]">
          Manage Products
        </h2>
        <Button
          onClick={() => setShowAddForm(!showAddForm)}
          className="rounded-md text-sm font-medium shadow-sm"
        >
          {showAddForm ? "Close Form" : "Add New Product"}
        </Button>
      </div>

      {/* Add Product Form */}
      {showAddForm && (
        <AddProductForm
          onSuccess={() => {
            setShowAddForm(false);
            // ✅ Stay on same page after adding (or reload last page if needed)
            fetchProducts(filters);
          }}
        />
      )}

      {/* Product Table */}
      <Card className="bg-white border border-gray-200 rounded-xl shadow-sm">
        <CardContent className="overflow-x-auto p-0">
          <table className="min-w-full border-collapse text-sm">
            <thead className="bg-[#f8fafc] text-gray-700 border-b">
              <tr>
                <th className="p-3 text-left font-medium">Image</th>
                <th className="p-3 text-left font-medium w-[250px]">Title</th>
                <th className="p-3 text-left font-medium">Category</th>
                <th className="p-3 text-left font-medium">Subcategory</th>
                <th className="p-3 text-center font-medium">Price</th>
                <th className="p-3 text-center font-medium">SKU</th>
                <th className="p-3 text-center font-medium">Stock</th>
                <th className="p-3 text-center font-medium">Actions</th>
              </tr>
            </thead>

            <tbody>
              {productList.length > 0 ? (
                productList.map((p, index) => (
                  <tr
                    key={p._id}
                    className={`${
                      index % 2 === 0 ? "bg-white" : "bg-gray-50"
                    } hover:bg-[#f1f5f9] transition-colors border-b`}
                  >
                    {/* Image */}
                    <td className="p-3">
                      <div className="flex justify-center">
                        <img
                          src={
                            p.images?.[0] ||
                            "https://ik.imagekit.io/bulkwala/demo/default-product.png"
                          }
                          alt={p.title}
                          className="w-14 h-14 object-cover rounded-md border border-gray-200 shadow-sm"
                        />
                      </div>
                    </td>

                    {/* Title */}
                    <td className="p-3 font-medium text-gray-800 leading-tight">
                      <div className="line-clamp-2">{p.title}</div>
                    </td>

                    {/* Category */}
                    <td className="p-3 text-gray-700 text-center">
                      {p.category?.name || "-"}
                    </td>

                    {/* Subcategory */}
                    <td className="p-3 text-gray-700 text-center">
                      {p.subcategory?.name || "-"}
                    </td>

                    {/* Price */}
                    <td className="p-3 text-center font-semibold">
                      {p.discountPrice && p.discountPrice < p.price ? (
                        <span className="text-green-600 font-bold">
                          ₹{p.discountPrice}
                        </span>
                      ) : (
                        <span>₹{p.price}</span>
                      )}
                    </td>

                    {/* SKU */}
                    <td className="p-3 text-center text-gray-700">
                      {p.sku || "-"}
                    </td>

                    {/* Stock */}
                    <td className="p-3 text-center">
                      <span
                        className={`inline-flex items-center justify-center min-w-[80px] px-3 py-1 rounded-full text-sm font-medium whitespace-nowrap shadow-sm ${
                          p.stock > 0
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {p.stock > 0 ? "In Stock" : "Out of Stock"}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="p-3 text-center">
                      <div className="flex justify-center gap-2">
                        <Button
                          size="icon"
                          variant="outline"
                          className="h-8 w-8 text-blue-600 border-blue-200 hover:bg-blue-50"
                          onClick={() => handleEdit(p.slug)}
                        >
                          <Edit size={15} />
                        </Button>
                        <Button
                          size="icon"
                          variant="outline"
                          className="h-8 w-8 text-red-600 border-red-200 hover:bg-red-50"
                          onClick={() => handleDelete(p.slug)}
                        >
                          <Trash2 size={15} />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="8"
                    className="text-center py-8 text-gray-500 text-sm"
                  >
                    No products found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </CardContent>
      </Card>

      {/* Pagination */}
      {total > filters.limit && (
        <div className="flex justify-center items-center gap-4 mt-6">
          <Button
            variant="outline"
            disabled={filters.page === 1}
            onClick={() =>
              setFilters((prev) => ({ ...prev, page: prev.page - 1 }))
            }
          >
            Prev
          </Button>
          <span className="text-gray-700">
            Page {filters.page} of {totalPages}
          </span>
          <Button
            variant="outline"
            disabled={filters.page === totalPages}
            onClick={() =>
              setFilters((prev) => ({ ...prev, page: prev.page + 1 }))
            }
          >
            Next
          </Button>
        </div>
      )}

      {/* Edit Product Dialog */}
      <EditProductDialog
        open={dialogOpen}
        slug={editSlug}
        onClose={() => setDialogOpen(false)}
        // ✅ Refresh same page after editing
        onSuccess={() => fetchProducts(filters)}
      />
    </>
  );
}
