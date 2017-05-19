/**
 * Created by wangyonghao on 2017/5/11.
 */
define('login' ,['jquery', 'initSDK'], function ($, initSDK) {


    checkLogin();


    function checkLogin() {
        if (!localStorage.token) {
            $(".login").css('display', 'block');
            $(".content").css('display', 'none');
            bindLogin();
        } else {
            showContent();
            initSDK.init();
        }
    }

    function bindLogin() {
        $(".login-btn").click(function () {
            var appkey = $(".app-key").val();
            var token = $(".token").val();
            var sendId = $(".send-id").val();
            window.localStorage.appKey = appkey;
            window.localStorage.token = token;
            window.localStorage.sendId = sendId;
        })
    }


    function showContent() {
        $(".login").css('display', 'none');
        $(".content").css('display', 'block');

    }

});