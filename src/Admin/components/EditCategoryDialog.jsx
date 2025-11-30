import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

const EditCategoryDialog = ({ open, onOpenChange, category, onSave }) => {
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [image, setImage] = useState(null);
  const [banners, setBanners] = useState([]);
  const [existingImage, setExistingImage] = useState("");
  const [existingBanners, setExistingBanners] = useState([]);

  useEffect(() => {
    if (category) {
      setName(category.name || "");
      setSlug(category.slug || "");
      setExistingImage(category.img_url || "");
      setExistingBanners(category.banner || []);
    }
  }, [category]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const uploadData = new FormData();
    uploadData.append("name", name);
    uploadData.append("slug", slug);

    if (image) uploadData.append("image", image);
    if (existingImage) uploadData.append("existingImage", existingImage);

    banners.forEach((banner) => uploadData.append("banner", banner));
    existingBanners.forEach((bannerUrl) =>
      uploadData.append("existingBanners", bannerUrl)
    );

    await onSave(uploadData);
  };

  const handleBannerChange = (e) => {
    setBanners([...e.target.files]);
  };

  const removeBanner = (index) => {
    const newBanners = [...existingBanners];
    newBanners.splice(index, 1);
    setExistingBanners(newBanners);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl w-full bg-white rounded-2xl shadow-lg p-6 sm:p-8 overflow-y-auto max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="text-[#02066F] text-2xl font-bold border-b pb-2">
            Edit Category
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
              className="w-full border-gray-300 focus:border-[#02066F] focus:ring-[#02066F]"
            />
          </div>

          {/* Current Image */}
          <div className="col-span-1 sm:col-span-2">
            <Label className="text-sm text-gray-700 mb-1 block">
              Current Image
            </Label>
            {existingImage && (
              <img
                src={existingImage}
                alt="Category"
                className="w-24 h-24 object-cover rounded-md border my-2"
              />
            )}
            <Input
              type="file"
              accept="image/*"
              onChange={(e) => setImage(e.target.files[0])}
              className="w-full border-gray-300 focus:border-[#02066F] focus:ring-[#02066F]"
            />
          </div>

          {/* Current Banners */}
          <div className="col-span-1 sm:col-span-2">
            <Label className="text-sm text-gray-700 mb-1 block">
              Current Banners
            </Label>
            {existingBanners.length > 0 && (
              <div className="flex flex-wrap gap-3 mt-2">
                {existingBanners.map((banner, idx) => (
                  <div key={idx} className="relative w-24 h-24">
                    <img
                      src={banner}
                      alt="Banner"
                      className="w-full h-full object-cover rounded-md border"
                    />
                    <Button
                      type="button"
                      size="icon"
                      variant="destructive"
                      className="absolute top-0 right-0 text-xs"
                      onClick={() => removeBanner(idx)}
                    >
                      ✕
                    </Button>
                  </div>
                ))}
              </div>
            )}
            <Input
              type="file"
              multiple
              accept="image/*"
              onChange={handleBannerChange}
              className="w-full border-gray-300 focus:border-[#02066F] focus:ring-[#02066F] mt-2"
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

export default EditCategoryDialog;
