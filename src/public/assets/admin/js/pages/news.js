export const initNews = () => {
    const $newsTableBody = $('#newsTableBody');

    const getNews = () => JSON.parse(localStorage.getItem('news')) || [];

    const getCurrentAuthor = () => {
        const user = JSON.parse(localStorage.getItem('currentUser'));
        return user ? user.fullName : 'Lê Gia Bảo';
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

    const renderNewsTable = () => {
        const news = getNews();
        $newsTableBody.empty();

        if (news.length === 0) {
            $newsTableBody.html('<tr><td colspan="5" class="text-center p-4 text-muted">Chưa có bài viết nào.</td></tr>');
            return;
        }

        news.forEach((item) => {
            $newsTableBody.append(`
                <tr>
                    <td class="ps-4">
                        <div class="d-flex align-items-center">
                            <img src="${item.thumbnail}" class="rounded shadow-sm me-3" style="width: 80px; height: 50px; object-fit: cover;" onerror="this.src='https://placehold.co/150x100?text=No+Image'">
                            <div>
                                <h6 class="mb-0 fw-bold text-truncate" style="max-width: 250px;">${item.title}</h6>
                                <small class="text-muted d-block small">ID: ${item.id}</small>
                            </div>
                        </div>
                    </td>
                    <td class="text-center">
                        <span class="badge rounded-pill bg-danger-subtle text-danger border border-danger-subtle">${item.category}</span>
                    </td>
                    <td class="text-center small text-muted">${item.date}</td>
                    <td class="text-center small fw-bold">${item.author}</td>
                    <td class="text-end pe-4">
                        <div class="btn-group">
                            <button class="btn btn-sm btn-light border btn-edit-news" data-id="${item.id}" data-bs-toggle="modal" data-bs-target="#modalNews">
                                <i class="bi bi-pencil-square text-primary"></i>
                            </button>
                            <button class="btn btn-sm btn-light border btn-delete-news" data-id="${item.id}">
                                <i class="bi bi-trash text-danger"></i>
                            </button>
                        </div>
                    </td>
                </tr>
            `);
        });
    };

    const handleNewsEvents = () => {
        $(document).on('input change', '#newsThumbnail', function () {
            const url = $(this).val().trim();
            $('#imgNewsPreview').attr('src', url || 'https://placehold.co/600x400?text=Xem+trước+ảnh');
        });

        $(document).off('click', '#btnSaveNews').on('click', '#btnSaveNews', function (e) {
            e.preventDefault();

            const titleEl = document.getElementById('newsTitle');
            const thumbnailEl = document.getElementById('newsThumbnail');
            const contentEl = document.getElementById('newsContent');
            const summaryEl = document.getElementById('newsSummary');

            const title = titleEl.value.trim();
            const thumbnail = thumbnailEl.value.trim();
            const content = contentEl.value.trim();
            const summary = summaryEl.value.trim();
            const category = $('#newsCategory').val();
            const id = $('#newsId').val();

            console.log("Dữ liệu bốc được:", {
                title,
                thumbnail,
                content
            });

            let isValid = true;

            if (!title) {
                showError($('#newsTitle'), 'Tiêu đề không được để trống');
                isValid = false;
            } else {
                showSuccess($('#newsTitle'));
            }

            if (!thumbnail) {
                showError($('#newsThumbnail'), 'Link ảnh không được để trống');
                isValid = false;
            } else {
                showSuccess($('#newsThumbnail'));
            }

            if (!content) {
                showError($('#newsContent'), 'Nội dung không được để trống');
                isValid = false;
            } else {
                showSuccess($('#newsContent'));
            }

            if (!isValid) return;

            const newsData = {
                title: title,
                thumbnail: thumbnail,
                summary: summary,
                content: content,
                category: category,
                author: getCurrentAuthor(),
                date: new Date().toLocaleDateString('vi-VN')
            };

            let newsList = getNews();

            if (id) {
                const index = newsList.findIndex(n => String(n.id) === String(id));
                if (index !== -1) newsList[index] = {
                    ...newsList[index],
                    ...newsData
                };
            } else {
                newsData.id = `N-${Date.now()}`;
                newsList.unshift(newsData);
            }

            localStorage.setItem('news', JSON.stringify(newsList));

            $('#formNews')[0].reset();
            $('#formNews input, #formNews textarea').removeClass('is-valid is-invalid');
            $('#imgNewsPreview').attr('src', 'https://placehold.co/600x400?text=Xem+trước+ảnh');

            alert('Lưu bài viết thành công!');

            const modalElement = document.getElementById('modalNews');
            const modalInstance = bootstrap.Modal.getInstance(modalElement) || new bootstrap.Modal(modalElement);
            modalInstance.hide();

            renderNewsTable();
        });

        $(document).on('click', '.btn-edit-news', function () {
            const targetId = String($(this).data('id'));
            const item = getNews().find(n => String(n.id) === targetId);

            if (item) {
                $('#modalNewsLabel').text('CHỈNH SỬA BÀI VIẾT');
                $('#newsId').val(item.id);
                $('#newsTitle').val(item.title);
                $('#newsThumbnail').val(item.thumbnail);
                $('#imgNewsPreview').attr('src', item.thumbnail);
                $('#newsCategory').val(item.category);
                $('#newsSummary').val(item.summary);
                $('#newsContent').val(item.content);
                $('#newsAuthor').val(item.author);
            }
        });

        $(document).on('click', '.btn-delete-news', function () {
            const targetId = String($(this).data('id'));
            if (confirm('Xác nhận xóa bài viết này?')) {
                const updated = getNews().filter(n => String(n.id) !== targetId);
                localStorage.setItem('news', JSON.stringify(updated));
                renderNewsTable();
            }
        });

        $('[data-bs-target="#modalNews"]').on('click', function () {
            if (!$('#newsId').val()) {
                $('#newsAuthor').val(getCurrentAuthor());
            }
        });
    };

    renderNewsTable();
    handleNewsEvents();
};