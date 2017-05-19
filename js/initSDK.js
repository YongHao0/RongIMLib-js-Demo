/**
 * Created by wangyonghao on 2017/5/11.
 */
define('initSDK', ['RongIMLib', 'uploadFile', 'conversation', 'sendMessage', 'talk'], function (RongIMLib, uploadFile, conversation, sendMessage, talk) {

    var token = window.localStorage.token;
    var appKey = window.localStorage.appKey;


    var RongIMClient = RongIMLib.RongIMClient;

    function init(){

        RongIMClient.init(appKey);
        RongIMLib.RongIMEmoji.init();
        RongIMLib.RongIMVoice.init();
        initialEmoji();

        RongIMClient.setConnectionStatusListener({
            onChanged: function (status) {
                switch (status) {
                    //链接成功
                    case RongIMLib.ConnectionStatus.CONNECTED:
                        console.log('链接成功');
                        break;
                    //正在链接
                    case RongIMLib.ConnectionStatus.CONNECTING:
                        console.log('正在链接');
                        break;
                    //重新链接
                    case RongIMLib.ConnectionStatus.DISCONNECTED:
                        console.log('断开连接');
                        break;
                    //其他设备登录
                    case RongIMLib.ConnectionStatus.KICKED_OFFLINE_BY_OTHER_CLIENT:
                        console.log('其他设备登录');
                        break;
                    //网络不可用
                    case RongIMLib.ConnectionStatus.NETWORK_UNAVAILABLE:
                        console.log('网络不可用');
                        break;
                }
            }
        });


        RongIMClient.setOnReceiveMessageListener({
            // 接收到的消息
            onReceived: function (message) {
                console.log('接收到消息');
                // message = RongIMLib.RongIMEmoji.emojiToHTML(message);

                console.log(message);
                if (message.targetId === $(".talk-title").text()) {
                    talk.addTalk(message);
                }
                conversation.setupConversationList();

                // 判断消息类型
                switch(message.messageType){
                    case RongIMClient.MessageType.TextMessage:
                        // 发送的消息内容将会被打印
                        console.log(message.content.content);
                        break;
                    case RongIMClient.MessageType.VoiceMessage:
                        // 对声音进行预加载
                        // message.content.content 格式为 AMR 格式的 base64 码
                        // RongIMLib.RongIMVoice.preLoaded(message.content.content);
                        break;
                    case RongIMClient.MessageType.ImageMessage:
                        // console.log('接收到图片消息');
                        break;
                    case RongIMClient.MessageType.DiscussionNotificationMessage:
                        // do something...
                        break;
                    case RongIMClient.MessageType.LocationMessage:
                        // do something...
                        break;
                    case RongIMClient.MessageType.RichContentMessage:
                        // do something...
                        break;
                    case RongIMClient.MessageType.DiscussionNotificationMessage:
                        // do something...
                        break;
                    case RongIMClient.MessageType.InformationNotificationMessage:
                        // do something...
                        break;
                    case RongIMClient.MessageType.ContactNotificationMessage:
                        // do something...
                        break;
                    case RongIMClient.MessageType.ProfileNotificationMessage:
                        // do something...
                        break;
                    case RongIMClient.MessageType.CommandNotificationMessage:
                        // do something...
                        break;
                    case RongIMClient.MessageType.CommandMessage:
                        // do something...
                        break;
                    case RongIMClient.MessageType.UnknownMessage:
                        // do something...
                        break;
                    default:
                    // 自定义消息
                    // do something...
                }
            }
        });


        //开始链接
        RongIMClient.connect(token, {
            onSuccess: function(userId) {

                $(".user-id").text(userId);
                var sendId = window.localStorage.sendId;
                if (sendId) {
                    $(".talk-title").text(sendId);
                    talk.setupTalk(sendId);
                }
                conversation.setupConversationList();
                bindClickEvent();

            },
            onTokenIncorrect: function() {
                console.log('token无效');
            },
            onError:function(errorCode){
                var info = '';
                switch (errorCode) {
                    case RongIMLib.ErrorCode.TIMEOUT:
                        info = '超时';
                        break;
                    case RongIMLib.ErrorCode.UNKNOWN_ERROR:
                        info = '未知错误';
                        break;
                    case RongIMLib.ErrorCode.UNACCEPTABLE_PaROTOCOL_VERSION:
                        info = '不可接受的协议版本';
                        break;
                    case RongIMLib.ErrorCode.IDENTIFIER_REJECTED:
                        info = 'appkey不正确';
                        break;
                    case RongIMLib.ErrorCode.SERVER_UNAVAILABLE:
                        info = '服务器不可用';
                        break;
                }
                console.log(info);
            }
        });
    }


    function bindClickEvent() {
        bindEmojiClick();
        sendVoice();
        clickSend();
        saveDraft();
        showDraft();
        clearDraft();
        addConversation();
        createDiscussion();
        sendPicture();
        addDiscussion();
        submitAddDiscussion();
        showDuscussInfo();
        equitDiscussion();
        showKickDiscussion();
        submitQuitDiscussion();
        submitNewDuscussName();
        addBlackList();
        removeBlackList();
        checkBlackList();
        showBlackList();
        addRoom();
        quitChat();
        showChatDetail();
        showHistory();
        clearAllConversation();
        clearSelectConversation();
    }

    
    function initialEmoji() {
        var emojis = RongIMLib.RongIMEmoji.emojis;
        var $emojiBox = $(".emoji-box");
        var emojiStr = '';
        emojis.forEach(function (emoji, index) {
            emojiStr += emoji.innerHTML;
        });
        $emojiBox.append(emojiStr.toString());
        clickEmoji();
    }


    function bindEmojiClick() {
        $(".tool-emoji").click(function () {
            var $emojiBox = $('.emoji-box');
            $emojiBox.css('display', $emojiBox.css('display') === 'none' ? 'block' : 'none');
        })
    }

    function clickEmoji() {
        $(".emoji-box span").click(function () {
            var $input = $(".input-text");
            var text = $input.val() + $(this).attr('name');
            $input.val(RongIMLib.RongIMEmoji.symbolToEmoji(text));
            $('.emoji-box').hide();
        })
    }

    function clickSend() {
        $(".input-btn").click(function () {
            var $input = $(".input-text");
            var text = $input.val();
            var targetId = $(".talk-title").text();
            if (targetId && targetId !== "") {
                var param = {content:text ,extra:"附加信息"};
                sendMessage.sendMessage(RongIMLib.TextMessage, param, targetId, function (message) {
                    $input.val('');
                    reloadTalkAndConversion(message);
                });
            } else {
                alert('未选择发送对象');
            }
            $input.text("");

        })
    }

    function sendVoice() {
        $(".tool-voice").change(function () {
            var file = this.files[0];
            var reader = new FileReader();
            reader.onload = function (e) {
                var base64 = e.target.result.split('data:audio/amr;base64,')[1];
                var duration = base64.length / 1024;
                var targetId = $(".talk-title").text();
                if (targetId && targetId !== "") {
                    var param = {'content': base64, 'duration': duration, 'extra': '附加信息'};
                    sendMessage.sendMessage(RongIMLib.VoiceMessage, param, targetId, function (message) {
                        reloadTalkAndConversion(message);
                    });
                } else {
                    alert('未选择发送对象');
                }
            };
            reader.readAsDataURL(file);
        });
    }


    function sendPicture() {
        $(".send-picture").change(function () {
            var file = this.files[0];
            var targetId = $(".talk-title").text();
            var param;
            uploadFile.getUploadUrl(file, function (data) {
                if (uploadFile.getFileType(file.name) === 'image') {
                    var base64 = data.hash;
                    var url = data.downloadUrl;
                    param = {content:base64,imageUri:url};
                    sendMessage.sendMessage(RongIMLib.ImageMessage, param, targetId, function (message) {
                        reloadTalkAndConversion(message);
                    });
                } else {
                    var name = data.name;
                    var size = data.size;
                    var fileType = data.fileType;
                    var fileUrl = data.downloadUrl;
                    param = {name: name, size: size, type: fileType, fileUrl: fileUrl};
                    sendMessage.sendMessage(RongIMLib.FileMessage, param, targetId, function (message) {
                        reloadTalkAndConversion(message);
                    });
                }
            })
        })
    }
    
    function reloadTalkAndConversion(message) {
        talk.addTalk(message);
        conversation.setupConversationList();
    }
    
    
    
    function saveDraft() {
        $(".tool-save-draft").click(function () {
            var $input = $(".input-text");
            var draftText = $input.val();
            var targetId = $(".user-id").text();
            var conversationType = RongIMLib.ConversationType.PRIVATE;
            RongIMClient.getInstance().saveTextMessageDraft(conversationType,targetId,draftText);
            $input.val('');
        })
    }

    function showDraft() {
        $(".tool-show-draft").click(function () {
            var conversationType = RongIMLib.ConversationType.PRIVATE;
            var targetId = $(".user-id").text();
            var draft = RongIMClient.getInstance().getTextMessageDraft(conversationType,targetId);
            if(draft) {
                $(".input-text").val(draft);
            } else {
                alert('草稿为空');
            }
        })
    }

    function clearDraft() {
        $('.tool-clear-draft').click(function () {
            var conversationType = RongIMLib.ConversationType.PRIVATE;
            var targetId = $(".user-id").text();
            RongIMClient.getInstance().clearTextMessageDraft(conversationType,targetId);
        })
    }


    function addConversation() {
        $(".add").click(function () {
            $(".create-discuss").hide();
            var $add = $(".add-box");
            var display = $add.css('display');
            display === 'none' ? $add.show() : $add.hide();

        });
        $(".show-create-discuss").click(function () {
            $(".add-box").hide();
            $(".create-discuss").show();
        });
        $(".show-create-group").click(function () {
            $(".add-box").hide();
            $(".create-group").show();
        });
        $(".show-create-chat").click(function () {
            // $(".add-box").hide();
            // $(".create-chat").show();
        });
    }
    
    function createDiscussion() {
        $(".submit-discuss").click(function () {
            var discussName = $(".discuss-name").val();
            var discussIdsStr = $(".discuss-ids").val();
            var discussIds = discussIdsStr.split(',');
            conversation.createDiscussion(discussName, discussIds);
            $(".create-discuss").hide();
        })
    }


    function addRoom() {
        $("#addRoom").click(function () {
            var roomId = $("#addRoomInput").val();
            var count = 10;
            RongIMClient.getInstance().joinChatRoom(roomId, count, {
                onSuccess: function () {
                    getChatRoomDetail(roomId, 10, RongIMLib.GetChatRoomType.REVERSE);
                    $(".add-box").hide();
                    alert('加入聊天室成功');
                },
                onError: function (error) {
                    alert('加入聊天室失败');
                }
            })
        })
    }


    function getChatRoomDetail(charRoomId, count, order) {
        RongIMClient.getInstance().getChatRoomInfo(charRoomId, count, order, {
            onSuccess:function (chatRoom) {
                conversation.setTalkTitle(charRoomId, 4, '');
                talk.setupTalk(charRoomId);
            },
            onError: function (error) {

            }
        })
    }


    function addDiscussion() {
        $(".talk-add-discuss").click(function () {
            var $add = $(".talk-add-id");
            var status = $add.css('display');
            status === 'none' ? $add.show() : $add.hide();
        })
    }

    function submitAddDiscussion() {
        $(".submit-talk-add").click(function () {
            var names = $(".discuss-name-input").val();
            var userIds = names.indexOf(',') !== -1 ? names.split(',') : [ names ];
            var discussionId = $(".talk-title").text();
            RongIMClient.getInstance().addMemberToDiscussion(discussionId, userIds, {
                onSuccess: function () {
                    alert('邀请成功');
                    $(".talk-add-id").hide();
                },
                onError: function () {
                    alert('邀请失败');
                }
            })
        })
    }


    function showDuscussInfo() {
        $(".talk-get-info").click(function () {
            var discussId = $(".talk-title").text();
            RongIMClient.getInstance().getDiscussion(discussId, {
                onSuccess: function (discussion) {
                    alert('创建者：' + discussion.creatorId + '\nID：' + discussion.id + '\n成员：' + discussion.memberIdList.toString() + '\n讨论组名：' + discussion.name);
                },
                onError: function (error) {

                }
            })
        })
    }


    function equitDiscussion() {
        $(".discuss-quit").click(function () {
            var discussionId = $(".talk-title").text();
            RongIMClient.getInstance().quitDiscussion(discussionId, {
                onSuccess: function () {
                    alert('退出成功');

                },
                onError: function () {
                    alert('退出失败');
                }
            })
        })
    }
    
    function showKickDiscussion() {
        $(".discuss-kick").click(function () {
            $(".talk-quit-id").show();
        })
    }

    function submitQuitDiscussion() {
        $(".submit-talk-quit").click(function () {
            var discussionId = $(".talk-title").text();
            var id = $(".discuss-quit-input").val();
            RongIMClient.getInstance().removeMemberFromDiscussion(discussionId,id,{
                onSuccess:function(){
                    $(".talk-quit-id").hide();
                    alert('踢人成功');
                },
                onError:function(error){
                    console.log(error);
                    alert('踢人失败');
                }
            });
        })
    }


    function quitChat() {
        $("#chatQuit").click(function () {
            var chatRoomId = $(".talk-title").val();
            RongIMClient.getInstance().quitChatRoom(chatRoomId, {
                onSuccess: function () {
                    alert('退出成功');
                },
                onError: function () {
                    alert('退出失败');
                }
            })
        });
    }

    function showChatDetail() {
        $("#chatDetail").click(function () {
            var chatRoomId = $(".talk-title").text();
            var count = 500;
            var order = RongIMLib.GetChatRoomType.REVERSE;
            console.log(chatRoomId);
            RongIMClient.getInstance().getChatRoomInfo(chatRoomId, count, order, {
                onSuccess: function (chatRoom) {
                    var users = '';
                    chatRoom.userInfos.forEach(function (user) {
                        users += (user.id + ' ');
                    });
                    alert('聊天室人数：' + chatRoom.userTotalNums + '\n聊天室成员：' + users);
                },
                onError: function (error) {

                }
            })
        })
    }


    function showHistory() {
        $("#chatHistory").click(function () {
            var chatRoomId = $(".talk-title").text();
            var timeStr = $("#chatTime").val();
            var time = new Date(timeStr.replace(/-/g, "/") || null);
            var timestamp = new Date().getTime();

            RongIMClient.getInstance().setChatroomHisMessageTimestamp(chatRoomId, timestamp);
            var count = 10;
            var order = 1;
            RongIMClient.getInstance().getChatRoomHistoryMessages(chatRoomId, count, order, {
                onSuccess: function(list, hasMore) {
                    console.log(list);
                    console.log('是否有更多：' + hasMore);
                },
                onError: function(error) {

                }
            });
        })
    }



    function clearAllConversation() {
        $("#clearAllConversation").click(function () {
            clearConversation(undefined);
        })
    }

    function clearSelectConversation() {
        $("#clearSelectConversation").click(function () {
            var typesStr = $(".clear-conversation-input").val();
            var types = typesStr.indexOf(',') === -1 ? [typesStr] : typesStr.split(',');
            types = getConversationTypes(types);
            clearConversation(types);
        })
    }


    
    function getConversationTypes(types) {
        types.forEach(function (type, index) {
            var typeStr = type.toUpperCase();
            types[index] = RongIMLib.ConversationType[typeStr];
        });
        return types;
    }




    function clearConversation(types) {
        var fuc = {
            onSuccess:function(){
                alert('删除会话成功');
                conversation.setupConversationList();
            },
            onError:function(error){
                // error => 清除会话错误码。
            }
        };
        types ? RongIMClient.getInstance().clearConversations(fuc, types) : RongIMClient.getInstance().clearConversations(fuc);
    }


    function submitNewDuscussName() {
        $(".submit-discuss-name").click(function () {
            var newName = $("#discussNameInput").val();
            var discussionId = $(".talk-title").text();
            console.log(newName);
            RongIMClient.getInstance().setDiscussionName(discussionId,newName,{
                onSuccess:function(){
                    alert('修改成功');
                },
                onError:function(error){
                    alert('修改失败');
                }
            });

        })
    }


    function addBlackList() {
        $(".blacklist-add-btn").click(function () {
            var addId = $(".blacklist-add-input").val();
            console.log(addId.toString());
            RongIMClient.getInstance().addToBlacklist(addId,{
                onSuccess: function(chatRoom) {
                    alert('加入黑名单成功');
                },
                onError: function(error) {
                    // 加入黑名单失败。
                }
            });
        })
    }

    function removeBlackList() {
        $(".blacklist-remove-btn").click(function () {
            var removeId = $(".blacklist-remove-input").val();
            RongIMClient.getInstance().removeFromBlacklist(removeId, {
                onSuccess: function() {
                    alert('移除成功');
                },
                onError: function(error) {
                }
            });
        })
    }
    
    function checkBlackList() {
        $(".blacklist-check-btn").click(function () {
            var id = $(".blacklist-check-input").val();
            RongIMClient.getInstance().getBlacklistStatus(id,{
                onSuccess: function(status) {
                    alert(status);
                },
                onError: function(error) {
                    alert(error);
                }
            });
        })
    }

    function showBlackList() {
        $(".blacklist-show-btn").click(function () {
            RongIMClient.getInstance().getBlacklist({
                onSuccess: function(list) {
                    console.log(list);
                    alert('黑名单：\n' + list.toString());
                },
                onError: function(error) {
                    // 获取黑名单失败
                }
            });
        })
    }





   return {
       token: token,
       appKey: appKey,
       init: init
   }



});