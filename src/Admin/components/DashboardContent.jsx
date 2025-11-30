import React, { useEffect } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import {
  FaBoxOpen,
  FaTags,
  FaList,
  FaExclamationTriangle,
} from "react-icons/fa";
import { useCategoryStore } from "@/store/category.store";
import { useSubcategoryStore } from "@/store/subcategory.store";
import { useProductStore } from "@/store/product.store";

export default function DashboardContent() {
  const { products, fetchProducts } = useProductStore();
  const { categories, fetchCategories } = useCategoryStore();
  const { subcategories, fetchSubcategories } = useSubcategoryStore();

  useEffect(() => {
    fetchProducts();
    fetchCategories();
    fetchSubcategories();
  }, []);

  const productList = Array.isArray(products)
    ? products
    : products?.products || [];

  const { total } = useProductStore();
  const totalProducts = total || 0;
  const totalCategories = categories?.length || 0;
  const totalSubcategories = subcategories?.length || 0;
  const lowStockProducts = productList?.filter((p) => p.stock <= 5).length || 0;

  const cardData = [
    {
      title: "Total Products",
      value: totalProducts,
      icon: <FaBoxOpen className="text-blue-500 w-6 h-6" />,
      bg: "bg-blue-50",
      textColor: "text-blue-600",
    },
    {
      title: "Total Categories",
      value: totalCategories,
      icon: <FaTags className="text-green-500 w-6 h-6" />,
      bg: "bg-green-50",
      textColor: "text-green-600",
    },
    {
      title: "Total Subcategories",
      value: totalSubcategories,
      icon: <FaList className="text-purple-500 w-6 h-6" />,
      bg: "bg-purple-50",
      textColor: "text-purple-600",
    },
    {
      title: "Low Stock Products",
      value: lowStockProducts,
      icon: <FaExclamationTriangle className="text-red-500 w-6 h-6" />,
      bg: "bg-red-50",
      textColor: "text-red-600",
    },
  ];

  return (
    <Card className="bg-white border border-gray-200 rounded-xl shadow-sm">
      <CardHeader>
        <CardTitle className="text-[#02066F]">Dashboard Overview</CardTitle>
        <CardDescription>Overview of key metrics</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {cardData.map((card) => (
            <Card
              key={card.title}
              className={`${card.bg} shadow-md rounded-xl`}
            >
              <CardHeader className="flex items-center justify-between">
                <div>
                  <CardDescription className="text-sm">
                    {card.title}
                  </CardDescription>
                  <CardTitle className={`text-2xl font-bold ${card.textColor}`}>
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
}
