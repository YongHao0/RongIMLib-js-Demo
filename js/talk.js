/**
 * Created by wangyonghao on 2017/5/12.
 */
define('talk', ['jquery', 'RongIMLib', 'sendMessage'], function ($, RongIMLib, sendMessage) {

    var RongIMClient = RongIMLib.RongIMClient;
    var RongVoiceMessage = {};

    function setupTalk(id) {
        var $talkBox = $(".talk-content");
        $talkBox.children().remove();
        getHistoryMessages(id, function (list) {

            for(var i = list.length - 1; i >= 0; i--) {
                var content = list[i];
                var id = content.senderUserId;
                saveVoiceMessage(content);
                var messageHtml = getMessageHtml(content);
                var className = $(".user-id").text() === id ? 'talk-show-right' : 'talk-show';
                $talkBox.prepend('<div class="' + className + '"><p class="talk-id">' + ('id：' +  id) + '</p>' + messageHtml + '</div>')
            }
            playVoice();
        })
    }
    
    function getHistoryMessages(targetId, callback) {
        RongIMClient.getInstance().getHistoryMessages(sendMessage.getSendType(), targetId, null, 10, {
            onSuccess: function(list, hasMsg) {
                console.log(list);
                callback(list);
            },
            onError: function(error) {

            }
        });
    }

    function getMessageHtml(content) {
        if (content.content instanceof RongIMLib.VoiceMessage) {
            return "<div class='talk-text talk-voice' id='" + content.messageId + "'>点击播放声音</div>"
        } else if (content.content instanceof RongIMLib.TextMessage) {
            var textStr = RongIMLib.RongIMEmoji.emojiToHTML(content.content.content);
            textStr = RongIMLib.RongIMEmoji.emojiToHTML(textStr);
            return '<div class="talk-text">' + textStr + '</div>';
        } else if (content.content instanceof RongIMLib.ImageMessage) {
            return '<div class="talk-text">' + '<img class="talk-image" src="' + content.content.imageUri + '" />' + '</div>';
        } else if (content.content instanceof RongIMLib.FileMessage) {
            return '<div class="talk-text">' + '<a href="' + content.content.fileUrl + '">' + content.content.name + '</a>' + '</div>';
        } else if (content.content instanceof  RongIMLib.DiscussionNotificationMessage) {
            var propt = '邀请增加了新成员：';
            if (content.content.type === 3) {
                propt = '修改了名字：';
            } else if (content.content.type === 2) {
                propt = '退出讨论组：';
            }
            return "<div class='talk-text talk-voice talk-red' id='" + content.messageId + "'>" + propt + content.content.extension + "</div>"
        }
    }

    function saveVoiceMessage(content) {
        if (content.content instanceof RongIMLib.VoiceMessage) {
            RongVoiceMessage[content.messageId] = {
                content: content.content.content,
                duration: content.content.duration
            };
        }
    }

    
    function playVoice() {
        $(".talk-voice").click(function () {
            var messageId = $(this).attr('id');
            var audioFile = RongVoiceMessage[messageId].content;
            var duration = RongVoiceMessage[messageId].duration;
            RongIMLib.RongIMVoice.preLoaded(audioFile, function(){
                RongIMLib.RongIMVoice.play(audioFile,duration);
            });
        })
    }

    function addTalk(message) {
        var $talkBox = $(".talk-content");
        var id = message.senderUserId;
        var messageHtml = getMessageHtml(message);
        var className = $(".user-id").text() === id ? 'talk-show-right' : 'talk-show';
        $talkBox.append('<div class="' + className + '"><p class="talk-id">' + ('id：' +  id) + '</p>' + messageHtml + '</div>')
    }
    
    
    function bind() {
        
    }
    
    
    function setupMoreHistory(hasMsg) {

    }

    return {
        setupTalk: setupTalk,
        getHistoryMessages: getHistoryMessages,
        addTalk: addTalk
    }
    
});