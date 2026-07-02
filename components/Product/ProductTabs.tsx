"use client";

import { useState } from "react";

import ProductDescription from "./ProductDescription";
import ProductSpecifications from "./ProductSpecifications";
import ProductReviews from "./ProductReviews";

export default function ProductTabs() {
  const [activeTab, setActiveTab] = useState("description");

  const tabs = [
    { id: "description", label: "Description" },
    { id: "specifications", label: "Specifications" },
    { id: "reviews", label: "Reviews" },
  ];

  return (
    <section className="mt-24">

      {/* Tabs */}

      <div className="flex flex-wrap justify-center gap-4 border-b border-gray-200 pb-4">

        {tabs.map((tab) => (

          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`rounded-full px-8 py-3 text-lg font-semibold transition-all duration-300 ${
              activeTab === tab.id
                ? "bg-[#5B3DF5] text-white shadow-lg"
                : "bg-white text-black border border-gray-300 hover:border-[#5B3DF5] hover:text-[#5B3DF5]"
            }`}
          >
            {tab.label}
          </button>

        ))}

      </div>

      {/* Content */}

      <div className="mt-10 rounded-3xl bg-white p-8 shadow-sm border border-gray-200">

        {activeTab === "description" && <ProductDescription />}

        {activeTab === "specifications" && (
          <ProductSpecifications />
        )}

        {activeTab === "reviews" && <ProductReviews />}

      </div>

    </section>
  );
}