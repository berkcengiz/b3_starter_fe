function Cookie() {
    $(window).scroll(function () {
        var scroll = $(window).scrollTop();
        if (scroll >= 96) {
            if (
                !localStorage.getItem("cookie") ||
                localStorage.getItem("cookie") !== "true"
            ) {
                $(".cookie").addClass("show");
            }
            $(".cookie .cookie-close").on("click", function () {
                localStorage.setItem("cookie", true);
                $(".cookie").removeClass("show");
            });
            $(".cookie .cookie-close").click(function () {
                $(".cookie").removeClass("show");
            });
        }
    });
}
Cookie();
