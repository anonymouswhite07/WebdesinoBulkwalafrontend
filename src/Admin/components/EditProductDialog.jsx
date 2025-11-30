import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useProductStore } from "@/store/product.store";
import { useCategoryStore } from "@/store/category.store";
import { useSubcategoryStore } from "@/store/subcategory.store";

export default function EditProductDialog({ open, onClose, slug, onSuccess }) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    price: "",
    discountPrice: "",
    gstSlab: "18", // ✅ default GST Slab
    sku: "",
    stock: "",
    description: "",
    category: "",
    subcategory: "",
    newImages: [],
    newVideo: null, // Add video support
    removeVideo: false,
  });

  const [existingImages, setExistingImages] = useState([]);
  const [imagesToRemove, setImagesToRemove] = useState([]);
  const [existingVideos, setExistingVideos] = useState([]); // Track existing videos

  const { products, editProduct } = useProductStore();
  const { categories, fetchCategories } = useCategoryStore();
  const { subcategories, fetchSubcategories } = useSubcategoryStore();

  useEffect(() => {
    fetchCategories();
    fetchSubcategories();
  }, []);

  useEffect(() => {
    if (!slug || !open) return;

    const product = Array.isArray(products)
      ? products.find((p) => p.slug === slug)
      : (products?.products || []).find((p) => p.slug === slug);

    if (product) {
      setFormData({
        title: product.title || "",
        price: product.price || "",
        discountPrice: product.discountPrice || "",
        gstSlab: String(product.gstSlab ?? 18), // ✅ default to 18 if undefined
        sku: product.sku || "",
        stock: product.stock || "",
        description: product.description || "",
        category: product.category?._id || "",
        subcategory: product.subcategory?._id || "",
        newImages: [],
        newVideo: null,
        removeVideo: false,
      });
      setExistingImages(product.images || []);
      setExistingVideos(product.videos || []);
      setImagesToRemove([]);
    }
  }, [slug, open, products]);

  const handleChange = (e) =>
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleImageChange = (e) => {
    setFormData((prev) => ({ ...prev, newImages: e.target.files }));
  };

  const handleVideoChange = (e) => {
    setFormData((prev) => ({ ...prev, newVideo: e.target.files[0] }));
  };

  const removeExistingVideo = (index) => {
    const updatedVideos = [...existingVideos];
    updatedVideos.splice(index, 1);
    setExistingVideos(updatedVideos);
    // Mark that we want to remove the video if all videos are removed
    if (updatedVideos.length === 0) {
      setFormData((prev) => ({ ...prev, removeVideo: true }));
    }
  };

  // Reset removeVideo flag when a new video is selected
  useEffect(() => {
    if (formData.newVideo) {
      setFormData((prev) => ({ ...prev, removeVideo: false }));
    }
  }, [formData.newVideo]);

  const removeExistingImage = (index) => {
    const removed = existingImages[index];
    setImagesToRemove((prev) => [...prev, removed]);
    setExistingImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);

      const uploadData = new FormData();
      uploadData.append("title", formData.title);
      uploadData.append("price", formData.price);
      uploadData.append("discountPrice", formData.discountPrice || 0);
      uploadData.append("gstSlab", formData.gstSlab || 18);
      uploadData.append("sku", formData.sku || "");
      uploadData.append("stock", formData.stock);
      uploadData.append("description", formData.description);
      uploadData.append("slug", slug);

      if (formData.category) uploadData.append("category", formData.category);
      if (formData.subcategory)
        uploadData.append("subcategory", formData.subcategory);

      // Removed images
      imagesToRemove.forEach((img) => uploadData.append("imagesToRemove", img));

      // Existing images
      existingImages.forEach((imgUrl) =>
        uploadData.append("existingImages", imgUrl)
      );

      // New images
      if (formData.newImages?.length > 0) {
        Array.from(formData.newImages).forEach((img) => {
          uploadData.append("images", img);
        });
      }

      // New video
      if (formData.newVideo) {
        uploadData.append("video", formData.newVideo);
      }

      // Removed videos (send removeVideo flag to clear)
      if (formData.removeVideo) {
        // If user wants to remove the video
        uploadData.append("removeVideo", "true");
      }

      await editProduct(slug, uploadData);
      toast.success("Product updated successfully!");
      onSuccess?.();
      onClose();
    } catch (err) {
      toast.error("Update failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl w-[95vw] bg-white rounded-2xl shadow-xl p-0 overflow-hidden">
        <div className="flex flex-col max-h-[90vh]">
          {/* Fixed Header */}
          <div className="flex items-center justify-between border-b px-6 py-4 sticky top-0 bg-white z-20">
            <DialogTitle className="text-[#02066F] text-2xl font-bold tracking-tight">
              Edit Product
            </DialogTitle>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-[#02066F] text-xl font-semibold"
            >
              ✕
            </button>
          </div>

          {/* Scrollable Form Area */}
          <div className="overflow-y-auto px-6 py-4 flex-1">
            {loading ? (
              <p className="p-4 text-center text-gray-500">Loading...</p>
            ) : (
              <form
                id="edit-form"
                onSubmit={handleSubmit}
                className="grid grid-cols-1 sm:grid-cols-2 gap-6"
              >
                {/* Title */}
                <div>
                  <Label className="text-sm text-gray-700 mb-1 block">
                    Title
                  </Label>
                  <Input
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    required
                    className="w-full border-gray-300 focus:border-[#02066F] focus:ring-[#02066F]"
                  />
                </div>

                {/* Price */}
                <div>
                  <Label className="text-sm text-gray-700 mb-1 block">
                    MRP
                  </Label>
                  <Input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    required
                    className="w-full border-gray-300 focus:border-[#02066F] focus:ring-[#02066F]"
                  />
                </div>

                {/* Discount Price */}
                <div>
                  <Label className="text-sm text-gray-700 mb-1 block">
                    Discount Price
                  </Label>
                  <Input
                    type="number"
                    name="discountPrice"
                    value={formData.discountPrice}
                    onChange={handleChange}
                    className="w-full border-gray-300 focus:border-[#02066F] focus:ring-[#02066F]"
                  />
                </div>

                {/* GST Slab */}
                <div>
                  <Label className="text-sm text-gray-700 mb-1 block">
                    GST Slab (%)
                  </Label>
                  <select
                    name="gstSlab"
                    value={formData.gstSlab}
                    onChange={handleChange}
                    className="w-full border rounded-md px-3 py-2 border-gray-300 focus:border-[#02066F] focus:ring-[#02066F]"
                  >
                    <option value="0">0%</option>
                    <option value="5">5%</option>
                    <option value="12">12%</option>
                    <option value="18">18%</option>
                    <option value="28">28%</option>
                  </select>
                </div>

                {/* SKU */}
                <div>
                  <Label className="text-sm text-gray-700 mb-1 block">
                    SKU
                  </Label>
                  <Input
                    type="text"
                    name="sku"
                    value={formData.sku}
                    onChange={handleChange}
                    className="w-full border-gray-300 focus:border-[#02066F] focus:ring-[#02066F]"
                  />
                </div>

                {/* Stock */}
                <div>
                  <Label className="text-sm text-gray-700 mb-1 block">
                    Stock
                  </Label>
                  <Input
                    type="number"
                    name="stock"
                    value={formData.stock}
                    onChange={handleChange}
                    required
                    className="w-full border-gray-300 focus:border-[#02066F] focus:ring-[#02066F]"
                  />
                </div>

                {/* Category */}
                <div>
                  <Label className="text-sm text-gray-700 mb-1 block">
                    Category
                  </Label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="w-full border rounded-md px-3 py-2 border-gray-300 focus:border-[#02066F] focus:ring-[#02066F]"
                  >
                    <option value="">Select Category</option>
                    {categories?.map((cat) => (
                      <option key={cat._id} value={cat._id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Subcategory */}
                <div>
                  <Label className="text-sm text-gray-700 mb-1 block">
                    Subcategory
                  </Label>
                  <select
                    name="subcategory"
                    value={formData.subcategory}
                    onChange={handleChange}
                    className="w-full border rounded-md px-3 py-2 border-gray-300 focus:border-[#02066F] focus:ring-[#02066F]"
                  >
                    <option value="">Select Subcategory</option>
                    {subcategories
                      ?.filter((sub) => sub.category?._id === formData.category)
                      .map((sub) => (
                        <option key={sub._id} value={sub._id}>
                          {sub.name}
                        </option>
                      ))}
                  </select>
                </div>

                {/* Description */}
                <div className="col-span-1 sm:col-span-2">
                  <Label className="text-sm text-gray-700 mb-1 block">
                    Description
                  </Label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-md min-h-[100px] focus:border-[#02066F] focus:ring-[#02066F]"
                  />
                </div>

                {/* Current Images */}
                {existingImages.length > 0 && (
                  <div className="col-span-2">
                    <Label className="text-sm text-gray-700 mb-2 block">
                      Current Images
                    </Label>
                    <div className="flex flex-wrap gap-3">
                      {existingImages.map((img, idx) => (
                        <div key={idx} className="relative w-24 h-24">
                          <img
                            src={img}
                            className="w-full h-full object-cover rounded-md border"
                          />
                          <Button
                            type="button"
                            size="icon"
                            variant="destructive"
                            className="absolute -top-2 -right-2 w-6 h-6 rounded-full text-xs bg-red-600 hover:bg-red-700 text-white shadow-md"
                            onClick={() => removeExistingImage(idx)}
                          >
                            ✕
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Current Videos */}
                {existingVideos.length > 0 && (
                  <div className="col-span-2">
                    <Label className="text-sm text-gray-700 mb-2 block">
                      Current Videos
                    </Label>
                    <div className="flex flex-wrap gap-3">
                      {existingVideos.map((video, idx) => (
                        <div key={idx} className="relative w-32 h-24">
                          <video
                            src={video}
                            className="w-full h-full object-cover rounded-md border"
                            controls={false}
                          />
                          <Button
                            type="button"
                            size="icon"
                            variant="destructive"
                            className="absolute -top-2 -right-2 w-6 h-6 rounded-full text-xs bg-red-600 hover:bg-red-700 text-white shadow-md"
                            onClick={() => removeExistingVideo(idx)}
                          >
                            ✕
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Add Video */}
                <div className="col-span-2">
                  <Label className="text-sm text-gray-700 mb-1 block">
                    {existingVideos.length > 0 ? "Replace Video" : "Add Product Video"}
                  </Label>
                  <Input
                    type="file"
                    accept="video/*"
                    onChange={handleVideoChange}
                    className="w-full border-gray-300 focus:border-[#02066F] focus:ring-[#02066F]"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Supported formats: MP4, MOV, WebM, AVI (Max 150MB)
                  </p>
                </div>

                {/* Add Images */}
                <div className="col-span-2">
                  <Label className="text-sm text-gray-700 mb-1 block">
                    Add / Replace Images
                  </Label>
                  <Input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageChange}
                    className="w-full border-gray-300 focus:border-[#02066F] focus:ring-[#02066F]"
                  />
                </div>
              </form>
            )}
          </div>

          {/* Fixed Footer */}
          <div className="border-t bg-white px-6 py-4 flex justify-end gap-3 sticky bottom-0 z-20">
            <Button
              variant="outline"
              type="button"
              onClick={onClose}
              className="border-gray-300"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              form="edit-form"
              disabled={loading}
              className="bg-[#02066F] hover:bg-[#04127A] text-white"
            >
              {loading ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
