export const initOrderAdmin = () => {
    const $desktopTbody = $('#content-orders .table-responsive tbody');
    const $mobileContainer = $('#content-orders .d-block.d-md-none');

    const statusFlow = {
        'Chờ xác nhận': { badgeClass: 'bg-warning-subtle text-warning border-warning', nextStatus: 'Đã xác nhận', btnText: 'Duyệt & Xác nhận đơn', btnClass: 'btn-danger' },
        'Đã xác nhận': { badgeClass: 'bg-info-subtle text-info border-info', nextStatus: 'Đang giao hàng', btnText: 'Xác nhận đi giao hàng', btnClass: 'btn-info text-white' },
        'Đang giao hàng': { badgeClass: 'bg-primary-subtle text-primary border-primary', nextStatus: 'Đã hoàn thành', btnText: 'Xác nhận Đã Giao (Hoàn thành)', btnClass: 'btn-success' },
        'Đã hoàn thành': { badgeClass: 'bg-success-subtle text-success border-success', nextStatus: null, btnText: '', btnClass: 'd-none' },
        'Đã hủy': { badgeClass: 'bg-danger-subtle text-danger border-danger', nextStatus: null, btnText: '', btnClass: 'd-none' }
    };

    const renderOrdersTable = () => {
        const allOrders = JSON.parse(localStorage.getItem('order_history')) || [];
        const allUsers = JSON.parse(localStorage.getItem('users')) || [];
        
        $desktopTbody.empty();
        $mobileContainer.empty();

        if (allOrders.length === 0) {
            $desktopTbody.append('<tr><td colspan="5" class="text-center py-4 text-muted">Chưa có đơn hàng nào.</td></tr>');
            return;
        }

        const reversedOrders = [...allOrders].reverse();

        reversedOrders.forEach((order) => {
            const orderOwner = allUsers.find(u => String(u.id) === String(order.userId)) || {};

            const customerName = order.fullName || order.customerName || orderOwner.fullName || 'Khách hàng ẩn danh';
            const customerPhone = order.phone || order.phoneNumber || order.customerPhone || order.sdt || order.tel || orderOwner.phone || 'Chưa cập nhật SĐT';
            
            const orderDate = order.date ? order.date.split(' ').find(p => p.includes('/') || p.includes('-')) || order.date : '';
            const total = (order.totalAmount || 0).toLocaleString('vi-VN');
            const currentStatus = order.status || 'Chờ xác nhận';
            
            const badgeClass = statusFlow[currentStatus]?.badgeClass || 'bg-secondary-subtle text-secondary';
            const borderClass = badgeClass.split(' ')[1].replace('text-', 'border-');

            $desktopTbody.append(`
                <tr>
                    <td><span class="fw-bold">${order.orderId}</span></td>
                    <td>
                        <div class="fw-bold small">${customerName}</div>
                        <small class="text-muted" style="font-size: 0.75rem;">${customerPhone}</small>
                    </td>
                    <td class="fw-bold text-danger">${total}đ</td>
                    <td><span class="badge ${badgeClass} rounded-pill px-3 py-2">${currentStatus}</span></td>
                    <td class="text-end">
                        <button class="btn btn-sm btn-light border-0" 
                            onclick="viewOrderDetailAdmin('${order.orderId}')" 
                            data-bs-toggle="modal" data-bs-target="#modalOrderDetail">
                            <i class="bi bi-eye"></i>
                        </button>
                    </td>
                </tr>
            `);

            $mobileContainer.append(`
                <div class="card border-0 shadow-sm rounded-4 p-3 mb-3 border-start border-4 ${borderClass}">
                    <div class="d-flex justify-content-between align-items-start mb-2">
                        <div><span class="fw-bold text-dark">#${order.orderId}</span><div class="small text-muted">${orderDate}</div></div>
                        <span class="badge ${badgeClass}">${currentStatus}</span>
                    </div>
                    <div class="mb-3"><div class="fw-bold">${customerName}</div><div class="text-muted small">${customerPhone}</div></div>
                    <div class="d-flex justify-content-between align-items-center">
                        <div class="fw-bold text-danger">${total}đ</div>
                        <button class="btn btn-sm btn-danger rounded-3 px-3" onclick="viewOrderDetailAdmin('${order.orderId}')" data-bs-toggle="modal" data-bs-target="#modalOrderDetail">Chi tiết</button>
                    </div>
                </div>
            `);
        });
    };

    window.viewOrderDetailAdmin = (orderId) => {
        const allOrders = JSON.parse(localStorage.getItem('order_history')) || [];
        const allUsers = JSON.parse(localStorage.getItem('users')) || [];
        
        const order = allOrders.find(o => o.orderId === orderId);
        if (!order) return;

        const orderOwner = allUsers.find(u => String(u.id) === String(order.userId)) || {};

        $('#modalOrderDetail').attr('data-order-id', orderId);
        $('#detailOrderId').text(orderId);

        $('#detailCustomerName').text(order.fullName || order.customerName || orderOwner.fullName || 'Ẩn danh');
        $('#detailCustomerPhone').text(order.phone || order.phoneNumber || order.customerPhone || order.sdt || order.tel || orderOwner.phone || 'Chưa cập nhật SĐT');
        $('#detailCustomerAddress').text(order.address || order.customerAddress || orderOwner.address || 'Chưa cập nhật địa chỉ');

        const $itemsBody = $('#detailOrderItems');
        $itemsBody.empty();
        let totalAmount = 0;

        if (order.items && order.items.length > 0) {
            order.items.forEach(item => {
                const itemTotal = (item.price * item.quantity);
                totalAmount += itemTotal;
                $itemsBody.append(`
                    <tr>
                        <td><div class="fw-bold small">${item.title}</div></td>
                        <td class="text-center">${item.quantity}</td>
                        <td class="text-end">${(item.price || 0).toLocaleString('vi-VN')}đ</td>
                        <td class="text-end fw-bold">${itemTotal.toLocaleString('vi-VN')}đ</td>
                    </tr>
                `);
            });
        }
        $('#detailOrderTotal').text(totalAmount.toLocaleString('vi-VN') + 'đ');

        const currentStatus = order.status || 'Chờ xác nhận';
        const flow = statusFlow[currentStatus];

        $('#currentOrderStatusBadge').attr('class', `badge rounded-pill px-3 py-2 fs-6 ${flow.badgeClass}`).text(currentStatus);

        const $btnProcess = $('#btnProcessOrder');
        const $btnPrint = $('#btnPrintInvoice');
        const $btnCancel = $('#btnCancelOrder');

        $btnProcess.hide().removeClass().addClass('btn rounded-pill px-4 fw-bold shadow-sm');
        $btnPrint.hide();
        $btnCancel.hide();

        if (currentStatus === 'Chờ xác nhận') {
            $btnProcess.show().addClass(flow.btnClass).text(flow.btnText);
            $btnCancel.show();
        } 
        else if (currentStatus === 'Đã xác nhận') {
            $btnProcess.show().addClass(flow.btnClass).text(flow.btnText);
            $btnPrint.show();
            $btnCancel.show(); 
        } 
        else if (currentStatus === 'Đang giao hàng') {
            $btnProcess.show().addClass(flow.btnClass).text(flow.btnText);
            $btnPrint.show();
        } 
        else if (currentStatus === 'Đã hoàn thành') {
            $btnPrint.show();
        }
    };

    $(document).off('click', '#btnProcessOrder').on('click', '#btnProcessOrder', function() {
        const orderId = $('#modalOrderDetail').attr('data-order-id');
        let allOrders = JSON.parse(localStorage.getItem('order_history')) || [];
        const index = allOrders.findIndex(o => o.orderId === orderId);
        if (index === -1) return;

        const currentStatus = allOrders[index].status || 'Chờ xác nhận';
        const nextStatus = statusFlow[currentStatus]?.nextStatus;

        if (nextStatus) {
            if (confirm(`Bạn xác nhận chuyển đơn hàng sang tiến độ: "${nextStatus}" chứ?`)) {
                allOrders[index].status = nextStatus;
                localStorage.setItem('order_history', JSON.stringify(allOrders));
                
                window.viewOrderDetailAdmin(orderId);
                renderOrdersTable();
            }
        }
    });

    $(document).off('click', '#btnCancelOrder').on('click', '#btnCancelOrder', function() {
        const orderId = $('#modalOrderDetail').attr('data-order-id');
        let allOrders = JSON.parse(localStorage.getItem('order_history')) || [];
        const index = allOrders.findIndex(o => o.orderId === orderId);
        
        if (index !== -1 && confirm('Hành động này không thể hoàn tác. Bạn chắc chắn muốn HỦY đơn hàng?')) {
            allOrders[index].status = 'Đã hủy';
            localStorage.setItem('order_history', JSON.stringify(allOrders));
            window.viewOrderDetailAdmin(orderId);
            renderOrdersTable();
        }
    });

    window.printOrderBill = () => {
        const orderId = $('#modalOrderDetail').attr('data-order-id');
        const allOrders = JSON.parse(localStorage.getItem('order_history')) || [];
        const allUsers = JSON.parse(localStorage.getItem('users')) || [];
        
        const order = allOrders.find(o => o.orderId === orderId);
        if (!order) return;

        const orderOwner = allUsers.find(u => String(u.id) === String(order.userId)) || {};

        $('#p-order-id').text(order.orderId);
        $('#p-date').text(order.date || new Date().toLocaleDateString('vi-VN'));
        $('#p-name').text(order.fullName || order.customerName || orderOwner.fullName || 'Khách hàng');
        $('#p-phone').text(order.phone || order.phoneNumber || order.customerPhone || order.sdt || order.tel || orderOwner.phone || 'Chưa cập nhật SĐT');
        $('#p-address').text(order.address || order.customerAddress || orderOwner.address || 'Chưa cập nhật địa chỉ');
        $('#p-method').text(order.paymentMethod || 'COD / Chuyển khoản');

        const $pItemsBody = $('#p-items-body');
        $pItemsBody.empty();
        let totalAmount = 0;

        if (order.items) {
            order.items.forEach((item, idx) => {
                const price = item.price || 0;
                const preTaxPrice = Math.round(price / 1.1);
                totalAmount += (price * item.quantity);
                
                $pItemsBody.append(`
                    <tr class="text-center">
                        <td>${idx + 1}</td>
                        <td class="text-start">${item.title}</td>
                        <td>Cái</td>
                        <td>${item.quantity}</td>
                        <td>${preTaxPrice.toLocaleString('vi-VN')}</td>
                        <td>${(preTaxPrice * item.quantity).toLocaleString('vi-VN')}</td>
                    </tr>
                `);
            });
        }

        const subTotal = Math.round(totalAmount / 1.1);
        const tax = totalAmount - subTotal;

        $('#p-subtotal').text(subTotal.toLocaleString('vi-VN') + 'đ');
        $('#p-tax').text(tax.toLocaleString('vi-VN') + 'đ');
        $('#p-total').text(totalAmount.toLocaleString('vi-VN') + 'đ');

        window.print();
    };

    renderOrdersTable();
};