export const initProduct = () => {
    const $productTableBody = $('#productTableBody');

    const getProducts = () => JSON.parse(localStorage.getItem('products')) || [];

    const getCurrentAdminName = () => {
        const user = JSON.parse(localStorage.getItem('currentUser'));
        return user ? user.fullName : 'Quản trị viên';
    };

    const createSlug = (str) => {
        if (!str) return '';
        str = str.toLowerCase();
        str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
        str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
        str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
        str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
        str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
        str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
        str = str.replace(/đ/g, "d");
        str = str.replace(/([^0-9a-z-\s])/g, '');
        str = str.replace(/(\s+)/g, '-');
        str = str.replace(/^-+/g, '');
        str = str.replace(/-+$/g, '');
        return str;
    };

    const categorySlugMap = {
        "dien-thoai": "phone",
        "tablet": "tablet",
        "laptop": "laptop",
        "man-hinh": "monitor",
        "gia-dung": "houseware",
        "phu-kien": "accessory"
    };

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

    const renderProductTable = (filterData = null) => {
        const products = filterData || getProducts();
        $productTableBody.empty();

        if (products.length === 0) {
            $productTableBody.html('<tr><td colspan="6" class="text-center p-4 text-muted">Không tìm thấy sản phẩm phù hợp.</td></tr>');
            return;
        }

        products.forEach((product) => {
            const statusClass = product.status === 'inactive' ? 'bg-secondary-subtle text-secondary' : 'bg-success-subtle text-success';
            const statusText = product.status === 'inactive' ? 'Inactive' : 'Active';

            $productTableBody.append(`
                <tr>
                    <td>
                        <div class="d-flex align-items-center">
                            <img src="${product.image}" class="rounded-3 me-3" style="width: 45px; height: 45px; object-fit: cover;" onerror="this.onerror=null; this.src='https://via.placeholder.com/45'">
                            <div>
                                <h6 class="mb-0 fw-bold text-truncate" style="max-width: 200px;">${product.title}</h6>
                                <small class="text-muted">ID: ${product.id}</small>
                            </div>
                        </div>
                    </td>
                    <td class="text-center">${product.brand || 'No Brand'}</td>
                    <td class="text-center fw-bold text-danger">${(product.price || 0).toLocaleString('vi-VN')}đ</td>
                    <td class="text-center"><span class="badge bg-light text-dark border">${product.stock || 0} chiếc</span></td>
                    <td class="text-center"><span class="badge ${statusClass}">${statusText}</span></td>
                    <td class="text-end">
                        <div class="btn-group">
                            <button class="btn btn-sm btn-light border-0 btn-edit-product" data-id="${product.id}" data-bs-toggle="modal" data-bs-target="#modalProductDetail"><i class="bi bi-pencil-square text-primary"></i></button>
                            <button class="btn btn-sm btn-light border-0 btn-delete-product" data-id="${product.id}"><i class="bi bi-trash text-danger"></i></button>
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

        $('#addImageUrl').on('input', function () {
            const url = $(this).val().trim();
            $('#addImgPreview').attr('src', url || 'https://via.placeholder.com/150');
        });

        $('#addCategory').on('change', function () {
            const selectedCategory = $(this).val();
            const brands = brandData[selectedCategory] || [];
            const $brandSelect = $('#addBrand');
            $brandSelect.empty();
            brands.forEach(brand => $brandSelect.append(`<option value="${brand}">${brand}</option>`));
        });

        $('#addCategory').trigger('change');

        $('#btnSaveNewProduct').off('click').on('click', function (e) {
            e.preventDefault();

            const title = $('#addProductName').val().trim();
            const image = $('#addImageUrl').val().trim();
            const price = $('#addInitialPrice').val();
            const stock = $('#addStock').val();

            let isValid = true;
            if (!title) {
                showError($('#addProductName'), 'Tên không được để trống');
                isValid = false;
            } else {
                showSuccess($('#addProductName'));
            }
            if (!image) {
                showError($('#addImageUrl'), 'Link ảnh không được để trống');
                isValid = false;
            } else {
                showSuccess($('#addImageUrl'));
            }
            if (!price || price <= 0) {
                showError($('#addInitialPrice'), 'Giá phải > 0');
                isValid = false;
            } else {
                showSuccess($('#addInitialPrice'));
            }
            if (stock === '' || stock < 0) {
                showError($('#addStock'), 'Số lượng không hợp lệ');
                isValid = false;
            } else {
                showSuccess($('#addStock'));
            }

            if (!isValid) return;

            const category = $('#addCategory').val();
            const newProduct = {
                id: `P-${Date.now()}`,
                title: title,
                slug: createSlug(title),
                categorySlug: categorySlugMap[category] || 'other',
                image: image,
                price: parseFloat(price),
                stock: parseInt(stock),
                category: category,
                brand: $('#addBrand').val(),
                description: $('#addDescription').val().trim() || 'Chưa có mô tả',
                status: 'active',
                createdAt: new Date().toISOString(),
                warehouseLogs: [{
                    date: new Date().toLocaleString('vi-VN'),
                    type: 'import',
                    qty: parseInt(stock),
                    note: 'Khởi tạo sản phẩm mới',
                    user: getCurrentAdminName()
                }],
                priceHistory: [{
                    date: new Date().toLocaleDateString('vi-VN'),
                    price: parseFloat(price),
                    reason: 'Giá khởi tạo',
                    user: getCurrentAdminName()
                }]
            };

            const products = getProducts();
            products.unshift(newProduct);
            localStorage.setItem('products', JSON.stringify(products));

            $('#modalProduct input, #modalProduct textarea').val('').removeClass('is-valid is-invalid');
            $('#addImgPreview').attr('src', 'https://via.placeholder.com/150');
            $('#addCategory').prop('selectedIndex', 0).trigger('change');
            alert('Thêm sản phẩm mới thành công!');
            $('#modalProduct').modal('hide');
            renderProductTable();
        });
    };

    const handleEditProduct = () => {
        $('#editProductImage').on('input', function () {
            const url = $(this).val().trim();
            $('#editProductPreview').attr('src', url || 'https://via.placeholder.com/150');
        });

        $(document).off('click', '.btn-edit-product').on('click', '.btn-edit-product', function () {
            const targetId = String($(this).data('id'));
            const products = getProducts();
            const product = products.find(p => String(p.id) === targetId);

            if (!product) return alert("Lỗi: Không tìm thấy sản phẩm!");

            $('#modalProductDetail').attr('data-current-id', targetId);
            $('#detailProductName').text(product.title || 'Chưa có tên');
            $('#editProductName').val(product.title || '');
            $('#editProductImage').val(product.image || '');
            $('#editProductPreview').attr('src', product.image || "https://via.placeholder.com/150");
            $('#editProductPrice').val(product.price || '');
            $('#editProductCategory').val(product.category || 'dien-thoai');
            $('#editProductStatus').val(product.status || 'active');
            $('#editProductDesc').val(htmlToPlainText(product.description));
            $('#currentStockDisplay').text(product.stock || 0);

            renderPriceHistory(product);
            renderWarehouseHistory(product);
        });

        $(document).off('click', '#btnUpdateProductGeneralInfo').on('click', '#btnUpdateProductGeneralInfo', function () {
            const currentId = $('#modalProductDetail').attr('data-current-id');
            const products = getProducts();
            const index = products.findIndex(p => String(p.id) === currentId);

            if (index !== -1) {
                const $titleInput = $('#editProductName');
                const $imageInput = $('#editProductImage');
                const $priceInput = $('#editProductPrice');

                const title = $titleInput.val().trim();
                const image = $imageInput.val().trim();
                const price = $priceInput.val();
                const category = $('#editProductCategory').val();

                let isValid = true;

                if (!title) {
                    showError($titleInput, 'Tên không được để trống');
                    isValid = false;
                } else {
                    showSuccess($titleInput);
                }

                if (!image) {
                    showError($imageInput, 'Link ảnh không được để trống');
                    isValid = false;
                } else {
                    showSuccess($imageInput);
                }

                if (!price || price <= 0) {
                    showError($priceInput, 'Giá phải > 0');
                    isValid = false;
                } else {
                    showSuccess($priceInput);
                }

                if (!isValid) return;

                const oldPrice = products[index].price;
                const newPrice = parseFloat(price);

                products[index].title = title;
                products[index].slug = createSlug(title);
                products[index].categorySlug = categorySlugMap[category] || 'other';
                products[index].image = image;
                products[index].price = newPrice;
                products[index].category = category;
                products[index].status = $('#editProductStatus').val();
                products[index].description = $('#editProductDesc').val().trim();

                if (oldPrice !== newPrice) {
                    if (!products[index].priceHistory) products[index].priceHistory = [];
                    products[index].priceHistory.unshift({
                        date: new Date().toLocaleString('vi-VN'),
                        price: newPrice,
                        reason: 'Cập nhật thông tin hệ thống',
                        user: getCurrentAdminName()
                    });
                }

                localStorage.setItem('products', JSON.stringify(products));
                alert('Cập nhật thông tin thành công!');
                $('#modalProductDetail').modal('hide');
                renderProductTable();
            }
        });

        $(document).off('click', '#btnUpdateWarehouse').on('click', '#btnUpdateWarehouse', function () {
            const currentId = $('#modalProductDetail').attr('data-current-id');
            const type = $('#logType').val();
            const $qtyInput = $('#logQty');
            const qty = parseInt($qtyInput.val());
            const note = $('#logNote').val().trim() || 'Giao dịch kho';

            if (isNaN(qty) || qty <= 0) {
                alert('Vui lòng nhập số lượng > 0');
                return;
            }

            const products = getProducts();
            const index = products.findIndex(p => String(p.id) === currentId);

            if (index === -1) return alert("Lỗi: Không tìm thấy sản phẩm!");

            let currentStock = parseInt(products[index].stock || 0);

            if (type === 'export' && qty > currentStock) {
                alert(`Lỗi: Vượt quá tồn kho hiện có (${currentStock} chiếc)`);
                return;
            }

            const newStock = (type === 'import') ? (currentStock + qty) : (currentStock - qty);
            products[index].stock = newStock;

            const newLog = {
                date: new Date().toLocaleString('vi-VN'),
                type: type,
                qty: qty,
                note: note,
                user: getCurrentAdminName()
            };

            if (!products[index].warehouseLogs) products[index].warehouseLogs = [];
            products[index].warehouseLogs.unshift(newLog);

            localStorage.setItem('products', JSON.stringify(products));

            $('#currentStockDisplay').text(newStock);
            $qtyInput.val('');
            $('#logNote').val('');

            renderWarehouseHistory(products[index]);
            renderProductTable();

            alert("Ghi sổ kho thành công!");
        });
    };

    const renderPriceHistory = (product) => {
        const $tbody = $('#priceHistoryBody');
        $tbody.empty();
        (product.priceHistory || []).forEach((h, idx) => {
            $tbody.append(`
                <tr>
                    <td class="small">${h.date}</td>
                    <td class="fw-bold text-danger">${Number(h.price).toLocaleString()}đ</td>
                    <td>${h.reason}</td>
                    <td class="small">${h.user}</td>
                    <td class="text-center text-success">${idx === 0 ? '<i class="bi bi-check-circle-fill"></i>' : ''}</td>
                </tr>
            `);
        });
    };

    const renderWarehouseHistory = (product) => {
        const $tbody = $('#warehouseHistoryBody');
        $tbody.empty();
        const logs = product.warehouseLogs || [];
        if (logs.length === 0) {
            $tbody.html('<tr><td colspan="5" class="text-center py-4 text-muted">Chưa có lịch sử kho.</td></tr>');
            return;
        }
        logs.forEach(log => {
            const isImport = log.type === 'import';
            $tbody.append(`
                <tr>
                    <td class="small text-muted">${log.date}</td>
                    <td><span class="badge ${isImport ? 'bg-success-subtle text-success' : 'bg-danger-subtle text-danger'}">${isImport ? 'Nhập kho (+)' : 'Xuất kho (-)'}</span></td>
                    <td class="fw-bold ${isImport ? 'text-success' : 'text-danger'}">${isImport ? '+' : '-'}${log.qty}</td>
                    <td class="small text-truncate" style="max-width: 150px;">${log.note}</td>
                    <td class="small fw-bold">${log.user}</td>
                </tr>
            `);
        });
    };

    const handleDeleteProduct = () => {
        $(document).off('click', '.btn-delete-product').on('click', '.btn-delete-product', function () {
            const targetId = String($(this).data('id'));
            if (confirm('Xác nhận xóa sản phẩm này khỏi hệ thống?')) {
                const products = getProducts().filter(p => String(p.id) !== targetId);
                localStorage.setItem('products', JSON.stringify(products));
                renderProductTable();
            }
        });
    };

    renderProductTable();
    handleAddNewProduct();
    handleEditProduct();
    handleDeleteProduct();
};