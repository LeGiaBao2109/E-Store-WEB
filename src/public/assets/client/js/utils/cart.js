function getCurrentUserId() {
    const userData = localStorage.getItem('currentUser');
    if (userData) {
        try {
            const user = JSON.parse(userData);
            return user._id || user.id || 'guest';
        } catch (e) {
            console.error("Lỗi parse user:", e);
            return 'guest';
        }
    }
    return 'guest';
}

function getCartKey() {
    const userId = getCurrentUserId();
    return `cart_${userId}`;
}

export const updateCartBadge = () => {
    const userId = getCurrentUserId();
    if (userId === 'undefined' || !userId) {
        $('.cart-badge').hide();
        return;
    }

    const cartKey = getCartKey();
    const cart = JSON.parse(localStorage.getItem(cartKey)) || [];
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    
    const $badge = $('.cart-badge');
    if ($badge.length) {
        if (totalItems > 0) {
            $badge.text(totalItems).show();
        } else {
            $badge.hide();
        }
    }
};

export const addToCart = (productId) => {
    const cartKey = getCartKey();
    const allProducts = JSON.parse(localStorage.getItem('products')) || [];
    let cart = JSON.parse(localStorage.getItem(cartKey)) || [];

    const product = allProducts.find(p => p.id === productId);

    if (!product) {
        console.error("Không tìm thấy sản phẩm!");
        return;
    }

    const existingItem = cart.find(item => item.id === productId);
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: product.id,
            title: product.title,
            price: product.price,
            image: product.image,
            slug: product.slug,
            quantity: 1
        });
    }

    localStorage.setItem(cartKey, JSON.stringify(cart));
    
    updateCartBadge();
    alert(`Đã thêm ${product.title} vào giỏ hàng!`);
};

export const getCartItems = () => {
    const cartKey = getCartKey();
    return JSON.parse(localStorage.getItem(cartKey)) || [];
};

export const saveCart = (cartData) => {
    const cartKey = getCartKey();
    localStorage.setItem(cartKey, JSON.stringify(cartData));
    updateCartBadge();
};