import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { Edit, Trash2 } from "lucide-react";
import AddSubCategoryForm from "./AddSubCategoryForm";
import EditSubcategoryDialog from "./EditSubcategoryDialog";
import { useSubcategoryStore } from "@/store/subcategory.store";

export default function SubcategoriesContent() {
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedSubcategory, setSelectedSubcategory] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const {
    fetchSubcategories,
    subcategories,
    removeSubcategory,
    editSubcategory,
  } = useSubcategoryStore();

  useEffect(() => {
    fetchSubcategories();
  }, []);

  const handleEdit = (sub) => {
    setSelectedSubcategory(sub);
    setDialogOpen(true);
  };

  const handleDelete = (slug) => {
    toast((t) => (
      <div className="flex flex-col gap-2">
        <p>Are you sure you want to delete this subcategory?</p>
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="destructive"
            onClick={async () => {
              await removeSubcategory(slug);
              toast.dismiss(t);
              toast.success("Subcategory deleted successfully!");
              fetchSubcategories();
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
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-[#02066F]">
          Manage Subcategories
        </h2>
        <Button onClick={() => setShowAddForm(!showAddForm)}>
          {showAddForm ? "Close Form" : "Add New Subcategory"}
        </Button>
      </div>

      {showAddForm && (
        <AddSubCategoryForm
          onSuccess={() => {
            setShowAddForm(false);
            fetchSubcategories();
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
                <th className="p-3 text-left">Category</th>
                <th className="p-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {subcategories?.length > 0 ? (
                subcategories.map((sub, i) => (
                  <tr
                    key={sub._id || i}
                    className="border-b hover:bg-gray-50 transition"
                  >
                    <td className="p-3">
                      <img
                        src={sub.img_url}
                        alt={sub.name}
                        className="w-14 h-14 object-cover rounded-md border"
                      />
                    </td>
                    <td className="p-3 text-sm font-medium">{sub.name}</td>
                    <td className="p-3 text-sm">{sub.slug}</td>
                    <td className="p-3 text-sm">{sub.category?.name || "-"}</td>
                    <td className="p-3 text-center">
                      <div className="flex justify-center gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-blue-600 border-blue-200 hover:bg-blue-50"
                          onClick={() => handleEdit(sub)}
                        >
                          <Edit size={16} />
                        </Button>
                        {/* <Button
                          size="sm"
                          variant="outline"
                          className="text-red-600 border-red-200 hover:bg-red-50"
                          onClick={() => handleDelete(sub.slug)}
                        >
                          <Trash2 size={16} />
                        </Button> */}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="5"
                    className="text-center py-8 text-gray-500 text-sm"
                  >
                    No subcategories found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </CardContent>
      </Card>

      <EditSubcategoryDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        subcategory={selectedSubcategory}
        onSave={async (slug, data) => {
          await editSubcategory(slug, data);
          toast.success("Subcategory updated!");
          fetchSubcategories();
        }}
      />
    </>
  );
}
