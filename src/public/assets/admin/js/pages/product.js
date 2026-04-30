export const initProduct = () => {
    const $productTableBody = $('#productTableBody');

    const getProducts = () => JSON.parse(localStorage.getItem('products')) || [];

    const showError = ($input, message) => {
        $input.removeClass('is-valid').addClass('is-invalid');
        let $errDiv = $input.siblings('.invalid-feedback');
        if ($errDiv.length === 0) {
            $input.after(`<div class="invalid-feedback small">${message}</div>`);
        } else {
            $errDiv.text(message);
        }
    };

    const showSuccess = ($input) => {
        $input.removeClass('is-invalid').addClass('is-valid');
    };

    const htmlToPlainText = (html) => {
        if (!html) return '';
        let text = String(html)
            .replace(/<br\s*[\/]?>/gi, '\n')
            .replace(/<\/li>/gi, '\n')
            .replace(/<\/p>/gi, '\n\n')
            .replace(/<\/div>/gi, '\n');
        
        return $('<div>').html(text).text().trim();
    };

    const renderProductTable = () => {
        const products = getProducts();
        $productTableBody.empty();

        if (products.length === 0) {
            $productTableBody.html('<tr><td colspan="6" class="text-center p-4 text-muted">Chưa có sản phẩm nào trong hệ thống.</td></tr>');
            return;
        }

        products.forEach((product) => {
            const statusClass = product.status === 'inactive' ? 'bg-secondary-subtle text-secondary' : 'bg-success-subtle text-success';
            const statusText = product.status === 'inactive' ? 'Inactive' : 'Active';

            $productTableBody.append(`
                <tr>
                    <td>
                        <div class="d-flex align-items-center">
                            <img src="${product.image}" 
                                 class="rounded-3 me-3" 
                                 style="width: 45px; height: 45px; object-fit: cover;"
                                 onerror="this.onerror=null; this.src='https://via.placeholder.com/45'">
                            <div>
                                <h6 class="mb-0 fw-bold text-truncate" style="max-width: 200px;">${product.title}</h6>
                                <small class="text-muted">ID: ${product.id}</small>
                            </div>
                        </div>
                    </td>
                    <td class="text-center">${product.brand || 'No Brand'}</td>
                    <td class="text-center fw-bold text-danger">${(product.price || 0).toLocaleString('vi-VN')}đ</td>
                    <td class="text-center">
                        <span class="badge bg-light text-dark border">${product.stock || 0} chiếc</span>
                    </td>
                    <td class="text-center">
                        <span class="badge ${statusClass}">${statusText}</span>
                    </td>
                    <td class="text-end">
                        <div class="btn-group">
                            <button class="btn btn-sm btn-light border-0 btn-edit-product" 
                                    data-id="${product.id}" 
                                    data-bs-toggle="modal" 
                                    data-bs-target="#modalProductDetail"
                                    title="Sửa/Chi tiết">
                                <i class="bi bi-pencil-square text-primary"></i>
                            </button>
                            <button class="btn btn-sm btn-light border-0 btn-delete-product" 
                                    data-id="${product.id}"
                                    title="Xóa sản phẩm">
                                <i class="bi bi-trash text-danger"></i>
                            </button>
                        </div>
                    </td>
                </tr>
            `);
        });
    };

    const handleAddNewProduct = () => {
        const brandData = {
            "dien-thoai": ["APPLE", "SAMSUNG", "XIAOMI", "VIVO", "OPPO", "REALME", "NOKIA"],
            "tablet": ["APPLE", "SAMSUNG", "XIAOMI", "LENOVO", "HUAWEI"],
            "laptop": ["APPLE", "ASUS", "DELL", "HP", "ACER", "MSI"],
            "man-hinh": ["SAMSUNG", "LG", "DELL", "ASUS", "VIEWSONIC"],
            "gia-dung": ["XIAOMI", "LG", "SAMSUNG", "TOSHIBA", "PANASONIC"],
            "phu-kien": ["APPLE", "BASEUS", "ANKER", "LOGITECH", "MARSHALL"]
        };

        $('#addCategory').on('change', function() {
            const selectedCategory = $(this).val();
            const brands = brandData[selectedCategory] || [];
            const $brandSelect = $('#addBrand');
            
            $brandSelect.empty();
            brands.forEach(brand => {
                $brandSelect.append(`<option value="${brand}">${brand}</option>`);
            });
        });

        $('#addCategory').trigger('change');

        $('#addProductName').on('blur', function() {
            if ($(this).val().trim() === '') showError($(this), 'Tên sản phẩm không được để trống');
            else showSuccess($(this));
        });

        $('#addImageUrl').on('blur', function() {
            const url = $(this).val().trim();
            if (url === '') showError($(this), 'Link ảnh không được để trống');
            else if (!url.startsWith('http')) showError($(this), 'Link ảnh phải bắt đầu bằng http hoặc https');
            else showSuccess($(this));
        });

        $('#addInitialPrice').on('blur', function() {
            const price = parseFloat($(this).val());
            if (isNaN(price)) showError($(this), 'Giá bán không được để trống');
            else if (price <= 0) showError($(this), 'Giá bán phải lớn hơn 0');
            else showSuccess($(this));
        });

        $('#addStock').on('blur', function() {
            const stock = parseInt($(this).val());
            if (isNaN(stock)) showError($(this), 'Số lượng không được để trống');
            else if (stock < 0) showError($(this), 'Số lượng không được là số âm');
            else showSuccess($(this));
        });

        $('#btnSaveNewProduct').off('click').on('click', function(e) {
            e.preventDefault();
            $('#addProductName, #addImageUrl, #addInitialPrice, #addStock').trigger('blur');

            if ($('#modalProduct').find('.is-invalid').length > 0) return;

            const newProduct = {
                id: `P-${Date.now()}`,
                title: $('#addProductName').val().trim(),
                image: $('#addImageUrl').val().trim(),
                price: parseFloat($('#addInitialPrice').val()),
                stock: parseInt($('#addStock').val()),
                category: $('#addCategory').val(),
                brand: $('#addBrand').val(),
                description: $('#addDescription').val().trim() || 'Chưa có mô tả',
                status: 'active',
                createdAt: new Date().toISOString()
            };

            const products = getProducts();
            products.unshift(newProduct);
            localStorage.setItem('products', JSON.stringify(products));

            $('#addProductName, #addImageUrl, #addInitialPrice, #addStock, #addDescription').val('').removeClass('is-valid is-invalid');
            $('#addCategory').prop('selectedIndex', 0).trigger('change');
            
            alert('Thêm sản phẩm mới thành công!');
            $('#modalProduct').modal('hide');
            
            renderProductTable();
        });
    };

    const handleEditProduct = () => {
        $('#editProductName').on('blur', function() {
            if ($(this).val().trim() === '') showError($(this), 'Tên sản phẩm không được để trống');
            else showSuccess($(this));
        });

        $('#editProductPrice').on('blur', function() {
            const price = parseFloat($(this).val());
            if (isNaN(price)) showError($(this), 'Giá bán không được để trống');
            else if (price <= 0) showError($(this), 'Giá bán phải lớn hơn 0');
            else showSuccess($(this));
        });

        $('#editProductImage').on('blur', function() {
            const url = $(this).val().trim();
            if (url === '') showError($(this), 'Link ảnh không được để trống');
            else showSuccess($(this));
        });

        $('#editProductImage').on('input', function() {
            const url = $(this).val().trim();
            $('#editProductPreview').attr('src', url || "https://via.placeholder.com/150");
        });

        $(document).off('click', '.btn-edit-product').on('click', '.btn-edit-product', function() {
            const targetId = String($(this).data('id')); 
            const products = getProducts();
            const product = products.find(p => String(p.id) === targetId);
            
            if (!product) {
                alert("Lỗi: Không tìm thấy sản phẩm!");
                return;
            }

            $('#modalProductDetail').attr('data-current-id', targetId);

            $('#detailProductName').text(product.title || 'Chưa có tên');
            $('#editProductName').val(product.title || '');
            $('#editProductImage').val(product.image || '');
            
            $('#editProductPreview').off('error').on('error', function() {
                $(this).off('error').attr('src', 'https://via.placeholder.com/150?text=No+Image');
            }).attr('src', product.image || "https://via.placeholder.com/150");

            $('#editProductPrice').val(product.price || '');
            
            if (product.category) $('#editProductCategory').val(product.category);
            if (product.status) $('#editProductStatus').val(product.status);
            
            $('#editProductDesc').val(htmlToPlainText(product.description));

            $('#subtab-info').find('.is-invalid, .is-valid').removeClass('is-invalid is-valid');
            $('#subtab-info').find('.invalid-feedback').remove();
            
            $('#currentStockDisplay').text(product.stock || 0);
            $('#logQty').val('').removeClass('is-invalid is-valid');
            $('#logNote').val('');
            $('#logType').val('import');
            renderWarehouseHistory(product);
        });

        const $btnSaveEdit = $('button[onclick="updateProductGeneralInfo()"]');
        if ($btnSaveEdit.length > 0) {
            $btnSaveEdit.removeAttr('onclick').attr('id', 'btnUpdateProductGeneralInfo');
        }

        $(document).off('click', '#btnUpdateProductGeneralInfo').on('click', '#btnUpdateProductGeneralInfo', function() {
            const currentId = $('#modalProductDetail').attr('data-current-id');
            if (!currentId) {
                alert("Lỗi hệ thống: Không xác định được sản phẩm đang sửa!");
                return;
            }

            $('#editProductName, #editProductPrice, #editProductImage').trigger('blur');
            if ($('#subtab-info').find('.is-invalid').length > 0) return;

            const products = getProducts();
            const index = products.findIndex(p => String(p.id) === currentId);

            if (index !== -1) {
                products[index].title = $('#editProductName').val().trim();
                products[index].image = $('#editProductImage').val().trim() || "https://via.placeholder.com/150";
                products[index].price = parseFloat($('#editProductPrice').val());
                products[index].category = $('#editProductCategory').val();
                products[index].status = $('#editProductStatus').val();
                products[index].description = $('#editProductDesc').val().trim();

                localStorage.setItem('products', JSON.stringify(products));

                alert('Cập nhật thông tin sản phẩm thành công!');
                $('#modalProductDetail').modal('hide');
                
                renderProductTable();
            } else {
                alert("Lỗi: Không tìm thấy sản phẩm trong cơ sở dữ liệu!");
            }
        });
        
        const renderWarehouseHistory = (product) => {
            const $tbody = $('#warehouseHistoryBody');
            const logs = Array.isArray(product.warehouseLogs) ? product.warehouseLogs : [];
            
            if (logs.length === 0) {
                $tbody.html('<tr><td colspan="5" class="text-center py-4 text-muted">Sản phẩm này chưa có lịch sử nhập/xuất kho.</td></tr>');
                return;
            }

            let rowsHtml = '';
            logs.forEach(log => {
                const isImport = log.type === 'import';
                const typeBadge = isImport 
                    ? '<span class="badge bg-success-subtle text-success">Nhập kho (+)</span>' 
                    : '<span class="badge bg-danger-subtle text-danger">Xuất kho (-)</span>';
                
                const qtyText = (isImport ? '+' : '-') + log.qty;
                const qtyClass = isImport ? 'text-success' : 'text-danger';

                rowsHtml += `
                    <tr>
                        <td class="small text-muted">${log.date}</td>
                        <td>${typeBadge}</td>
                        <td class="fw-bold ${qtyClass}">${qtyText}</td>
                        <td class="small text-truncate" style="max-width: 150px;" title="${log.note}">${log.note}</td>
                        <td class="small fw-bold">${log.user}</td>
                    </tr>
                `;
            });
            $tbody.html(rowsHtml);
        };

        const $btnUpdateWarehouse = $('button[onclick="updateWarehouse()"]');
        if ($btnUpdateWarehouse.length > 0) {
            $btnUpdateWarehouse.removeAttr('onclick').attr('id', 'btnUpdateWarehouseAction');
        }

        $(document).off('click', '#btnUpdateWarehouseAction').on('click', '#btnUpdateWarehouseAction', function(e) {
            e.preventDefault();
            const currentId = $('#modalProductDetail').attr('data-current-id');
            if (!currentId) return alert("Lỗi: Không xác định được sản phẩm đang thao tác!");

            const type = $('#logType').val();
            const $qtyInput = $('#logQty');
            const qtyStr = $qtyInput.val().trim();
            const qty = parseInt(qtyStr);
            const note = $('#logNote').val().trim() || 'Không có ghi chú';

            $qtyInput.removeClass('is-invalid is-valid');

            if (!qtyStr || isNaN(qty) || qty <= 0) {
                showError($qtyInput, 'Vui lòng nhập số lượng lớn hơn 0');
                return;
            }

            const products = JSON.parse(localStorage.getItem('products')) || [];
            const index = products.findIndex(p => String(p.id) === currentId);
            
            if (index === -1) return alert("Lỗi: Sản phẩm không tồn tại!");
            
            let currentStock = parseInt(products[index].stock);
            if (isNaN(currentStock)) currentStock = 0;

            if (type === 'export' && qty > currentStock) {
                showError($qtyInput, `Vượt quá tồn kho! Chỉ có thể xuất tối đa ${currentStock} chiếc`);
                return;
            }

            showSuccess($qtyInput);

            const sessionUserStr = localStorage.getItem('currentUser');
            let userName = 'Quản trị viên';
            if (sessionUserStr) {
                try {
                    const userObj = JSON.parse(sessionUserStr);
                    userName = userObj.fullName || userObj.username || 'Quản trị viên';
                } catch(e) {}
            }

            const newStock = (type === 'import') ? (currentStock + qty) : (currentStock - qty);
            products[index].stock = newStock;

            const newLog = {
                date: new Date().toLocaleString('vi-VN'),
                type: type,
                qty: qty,
                note: note,
                user: userName
            };

            products[index].warehouseLogs = Array.isArray(products[index].warehouseLogs) ? products[index].warehouseLogs : [];
            products[index].warehouseLogs.unshift(newLog);

            localStorage.setItem('products', JSON.stringify(products));

            $('#currentStockDisplay').text(newStock);
            $qtyInput.val('').removeClass('is-valid is-invalid');
            $('#logNote').val('');
            
            renderWarehouseHistory(products[index]);
            renderProductTable();
        });

        const handleDeleteProduct = () => {
            $(document).off('click', '.btn-delete-product').on('click', '.btn-delete-product', function() {
                const targetId = String($(this).data('id'));
                
                if (confirm('Bạn có chắc chắn muốn xóa sản phẩm này? Hành động này sẽ không thể hoàn tác!')) {
                    let products = getProducts();
                    const initialLength = products.length;
                    
                    products = products.filter(p => String(p.id) !== targetId);
                    
                    if (products.length < initialLength) {
                        localStorage.setItem('products', JSON.stringify(products));
                        renderProductTable();
                    } else {
                        alert('Lỗi: Không tìm thấy sản phẩm để xóa!');
                    }
                }
            });
        };

        renderProductTable();
        handleAddNewProduct();
        // handleEditProduct();
        handleDeleteProduct(); 
    };
    
    handleEditProduct();
};