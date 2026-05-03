export const initNewsDetail = () => {
    const allNews = JSON.parse(localStorage.getItem('news')) || [];
    const pathParts = window.location.pathname.split('/');
    const newsId = pathParts[pathParts.length - 1];

    const news = allNews.find(item => item.id === newsId);

    if (!news) {
        $('.article-container').html(`
            <div class="text-center py-5">
                <h3>Không tìm thấy bài viết</h3>
                <a href="/news" class="btn btn-danger mt-3">Quay lại trang tin tức</a>
            </div>
        `);
        return;
    }

    $('.article-header__bg').attr('src', news.thumbnail);
    $('.breadcrumb-item.active').text(news.category);
    $('.article-content-card .badge').text(news.category);
    $('.article-content-card h1').text(news.title);
    $('.article-meta p.fw-bold').text(news.author);
    $('.article-meta .text-muted').html(`<i class="bi bi-clock me-1"></i> ${news.date}`);

    $('.article-body').html(`
        <p class="fw-bold fs-5">${news.summary}</p>
        <div class="mt-4">
            ${news.content}
        </div>
    `);

    const relatedNews = allNews
        .filter(item => item.category === news.category && item.id !== news.id)
        .slice(0, 3);

    const $relatedContainer = $('.row.g-3');
    $relatedContainer.empty();
    
    if (relatedNews.length > 0) {
        relatedNews.forEach(item => {
            $relatedContainer.append(`
                <div class="col-md-4">
                    <a href="/news/detail/${item.id}" class="text-decoration-none text-dark">
                        <div class="card border-0 shadow-sm h-100">
                            <img src="${item.thumbnail}" class="card-img-top rounded" alt="${item.title}" style="height: 150px; object-fit: cover;">
                            <div class="card-body px-0">
                                <h6 class="fw-bold mb-0 line-clamp-2">${item.title}</h6>
                                <small class="text-muted">${item.date}</small>
                            </div>
                        </div>
                    </a>
                </div>
            `);
        });
    } else {
        $relatedContainer.closest('section').hide();
    }

    const categorySlugs = {
        'Tin công nghệ': 'tin-cong-nghe',
        'Games': 'games',
        'Mẹo vặt': 'meo-vat',
        'Trên tay': 'tren-tay'
    };

    $('.sidebar-menu .nav-link').each(function() {
        const text = $(this).find('span').text().trim() || $(this).text().trim();
        
        if (categorySlugs[text]) {
            $(this).attr('href', `/news?category=${categorySlugs[text]}`);
        } else if (text === "Trang chính") {
            $(this).attr('href', '/news');
        }

        if (text === news.category) {
            $('.sidebar-menu .nav-link').removeClass('active');
            $(this).addClass('active');
        }
    });
};