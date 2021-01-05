// Function maskphonee
function initMaskPhone(){
    $('input[type="tel"]').mask("+7 (999) 999-99-99");
}

// Function headerfix and clone
function initHeaderFixed(){
    function onFixed(BF) {
        BF.addClass('is-fixed');
        $('.fixed-phone').addClass('col-md-12');   
    }

    function offFixed(BF) {
        BF.removeClass('is-fixed');
        $('.fixed-phone').removeClass('col-md-12');
    }

    function blockFixed(BF) {
        var $t = $(".block-fixed");
        var fixedHeight = $(".wpar-fixed").children(".block-fixed").outerHeight(),
            fixedTop = $t.offset().top,
            topScroll = fixedTop + fixedHeight;

        $(".wpar-fixed").height(fixedHeight);

        $(window).on('scroll resize', function () {
            if ($(this).scrollTop() > topScroll) {
                onFixed($t);
            } else if ($(this).scrollTop() < 20) {
                offFixed($t);
            }
        });
    }

    if ($('*').is('.block-fixed')) {
        $('.block-fixed').wrapAll('<div class="wpar-fixed"></div>');
        blockFixed();
        $(window).on('resize', blockFixed);
    }
    
    function headerClone(){
        var hMain = $('.header:not(.is-clone)'),
        hClone = $('.header.is-clone'),
        hMainHeight = hMain.innerHeight(),
        topHeight = hMain.offset().top + hMainHeight,
        hCloneHeight = hClone.innerHeight(),
        hAll = Number(hMainHeight + hCloneHeight);
        $('.header.is-clone').css({
            "top": "-" + hAll + "px"
        });

        $(window).scroll(function () {
            if ($(this).scrollTop() > topHeight) {
                $('.header.is-clone').addClass('is-fixed');
            } else {
                $('.header.is-clone').removeClass('is-fixed');
                $('.header.is-clone').css({
                    "top": "-" + hAll + "px"
                });
            }
        });
    }
    headerClone();
}

// Function owl-carousel
function initOwlCarousel(){
    function set_value(carousel, value, default_value) {
        var value = (carousel.data(value) || carousel.data(value) == false) ? carousel.data(value) : default_value;
        return value;
    }
    $(document).ready(function () {
        var owl = $(".carousel");
        owl.each(function (i) {
            var $t = $(this),
                options = {
                    items: $t.data('items') || 1, //attr('data-items')
                    margin: Number($t.data('margin')) || 15,
                    loop: $t.data('loop') ? $t.data('loop') : true,
                    nav: set_value($t, 'nav', true),
                    navText: ['', ''], //['<i class="fa fa-angle-left"></i>','<i class="fa fa-angle-right"></i>'],
                    dots: set_value($t, 'dots', false),
                    autoplay: set_value($t, 'autoplay', false),
                    autoplayTimeout: 2000,
                    autoplaySpeed: 1000,
                    animateOut: set_value($t, 'animate', false),
                    //animateIn: "fade",     
                    //navContainer: false,
                    stageOuterClass: 'carousel__content',
                    stageClass: 'carousel__inner',
                    navContainerClass: 'carousel__nav',
                    navClass: ['carousel__nav-item carousel__nav-item--prev', 'carousel__nav-item carousel__nav-item--next'],
                    dotsClass: 'carousel__dots',
                    dotClass: 'carousel__dots-item',
                    responsive: {},
                    autoHeight: true
                };

                
            if ($t.data('animate') == "fade") options.mouseDrag = false;

            var maxWidth = $t.data('max-width') ? $t.data('max-width') : 1200,
                itemSize = maxWidth / (options.items - 1);

            $t.attr('id', 'owl-carousel-' + i); // addId

            if ($(this).hasClass('slider')) {
                options.navContainerClass += ' carousel__nav--slider';
            }

            if ($(this).hasClass('slider--widget')) {
                options.navContainerClass += ' carousel__nav--slider-widget';
                options.dotsClass += ' carousel__dots--slider-widget';
            }

            if (options.items > 1) {
                for (var i = 0; i <= options.items - 1; i++) {
                    var key = String(itemSize * i);
                    options.responsive[key] = {
                        items: i + 1
                    };
                }
            }

            $t.owlCarousel(options);
        });
    });
}

