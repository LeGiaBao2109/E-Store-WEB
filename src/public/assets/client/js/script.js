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

$(function () {
    checkUserStatus();
    initNavbar();
    updateCartBadge();
    initHome();

    const path = window.location.pathname;


        const productSlider = initProductSlider('productSlider');
        if (productSlider) {
            $('.next-btn').on('click', e => { e.preventDefault(); productSlider.slide(1); });
            $('.prev-btn').on('click', e => { e.preventDefault(); productSlider.slide(-1); });
        }
        initProductList();
    if (path.includes('/auth')) {
        initAuth();
    } 
    else if (path.includes('/user-profile')) {
        initUserProfile();
        initOrderHistory();
    } 
    else if (path.includes('/product-detail')) {
        initProductDetail();
    }
    else if (path.includes('/cart/payment')) {
        initPayment();
    } 
    else if (path.includes('/cart')) {
        initCart();
    }

    $(document).on('click', '.btn-add-cart', function (e) {
        e.preventDefault(); e.stopPropagation();
        const productId = $(this).data('id');
        if (productId) addToCart(productId);
    });
});