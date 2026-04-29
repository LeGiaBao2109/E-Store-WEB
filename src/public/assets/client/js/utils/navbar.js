export function initNavbar() {
    const $menuToggle = $('#menuToggle');
    const $headerBottom = $('.header-bottom');
    
    if ($menuToggle.length && $headerBottom.length) {
        $menuToggle.click(function (e) {
            e.stopPropagation();
            $headerBottom.stop().slideToggle(300); 
        });

        $(document).click(function (e) {
            if (!$headerBottom.is(e.target) && $headerBottom.has(e.target).length === 0 && !$menuToggle.is(e.target) && $menuToggle.has(e.target).length === 0) {
                if ($headerBottom.is(':visible') && window.innerWidth <= 991) {
                    $headerBottom.stop().slideUp(300);
                }
            }
        });

        $(window).resize(function() {
            if (window.innerWidth > 991) {
                $headerBottom.css('display', '');
            }
        });
    }

    const $btnSearch = $('#btnSearch');
    const $searchInput = $('#searchInput');

    if ($btnSearch.length && $searchInput.length) {
        $btnSearch.click(function (e) {
            e.preventDefault();
            
            const keyword = $searchInput.val().trim();

            if (keyword !== "") {
                window.location.href = `/products/?search=${encodeURIComponent(keyword)}`;
            } else {
                $searchInput.focus();
            }
        });

        $searchInput.keypress(function (e) {
            if (e.which === 13) {
                $btnSearch.click();
            }
        });
    }
}