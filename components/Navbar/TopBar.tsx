export default function TopBar() {
  return (
    <div className="border-b border-[#ECE6DF] bg-[#F8F1EA]">
      <div className="container flex h-10 items-center justify-center">
        <p className="text-center text-sm font-medium tracking-wide text-[#555]">
          <span className="text-[#5B3DF5]">✦</span>{" "}
          FREE SHIPPING ON ALL ORDERS ABOVE{" "}
          <span className="font-semibold text-[#5B3DF5]">₹999</span>{" "}
          • EASY 7-DAY RETURNS
        </p>
      </div>
    </div>
  );
}