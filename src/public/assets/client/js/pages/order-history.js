export const prepareReview = (name) => {
    const modalTitle = document.getElementById('modalProductName');
    const textArea = document.getElementById('reviewText');
    
    if (modalTitle) modalTitle.innerText = name;
    if (textArea) textArea.value = '';
};

export const submitReview = () => {
    const productName = document.getElementById('modalProductName')?.innerText;
    const content = document.getElementById('reviewText')?.value;

    if (!content || !content.trim()) {
        alert("Vui lòng nhập nội dung đánh giá!");
        return;
    }

    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser) {
        alert("Vui lòng đăng nhập để thực hiện đánh giá!");
        return;
    }

    const newReview = {
        reviewId: Date.now(),
        productName: productName,
        userId: currentUser.id || currentUser._id,
        fullName: currentUser.fullName,
        content: content.trim(),
        date: new Date().toLocaleDateString('vi-VN')
    };

    try {
        const allReviews = JSON.parse(localStorage.getItem('product_reviews')) || [];
        allReviews.push(newReview);
        localStorage.setItem('product_reviews', JSON.stringify(allReviews));

        alert("Gửi đánh giá thành công!");

        const modalElement = document.getElementById('reviewModal');
        const modal = bootstrap.Modal.getInstance(modalElement);
        if (modal) modal.hide();
        
    } catch (error) {
        console.error("Lỗi khi lưu đánh giá:", error);
        alert("Có lỗi xảy ra, vui lòng thử lại sau.");
    }
};

export const initOrderHistory = () => {
    const urlParams = new URLSearchParams(window.location.search);
    let viewingOrderId = urlParams.get('id');

    if (!viewingOrderId) {
        viewingOrderId = sessionStorage.getItem('viewingOrderId');
    }
    
    if (viewingOrderId) {
        const allOrders = JSON.parse(localStorage.getItem('order_history')) || [];
        const targetOrder = allOrders.find(order => order.orderId === viewingOrderId);
        
        if (targetOrder) {
            const allUsers = JSON.parse(localStorage.getItem('users')) || [];
            const userAccount = allUsers.find(u => String(u.id || u._id) === String(targetOrder.userId));
            const displayEmail = userAccount ? userAccount.email : (targetOrder.email || 'Chưa cập nhật');

            $('h5:contains("Chi tiết đơn hàng")').html(`<i class="bi bi-box-seam me-2 text-danger"></i> Chi tiết đơn hàng #${targetOrder.orderId}`);
            
            const infoList = $('.order-info-list .col-12, .order-info-list .col-6');
            infoList.eq(0).find('span.fw-bold').text(targetOrder.customerName);
            infoList.eq(1).find('span:last-child').text(targetOrder.phone || 'Chưa cập nhật');
            
            infoList.eq(2).find('span:last-child').text(displayEmail); 
            
            infoList.eq(3).find('span:last-child').text(targetOrder.date);
            infoList.eq(4).find('span:last-child').text(targetOrder.address);

            const statusBadge = $('.status-badge');
            statusBadge.text(targetOrder.status);
            statusBadge.attr('class', 'status-badge'); 
            if (targetOrder.status === 'Đã hoàn thành' || targetOrder.status === 'Hoàn thành') {
                statusBadge.addClass('status-delivered');
            }

            $('h5:contains("Danh sách sản phẩm")').text(`Danh sách sản phẩm (${targetOrder.items.length})`);
            
            const $orderItemsContainer = $('.order-items');
            $orderItemsContainer.empty();

            targetOrder.items.forEach((item) => {
                const itemHtml = `
                    <div class="order-item-row mb-3 pb-3 border-bottom">
                        <div class="flex-shrink-0 position-relative">
                            <img src="${item.image || '/assets/client/images/no-image.png'}"
                                class="rounded-3 border bg-white"
                                style="width: 75px; height: 75px; object-fit: contain;">
                        </div>
                        <div class="product-info-detail">
                            <h6 class="mb-0 fw-bold text-dark">${item.title}</h6>
                            <div class="d-flex align-items-center gap-2">
                                <span class="qty-label">SL: ${item.quantity}</span>
                                <button class="btn btn-review btn-sm rounded-pill px-3" 
                                    onclick="prepareReview('${item.title}')"
                                    data-bs-toggle="modal" 
                                    data-bs-target="#reviewModal">
                                    <i class="bi bi-star-fill me-1"></i> Đánh giá
                                </button>
                            </div>
                        </div>
                        <div class="product-price-block">
                            <div class="fw-bold text-dark">${(item.price || 0).toLocaleString('vi-VN')} đ</div>
                        </div>
                    </div>
                `;
                $orderItemsContainer.append(itemHtml);
            });

            const summaryBody = $('.order-summary');
            summaryBody.find('.fw-bold').eq(0).text((targetOrder.subtotal || 0).toLocaleString('vi-VN') + ' đ');
            summaryBody.find('span:last-child').eq(2).text((targetOrder.vat || 0).toLocaleString('vi-VN') + ' đ');
            summaryBody.find('.text-danger').text((targetOrder.totalAmount || 0).toLocaleString('vi-VN') + ' đ');
        }
        
        sessionStorage.removeItem('viewingOrderId');
    }

    window.prepareReview = prepareReview;

    const submitBtn = document.querySelector('#reviewModal .btn-danger');
    if (submitBtn) {
        const newBtn = submitBtn.cloneNode(true);
        submitBtn.parentNode.replaceChild(newBtn, submitBtn);
        newBtn.addEventListener('click', submitReview);
    }
};