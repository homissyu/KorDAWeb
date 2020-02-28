$(document).ready(function(){
  
  // fullpage customization
  $('#fullpage').fullpage({
    sectionSelector: '.section',
    navigation: false,
    slidesNavigation: true,
    css3: true,
    menu: '#menu',
    controlArrows: true 
    

  }); 
  
});








//  ㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡ //




define([
  'jquery'
  ,'fullPage'
  ,'checkDeviceSize'
  ,'device'
], function($, fullpage, checkDeviceSize, DEVICE) {
  $(window).resize( function(){
      var isBindEventPoint = checkDeviceSize.isChangedDeviceSize()
      if(isBindEventPoint){
          parellaxScroll.setDeviceFunction();
      }
  });

  $(document).ready( function(){
    $('.loading-dim').animate({
      "opacity": 0
    }, 1000);
    setTimeout(function(){
      $('.loading-dim').remove();
    },1001)
  })


  var parellaxScroll = (function(){
      bindParallax();
      function setDeviceFunction(){
          var currentDevice = checkDeviceSize.getCurrentSize();
          switch(currentDevice){
              //PC일 경우
              case DEVICE.NAME.PC : start()
              break;
              //Tablet일 경우
              case DEVICE.NAME.TABLET : start()
              break;
              //Mobile일 경우
              case DEVICE.NAME.MOBILE : stop()
              break;
          }
      }

      function bindParallax(){
          $('.contents').fullpage({
              anchors: ['is-first', 'is-second', 'is-third', 'is-fourth','is-fifth','is-sixth', 'is-seventh','is-eighth'],
              css3: true,
              onLeave: function(index, nextIndex, direction){
                  var currentIndex = nextIndex-1;
                  var beforeIndex = index-1;
                  var currentNavigation = $('.left-menu-bar__category-list').find('li')[currentIndex];

                  currentNavigation = (function(){
                      switch(true) {
                          case (currentIndex == 0) :
                              return $('.left-menu-bar__category-list').find('li')[0];
                              break;
                          case (1 <= currentIndex && currentIndex < 6 ) :
                              return $('.left-menu-bar__category-list').find('li')[1];
                              break;
                          case (currentIndex == 6) :
                              return $('.left-menu-bar__category-list').find('li')[2];
                              break;
                          case ( 7 <= currentIndex < 8) :
                              return $('.left-menu-bar__category-list').find('li')[3];
                              break;
                      }
                  })();

                  $('.left-menu-bar__category-list').find('li').removeClass("active");
                  $(currentNavigation).addClass("active");
              }
          });
      }


      function start(){
          $('.contents').fullpage.setResponsive(false);
      }
      function stop(){
          $('.contents').fullpage.setResponsive(true);
      }
      return {
          bindParallax: bindParallax,
          setDeviceFunction: setDeviceFunction
      }
  })();

  return parellaxScroll
});





