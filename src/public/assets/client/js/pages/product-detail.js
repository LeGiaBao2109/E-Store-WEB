export const initProductDetail = () => {
    const pathParts = window.location.pathname.split('/');
    const slug = pathParts[pathParts.length - 1];

    const allProducts = JSON.parse(localStorage.getItem('products')) || [];
    const product = allProducts.find(p => p.slug === slug);

    if (!product) {
        $('.product-detail .container').html(`
            <div class="text-center py-5">
                <h3 class="text-muted">Sản phẩm không tồn tại!</h3>
                <a href="/" class="btn btn-danger mt-3 rounded-pill px-4">Quay lại trang chủ</a>
            </div>
        `);
        return;
    }

    const detailHtml = `
        <div class="row gy-4">
            <div class="col-12 col-lg-5">
                <div class="product__item--detail">
                    <h3 class="product__item--title fw-bold text-uppercase mb-3 d-lg-none">
                        ${product.title}
                    </h3>
                    <div class="product__image img-thumbnail d-flex align-items-center justify-content-center rounded-3 p-4 p-md-5 bg-white shadow-sm">
                        <img src="${product.image}" alt="${product.title}" class="img-fluid" style="max-height: 400px; object-fit: contain;">
                    </div>
                </div>
            </div>

            <div class="col-12 col-lg-7">
                <div class="product__info-wrapper ps-lg-4">
                    <h3 class="product__item--title fw-bold text-uppercase d-none d-lg-block mb-3">
                        ${product.title}
                    </h3>

                    <div class="product__item--price mb-3">
                        <span class="text-secondary fw-bold text-uppercase small">Giá bán:</span>
                        <h4 class="product__price fw-bold text-danger fs-3 mt-1">
                            ${product.price.toLocaleString()} VNĐ
                        </h4>
                    </div>

                    <div class="product__item--buttons d-flex flex-wrap gap-2 mt-4">
                        <button class="btn btn-danger btn-lg rounded-pill px-5 flex-grow-1 flex-md-grow-0 fw-bold btn-buy-now">
                            MUA NGAY
                        </button>
                        <button class="btn btn-outline-danger btn-lg rounded-circle d-flex align-items-center justify-content-center btn-add-to-cart" 
                                style="width: 56px; height: 56px;" data-id="${product.id}">
                            <i class="bi bi-cart fs-4"></i>
                        </button>
                    </div>

                    <hr class="my-4 text-secondary opacity-25">

                    <div class="product__item--desc">
                        <h5 class="product__desc--title fw-bold mb-3 border-start border-danger border-4 ps-2">
                            Mô tả sản phẩm
                        </h5>
                        <div class="product__desc--content text-secondary lh-lg" style="text-align: justify;">
                            ${product.description || '<p>Đang cập nhật mô tả cho sản phẩm này...</p>'}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;

    $('.product-detail .container').html(detailHtml);

    document.title = `${product.title} | E-STORE`;

    if (typeof initRelatedProducts === 'function') {
        initRelatedProducts(product, allProducts);
    }
};

const initRelatedProducts = (currentProduct, allProducts) => {
    const $slider = $('#productSlider');
    if (!$slider.length) return;

    const related = allProducts.filter(p => 
        p.categorySlug === currentProduct.categorySlug && p.id !== currentProduct.id
    );

    $slider.empty();
    related.forEach(p => {
        $slider.append(`
            <div class="product-item" style="min-width: 250px;">
                <div class="card h-100 border-0 shadow-sm rounded-4 overflow-hidden">
                    <a href="/products/detail/${p.slug}">
                        <img src="${p.image}" class="card-img-top p-3" alt="${p.title}" style="height: 180px; object-fit: contain;">
                    </a>
                    <div class="card-body text-center">
                        <h6 class="fw-bold text-truncate">${p.title}</h6>
                        <p class="text-danger fw-bold">${p.price.toLocaleString()}đ</p>
                    </div>
                </div>
            </div>
        `);
    });
};