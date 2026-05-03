import { initNavbar } from './utils/navbar.js';
import { initProductSlider } from './utils/slider.js';
import { initProductList } from './pages/product-list.js';
import { initProductDetail } from './pages/product-detail.js';
import { initAuth } from './pages/auth.js';
import { initOrderHistory } from './pages/order-history.js';
import { initUserProfile } from './pages/user-profile.js';
import { initHome, checkUserStatus } from './pages/home.js';
import { addToCart, updateCartBadge } from './utils/cart.js';
import { initCart } from './pages/cart.js';
import { initPayment } from './pages/payment.js';
import { initNews } from './pages/news.js';
import { initNewsDetail } from './pages/news-detail.js';

$(function () {
    checkUserStatus();
    initNavbar();
    updateCartBadge();

    const path = window.location.pathname;

    if (path === '/') {
        initHome();
        initProductList();
        
        const productSlider = initProductSlider('productSlider');
        if (productSlider) {
            $('.next-btn').off('click').on('click', e => { e.preventDefault(); productSlider.slide(1); });
            $('.prev-btn').off('click').on('click', e => { e.preventDefault(); productSlider.slide(-1); });
        }
    } 
    else if (path.includes('/products/detail/')) {
        initProductDetail();
    } 
    else if (path.includes('/cart/payment')) {
        initPayment();
    } 
    else if (path.includes('/cart')) {
        initCart();
    } 
    else if (path.includes('/auth')) {
        initAuth();
    } 
    else if (path.includes('/user-profile') || path.includes('/order-history')) {
        initUserProfile();
        initOrderHistory();
    }
    // PHẢI ĐƯA DETAIL LÊN TRƯỚC
    else if (path.includes('/news/detail/')) {
        initNewsDetail();
    }
    // RỒI MỚI ĐẾN TRANG DANH SÁCH NEWS
    else if (path.includes('/news')) {
        initNews();
    }
    
    $(document).off('click', '.btn-add-cart').on('click', '.btn-add-cart', function (e) {
        e.preventDefault(); 
        e.stopPropagation();
        const productId = $(this).data('id');
        if (productId) addToCart(productId);
    });
});