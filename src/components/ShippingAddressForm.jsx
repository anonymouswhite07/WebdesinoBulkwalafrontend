import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import shippingAddressSchema from "@/schemas/shippingFormSchema";

const ShippingAddressForm = ({ onSubmit, initialData, mode }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(shippingAddressSchema),
    defaultValues: initialData || {
      name: "",
      phone: "",
      street: "",
      city: "",
      state: "",
      postalCode: "",
      country: "India",
    },
  });
  useEffect(() => {
    if (initialData) reset(initialData);
    else
      reset(
        initialData || {
          name: "",
          phone: "",
          street: "",
          city: "",
          state: "",
          postalCode: "",
          country: "India",
        }
      );
  }, [initialData, reset]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="block text-sm font-semibold">Full Name</label>
        <input
          {...register("name")}
          className="w-full p-2 border border-gray-300 rounded"
          placeholder="John Doe"
        />
        {errors.name && (
          <p className="text-red-500 text-xs">{errors.name.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-semibold">Phone</label>
        <input
          {...register("phone")}
          className="w-full p-2 border border-gray-300 rounded"
          placeholder="9999999999"
        />
        {errors.phone && (
          <p className="text-red-500 text-xs">{errors.phone.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-semibold">Street Address</label>
        <input
          {...register("street")}
          className="w-full p-2 border border-gray-300 rounded"
          placeholder="123 Main St"
        />
        {errors.street && (
          <p className="text-red-500 text-xs">{errors.street.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-semibold">City</label>
        <input
          {...register("city")}
          className="w-full p-2 border border-gray-300 rounded"
          placeholder="Delhi"
        />
        {errors.city && (
          <p className="text-red-500 text-xs">{errors.city.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-semibold">State</label>
        <input
          {...register("state")}
          className="w-full p-2 border border-gray-300 rounded"
          placeholder="Delhi"
        />
        {errors.state && (
          <p className="text-red-500 text-xs">{errors.state.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-semibold">Postal Code</label>
        <input
          {...register("postalCode")}
          className="w-full p-2 border border-gray-300 rounded"
          placeholder="110001"
        />
        {errors.postalCode && (
          <p className="text-red-500 text-xs">{errors.postalCode.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-semibold">Country</label>
        <input
          {...register("country")}
          className="w-full p-2 border border-gray-300 rounded"
          placeholder="India"
        />
        {errors.country && (
          <p className="text-red-500 text-xs">{errors.country.message}</p>
        )}
      </div>

      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-2 rounded-lg"
      >
        {mode === "edit" ? "Update Address" : "Save Address"}
      </button>
    </form>
  );
};

export default ShippingAddressForm;
