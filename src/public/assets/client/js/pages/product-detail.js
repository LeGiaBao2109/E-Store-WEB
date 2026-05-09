import {
    getCartItems,
    saveCart,
    updateCartBadge
} from '../utils/cart.js';

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
                        <button class="btn btn-outline-danger btn-lg rounded-circle d-flex align-items-center justify-content-center btn-add-cart" 
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

        <div class="row mt-5">
            <div class="col-12">
                <div class="product__reviews shadow-sm rounded-4 p-4 bg-white">
                    <h5 class="fw-bold mb-4 d-flex align-items-center">
                        <i class="bi bi-chat-left-text me-2 text-danger"></i> Đánh giá từ khách hàng
                    </h5>
                    <div id="reviewContainer">
                        <!-- Reviews will be rendered here -->
                    </div>
                </div>
            </div>
        </div>
    `;

    $('.product-detail .container').html(detailHtml);

    renderProductReviews(product.title);

    $(document).off('click', '.btn-buy-now').on('click', '.btn-buy-now', function () {
        const userData = localStorage.getItem('currentUser');
        if (!userData) {
            alert("Vui lòng đăng nhập để mua hàng!");
            window.location.href = "/auth";
            return;
        }

        if (product.stock <= 0) {
            alert("Sản phẩm đã hết hàng!");
            return;
        }

        const buyNowItem = [{
            id: product.id,
            title: product.title,
            price: product.price,
            image: product.image,
            slug: product.slug,
            quantity: 1
        }];

        localStorage.setItem('buy_now_temp', JSON.stringify(buyNowItem));

        window.location.href = "/cart/payment";
    });

    $(document).off('click', '.btn-add-cart').on('click', '.btn-add-cart', function () {
        const productId = $(this).data('id');
        import('../utils/cart.js').then(module => module.addToCart(productId));
    });

    document.title = `${product.title} | E-STORE`;

    if (typeof initRelatedProducts === 'function') {
        initRelatedProducts(product, allProducts);
    }
};

const renderProductReviews = (productName) => {
    const allReviews = JSON.parse(localStorage.getItem('product_reviews')) || [];
    const productReviews = allReviews.filter(r => r.productName === productName);
    const $container = $('#reviewContainer');

    if (productReviews.length === 0) {
        $container.html(`
            <div class="text-center py-4">
                <img src="https://cdn-icons-png.flaticon.com/512/4076/4076402.png" style="width: 80px; opacity: 0.3" class="mb-3">
                <p class="text-muted">Sản phẩm này chưa có đánh giá nào.</p>
            </div>
        `);
        return;
    }

    let reviewsHtml = '';
    productReviews.reverse().forEach(review => {
        reviewsHtml += `
            <div class="review-item mb-4 pb-4 border-bottom">
                <div class="d-flex justify-content-between align-items-start mb-2">
                    <div class="d-flex align-items-center gap-2">
                        <div class="avatar-circle bg-danger-subtle text-danger rounded-circle d-flex align-items-center justify-content-center fw-bold" style="width: 40px; height: 40px;">
                            ${review.fullName.charAt(0).toUpperCase()}
                        </div>
                        <div>
                            <h6 class="mb-0 fw-bold">${review.fullName}</h6>
                            <small class="text-muted">${review.date}</small>
                        </div>
                    </div>
                </div>
                <div class="review-content ps-5">
                    <p class="mb-0 text-dark">${review.content}</p>
                </div>
            </div>
        `;
    });

    $container.html(reviewsHtml);
};

const initRelatedProducts = (currentProduct, allProducts) => {
    const $slider = $('#productSlider');
    if (!$slider.length) return;

    const related = allProducts.filter(p =>
        p.categorySlug === currentProduct.categorySlug && p.id !== currentProduct.id
    );

    $slider.empty();
    related.forEach((p, index) => {
        const row = `
        <div class="col-6 col-md-4 col-lg-3 product-item mb-4">
            <div class="card h-100 shadow-sm border-0 rounded-4">
                <a href="/products/detail/${p.slug}">
                    <img src="${p.image}" class="card-img-top p-3" alt="${p.title}" style="height: 180px; object-fit: contain;">
                </a>
                <div class="card-body text-center">
                    <h6 class="card-title fw-bold text-truncate">${p.title}</h6>
                    <p class="text-danger fw-bold mb-2">${p.price.toLocaleString()}đ</p>
                    <div class="buttons d-flex gap-2">
                        <a href="/products/detail/${p.slug}" class="btn btn-outline-danger btn-sm rounded-pill w-100 p-2">Xem chi tiết</a>
                        <button class="btn btn-danger btn-sm rounded-circle p-2 btn-add-cart" data-id="${p.id}">
                            <i class="bi bi-cart"></i>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
        $slider.append(row);
    });
};