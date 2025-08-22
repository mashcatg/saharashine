(function ($) {
    "use strict";

    const $window = $(window);
    const $body = $('body');

    // PreLoader
    $window.on('load', function () {
        $('#preloader').fadeOut(500);
    });

    // Sticky Header
    $window.on('scroll', function () {
        const scroll = $window.scrollTop();
        $("#header-sticky").toggleClass("header-sticky", scroll >= 400);
    });

    // Header Height Fix
    const $headerHeight = $('.it-header-height');
    if ($headerHeight.length) {
        const headerHeight = $headerHeight[0].offsetHeight;
        $headerHeight.css('height', `${headerHeight}px`);
    }

    // Nice Select
    $('select').niceSelect();

    // Data Attributes
    $("[data-background]").each(function () {
        $(this).css("background-image", `url(${ $(this).data("background") })`);
    });

    $("[data-width]").each(function () {
        $(this).css("width", $(this).data("width"));
    });

    $("[data-bg-color]").each(function () {
        $(this).css("background-color", $(this).data("bg-color"));
    });

    // Accordion
    $(".accordion-items").on("click", function () {
        $(this).toggleClass("active").siblings().removeClass("active");
    });

    // Counter
    if ($(".purecounter").length) {
        new PureCounter({ filesizing: true, selector: ".filesizecount", pulse: 2 });
        new PureCounter();
    }

    // Magnific Popup
    $('.popup-image').magnificPopup({ type: 'image', gallery: { enabled: true } });
    $(".popup-video").magnificPopup({ type: "iframe" });

    // Isotope
    $('.grid').imagesLoaded(function () {
        const $grid = $('.grid').isotope({
            itemSelector: '.grid-item',
            percentPosition: true,
            masonry: { columnWidth: '.grid-item' }
        });

        $('.masonary-menu').on('click', 'button', function (e) {
            e.preventDefault();
            const filterValue = $(this).attr('data-filter');
            $grid.isotope({ filter: filterValue });
            $(this).addClass('active').siblings().removeClass('active');
        });
    });

    // Mobile Menu
    if ($('.it-menu-content').length && $('.it-menu-mobile').length) {
        const navContent = $(".it-menu-content").html();
        $(".it-menu-mobile").html(navContent);

        $(".it-menu-mobile .has-dropdown > a").each(function () {
            const $self = $(this);
            const $btn = $("<button class='dropdown-toggle-btn'><i class='fal fa-angle-right'></i></button>");
            $self.append($btn);

            $btn.on("click", function (e) {
                e.preventDefault();
                const $parent = $(this).parent();
                $parent.toggleClass("expanded");
                $parent.siblings().removeClass("expanded");
                $parent.next(".it-submenu").slideToggle();
            });
        });
    }

    // Scroll to Target
    $window.on('scroll', function () {
        $('.scroll-to-target').toggleClass('open', $window.scrollTop() >= 500);
    });

    $(".scroll-to-target").on('click', function () {
        const target = $(this).data('target');
        $('html, body').animate({ scrollTop: $(target).offset().top }, 1000);
    });

    // Sidebar
    $(".it-menu-bar").on("click", function () {
        $(".itoffcanvas, .body-overlay").addClass("opened apply");
    });

    $(".close-btn, .body-overlay").on("click", function () {
        $(".itoffcanvas, .body-overlay, .search-popup").removeClass("opened apply search-active");
    });

    // Search
    $('.search-box-outer').on('click', function () {
        $('.search-popup').addClass('search-active');
        $(".body-overlay").addClass("apply");
    });

    $('.close-search').on('click', function () {
        $('.search-popup').removeClass('search-active');
        $(".body-overlay").removeClass("apply");
    });

    // WOW Animation
    new WOW({ mobile: true }).init();

    // Cart Quantity
    $('.cart-minus, .cart-plus').on('click', function () {
        const $input = $(this).siblings('input');
        let count = parseInt($input.val(), 10) || 1;
        count = $(this).hasClass('cart-minus') ? Math.max(1, count - 1) : count + 1;
        $input.val(count).trigger('change');
        return false;
    });

    // Checkout Toggles
    $('#showlogin').on('click', () => $('#checkout-login').slideToggle(900));
    $('#cbox').on('click', () => $('#cbox_info').slideToggle(900));
    $('#showcoupon').on('click', () => $('#checkout_coupon').slideToggle(900));

    // Price Range
    $("#slider-range").slider({
        range: true,
        min: 0,
        max: 1200,
        values: [80, 700],
        slide: function (event, ui) {
            $("#amount").val(`$${ui.values[0]} - $${ui.values[1]}`);
        }
    });
    $("#amount").val(`$${$("#slider-range").slider("values", 0)} - $${$("#slider-range").slider("values", 1)}`);

    // WebGL Hover Animation
    if ($('.it-img-anim-wrap').length) {
        $(".it-img-anim").each(function () {
            const $el = $(this);
            const $img = $el.find("img").first();

            const initHover = () => {
                new hoverEffect({
                    parent: $el[0],
                    intensity: $el.data("intensity"),
                    speedIn: $el.data("speedin"),
                    speedOut: $el.data("speedout"),
                    easing: $el.data("easing"),
                    image1: $img.attr("src"),
                    image2: $img.attr("src"),
                    displacementImage: $el.data("displacement"),
                    imagesRatio: $img[0].naturalHeight / $img[0].naturalWidth,
                    hover: false
                });
            };

            if ($img[0].complete) {
                initHover();
            } else {
                $img.on("load", initHover);
            }
        });
    }

    // ScrollSmoother
    gsap.registerPlugin(ScrollTrigger, ScrollSmoother, ScrollToPlugin);
    if ($('#smooth-wrapper').length && $('#smooth-content').length) {
        ScrollSmoother.create({
            smooth: 1.35,
            effects: true,
            smoothTouch: 1,
            normalizeScroll: false,
            ignoreMobileResize: true
        });
    }

    // Split Text Animation
    if ($('.it-split-text').length) {
        gsap.registerPlugin(SplitText);
        $(".it-split-text").each(function () {
            const el = this;
            el.split = new SplitText(el, { type: "lines,words,chars", linesClass: "it-split-line" });
            gsap.set(el, { perspective: 400 });

            let initial = { opacity: 0 };
            if ($(el).hasClass('it-split-in-right')) initial.x = 50;
            if ($(el).hasClass('it-split-in-left')) initial.x = -50;
            if ($(el).hasClass('it-split-in-up')) initial.y = 80;
            if ($(el).hasClass('it-split-in-down')) initial.y = -80;

            gsap.set(el.split.chars, initial);

            gsap.to(el.split.chars, {
                scrollTrigger: { trigger: el, start: "top 90%" },
                x: 0, y: 0, opacity: 1, duration: 0.4, stagger: 0.02
            });
        });
    }

    // Fade Animations
    const fadeItems = gsap.utils.toArray(".it-fade-anim");
    fadeItems.forEach(item => {
        const fadeOffset = parseInt(item.getAttribute("data-fade-offset") || 50, 10);
        const duration = parseFloat(item.getAttribute("data-duration") || 1.15);
        const delay = parseFloat(item.getAttribute("data-delay") || 0.15);
        const ease = item.getAttribute("data-ease") || "power2.out";
        const from = item.getAttribute("data-fade-from") || "bottom";
        const onScroll = parseInt(item.getAttribute("data-on-scroll") || 1, 10);

        let animation = { opacity: 0, duration, delay, ease };
        if (from === "top") animation.y = -fadeOffset;
        if (from === "left") animation.x = -fadeOffset;
        if (from === "bottom") animation.y = fadeOffset;
        if (from === "right") animation.x = fadeOffset;

        if (onScroll) animation.scrollTrigger = { trigger: item, start: 'top 85%' };
        gsap.from(item, animation);
    });

    // One Page Navigation
    $('.it-onepage-menu li a').on('click', function (e) {
        e.preventDefault();
        $(".it-onepage-menu li a").removeClass("active");
        $(this).addClass("active");
        $('html, body').animate({ scrollTop: $($(this).attr('href')).offset().top - 80 }, 300);
    });

})(jQuery);
