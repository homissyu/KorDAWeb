/**********************************************************************************
    LeftBanner 기능에 관련 스크립트
**********************************************************************************/
define([
    'jquery'
    ,'jqueryEasing'
    ,'checkDeviceSize'
    ,'device'
], function($, jqueryEasing, checkDeviceSize, DEVICE) {
    $(window).resize( function(){
        var isBindEventPoint = checkDeviceSize.isChangedDeviceSize()
        if(isBindEventPoint){
            leftBanner.setDeviceFunction();
        }
    });

    var leftBanner = (function(){
        var obj=null;
        var isLeftMenuActive = false;

        function initialize(options){
            setSelector(options);
            setDeviceFunction();
        }

        function setDeviceFunction(){
            var currentDevice = checkDeviceSize.getCurrentSize();

            switch(currentDevice){
                //PC일 경우
                case DEVICE.NAME.PC : initializeForPc()
                break;
                case DEVICE.NAME.TABLET : initializeForPc();
                break;
                //Mobile일 경우
                case DEVICE.NAME.MOBILE : initializeForMobile();
                break;
            }
        }

        function setSelector(dom){
            obj = {
                leftMenuWrapper: $(dom.leftMenuWrapper),
                leftMenuButton:  $(dom.leftMenuButton),
                leftToggleButton: $(dom.leftToggleButton),
                moblieGnbOpenButton: $(dom.moblieGnbOpenButton),
                mobileLeftBannerDim: $(dom.mobileLeftBannerDim)
            }
        }

        function initializeForPc(){
            obj.leftMenuWrapper.removeClass("hide");
            bindEvents();

            function bindEvents(){
                obj.leftMenuButton.unbind("click").on('click', function() { moveDirectContents( $(this) ) });
            }

        }

        function initializeForTablet(){
            toggleDim(false);
            isLeftMenuActive=false;
            obj.leftMenuWrapper.addClass("hide").removeClass("show");
            bindEvents();

            function bindEvents(){
                obj.leftToggleButton.unbind("click").on('click', function(){ toggleLeftMenu(); });
                obj.leftMenuButton.unbind("click").on('click', function(){
                    toggleLeftMenu();
                    moveDirectContents($(this));
                });
            }
        }

        function initializeForMobile(){
            isLeftMenuActive=false;
            obj.leftMenuWrapper.addClass("hide").removeClass("show");
            bindEvents();

            function bindEvents(){
                obj.moblieGnbOpenButton.unbind("click").on('click', function(){
                    toggleDim(true);
                    toggleLeftMenu();
                });
                obj.leftMenuButton.unbind("click").on('click', function(){
                    toggleDim(false);
                    toggleLeftMenu();
                    moveScrollTop( $(this) );
                });
                obj.mobileLeftBannerDim.unbind("click").on("click", function(){
                    toggleDim(false);
                    toggleLeftMenu();
                });
                $(".left-menu-bar--active-btn").unbind("click").on("click", function(){
                    toggleDim(false);
                    toggleLeftMenu();
                });
            }
        }

        function toggleDim(isActive){
            if(isActive){
                $('.left-menu-bg--is-mobile').addClass("active");
            } else {
                $('.left-menu-bg--is-mobile').removeClass("active");
            }
        }

        function toggleLeftMenu(){
            if(isLeftMenuActive){
                obj.leftMenuWrapper.addClass("hide").removeClass("show");
                isLeftMenuActive = false;
            } else {
                obj.leftMenuWrapper.removeClass("hide").addClass("show");
                isLeftMenuActive = true;
            }
        }

        function moveDirectContents($targetElement){
            var targetPoint = $targetElement.data('tooltip');

            $('.contents').fullpage.moveTo(targetPoint);
        }

        function moveScrollTop($targetElement){
            var scrollPoint = $('#' + $targetElement.data("scroll-point")).offset().top;
            var extraHeight = 51;

            $('document, body').animate({
                'scrollTop': scrollPoint - extraHeight + 'px'
            }, {
                "duration" : 1000,
                "easing" : "easeOutQuart"
            })
        }

       return {
           initialize: initialize,
           setDeviceFunction: setDeviceFunction
       }
    }());

    return leftBanner;
});
