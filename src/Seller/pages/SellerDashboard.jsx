import React, { useState, useEffect } from "react";
import {
  FaBoxOpen,
  FaTags,
  FaTachometerAlt,
  FaCog,
  FaExclamationTriangle,
} from "react-icons/fa";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import AddProductForm from "../../Admin/components/AddProductForm.jsx";
import EditProductDialog from "../../Admin/components/EditProductDialog.jsx";
import { useProductStore } from "@/store/product.store.js";
import { useCategoryStore } from "@/store/category.store.js";
import useAuthStore from "@/store/auth.store.js";
import { Trash2, Edit } from "lucide-react";
import { toast } from "sonner";

/* SELLER DASHBOARD MAIN COMPONENT*/
const SellerDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeSection, setActiveSection] = useState(
    localStorage.getItem("sellerActiveSection") || "Dashboard"
  );

  useEffect(() => {
    localStorage.setItem("sellerActiveSection", activeSection);
  }, [activeSection]);

  const menuItems = [
    { name: "Dashboard", icon: <FaTachometerAlt /> },
    { name: "Products", icon: <FaBoxOpen /> },
    { name: "Categories", icon: <FaTags /> },
  ];

  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Sidebar */}
      <aside
        className={`${
          sidebarOpen ? "w-64" : "w-20"
        } bg-white shadow-md border-r border-gray-200 transition-all duration-300 flex flex-col`}
      >
        <div className="flex items-center justify-between p-4 border-b">
          <h1
            className={`${
              sidebarOpen ? "block" : "hidden"
            } text-xl font-bold text-[#02066F]`}
          >
            Seller Panel
          </h1>
          <Button
            size="icon"
            variant="ghost"
            className="hover:bg-gray-100 text-[#02066F]"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            {sidebarOpen ? "←" : "→"}
          </Button>
        </div>

        <nav className="flex-1 mt-4 overflow-y-auto space-y-1 px-2">
          {menuItems.map((item) => (
            <Button
              key={item.name}
              variant={activeSection === item.name ? "secondary" : "ghost"}
              className={`w-full justify-start px-4 py-2 text-gray-700 rounded-lg transition-all duration-200 ${
                activeSection === item.name
                  ? "bg-[#02066F] text-white hover:bg-[#04127A]"
                  : "hover:bg-gray-100"
              }`}
              onClick={() => setActiveSection(item.name)}
            >
              <span className="text-lg">{item.icon}</span>
              {sidebarOpen && (
                <span className="ml-3 text-sm font-medium">{item.name}</span>
              )}
            </Button>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 overflow-auto">
        {/* Section Rendering */}
        {activeSection === "Dashboard" && <SellerDashboardContent />}
        {activeSection === "Products" && <SellerProductsContent />}
        {activeSection === "Categories" && <SellerCategoryView />}
      </main>
    </div>
  );
};

/* DASHBOARD OVERVIEW SECTION */
const SellerDashboardContent = () => {
  const { products, fetchProducts, total } = useProductStore();
  const { user } = useAuthStore();

  useEffect(() => {
    fetchProducts({ sellerId: user._id, limit: 15 });
  }, []);

  const productList = Array.isArray(products)
    ? products
    : products?.products || [];

  const lowStock = productList.filter((p) => p.stock <= 5).length;

  const cardData = [
    {
      title: "My Products",
      value: total || 0,
      icon: <FaBoxOpen className="text-blue-500 w-6 h-6" />,
      bg: "bg-blue-50",
      text: "text-blue-700",
    },
    {
      title: "Low Stock",
      value: lowStock,
      icon: <FaExclamationTriangle className="text-red-500 w-6 h-6" />,
      bg: "bg-red-50",
      text: "text-red-700",
    },
  ];

  return (
    <Card className="bg-white border border-gray-200 rounded-xl shadow-sm">
      <CardHeader>
        <CardTitle className="text-[#02066F]">Dashboard Overview</CardTitle>
        <CardDescription>Your product performance summary</CardDescription>
      </CardHeader>

      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {cardData.map((card) => (
            <Card
              key={card.title}
              className="bg-white shadow-md rounded-xl border border-gray-200"
            >
              <CardHeader className="flex items-center justify-between">
                <div>
                  <CardDescription className="text-sm">
                    {card.title}
                  </CardDescription>
                  <CardTitle className="text-2xl font-bold text-[#02066F]">
                    {card.value}
                  </CardTitle>
                </div>
                {card.icon}
              </CardHeader>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

/* PRODUCT MANAGEMENT SECTION (Paginated */
const SellerProductsContent = () => {
  const { fetchProducts, products, deleteProduct, total } = useProductStore();
  const [showAddForm, setShowAddForm] = useState(false);
  const [editSlug, setEditSlug] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const { user } = useAuthStore();

  const [page, setPage] = useState(1);
  const limit = 15;

  useEffect(() => {
    fetchProducts({ sellerId: user._id, page, limit });
  }, [page]);

  const productList = Array.isArray(products)
    ? products
    : products?.products || [];

  const totalPages = Math.ceil((total || 0) / limit);

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
              toast.success("Product deleted successfully!");
              fetchProducts({ sellerId: user._id, page, limit });
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
      {/* OUTER WRAPPER LIKE ADMIN */}
      <Card className="bg-white border border-gray-200 rounded-xl shadow-sm">
        <CardHeader className="pb-4">
          <CardTitle className="text-[#02066F] text-m">
            Manage Products
          </CardTitle>
          <CardDescription>View and manage your products</CardDescription>
        </CardHeader>

        <CardContent className="pt-0">
          {/* Add Product Button */}
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-700">
              Product List
            </h2>
            <Button onClick={() => setShowAddForm(!showAddForm)}>
              {showAddForm ? "Close Form" : "Add Product"}
            </Button>
          </div>

          {/* Add Form */}
          {showAddForm && (
            <AddProductForm
              onSuccess={() => {
                setShowAddForm(false);
                fetchProducts({ sellerId: user._id, page, limit });
              }}
            />
          )}

          {/* PRODUCT TABLE */}
          <div className="overflow-x-auto border rounded-lg shadow-sm">
            <table className="min-w-full border-collapse bg-white">
              <thead className="bg-[#e4e9f2] text-[#02066F] border-b text-sm font-medium">
                <tr>
                  <th className="p-3 text-left">Image</th>
                  <th className="p-3 text-left w-[250px]">Title</th>
                  <th className="p-3 text-left">Category</th>
                  <th className="p-3 text-left">Subcategory</th>
                  <th className="p-3 text-center">Price</th>
                  <th className="p-3 text-center">SKU</th>
                  <th className="p-3 text-center">Stock</th>
                  <th className="p-3 text-center">Actions</th>
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
                            className="w-14 h-14 rounded-md object-cover border shadow-sm"
                          />
                        </div>
                      </td>

                      {/* Title */}
                      <td className="p-3 font-medium text-gray-800 leading-tight">
                        <div className="line-clamp-2">{p.title}</div>
                      </td>

                      {/* Category */}
                      <td className="p-3 text-gray-700">
                        {p.category?.name || "-"}
                      </td>

                      {/* Subcategory */}
                      <td className="p-3 text-gray-700">
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
                          className={`inline-flex items-center justify-center min-w-[80px] px-3 py-1 rounded-full text-sm font-medium shadow-sm ${
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
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center mt-6 space-x-3">
              <Button
                variant="outline"
                disabled={page === 1}
                onClick={() => setPage((prev) => prev - 1)}
              >
                Prev
              </Button>
              <span className="text-sm text-gray-700">
                Page {page} of {totalPages}
              </span>
              <Button
                variant="outline"
                disabled={page === totalPages}
                onClick={() => setPage((prev) => prev + 1)}
              >
                Next
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* EDIT PRODUCT MODAL */}
      <EditProductDialog
        open={dialogOpen}
        slug={editSlug}
        onClose={() => setDialogOpen(false)}
        onSuccess={() => fetchProducts({ sellerId: user._id, page, limit })}
      />
    </>
  );
};

/*  CATEGORY READ-ONLY VIEW */
const SellerCategoryView = () => {
  const { categories, fetchCategories } = useCategoryStore();

  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <Card className="bg-white shadow-sm rounded-xl">
      <CardHeader>
        <CardTitle>Available Categories</CardTitle>
        <CardDescription>You can choose from these categories.</CardDescription>
      </CardHeader>
      <CardContent>
        {categories?.length > 0 ? (
          <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {categories.map((cat) => (
              <div
                key={cat._id}
                className="p-4 border rounded-lg hover:shadow-sm bg-gray-50 flex flex-col items-center"
              >
                <img
                  src={cat.img_url}
                  alt={cat.name}
                  className="w-20 h-20 object-cover rounded-md mb-2"
                />
                <p className="font-medium text-gray-800">{cat.name}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-sm">No categories available.</p>
        )}
      </CardContent>
    </Card>
  );
};

export default SellerDashboard;
