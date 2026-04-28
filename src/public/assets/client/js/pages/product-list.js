const createProductCard = (p, index, isGrid = true) => {
    const hideClass = (isGrid && index >= 8) ? 'd-none' : '';
    const columnClass = isGrid ? 'col-6 col-md-4 col-lg-3 product-item' : 'product-item';

    return `
        <div class="${columnClass} ${hideClass} mb-4">
            <div class="card h-100 shadow-sm border-0 rounded-4">
                <a href="/products/detail/${p.slug}">
                    <img src="${p.image}" class="card-img-top p-3" alt="${p.title}">
                </a>
                <div class="card-body text-center">
                    <h6 class="card-title fw-bold text-truncate">${p.title}</h6>
                    <p class="text-danger fw-bold mb-2">${p.price.toLocaleString()}đ</p>
                    <div class="buttons d-flex gap-2">
                        <a href="/products/detail/${p.slug}" class="btn btn-outline-danger btn-sm rounded-pill w-100 p-2">Mua Ngay</a>
                        <button class="btn btn-danger btn-sm rounded-circle p-2 btn-add-cart" data-id="${p.id}">
                            <i class="bi bi-cart"></i>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
};

export const initProductList = () => {
    const $productContainer = $('#product-container');
    const $productSlider = $('#productSlider'); 
    const $loadMoreBtn = $('#loadMoreBtn');

    const allProducts = JSON.parse(localStorage.getItem('products')) || [];

    if ($productContainer.length) {
        const path = window.location.pathname;
        const pathParts = path.split('/');
        const slug = pathParts[pathParts.length - 1];

        let filteredProducts = [];
        if (slug === 'products' || slug === '' || !slug) {
            filteredProducts = allProducts;
        } else {
            filteredProducts = allProducts.filter(p => p.categorySlug === slug);
        }

        $productContainer.empty();
        filteredProducts.forEach((p, index) => {
            $productContainer.append(createProductCard(p, index, true));
        });

        checkLoadMoreVisibility();
        $loadMoreBtn.off('click').on('click', function (e) {
            e.preventDefault();
            const windowWidth = $(window).width();
            let itemsPerRow = windowWidth >= 992 ? 4 : (windowWidth >= 768 ? 3 : 2);
            const itemsToShow = itemsPerRow * 2;
            
            const $hiddenItems = $('.product-item.d-none');
            if ($hiddenItems.length > 0) {
                $hiddenItems.slice(0, itemsToShow).removeClass('d-none').hide().fadeIn(600);
            }
            checkLoadMoreVisibility();
        });
    }

    if ($productSlider.length) {
        $productSlider.empty();
        allProducts.forEach((p, index) => {
            $productSlider.append(createProductCard(p, index, false));
        });
        
        $('.next-btn').off('click').on('click', () => $productSlider.animate({ scrollLeft: '+=300' }, 400));
        $('.prev-btn').off('click').on('click', () => $productSlider.animate({ scrollLeft: '-=300' }, 400));
    }
};

function checkLoadMoreVisibility() {
    if ($('.product-item.d-none').length === 0) {
        $('#loadMoreBtn').hide();
    } else {
        $('#loadMoreBtn').show();
    }
}