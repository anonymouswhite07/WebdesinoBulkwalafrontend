import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { Edit } from "lucide-react";
import AddCategoryForm from "./AddCategoryForm";
import EditCategoryDialog from "./EditCategoryDialog";
import { useCategoryStore } from "@/store/category.store";

export default function CategoriesContent() {
  const [showAddForm, setShowAddForm] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);

  const { fetchCategories, categories, removeCategory, editCategory } =
    useCategoryStore();

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleEdit = (category) => {
    setSelectedCategory(category);
    setEditDialogOpen(true);
  };

  const handleSave = async (updatedData) => {
    await editCategory(selectedCategory.slug, updatedData);
    setEditDialogOpen(false);
    toast.success("Category updated successfully!");
    fetchCategories();
  };

  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-[#02066F]">
          Manage Categories
        </h2>
        <Button onClick={() => setShowAddForm(!showAddForm)}>
          {showAddForm ? "Close Form" : "Add New Category"}
        </Button>
      </div>

      {showAddForm && (
        <AddCategoryForm
          onSuccess={() => {
            setShowAddForm(false);
            fetchCategories();
          }}
        />
      )}

      <Card className="bg-white border border-gray-200 rounded-xl shadow-sm">
        <CardContent className="overflow-x-auto p-0">
          <table className="min-w-full border-collapse">
            <thead className="bg-gray-100 text-gray-700 text-sm">
              <tr>
                <th className="p-3 text-left">Image</th>
                <th className="p-3 text-left">Name</th>
                <th className="p-3 text-left">Slug</th>
                <th className="p-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories?.length > 0 ? (
                categories.map((cat, i) => (
                  <tr
                    key={cat._id || i}
                    className="border-b hover:bg-gray-50 transition"
                  >
                    <td className="p-3">
                      <img
                        src={cat.img_url}
                        alt={cat.name}
                        className="w-14 h-14 object-cover rounded-md border"
                      />
                    </td>
                    <td className="p-3 text-sm font-medium">{cat.name}</td>
                    <td className="p-3 text-sm text-gray-700">{cat.slug}</td>
                    <td className="p-3 text-center">
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-blue-600 border-blue-200 hover:bg-blue-50"
                        onClick={() => handleEdit(cat)}
                      >
                        <Edit size={16} />
                      </Button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="4"
                    className="text-center py-8 text-gray-500 text-sm"
                  >
                    No categories found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </CardContent>
      </Card>

      {selectedCategory && (
        <EditCategoryDialog
          open={editDialogOpen}
          onOpenChange={setEditDialogOpen}
          category={selectedCategory}
          onSave={handleSave}
        />
      )}
    </>
  );
}
