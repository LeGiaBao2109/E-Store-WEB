const sampleProducts = [
    // --- PHONE ---
    { 
        id: "p1", 
        title: "iPhone 13 128GB - Red", 
        slug: "iphone-13-128gb-red", 
        image: "https://res.cloudinary.com/dvuxeesfo/image/upload/v1774925427/iphone-13-red_wwmt3u.webp", 
        brand: "Apple", 
        price: 13490000, 
        categorySlug: "phone", 
        stock: 41,
        description: `
            <p>iPhone 13 mang đến bước nhảy vọt về thời lượng pin và hệ thống camera kép tiên tiến. Phiên bản màu Đỏ đặc biệt không chỉ cá tính mà còn góp phần vào quỹ phòng chống dịch bệnh toàn cầu.</p>
            <ul>
                <li>Chip xử lý: Apple A15 Bionic 6 nhân mạnh mẽ.</li>
                <li>Màn hình: 6.1 inch Super Retina XDR sắc nét.</li>
                <li>Camera: Cụm 2 camera 12MP hỗ trợ chế độ Điện ảnh (Cinematic Mode).</li>
                <li>Kháng nước và bụi: Chuẩn IP68 bền bỉ.</li>
            </ul>
        `
    },
    { 
        id: "p2", 
        title: "iPhone 13 128GB - Black", 
        slug: "iphone-13-128gb-black", 
        image: "https://res.cloudinary.com/dvuxeesfo/image/upload/v1774925426/iphone-13-black_taznvv.webp", 
        brand: "Apple", 
        price: 13500000, 
        categorySlug: "phone", 
        stock: 3,
        description: "<p>iPhone 13 màu Midnight (Đen) sang trọng và đẳng cấp. Với dung lượng 128GB, bạn thoải mái lưu trữ hình ảnh và video chất lượng cao cùng hiệu năng không đối thủ từ chip A15.</p>"
    },
    { 
        id: "p3", 
        title: "iPhone 13 128GB - Pink", 
        slug: "iphone-13-128gb-pink", 
        image: "https://res.cloudinary.com/dvuxeesfo/image/upload/v1774925426/iphone-13-pink_lrzubj.webp", 
        brand: "Apple", 
        price: 14200000, 
        categorySlug: "phone", 
        stock: 24,
        description: "<p>Sắc hồng tinh tế trên iPhone 13 là lựa chọn hàng đầu cho phái đẹp. Thiết kế khung nhôm chắc chắn kết hợp mặt kính Ceramic Shield giúp bảo vệ máy tối đa khỏi va đập.</p>"
    },
    { 
        id: "p4", 
        title: "Samsung Galaxy S24 Ultra", 
        slug: "samsung-s24-ultra", 
        image: "https://res.cloudinary.com/dvuxeesfo/image/upload/v1775793375/text_ng_n_13_7_eufgal.webp", 
        brand: "Samsung", 
        price: 29990000, 
        categorySlug: "phone", 
        stock: 15,
        description: `
            <p>Galaxy S24 Ultra mở ra kỷ nguyên <strong>AI Phone</strong> với các tính năng thông minh như khoanh vùng tìm kiếm, phiên dịch trực tiếp cuộc gọi và trợ lý ghi chú quyền năng.</p>
            <ul>
                <li>Camera: 200MP zoom quang học 100x đỉnh cao.</li>
                <li>Chip: Snapdragon 8 Gen 3 for Galaxy tối ưu game mượt mà.</li>
                <li>Chất liệu: Khung viền Titan siêu bền và sang trọng.</li>
            </ul>
        `
    },
    
    // --- TABLET ---
    { 
        id: "t1", 
        title: "Samsung Galaxy Tab A11 Plus Wifi", 
        slug: "samsung-tab-a11-plus", 
        image: "https://res.cloudinary.com/dvuxeesfo/image/upload/v1775793467/may-tinh-bang-samsung-galaxy-tab-a11-plus-wifi_1_1_ey8a73.webp", 
        brand: "Samsung", 
        price: 7490000, 
        categorySlug: "tablet", 
        stock: 18,
        description: "<p>Dòng máy tính bảng phổ thông lý tưởng cho học sinh, sinh viên học online và giải trí với màn hình lớn, âm thanh Dolby Atmos sống động.</p>"
    },
    { 
        id: "t2", 
        title: "Huawei MatePad 12 X Edition", 
        slug: "huawei-matepad-12-x", 
        image: "https://res.cloudinary.com/dvuxeesfo/image/upload/v1775793340/huawei-matepad-12-x_k8v0m6.webp", 
        brand: "Huawei", 
        price: 11200000, 
        categorySlug: "tablet", 
        stock: 10,
        description: "<p>Trang bị màn hình PaperMatte chống chói hiệu quả, MatePad 12 X mang lại trải nghiệm viết vẽ như trên giấy thật, cực kỳ phù hợp cho dân văn phòng và thiết kế.</p>"
    },
    { 
        id: "t3", 
        title: "iPad Air M2 11 inch", 
        slug: "ipad-air-m2", 
        image: "https://res.cloudinary.com/dvuxeesfo/image/upload/v1775793466/may-tinh-bang-samsung-galaxy-tab-a11-plus-wifi-1_2_epue8h.webp", 
        brand: "Apple", 
        price: 15990000, 
        categorySlug: "tablet", 
        stock: 20,
        description: "<p>Sức mạnh khủng khiếp từ chip M2 giúp iPad Air xử lý tốt các tác vụ đồ họa nặng, edit video 4K mượt mà trong một thiết kế mỏng nhẹ, tinh tế.</p>"
    },

    // --- SCREEN / TV ---
    { 
        id: "s1", 
        title: "TIVI GOOGLE 4K 65 INCH", 
        slug: "tivi-google-4k-65-inch", 
        image: "https://res.cloudinary.com/dvuxeesfo/image/upload/v1775795286/smart-tivi-samsung-qled-65q6fa-4k-65-inch_4__il8aew.webp", 
        brand: "Samsung", 
        price: 18500000, 
        categorySlug: "screen", 
        stock: 47,
        description: "<p>Tận hưởng không gian giải trí đỉnh cao với độ phân giải 4K sắc nét và hệ điều hành Google TV thông minh, hỗ trợ tìm kiếm giọng nói bằng tiếng Việt.</p>"
    },
    { 
        id: "s2", 
        title: "Google Tivi TCL MiniLED 65 inch", 
        slug: "tcl-miniled-65c7k", 
        image: "https://res.cloudinary.com/dvuxeesfo/image/upload/v1775796030/google-tivi-tcl-qd-miniled-65c7k-4k-65-inch-2025_2__x2lqmh.webp", 
        brand: "TCL", 
        price: 23490000, 
        categorySlug: "screen", 
        stock: 12,
        description: "<p>Công nghệ MiniLED giúp tăng cường độ sáng và độ tương phản cực sâu, mang lại hình ảnh trung thực như đang ở trong rạp chiếu phim chuyên nghiệp.</p>"
    },
    { 
        id: "s3", 
        title: "Màn hình LG StandbyME 27 inch", 
        slug: "lg-standbyme-27", 
        image: "https://res.cloudinary.com/dvuxeesfo/image/upload/v1775794379/man-hinh-thong-minh-lg-standbyme-2-27-inch-27lx6tdga-2025_aq2ahg.webp", 
        brand: "LG", 
        price: 17900000, 
        categorySlug: "screen", 
        stock: 5,
        description: "<p>Màn hình giải trí cá nhân có thể di chuyển khắp nơi nhờ chân đế có bánh xe. Pin tích hợp cho phép bạn xem phim tại bất cứ đâu trong căn nhà mà không cần cắm điện.</p>"
    },
    { 
        id: "s4", 
        title: "Samsung UHD 4K 75 inch", 
        slug: "samsung-uhd-75-inch", 
        image: "https://res.cloudinary.com/dvuxeesfo/image/upload/v1775793210/tv-ss-75u8500f-uhd-4k-75_2__fivpmb.webp", 
        brand: "Samsung", 
        price: 21900000, 
        categorySlug: "screen", 
        stock: 7,
        description: "<p>Kích thước màn hình khổng lồ 75 inch biến phòng khách của bạn thành một rạp hát tại gia đích thực với màu sắc Crystal Display rực rỡ.</p>"
    },

    // --- HOUSEWARE ---
    { 
        id: "h1", 
        title: "Tủ lạnh Mijia Multidoor 510L", 
        slug: "tu-lanh-mijia-510l", 
        image: "https://res.cloudinary.com/dvuxeesfo/image/upload/v1775795221/tu-lanh-mijia-multidoor-510l-1_f7jjqh.webp", 
        brand: "Xiaomi", 
        price: 12990000, 
        categorySlug: "houseware", 
        stock: 15,
        description: "<p>Tủ lạnh dung tích lớn 510L với 4 cánh hiện đại, tích hợp công nghệ làm lạnh nhanh và khử mùi bằng ion, tiết kiệm điện năng tối đa cho gia đình bạn.</p>"
    },
    { 
        id: "h2", 
        title: "Robot hút bụi Roborock Q7 Max", 
        slug: "roborock-q7-max", 
        image: "https://res.cloudinary.com/dvuxeesfo/image/upload/v1775795118/roborock-q7-tf-2_sre035.webp", 
        brand: "Roborock", 
        price: 9900000, 
        categorySlug: "houseware", 
        stock: 10,
        description: "<p>Robot hút bụi lau nhà thông minh với lực hút 4200Pa, tự động lập bản đồ 3D ngôi nhà và có khả năng tránh chướng ngại vật cực nhạy.</p>"
    },
    { 
        id: "h3", 
        title: "Máy hút bụi Roborock Handheld", 
        slug: "roborock-handheld", 
        image: "https://res.cloudinary.com/dvuxeesfo/image/upload/v1775795116/roborock-q7-tf-1_1_dxrdge.webp", 
        brand: "Roborock", 
        price: 4500000, 
        categorySlug: "houseware", 
        stock: 22,
        description: "<p>Máy hút bụi cầm tay không dây với thiết kế gọn nhẹ, công suất hút mạnh mẽ giúp vệ sinh mọi ngóc ngách từ sàn nhà đến rèm cửa một cách dễ dàng.</p>"
    },

    // --- ACCESSORIES ---
    { 
        id: "a1", 
        title: "Tai nghe Marshall Major IV", 
        slug: "marshall-major-iv", 
        image: "https://res.cloudinary.com/dvuxeesfo/image/upload/v1775794285/frame_470_14__1_pajjrj.webp", 
        brand: "Marshall", 
        price: 3690000, 
        categorySlug: "accessories", 
        stock: 50,
        description: "<p>Thời lượng pin lên đến 80 giờ liên tục. Marshall Major IV mang lại âm thanh bùng nổ cùng thiết kế mang đậm chất rock-and-roll cổ điển.</p>"
    },
    { 
        id: "a2", 
        title: "Loa Marshall Emberton II", 
        slug: "marshall-emberton-ii", 
        image: "https://res.cloudinary.com/dvuxeesfo/image/upload/v1775794283/frame_470_16__1_l5ifin.webp", 
        brand: "Marshall", 
        price: 4990000, 
        categorySlug: "accessories", 
        stock: 35,
        description: "<p>Loa di động kháng nước IP67 bền bỉ. Công nghệ âm thanh True Stereophonic cho trải nghiệm 360 độ sống động bất kể bạn đang ở đâu.</p>"
    },
    { 
        id: "a3", 
        title: "Tai nghe Marshall Motif II", 
        slug: "marshall-motif-ii", 
        image: "https://res.cloudinary.com/dvuxeesfo/image/upload/v1775794282/frame_470_13__1_dibcsx.webp", 
        brand: "Marshall", 
        price: 4290000, 
        categorySlug: "accessories", 
        stock: 15,
        description: "<p>Tai nghe chống ồn chủ động (ANC) nhỏ gọn nhưng uy lực. Hỗ trợ sạc nhanh và kết nối Bluetooth 5.3 mới nhất cho đường truyền ổn định.</p>"
    }
];

localStorage.setItem('products', JSON.stringify(sampleProducts));