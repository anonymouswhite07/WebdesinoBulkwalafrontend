import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useCategoryStore } from "@/store/category.store";

const EditSubcategoryDialog = ({ open, onOpenChange, subcategory, onSave }) => {
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [category, setCategory] = useState("");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState("");

  const { categories, fetchCategories } = useCategoryStore();

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    if (subcategory) {
      setName(subcategory.name || "");
      setSlug(subcategory.slug || "");
      setCategory(subcategory.category?._id || "");
      setPreview(subcategory.img_url || "");
    }
  }, [subcategory]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      name,
      slug,
      category,
      image,
    };

    await onSave(subcategory.slug, payload);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl w-full bg-white rounded-2xl shadow-lg p-6 sm:p-8 overflow-y-auto max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="text-[#02066F] text-2xl font-bold border-b pb-2">
            Edit Subcategory
          </DialogTitle>
        </DialogHeader>

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-6"
        >
          {/* Name */}
          <div>
            <Label className="text-sm text-gray-700 mb-1 block">Name</Label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Subcategory Name"
              required
              className="w-full border-gray-300 focus:border-[#02066F] focus:ring-[#02066F]"
            />
          </div>

          {/* Slug */}
          <div>
            <Label className="text-sm text-gray-700 mb-1 block">Slug</Label>
            <Input
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              placeholder="Unique Slug"
              required
              className="w-full border-gray-300 focus:border-[#02066F] focus:ring-[#02066F]"
            />
          </div>

          {/* Category */}
          <div className="col-span-1 sm:col-span-2">
            <Label className="text-sm text-gray-700 mb-1 block">
              Parent Category
            </Label>
            <select
              className="w-full border rounded-md px-3 py-2 border-gray-300 focus:border-[#02066F] focus:ring-[#02066F]"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
            >
              <option value="">Select Category</option>
              {categories.map((cat) => (
                <option key={cat._id} value={cat._id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* Image */}
          <div className="col-span-1 sm:col-span-2">
            <Label className="text-sm text-gray-700 mb-1 block">Image</Label>
            {preview && (
              <img
                src={preview}
                alt="Preview"
                className="w-24 h-24 object-cover rounded-md border mb-3"
              />
            )}
            <Input
              type="file"
              accept="image/*"
              onChange={(e) => setImage(e.target.files[0])}
              className="w-full border-gray-300 focus:border-[#02066F] focus:ring-[#02066F]"
            />
          </div>

          {/* Actions */}
          <div className="col-span-2 flex justify-end gap-3 pt-4 border-t mt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="border-gray-300"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-[#02066F] hover:bg-[#04127A] text-white"
            >
              Save Changes
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditSubcategoryDialog;
