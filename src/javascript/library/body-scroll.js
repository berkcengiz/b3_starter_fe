var lastScrollTop = 0;
$(window).scroll(function (event) {
    var st = $(this).scrollTop();
    if (st > lastScrollTop) {
        $("body").addClass("scroll-down").removeClass("scroll-up");
    } else {
        $("body").removeClass("scroll-down").addClass("scroll-up");
    }
    lastScrollTop = st;
});
