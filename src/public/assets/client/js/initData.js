const sampleProducts = [
  {
    id: "69e458aab8632890824a8a0d",
    title: "iPhone 13 128GB - Red",
    slug: "iphone-13-128gb-red",
    image: "https://res.cloudinary.com/dvuxeesfo/image/upload/v1774925427/iphone-13-red_wwmt3u.webp",
    brand: "Apple",
    price: 13490000,
    categorySlug: "phone", // Khớp với /products/phone
    stock: 41
  },
  {
    id: "69e46c43b8632890824a8a0f",
    title: "iPhone 13 128GB - White",
    slug: "iphone-13-128gb-white",
    image: "https://res.cloudinary.com/dvuxeesfo/image/upload/v1774925426/iphone-13-white_nphhll.webp",
    brand: "Apple",
    price: 13990000,
    categorySlug: "tablet", // Khớp với /products/tablet
    stock: 20
  },
  {
    id: "69e46c43b8632890824a8a10",
    title: "iPhone 13 128GB - Black",
    slug: "iphone-13-128gb-black",
    image: "https://res.cloudinary.com/dvuxeesfo/image/upload/v1774925426/iphone-13-black_taznvv.webp",
    brand: "Apple",
    price: 13500000,
    categorySlug: "phone", // Khớp với /products/phone
    stock: 3
  },
  {
    id: "69e46c43b8632890824a8a11",
    title: "iPhone 13 128GB - Pink",
    slug: "iphone-13-128gb-pink",
    image: "https://res.cloudinary.com/dvuxeesfo/image/upload/v1774925426/iphone-13-pink_lrzubj.webp",
    brand: "Apple",
    price: 14200000,
    categorySlug: "phone", // Khớp với /products/phone
    stock: 24
  },
  {
    id: "69e79066de89186b89b781f4",
    title: "TIVI GOOGLE 4K 65 INCH",
    slug: "tivi-google-4k-65-inch",
    image: "https://res.cloudinary.com/dvuxeesfo/image/upload/v1775795286/smart-tivi-samsung-qled-65q6fa-4k-65-inch_4__il8aew.webp",
    brand: "Samsung",
    price: 18500000,
    categorySlug: "screen", // Khớp với /products/screen
    stock: 47
  },
  {
    id: "69e79066de89186b89b782c5",
    title: "Tủ lạnh Mijia Multidoor 510L",
    slug: "tu-lanh-mijia-multidoor-510l",
    image: "https://res.cloudinary.com/dvuxeesfo/image/upload/v1775795221/tu-lanh-mijia-multidoor-510l-1_f7jjqh.webp",
    brand: "Xiaomi",
    price: 12990000,
    categorySlug: "houseware", // Khớp với /products/houseware
    stock: 15
  }
];

// Nhập lại vào LocalStorage
localStorage.setItem('products', JSON.stringify(sampleProducts));
console.log("Đã chuẩn hóa categorySlug thành công!");