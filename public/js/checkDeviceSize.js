/**********************************************************************************
    반응형 관련 Device 사이즈 체크

    isChangedDeviceSize: Device 사이즈가 변경된 시점을 반환 (return Boolean)
    getCurrentSize: 현재의 Device 정보를 반환 (return String)
**********************************************************************************/
define([
  'jquery'
  ,'device'
], function($, DEVICE){
  var checkDeviceSize = (function(){
      var userScreenSize = $(window).width();
      var oldScreenSize = newScreenSize = getUserDeviceType();
      var isChangedDeviceSize = checkedChangeDeviceSize();
      initialize();

      function initialize(){
          $(window).resize( function(){
              newScreenSize = getUserDeviceType();
              isChangedDeviceSize = checkedChangeDeviceSize();
          });

      }
      function getUserDeviceType(){
          userScreenSize = $(window).width();

          if(userScreenSize > DEVICE.SIZE.TABLET){
            //Device: PC
            return DEVICE.NAME.PC;
          } else if(userScreenSize <= DEVICE.SIZE.TABLET && userScreenSize > DEVICE.SIZE.MOBILE){
            //Device: Tablet
            return DEVICE.NAME.TABLET;
          } else if (userScreenSize <= DEVICE.SIZE.MOBILE){
            //Device: Mobile
            return DEVICE.NAME.MOBILE;
          }
      }

      function checkedChangeDeviceSize(){
        if(newScreenSize == oldScreenSize) {
            return false;
        } else {
            oldScreenSize = newScreenSize;
            return true;
        }
      }

      return {
          initialize:initialize,
          isChangedDeviceSize: function(){
            return isChangedDeviceSize;
          },
          getCurrentSize : function(){
            return getUserDeviceType();
          }
      };
  }());

  return checkDeviceSize;
});
