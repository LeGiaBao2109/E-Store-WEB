import { updateCartBadge, getCartItems, saveCart, clearTempCart } from '../utils/cart.js';

export const initCart = () => {
    const $cartTableBody = $('.table tbody');
    const $totalAmount = $('.h3.fw-bold.text-danger');

    const getProductStock = (productId) => {
        const allProducts = JSON.parse(localStorage.getItem('products')) || [];
        const product = allProducts.find(p => p.id === productId);
        return product ? product.stock : 0;
    };

    const renderCart = () => {
        const cart = getCartItems();
        $cartTableBody.empty();

        if (cart.length === 0) {
            $('.card-body').html(`
                <div class="text-center py-5">
                    <h5>Giỏ hàng của bạn đang trống</h5>
                    <a href="/" class="btn btn-danger mt-3 px-4 rounded-pill shadow-sm">MUA SẮM NGAY</a>
                </div>
            `);
            $('.card-footer').hide();
            updateCartBadge();
            return;
        }

        $('.card-footer').show();
        let total = 0;

        cart.forEach((item) => {
            const subtotal = item.price * item.quantity;
            total += subtotal;
            const currentStock = getProductStock(item.id);

            $cartTableBody.append(`
                <tr class="cart-item" data-id="${item.id}">
                  <td class="py-4 px-4">
                    <div class="d-flex align-items-center">
                      <div class="rounded-3 border p-1 bg-white shadow-sm flex-shrink-0" style="width: 90px; height: 90px;">
                        <img src="${item.image}" alt="${item.title}" class="w-100 h-100 object-fit-contain">
                      </div>
                      <div class="ms-3 flex-grow-1">
                        <h6 class="fw-bold mb-1 text-truncate" style="max-width: 250px;">${item.title}</h6>
                        <p class="text-muted small mb-0">Tồn kho: <span class="badge bg-light text-dark border">${currentStock}</span></p>
                      </div>
                    </div>
                  </td>
                  <td class="py-4 text-center">
                    <div class="d-flex justify-content-center align-items-center">
                      <div class="input-group input-group-sm flex-nowrap border rounded-pill overflow-hidden" style="width: 110px;">
                        <button class="btn btn-light border-0 px-2 btn-minus" type="button"><i class="bi bi-dash"></i></button>
                        <input type="number" class="form-control border-0 text-center fw-bold shadow-none bg-transparent p-0 input-qty" 
                               value="${item.quantity}" min="1" max="${currentStock}">
                        <button class="btn btn-light border-0 px-2 btn-plus" type="button"><i class="bi bi-plus"></i></button>
                      </div>
                    </div>
                  </td>
                  <td class="py-4 text-center d-none d-lg-table-cell text-secondary">${item.price.toLocaleString()}đ</td>
                  <td class="py-4 text-center d-none d-lg-table-cell fw-bold text-danger">${subtotal.toLocaleString()}đ</td>
                  <td class="py-4 text-center">
                    <button class="btn btn-outline-danger btn-sm border-0 rounded-circle btn-remove"><i class="bi bi-trash"></i></button>
                  </td>
                </tr>
            `);
        });

        $totalAmount.text(`${total.toLocaleString()}đ`);
        updateCartBadge();
    };

    const updateQuantity = (id, change) => {
        let cart = getCartItems();
        const item = cart.find(p => p.id === id);
        if (!item) return;

        const stock = getProductStock(id);
        const newQty = item.quantity + change;

        if (newQty > stock) {
            alert(`Sản phẩm này chỉ còn tối đa ${stock} cái trong kho.`);
            item.quantity = stock;
        } else if (newQty <= 0) {
            removeFromCart(id);
            return;
        } else {
            item.quantity = newQty;
        }
        
        saveCart(cart);
        renderCart();
    };

    const removeFromCart = (id) => {
        let cart = getCartItems();
        cart = cart.filter(p => p.id !== id);
        saveCart(cart);
        renderCart();
    };

    $(document).off('click', '.btn-plus').on('click', '.btn-plus', function() {
        updateQuantity($(this).closest('tr').data('id'), 1);
    });

    $(document).off('click', '.btn-minus').on('click', '.btn-minus', function() {
        updateQuantity($(this).closest('tr').data('id'), -1);
    });

    $(document).off('click', '.btn-remove').on('click', '.btn-remove', function() {
        if(confirm("Bạn có chắc chắn muốn xóa sản phẩm này?")) {
            removeFromCart($(this).closest('tr').data('id'));
        }
    });

    $(document).off('change', '.input-qty').on('change', '.input-qty', function() {
        const id = $(this).closest('tr').data('id');
        const stock = getProductStock(id);
        let val = parseInt($(this).val());

        if (isNaN(val) || val < 1) val = 1;
        
        if (val > stock) {
            alert(`Kho hàng hiện tại chỉ còn ${stock} sản phẩm.`);
            val = stock;
        }

        let cart = getCartItems();
        const item = cart.find(p => p.id === id);
        if (item) {
            item.quantity = val;
            saveCart(cart);
            renderCart();
        }
    });

    $(document).on('keydown', '.input-qty', function(e) {
        if (["e", "E", "+", "-", "."].includes(e.key)) e.preventDefault();
    });

    $(document).off('click', '.btn-checkout').on('click', '.btn-checkout', function(e) {
        e.preventDefault();
        clearTempCart();
        window.location.href = "/cart/payment";
    });

    clearTempCart();
    renderCart();
};