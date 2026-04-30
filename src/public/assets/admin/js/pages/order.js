export const initOrderAdmin = () => {
    const $desktopTbody = $('#content-orders .table-responsive tbody');
    const $mobileContainer = $('#content-orders .d-block.d-md-none');
    const $filterStatus = $('#filterOrderStatus');
    const $searchInput = $('#content-orders input[placeholder*="Tìm mã đơn"]');

    const statusFlow = {
        'Chờ xác nhận': { badgeClass: 'bg-warning-subtle text-warning border-warning', nextStatus: 'Đã xác nhận', btnText: 'Duyệt & Xác nhận đơn', btnClass: 'btn-danger' },
        'Đã xác nhận': { badgeClass: 'bg-info-subtle text-info border-info', nextStatus: 'Đang giao hàng', btnText: 'Xác nhận đi giao hàng', btnClass: 'btn-info text-white' },
        'Đang giao hàng': { badgeClass: 'bg-primary-subtle text-primary border-primary', nextStatus: 'Đã hoàn thành', btnText: 'Xác nhận Đã Giao', btnClass: 'btn-success' },
        'Đã hoàn thành': { badgeClass: 'bg-success-subtle text-success border-success', nextStatus: null, btnText: '', btnClass: 'd-none' },
        'Đã hủy': { badgeClass: 'bg-danger-subtle text-danger border-danger', nextStatus: null, btnText: '', btnClass: 'd-none' }
    };

    const renderOrdersTable = () => {
        let allOrders = JSON.parse(localStorage.getItem('order_history')) || [];
        const allUsers = JSON.parse(localStorage.getItem('users')) || [];
        
        allOrders.sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0));

        const selectedStatus = $filterStatus.val();
        const searchTerm = $searchInput.val().toLowerCase().trim();

        const statusMap = {
            'pending': 'Chờ xác nhận',
            'confirmed': 'Đã xác nhận',
            'shipping': 'Đang giao hàng',
            'completed': 'Đã hoàn thành',
            'cancelled': 'Đã hủy'
        };

        const filteredOrders = allOrders.filter(order => {
            const matchesStatus = selectedStatus === 'all' || order.status === statusMap[selectedStatus];
            const matchesSearch = order.orderId.toLowerCase().includes(searchTerm) || 
                                 (order.customerName || '').toLowerCase().includes(searchTerm);
            return matchesStatus && matchesSearch;
        });

        $desktopTbody.empty();
        $mobileContainer.empty();

        if (filteredOrders.length === 0) {
            $desktopTbody.append('<tr><td colspan="5" class="text-center py-4 text-muted">Không tìm thấy đơn hàng phù hợp.</td></tr>');
            return;
        }

        filteredOrders.forEach((order) => {
            const userAccount = allUsers.find(u => String(u.id) === String(order.userId)) || {};
            const displayName = order.customerName || userAccount.fullName || 'Khách hàng ẩn danh';
            const displayPhone = order.phone || userAccount.phone || 'N/A';
            const total = (order.totalAmount || 0).toLocaleString('vi-VN');
            const currentStatus = order.status || 'Chờ xác nhận';
            const flow = statusFlow[currentStatus] || { badgeClass: 'bg-secondary-subtle text-secondary' };
            const borderClass = flow.badgeClass.split(' ')[1].replace('text-', 'border-');

            $desktopTbody.append(`
                <tr>
                    <td><span class="fw-bold">${order.orderId}</span></td>
                    <td>
                        <div class="fw-bold small">${displayName}</div>
                        <small class="text-muted" style="font-size: 0.75rem;">${displayPhone}</small>
                    </td>
                    <td class="fw-bold text-danger">${total}đ</td>
                    <td><span class="badge ${flow.badgeClass} rounded-pill px-3 py-2">${currentStatus}</span></td>
                    <td class="text-end">
                        <button class="btn btn-sm btn-light border-0" onclick="viewOrderDetailAdmin('${order.orderId}')" data-bs-toggle="modal" data-bs-target="#modalOrderDetail">
                            <i class="bi bi-eye"></i>
                        </button>
                    </td>
                </tr>
            `);

            $mobileContainer.append(`
                <div class="card border-0 shadow-sm rounded-4 p-3 mb-3 border-start border-4 ${borderClass}">
                    <div class="d-flex justify-content-between align-items-start mb-2">
                        <div><span class="fw-bold text-dark">#${order.orderId}</span><div class="small text-muted">${order.date || ''}</div></div>
                        <span class="badge ${flow.badgeClass}">${currentStatus}</span>
                    </div>
                    <div class="mb-3"><div class="fw-bold">${displayName}</div><div class="text-muted small">${displayPhone}</div></div>
                    <div class="d-flex justify-content-between align-items-center">
                        <div class="fw-bold text-danger">${total}đ</div>
                        <button class="btn btn-sm btn-danger rounded-3 px-3" onclick="viewOrderDetailAdmin('${order.orderId}')" data-bs-toggle="modal" data-bs-target="#modalOrderDetail">Chi tiết</button>
                    </div>
                </div>
            `);
        });
    };

    $filterStatus.on('change', renderOrdersTable);
    $searchInput.on('input', renderOrdersTable);

    window.viewOrderDetailAdmin = (orderId) => {
        const allOrders = JSON.parse(localStorage.getItem('order_history')) || [];
        const order = allOrders.find(o => o.orderId === orderId);
        if (!order) return;

        $('#modalOrderDetail').attr('data-order-id', orderId);
        $('#detailOrderId').text(orderId);
        $('#detailCustomerName').text(order.customerName || 'Người nhận ẩn danh');
        $('#detailCustomerPhone').text(order.phone || 'Chưa có SĐT');
        $('#detailCustomerAddress').text(order.address || 'Chưa có địa chỉ');

        const $itemsBody = $('#detailOrderItems');
        $itemsBody.empty();
        if (order.items) {
            order.items.forEach(item => {
                $itemsBody.append(`
                    <tr>
                        <td><div class="fw-bold small">${item.title}</div></td>
                        <td class="text-center">${item.quantity}</td>
                        <td class="text-end">${(item.price || 0).toLocaleString('vi-VN')}đ</td>
                        <td class="text-end fw-bold">${(item.price * item.quantity).toLocaleString('vi-VN')}đ</td>
                    </tr>
                `);
            });
        }
        $('#detailOrderTotal').text((order.totalAmount || 0).toLocaleString('vi-VN') + 'đ');

        const currentStatus = order.status || 'Chờ xác nhận';
        const flow = statusFlow[currentStatus];
        $('#currentOrderStatusBadge').attr('class', `badge rounded-pill px-3 py-2 fs-6 ${flow.badgeClass}`).text(currentStatus);

        const $btnProcess = $('#btnProcessOrder').hide().removeClass().addClass('btn rounded-pill px-4 fw-bold shadow-sm');
        const $btnPrint = $('#btnPrintInvoice').hide();
        const $btnCancel = $('#btnCancelOrder').hide();

        if (currentStatus === 'Chờ xác nhận') {
            $btnProcess.show().addClass(flow.btnClass).text(flow.btnText);
            $btnCancel.show();
        } else if (currentStatus === 'Đã xác nhận' || currentStatus === 'Đang giao hàng') {
            $btnProcess.show().addClass(flow.btnClass).text(flow.btnText);
            $btnPrint.show();
            if(currentStatus === 'Đã xác nhận') $btnCancel.show();
        } else if (currentStatus === 'Đã hoàn thành') {
            $btnPrint.show();
        }
    };

    window.printOrderBill = () => {
        const orderId = $('#modalOrderDetail').attr('data-order-id');
        const allOrders = JSON.parse(localStorage.getItem('order_history')) || [];
        const order = allOrders.find(o => o.orderId === orderId);
        if (!order) return;

        $('#p-order-id').text(order.orderId);
        $('#p-date').text(order.date || new Date().toLocaleDateString('vi-VN'));
        $('#p-name').text(order.customerName || 'N/A');
        $('#p-phone').text(order.phone || 'N/A');
        $('#p-address').text(order.address || 'N/A');
        $('#p-method').text(order.paymentMethod || 'Tiền mặt');

        const $pItemsBody = $('#p-items-body').empty();
        let subtotalNoTax = 0;

        if (order.items) {
            order.items.forEach((item, idx) => {
                const priceWithVat = item.price || 0;
                const priceNoVat = Math.round(priceWithVat / 1.1);
                const lineTotalNoVat = priceNoVat * item.quantity;
                subtotalNoTax += lineTotalNoVat;

                $pItemsBody.append(`
                    <tr class="text-center">
                        <td>${idx + 1}</td>
                        <td class="text-start">${item.title}</td>
                        <td>Cái</td>
                        <td>${item.quantity}</td>
                        <td>${priceNoVat.toLocaleString('vi-VN')}</td>
                        <td>${lineTotalNoVat.toLocaleString('vi-VN')}</td>
                    </tr>
                `);
            });
        }

        const totalAmount = order.totalAmount || 0;
        const tax = totalAmount - subtotalNoTax;

        $('#p-subtotal').text(subtotalNoTax.toLocaleString('vi-VN') + 'đ');
        $('#p-tax').text(tax.toLocaleString('vi-VN') + 'đ');
        $('#p-total').text(totalAmount.toLocaleString('vi-VN') + 'đ');

        window.print();
    };

    $(document).off('click', '#btnProcessOrder').on('click', '#btnProcessOrder', function() {
        const orderId = $('#modalOrderDetail').attr('data-order-id');
        let allOrders = JSON.parse(localStorage.getItem('order_history')) || [];
        const idx = allOrders.findIndex(o => o.orderId === orderId);
        if (idx === -1) return;

        const nextStatus = statusFlow[allOrders[idx].status]?.nextStatus;
        if (nextStatus && confirm(`Chuyển đơn hàng sang: ${nextStatus}?`)) {
            allOrders[idx].status = nextStatus;
            localStorage.setItem('order_history', JSON.stringify(allOrders));
            window.viewOrderDetailAdmin(orderId);
            renderOrdersTable();
        }
    });

    $(document).off('click', '#btnCancelOrder').on('click', '#btnCancelOrder', function() {
        const orderId = $('#modalOrderDetail').attr('data-order-id');
        let allOrders = JSON.parse(localStorage.getItem('order_history')) || [];
        const idx = allOrders.findIndex(o => o.orderId === orderId);
        if (idx !== -1 && confirm('Xác nhận HỦY đơn hàng này?')) {
            allOrders[idx].status = 'Đã hủy';
            localStorage.setItem('order_history', JSON.stringify(allOrders));
            window.viewOrderDetailAdmin(orderId);
            renderOrdersTable();
        }
    });

    renderOrdersTable();
};