// Function scrollanchor
function initScrollAnchor(){
    var maskClick = "#anchor-";//"#anchor-";
    $('[href*="' + maskClick + '"]').on('click', function(e) {
           var itemId = $(this).attr("href"),
            strName = itemId.replace('#',''),
            itemName = '[name=' + strName + ']';;
        if ( $('*').is(itemId) || $('*').is(itemName) ) {
            //console.log(itemName);
            var item = $('*').is(itemId) ? itemId : itemName,
            itemTop = $(item).offset().top,
            blockFixed = $(document).width() >= 768 ? ".header-clone" : ".header-mobile",
            heightHeader = $(blockFixed).outerHeight(),
            destination = itemTop - heightHeader;
            console.log(blockFixed + ' ' + heightHeader);
            
            $("html:not(:animated),body:not(:animated)").animate({scrollTop: destination}, 800);
        }
        return false;
    });
}
// Function slick-carousell
function initSlickCarousel(slideName,rows,showItems){
    $(slideName).each(function(index, element){
		var slider = $(this);
        slider.slick({
            centerMode: false,
			dots: false,
			
			arrows: true,
			nextArrow: `<button class="${String(slideName).slice(1).concat('--next')}"></button>`,
        	prevArrow: `<button class="${String(slideName).slice(1).concat('--prev')}"></button>`,
            infinite: true,
            autoplay: false,
            speed: 1500,
            autoplaySpeed: 150,
            slidesToShow: 7,
            slidesToScroll: 1,
            rows: rows,
            mobileFirst: true,
            responsive: 
            [
                {
                    breakpoint: 320,
                    settings: {
                        slidesToShow: 1,
                        slidesToScroll: 1,
                        rows: rows
                    }
                },
                {
                    breakpoint: 992,
                    settings: {
                        slidesToShow: 3,
                        slidesToScroll: 3,
                        rows: rows
                    }
                },
                {
                    breakpoint: 1199,
                    settings: {
                        slidesToShow: showItems || 3,
                        slidesToScroll: 3,
                        rows: rows
                    }
                }
            ]
        });
		
    });

}

// Function c-slide-nav
function initSlideMenu(){
    //-----------------События для фильтр-меню----------------------------------
    // $(".wrap-filter-form").clone().prependTo(".c-slide__wrapper");
    var button = $('.c-slide-nav__button-link');
    var slider = $('.c-slide-nav');

    button.on('click', function (e) {
        e.preventDefault();
        var dataControl = $(this).data('control');
        slider.removeClass('--is-active');
        $('.c-slide-nav[data-control=' + dataControl + ']').show();
        $('.c-slide-nav[data-control=' + dataControl + ']').addClass('--is-active');
    });
    // --------------------------------------------------------------------------

    // ----------------------------------------------------------
    $('.c-slide-nav__open-list').on('click', function () { // Событие для открытия итемов в UL
        var list = $(this).next();
        list.slideToggle('slow');
        $('.c-slide-nav__open-list').toggleClass('--minus');
    });
    // --------------------------------------------------------------------------

    $('.c-slide-nav__close-menu').on('click', function () { // Событие для закрытия слайдера
        $('.c-slide-nav').removeClass('--is-active');
    });

    $(document).mouseup(function (e) {
        var div = $(".c-slide-nav");
        if (!div.is(e.target) &&
            div.has(e.target).length === 0) {
            $('.c-slide-nav').removeClass('--is-active');
        }
    });
}

// Function mobile menu slide
function initMobileSlideMenu(){
    $('[data-control="menu-burger"]').on('click', function (e) {
        e.preventDefault();
        var menu = $('.header-mobile__nav');
        menu.slideToggle();
    });
}

// Function hideProduct
function initHideProduct(){
    $('.c-hidden__btn').on('click', function(e){
        e.preventDefault();
        $('.c-hidden').slideToggle();
        $('.c-hidden__btn').toggleClass('c-hidden__btn--active');
        // $('.c-hidden__btn').text('Скрыть');
    });
}

// Function for modal
function initModalScript(){
    var modal = $('.c-modal__container');
    var close = $('.c-form-message__item--close');

    close.on('click', function (e){
        e.preventDefault();
        modal.fadeOut(300);
    });
}

// Function arrow footer
function initArrowBtn(){
    var scrollBtn = $('.btn-scroll');
    scrollBtn.on('click', function(e) {
        e.preventDefault();
        $("html:not(:animated),body:not(:animated)").animate({scrollTop: 0}, 800);
    });
}

// Function choose-tabs
function initChooseTabs(){
    var btn = $('.c-gallery__nav-link');
    var content = $('.slide-content');
    btn.on('click', function(e){
        e.preventDefault();
        var count = $(this).data('slide');

        function showTab(content, dataTab){
            content.each(function(array, mas){
                $(this).css({opacity: 0.6}, 500);
                if(dataTab === array){
                    $(this).animate({opacity: 1}, 1000);
                    $(this).css({display: 'block'});
                }else{
                    $(this).css({display: 'none'});
                    $(this).animate({opacity: 0.25}, 500);
                }
            });
        }
        showTab(content, count);
    });
}