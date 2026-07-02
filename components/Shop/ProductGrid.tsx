import ProductCard from "./ProductCard";

const products = [
  {
    id: 1,
    image: "/images/shop/products/jacket.png",
    title: "Premium Wool Jacket",
    category: "MEN",
    price: 4999,
    oldPrice: 6999,
  },
  {
    id: 2,
    image: "/images/shop/products/hoodie.png",
    title: "Oversized Hoodie",
    category: "STREETWEAR",
    price: 2999,
    oldPrice: 3999,
  },
  {
    id: 3,
    image: "/images/shop/products/dress.png",
    title: "Elegant Midi Dress",
    category: "WOMEN",
    price: 4599,
    oldPrice: 5999,
  },
  {
    id: 4,
    image: "/images/shop/products/shoes.png",
    title: "Luxury Sneakers",
    category: "FOOTWEAR",
    price: 5499,
    oldPrice: 6999,
  },
];

export default function ProductGrid() {
  return (
    <div className="grid gap-8 sm:grid-cols-2 xl:grid-cols-3">

      {products.map((product) => (
        <ProductCard
          key={product.id}
          image={product.image}
          title={product.title}
          category={product.category}
          price={product.price}
          oldPrice={product.oldPrice}
        />
      ))}

    </div>
  );
}