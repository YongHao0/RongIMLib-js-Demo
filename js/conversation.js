/**
 * Created by wangyonghao on 2017/5/12.
 */
define('conversation', ['jquery', 'RongIMLib', 'talk'], function ($, RongIMLib, talk) {
    var RongIMClient = RongIMLib.RongIMClient;

    var conversationList = [];

    function getConversationList(callback) {
        RongIMClient.getInstance().getConversationList({
            onSuccess: function (list) {
                getUnreadTotalCount();
                callback(list);
            },
            onError: function (error) {

            }
        }, null);
    }

    function setupConversationList() {
        getConversationList(function (list) {
            conversationList = list;
            console.log(conversationList);
            list.forEach(function (content, index) {
                getSelectUnreadCount(content, index);
            });

        });
    }
    
    
    function getSelectUnreadCount(content, index) {
        var type = content.conversationType;
        var targetId = content.targetId;
        var lastContent = getMessageContent(content);
        lastContent = RongIMLib.RongIMEmoji.emojiToSymbol(lastContent);
        RongIMClient.getInstance().getUnreadCount(type, targetId, {
            onSuccess: function (count) {
                index === 0 ? $(".conversion-box").children().remove() : '';
                $(".conversion-box").append('<div id="' + 'conversation' + index + '"class="conversion"><p class="talk-id">' + (getMessageTitle(content) || "") + '</p><div class="talk-text talk-list-text">' + (lastContent || "") + '</div><p class="unread">未读数：' + count + '</p></div>');
                bindClickConversation();
            },
            onError: function () {

            }
        })
    }

    
    function getUnreadTotalCount() {
        RongIMClient.getInstance().getTotalUnreadCount({
            onSuccess:function(count){
                console.log(count);
                $(".unread-total").text('总未读数' + count);
            },
            onError:function(error){
                // error => 获取总未读数错误码。
            }
        });
    }
    

    function getMessageTitle(content) {
        if (content.conversationType === 1) {
            return '私聊：' + content.targetId;
        } else if (content.conversationType === 2) {
            return '讨论组：' + content.targetId;
        } else if (content.conversationType === 4) {
            return '聊天室：' + content.targetId;
        } else {
            return 'id：' + content.targetId;
        }
    }


    function getMessageContent(content) {
        if (content.latestMessage.content instanceof RongIMLib.VoiceMessage) {
            return '收到一条语音消息';
        } else if (content.latestMessage.content instanceof RongIMLib.ImageMessage) {
            return '收到一条图片消息';
        } else if (content.latestMessage.content instanceof RongIMLib.FileMessage) {
            return '收到一个文件';
        } else {
            return content.latestMessage.content.content || "";
        }
    }


    
    function bindClickConversation() {
        var $conversion = $(".conversion");
        $conversion.click(function () {
            $(".talk-add-id").hide();
            $(".talk-quit-id").hide();
            var index = $(this).attr('id').split('conversation')[1];
            removeUnread(conversationList[index]);
            var id = conversationList[index].targetId;
            setTalkTitle(id, conversationList[index].conversationType, conversationList[index].conversationTitle);
            // var $talk = $(".talk-title");
            // $talk.text(id);
            // $talk.attr('id', 'conversation-type-' + conversationList[index].conversationType);
            talk.setupTalk(id);
        });
    }
    
    function removeUnread(content) {
        var type = content.conversationType;
        var targetId = content.targetId;
        RongIMClient.getInstance().clearUnreadCount(type,targetId,{
            onSuccess:function(){
                setupConversationList();
            },
            onError:function(error){
                // error => 清除未读消息数错误码。
            }
        });
    }



    function setTalkTitle(text, type, name) {
        var $talk = $(".talk-title");
        var $discussKick = $(".discuss-kick");
        var $quit = $(".discuss-quit");
        var $getTalkInfo = $(".talk-get-info");
        var $talkName = $("#talkName");
        var $discussName = $(".discuss-name-box");
        var $talkAdd = $(".talk-add-discuss");
        var $quitChat = $("#chatQuit");
        var $chatDetail = $("#chatDetail");
        var $chatHistory = $('.chat-history-box');
        $talkName.text(name);
        $talk.text(text);
        $talk.attr('id', 'conversation-type-' + type);
        setupDisplay([$discussName, $quit, $discussKick, $getTalkInfo, $talkName, $talkAdd, $quitChat, $chatDetail, $chatHistory], 'none');
        if (type === 2) {
            setupDisplay([$quit, $discussKick, $getTalkInfo, $talkName, $talkAdd], 'inline-block');
            $discussName.css('display', 'block');
        } else if (type === 4) {
            setupDisplay([$quitChat, $chatDetail, $chatHistory], 'inline-block');
        }

    }


    function setupDisplay(arr, type) {
        arr.forEach(function ($content) {
            $content.css('display', type);
        });
    }




    // function setupTalk() {
    //     var $conversion = $(".conversion");
    //     $(this).unbind('click', setupTalk);
    //     $conversion.bind('click', setupTalk);
    //     var id = $(this).attr('id');
    //     $(".talk-title").text(id);
    //     talk.setupTalk(id);
    // }


    function createDiscussion(discussionName, userIds) {
        RongIMClient.getInstance().createDiscussion(discussionName,userIds,{
            onSuccess:function(discussionId){
                setTalkTitle(discussionId, 2);
                talk.setupTalk(discussionId);
            },
            onError:function(error){

            }
        });
    }


    return {
        getConversationList: getConversationList,
        setupConversationList: setupConversationList,
        createDiscussion: createDiscussion,
        setTalkTitle: setTalkTitle
    };

});