import { getCartItems, saveCart } from '../utils/cart.js';

export const initPayment = () => {
    const $orderItemsContainer = $('.order-items');
    const $subtotalDisplay = $('.order-summary .fw-bold.small.text-dark').first();
    const $vatDisplay = $('.order-summary .fw-bold.small.text-dark').eq(1);
    const $totalAmountDisplay = $('.order-summary .h4.text-danger');
    
    const $customerFields = $('.customer-info .col-sm-8'); 

    const renderOrderSummary = () => {
        const cart = getCartItems();
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));

        if (currentUser && $customerFields.length >= 3) {
            $customerFields.eq(0).text(currentUser.fullName);
            $customerFields.eq(1).text(currentUser.email);
            $customerFields.eq(2).text(currentUser.phone || 'Chưa cập nhật');
        }

        $orderItemsContainer.empty();
        let subtotal = 0;

        if (cart.length === 0) {
            alert("Giỏ hàng của bạn đang trống!");
            window.location.href = "/";
            return;
        }

        cart.forEach((item) => {
            const itemTotal = item.price * item.quantity;
            subtotal += itemTotal;

            $orderItemsContainer.append(`
                <div class="order-item-row mb-3 pb-3 border-bottom d-flex align-items-center justify-content-between">
                    <div class="d-flex align-items-center">
                        <div class="flex-shrink-0">
                            <img src="${item.image}" class="rounded-3 border bg-white" style="width: 70px; height: 70px; object-fit: contain;">
                        </div>
                        <div class="ms-3">
                            <h6 class="mb-0 fw-bold text-dark">${item.title}</h6>
                            <span class="text-muted small">Số lượng: ${item.quantity}</span>
                        </div>
                    </div>
                    <div class="fw-bold text-dark">${itemTotal.toLocaleString()} đ</div>
                </div>
            `);
        });

        const vatRate = 0.1;
        const vatAmount = subtotal * vatRate;
        const finalTotal = subtotal + vatAmount;

        $subtotalDisplay.text(`${subtotal.toLocaleString()} đ`);
        $vatDisplay.text(`${vatAmount.toLocaleString()} đ`);
        $totalAmountDisplay.text(`${finalTotal.toLocaleString()} đ`);

        window.currentOrderTotal = { subtotal, vatAmount, finalTotal };
    };

    $('button[type="submit"]').on('click', function(e) {
        e.preventDefault();
        
        const address = $('#fullAddress').val().trim();
        if (!address) {
            alert("Vui lòng nhập địa chỉ giao hàng!");
            return;
        }

        const cart = getCartItems();
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        const { subtotal, vatAmount, finalTotal } = window.currentOrderTotal;

        const newOrder = {
            orderId: 'ORD' + Date.now(),
            customerName: currentUser.fullName,
            items: cart,
            subtotal: subtotal,
            vat: vatAmount,
            totalAmount: finalTotal,
            address: address,
            note: $('#orderNote').val(),
            status: 'Chờ xác nhận',
            date: new Date().toLocaleString('vi-VN')
        };

        let history = JSON.parse(localStorage.getItem('order_history')) || [];
        history.unshift(newOrder);
        localStorage.setItem('order_history', JSON.stringify(history));

        saveCart([]); 
        alert("Đặt hàng thành công!");
        window.location.href = "/"; 
    });

    renderOrderSummary();
};