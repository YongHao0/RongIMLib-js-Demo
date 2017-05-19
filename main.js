/**
 * Created by wangyonghao on 2017/5/11.
 */
require.config({
    paths: {
        'protobuf': '//cdn.ronghub.com/protobuf-2.1.5.min',
        'Libamr': 'https://cdn.ronghub.com/Libamr-2.2.5.min',
        'RongIMVoice': 'https://cdn.ronghub.com/RongIMVoice-2.2.5.min',
        'jquery': 'lib/jquery-3.0.0',
        'login': 'js/login',
        'RongIMLib': 'lib/RongIMLib-2.2.5',
        'initSDK': 'js/initSDK',
        'conversation': 'js/conversation',
        'talk': 'js/talk',
        'RongIMEmoji': 'lib/RongEmoji-2.2.5',
        'sendMessage': 'js/sendMessage',
        'uploadFile': 'js/upload'
    }
});

require(['jquery', 'protobuf', 'RongIMLib', 'Libamr', 'RongIMVoice', 'RongIMEmoji', 'uploadFile', 'sendMessage', 'talk', 'conversation', 'initSDK', 'login'],
    function ($, protobuf, RongIMLib, Libamr, RongIMVoice, RongIMEmoji, uploadFile, sendMessage, talk, conversation, initSDK, login) {


});