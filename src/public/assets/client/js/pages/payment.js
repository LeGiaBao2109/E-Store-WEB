import { getCartItems, saveCart, clearTempCart } from '../utils/cart.js';

export const initPayment = () => {
    const $orderItemsContainer = $('.order-items');
    const $subtotalDisplay = $('.order-summary .fw-bold.small.text-dark').first();
    const $vatDisplay = $('.order-summary .fw-bold.small.text-dark').eq(1);
    const $totalAmountDisplay = $('.order-summary .h4.text-danger');
    const $customerFields = $('.customer-info .col-sm-8'); 

    const renderOrderSummary = () => {
        let cart = getCartItems('buy_now');
        
        if (!cart || cart.length === 0) {
            cart = getCartItems('all');
        }

        const currentUser = JSON.parse(localStorage.getItem('currentUser')) || {}; 

        if (!currentUser.fullName) {
            alert("Vui lòng đăng nhập để tiếp tục!");
            window.location.href = "/auth";
            return;
        }

        if ($customerFields.length >= 3) {
            $customerFields.eq(0).text(currentUser.fullName || 'Khách hàng');
            $customerFields.eq(1).text(currentUser.email || 'N/A');
            $customerFields.eq(2).text(currentUser.phone || 'Chưa cập nhật');
        }

        $orderItemsContainer.empty();
        let subtotal = 0;

        if (!cart || cart.length === 0) {
            alert("Đơn hàng của bạn đang trống!");
            window.location.href = "/";
            return;
        }

        cart.forEach((item) => {
            const itemTotal = Number(item.price) * Number(item.quantity);
            subtotal += itemTotal;

            $orderItemsContainer.append(`
                <div class="order-item-row mb-3 pb-3 border-bottom d-flex align-items-center justify-content-between">
                    <div class="d-flex align-items-center">
                        <div class="flex-shrink-0">
                            <img src="${item.image}" class="rounded-3 border bg-white" style="width: 70px; height: 70px; object-fit: contain;">
                        </div>
                        <div class="ms-3">
                            <h6 class="mb-0 fw-bold text-dark text-truncate" style="max-width: 200px;">${item.title}</h6>
                            <span class="text-muted small">Số lượng: ${item.quantity}</span>
                        </div>
                    </div>
                    <div class="fw-bold text-dark">${itemTotal.toLocaleString()} đ</div>
                </div>
            `);
        });

        const vatRate = 0.1;
        const vatAmount = Math.round(subtotal * vatRate);
        const finalTotal = subtotal + vatAmount;

        $subtotalDisplay.text(`${subtotal.toLocaleString()} đ`);
        $vatDisplay.text(`${vatAmount.toLocaleString()} đ`);
        $totalAmountDisplay.text(`${finalTotal.toLocaleString()} đ`);

        window.currentOrderTotal = { subtotal, vatAmount, finalTotal, items: cart };
    };

    $(document).off('click', 'button[type="submit"]').on('click', 'button[type="submit"]', function(e) {
        e.preventDefault();
        
        const address = $('#fullAddress').val()?.trim();
        if (!address) {
            alert("Vui lòng nhập địa chỉ giao hàng!");
            $('#fullAddress').focus();
            return;
        }

        const currentUser = JSON.parse(localStorage.getItem('currentUser'));

        if (!window.currentOrderTotal) {
            alert("Lỗi dữ liệu thanh toán. Vui lòng thử lại!");
            return;
        }

        const { subtotal, vatAmount, finalTotal, items } = window.currentOrderTotal;

        let allProducts = JSON.parse(localStorage.getItem('products')) || [];
        let stockError = false;

        items.forEach(cartItem => {
            const productIndex = allProducts.findIndex(p => p.id === cartItem.id);
            if (productIndex !== -1) {
                if (allProducts[productIndex].stock >= cartItem.quantity) {
                    allProducts[productIndex].stock -= cartItem.quantity;
                } else {
                    stockError = true;
                }
            }
        });

        if (stockError) {
            alert("Một số sản phẩm đã hết hàng hoặc không đủ số lượng tồn kho!");
            return;
        }

        const newOrder = {
            orderId: 'ORD' + Date.now(),
            customerName: currentUser?.fullName || "Khách hàng",
            userId: currentUser?.id || currentUser?._id || "guest",
            items: items,
            subtotal: subtotal,
            vat: vatAmount,
            totalAmount: finalTotal,
            address: address,
            note: $('#orderNote').val() || "",
            status: 'Chờ xác nhận',
            date: new Date().toLocaleString('vi-VN')
        };

        try {
            localStorage.setItem('products', JSON.stringify(allProducts));

            let history = JSON.parse(localStorage.getItem('order_history')) || [];
            history.unshift(newOrder);
            localStorage.setItem('order_history', JSON.stringify(history));

            if (localStorage.getItem('buy_now_temp')) {
                clearTempCart(); 
            } else {
                saveCart([]); 
            }

            alert("Đặt hàng thành công!");
            window.location.href = "/"; 
        } catch (err) {
            alert("Không thể hoàn tất đơn hàng. Vui lòng kiểm tra lại!");
        }
    });

    renderOrderSummary();
};