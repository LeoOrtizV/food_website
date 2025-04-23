$(document).ready(function ($) {
    "use strict";

    // 1. Configuración de Swipers
    var book_table = new Swiper(".book-table-img-slider", {
        slidesPerView: 1,
        spaceBetween: 20,
        loop: true,
        autoplay: {
            delay: 3000,
            disableOnInteraction: false,
        },
        speed: 2000,
        effect: "coverflow",
        coverflowEffect: {
            rotate: 3,
            stretch: 2,
            depth: 100,
            modifier: 5,
            slideShadows: false,
        },
        loopAdditionSlides: true,
        navigation: {
            nextEl: ".swiper-button-next",
            prevEl: ".swiper-button-prev",
        },
        pagination: {
            el: ".swiper-pagination",
            clickable: true,
        },
    });

    var team_slider = new Swiper(".team-slider", {
        slidesPerView: 3,
        spaceBetween: 30,
        loop: true,
        autoplay: {
            delay: 3000,
            disableOnInteraction: false,
        },
        speed: 2000,
        navigation: {
            nextEl: ".swiper-button-next",
            prevEl: ".swiper-button-prev",
        },
        pagination: {
            el: ".swiper-pagination",
            clickable: true,
        },
        breakpoints: {
            0: {
                slidesPerView: 1.2,
            },
            768: {
                slidesPerView: 2,
            },
            992: {
                slidesPerView: 3,
            },
            1200: {
                slidesPerView: 3,
            },
        },
    });

    // 2. Filtros de menú
    jQuery(".filters").on("click", function () {
        jQuery("#menu-dish").removeClass("bydefault_show");
    });
    
    $(function () {
        var filterList = {
            init: function () {
                $("#menu-dish").mixItUp({
                    selectors: {
                        target: ".dish-box-wp",
                        filter: ".filter",
                    },
                    animation: {
                        effects: "fade",
                        easing: "ease-in-out",
                    },
                    load: {
                        filter: ".all, .breakfast, .lunch, .dinner",
                    },
                });
            },
        };
        filterList.init();
    });

    // 3. Menú toggle
    jQuery(".menu-toggle").click(function () {
        jQuery(".main-navigation").toggleClass("toggled");
    });

    jQuery(".header-menu ul li a").click(function () {
        jQuery(".main-navigation").removeClass("toggled");
    });

    // 4. ScrollTrigger del header (versión mejorada)
    gsap.registerPlugin(ScrollTrigger);
    
    ScrollTrigger.create({
        trigger: "body",
        start: "top top",
        end: "max",
        onUpdate: (self) => {
            const header = document.querySelector('.site-header');
            if (self.scroll() > 30) {
                header.classList.add('sticky_head');
            } else {
                header.classList.remove('sticky_head');
            }
        }
    });

    // 5. Manejo de clics en anclas (para header y footer)
    function handleAnchorClick(e) {
        if (this.getAttribute('href').startsWith('#')) {
            e.preventDefault();
            
            const target = $(this.getAttribute('href'));
            if (target.length) {
                const headerHeight = $('.site-header').outerHeight();
                const targetPosition = target.offset().top - headerHeight;
                
                ScrollTrigger.getAll().forEach(t => t.disable());
                
                $('html, body').stop().animate({
                    scrollTop: targetPosition
                }, 800, 'swing', function() {
                    ScrollTrigger.getAll().forEach(t => t.enable());
                    history.pushState(null, null, e.target.hash);
                });
            }
        }
    }

    // Aplicar a enlaces del menú principal y del footer
    $('.menu a[href^="#"], .footer-menu a[href^="#"]').on('click', handleAnchorClick);

    // 6. Parallax
    var scene = $(".js-parallax-scene").get(0);
    var parallaxInstance = new Parallax(scene);
});

// 7. Código window.onload
jQuery(window).on('load', function() {
    $('body').removeClass('body-fixed');
    
    // Inicializar mixItUp primero
    var filterList = {
        init: function() {
            $("#menu-dish").mixItUp({
                selectors: {
                    target: ".dish-box-wp",
                    filter: ".filter",
                },
                animation: {
                    effects: "fade",
                    easing: "ease-in-out",
                },
                load: {
                    filter: ".all, .breakfast, .lunch, .dinner",
                },
            });
        }
    };
    filterList.init();
    
    // Luego el código de los tabs
    let targets = document.querySelectorAll(".filter");
    let activeTab = 0;
    let old = 0;
    let dur = 0.4;
    let animation;

    for (let i = 0; i < targets.length; i++) {
        targets[i].index = i;
        targets[i].addEventListener("click", moveBar);
    }

    gsap.set(".filter-active", {
        x: targets[0].offsetLeft,
        width: targets[0].offsetWidth
    });

    function moveBar() {
        if (this.index != activeTab) {
            if (animation && animation.isActive()) {
                animation.progress(1);
            }
            animation = gsap.timeline({
                defaults: {
                    duration: 0.4
                }
            });
            old = activeTab;
            activeTab = this.index;
            animation.to(".filter-active", {
                x: targets[activeTab].offsetLeft,
                width: targets[activeTab].offsetWidth
            });

            animation.to(targets[old], {
                color: "#0d0d25",
                ease: "none"
            }, 0);
            animation.to(targets[activeTab], {
                color: "#fff",
                ease: "none"
            }, 0);
        }
    }
});