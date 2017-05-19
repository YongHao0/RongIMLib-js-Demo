/**
 * Created by wangyonghao on 2017/5/12.
 */
define('sendMessage', ['jquery', 'RongIMLib'], function ($, RongIMLib) {

    var RongIMClient = RongIMLib.RongIMClient;
    

    function sendMessage(SendClass, paramObj, targetId, callback) {
        var conversationType = getSendType();
        var msg = new SendClass(paramObj);
        RongIMClient.getInstance().sendMessage(conversationType, targetId, msg, {
            onSuccess: function (message) {
                callback(message);
                console.log('Send Successfully');
            },
            onError: onError
        })
    }
    


    function onError(errorCode, message) {
        var info = '';
        switch (errorCode) {
            case RongIMLib.ErrorCode.TIMEOUT:
                info = '超时';
                break;
            case RongIMLib.ErrorCode.UNKNOWN_ERROR:
                info = '未知错误';
                break;
            case RongIMLib.ErrorCode.REJECTED_BY_BLACKLIST:
                info = '在黑名单中，无法向对方发送消息';
                break;
            case RongIMLib.ErrorCode.NOT_IN_DISCUSSION:
                info = '不在讨论组中';
                break;
            case RongIMLib.ErrorCode.NOT_IN_GROUP:
                info = '不在群组中';
                break;
            case RongIMLib.ErrorCode.NOT_IN_CHATROOM:
                info = '不在聊天室中';
                break;
            default :
                info = errorCode;
                break;
        }
        alert('发送失败' + info);
    }


    function getSendType() {
        var id = $(".talk-title").attr('id');
        if (!id) {
            alert('未选择会话对象');
        } else {
            var type = id.split('conversation-type-')[1];
            return parseInt(type) || 1;
        }
        return null;

    }
    
    
    return {
        // sendTextMessage: sendTextMessage,
        // sendVoiceMessage: sendVoiceMessage,
        // sendPictureMessage: sendPictureMessage,
        // sendFileMessage: sendFileMessage,
        getSendType:getSendType,
        sendMessage:sendMessage
    };
    
});