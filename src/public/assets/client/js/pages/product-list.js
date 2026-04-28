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

const renderProductsToContainer = (products, $container, isGrid) => {
    $container.empty();
    if (products.length === 0) {
        $container.append('<div class="col-12 text-center py-5"><h4 class="text-muted">Không tìm thấy sản phẩm nào phù hợp.</h4></div>');
    } else {
        products.forEach((p, index) => {
            $container.append(createProductCard(p, index, isGrid));
        });
    }
    checkLoadMoreVisibility();
};

export const initProductList = () => {
    initBrandMenu();

    const $productContainer = $('#product-container');
    const $productSlider = $('#productSlider');
    const $loadMoreBtn = $('#loadMoreBtn');
    const allProducts = JSON.parse(localStorage.getItem('products')) || [];

    const executeFilter = () => {
        const path = window.location.pathname;
        const pathParts = path.split('/').filter(p => p !== "");
        const categorySlug = pathParts[pathParts.length - 1];

        const urlParams = new URLSearchParams(window.location.search);
        const brandFilter = urlParams.get('brand');

        const selectedPriceRanges = [];
        $('.price-checkbox:checked').each(function () {
            const [min, max] = $(this).val().split('-').map(Number);
            selectedPriceRanges.push({
                min,
                max
            });
        });

        const sortOrder = $('#sortPrice').val();

        let filtered = allProducts;

        if (categorySlug && categorySlug !== 'products' && categorySlug !== '') {
            filtered = filtered.filter(p => p.categorySlug === categorySlug);
        }

        if (brandFilter) {
            filtered = filtered.filter(p => p.brand && p.brand.toLowerCase() === brandFilter.toLowerCase());
        }

        if (selectedPriceRanges.length > 0) {
            filtered = filtered.filter(p => {
                return selectedPriceRanges.some(range => p.price >= range.min && p.price <= range.max);
            });
        }

        if (sortOrder === 'asc') {
            filtered.sort((a, b) => a.price - b.price);
        } else if (sortOrder === 'desc') {
            filtered.sort((a, b) => b.price - a.price);
        } else {
            filtered.reverse();
        }

        renderProductsToContainer(filtered, $productContainer, true);
    };

    $('.price-checkbox').on('change', function () {
        executeFilter();
    });

    $('#sortPrice').on('change', function () {
        executeFilter();
    });

    $('.price-checkbox').on('change', function () {
        executeFilter();
    });

    if ($productContainer.length) {
        executeFilter();

        $loadMoreBtn.off('click').on('click', function (e) {
            e.preventDefault();
            const $hiddenItems = $('.product-item.d-none');
            $hiddenItems.slice(0, 8).removeClass('d-none').hide().fadeIn(600);
            checkLoadMoreVisibility();
        });
    }

    if ($productSlider.length) {
        renderProductsToContainer(allProducts, $productSlider, false);
        $('.next-btn').off('click').on('click', () => $productSlider.animate({
            scrollLeft: '+=300'
        }, 100));
        $('.prev-btn').off('click').on('click', () => $productSlider.animate({
            scrollLeft: '-=300'
        }, 100));
    }
};

function checkLoadMoreVisibility() {
    if ($('.product-item.d-none').length === 0) {
        $('#loadMoreBtn').hide();
    } else {
        $('#loadMoreBtn').show();
    }
}

const brandData = {
    "phone": ["APPLE", "SAMSUNG", "XIAOMI", "VIVO", "OPPO", "REALME", "NOKIA"],
    "tablet": ["APPLE", "SAMSUNG", "XIAOMI", "LENOVO", "HUAWEI"],
    "laptop": ["APPLE", "ASUS", "DELL", "HP", "ACER", "MSI"],
    "screen": ["SAMSUNG", "LG", "DELL", "ASUS", "VIEWSONIC"],
    "houseware": ["XIAOMI", "LG", "SAMSUNG", "TOSHIBA", "PANASONIC"],
    "accessories": ["APPLE", "BASEUS", "ANKER", "LOGITECH", "MARSHALL"]
};

export const initBrandMenu = () => {
    const $brandContainer = $('.nav-brands');
    if (!$brandContainer.length) return;

    const path = window.location.pathname;
    const pathParts = path.split('/').filter(item => item !== "");
    const categorySlug = pathParts[pathParts.length - 1];

    const brands = brandData[categorySlug] || [];

    $brandContainer.empty();

    if (brands.length > 0) {
        brands.forEach(brand => {
            $brandContainer.append(`
                <li class="nav-item">
                    <a class="nav-link text-white fw-bold text-uppercase" href="?brand=${brand.toLowerCase()}">
                        ${brand}
                    </a>
                </li>
            `);
        });
    } else {
        $brandContainer.append('<li class="nav-item"><span class="nav-link text-white">Tất cả thương hiệu</span></li>');
    }
};