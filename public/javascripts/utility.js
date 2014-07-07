$(document).ready(function() {
    //comment show delegate
    $('.delegate-symbol').on('click','.comment-show', function() {
      var itemid = $(this).data('itemid');
      var $comment = $('#joke' + itemid +'-comments');
      var display = $comment.css('display');
      if (display === 'none') {
        $comment.show();
        $(this).find('b').text('收起评论');
      } else {
        $comment.hide();
        $(this).find('b').text('展开评论');
      }
    });

    //comment reply delegate
    $('.delegate-symbol').on('click', '.comment-reply', function() {
      //get parent container
      var $parent = $(this).parents('.content-bottom');
      var index = $parent.parents('.delegate-need-index').data('index');
      var toid = $parent.data('userid');
      var jokeid = $parent.data('jokeid');
      var username = $parent.data('username');
      var avatar = $parent.data('useravatar');
      var time = $parent.data('posttime');
      var content = $parent.data('postcontent') || '';

      var modal = '<div class="modal fade" id="comment-post-modal" tabindex="-1" role="dialog" aria-labelledby="myPostModalLabel" aria-hidden="true"><div class="modal-dialog"><div class="modal-content"><div class="modal-header"><button type="button" class="close" data-dismiss="modal"><span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button><h4 class="modal-title" id="myModalLabel">' + '回复@' + username + '</h4></div><div class="modal-body"><div class="modal-comment-item"><div class="modal-comment-inner-left"><img class="img-rounded img-responsive nav-tooltip" src="' + avatar + '" title="' + username + '" width="48" height="48"></div><div class="modal-comment-inner-right"><div class="author-information"><a href="/u/' + username + '"><strong class="fullname">' + username + '</strong></a><small class="create-time"><a class="nav-tooltip" href="/u/' + username + '">' + time + '</a></small></div><p>' + content + '</p></div></div><div class="comment-input-area"><textarea class="share-words" row="3">' + '@' + username + ' ' + '</textarea></div></div><div class="modal-footer"><button type="button" data-index="' + index + '" data-toname="' + username + '" data-jokeid="' + jokeid + '" data-toid="' + toid + '" class="btn btn-primary btn-post-comment" disabled="disabled"><i class="fa fa-pencil-square-o"></i></button></div></div></div></div>';
      $('#comment-post-modal').remove();
      $('.wrap').append(modal);
      $('#comment-post-modal').find('textarea').on('keyup', function() {
        var $btn = $('#comment-post-modal').find('.btn-post-comment');
        var username = $btn.data('toname');
        var value = $(this).val();
        if (value.indexOf('@'+username+' ') !== -1) {
          value = value.replace('@'+username+' ', '');
          if (value !== '') {
            $btn.removeAttr('disabled');
          } else {
            $btn.attr('disabled', 'disabled');
          }
        } else {
          $btn.attr('disabled', 'disabled');
        }
      });

      //post comment
      $('.btn-post-comment').on('click', function() {
        var $textarea = $(this).parents('#comment-post-modal').find('.comment-input-area').find('textarea');
        var jokeid = $(this).data('jokeid');
        var toname = $(this).data('toname');
        var toid = $(this).data('toid');
        var content = $textarea.val();
        var index = $(this).data('index');
        $.ajax({
          url: '/comment/new',
          type: 'POST',
          dataType: 'json',
          data: {jokeid: jokeid, toid: toid, content: content},
          success: function(data) {
            if (data.status === 'success') {
              $('#comment-post-modal').modal('hide');
              var commenthtml = '<div class="comment-item"><div class="comment-item-inner-left"><img class="img-rounded img-responsive nav-tooltip" src="' + data.info.gravatar +'" data-toggle="tooltip" title="' + data.info.name +'" width="32" height="32"></div><div class="comment-item-inner-right"><div class="author-information"><a href="/u/' + data.info.name + '"><strong class="fullname">' + data.info.name + '</strong></a><small class="create-time"><a class="nav-tooltip" href="/u/'+ data.info.name +'">' + '刚刚' + '</a></small></div><p>'+ content +'</p><div class="content-bottom" data-index="' + index + '" data-jokeid="' + jokeid + '" data-userid="' + data.info.userid + '" data-username="' + data.info.name + '" data-useravatar="' + data.info.gravatar + '" data-posttime="刚刚" data-postcontent="' + content + '"><ul class="list-inline fun-list"><li><a class="comment-reply"><i class="fa fa-reply"></i><b>回复</b></a></li><li><a href="#"><i class="fa fa-heart"></i><b>点赞</b></a></li><li><a href="#"><i class="fa fa-hand-o-down"></i><b>差评</b></a></li><li><a href="#"><i class="fa fa-star"></i><b>收藏</b></a></li></ul></div></div></div>';
              $('#joke'+index+'-comments').prepend(commenthtml);
              $('#joke'+index+'-comments').show();
            }
          },
          error: function() {
            alert('Something goes wrong here!');
          }
        });
      });
      $('#comment-post-modal').modal();
    });

    // like delegate
    $('.delegate-symbol').on('click', '.joke-like-btn', function() {
        var self = $(this);
        var $parent = self.parents('.content-bottom');
        var jokeid = $parent.data('jokeid');
        var action = self.data('action');
        if (jokeid) {
            $.ajax({
                url: '/joke/like',
                type: 'POST',
                dataType: 'json',
                data: {jokeid: jokeid, action: action},
                success: function(data) {
                    if (data.status === 'success') {
                        if (action === 'like') {
                            self.addClass('islike');
                            self.data('action', 'cancel-like');
                            self.find('b').text(data.like_count);
                            self.attr('data-original-title', '取消');
                        } else {
                            self.removeClass('islike');
                            self.data('action', 'like');
                            self.find('b').text(data.like_count);
                            self.attr('data-original-title', '点赞');
                        }
                    }
                },
                error: function() {
                    alert('Oops, something goes wrong here!');
                }
            });
        }
    });
    // like delegate
    $('.delegate-symbol').on('click', '.joke-dislike-btn', function() {
        var self = $(this);
        var $parent = self.parents('.content-bottom');
        var jokeid = $parent.data('jokeid');
        var action = self.data('action');
        if (jokeid) {
            $.ajax({
                url: '/joke/dislike',
                type: 'POST',
                dataType: 'json',
                data: {jokeid: jokeid, action: action},
                success: function(data) {
                    if (data.status === 'success') {
                        if (action === 'dislike') {
                           self.addClass('isdislike');
                           self.data('action', 'cancel-dislike');
                           self.find('b').text(data.dislike_count);
                           self.attr('data-original-title', '取消');
                        } else {
                            self.removeClass('isdislike');
                            self.data('action', 'dislike');
                            self.find('b').text(data.dislike_count);
                            self.attr('data-original-title', '差评');
                        }
                    }
                },
                error: function() {
                    alert('Oops, something goes wrong here!');
                }
            });
        }
    });

    $('.notification-check-delegate').on('click', '.check-notification', function() {
      var self = $(this);
      var notificationid = self.data('notificationid');
      $.ajax({
        url: 'notification/check',
        type: 'POST',
        dataType: 'json',
        data: {notificationid: notificationid},
        success: function(data) {
          if (data.status === 'success') {
            self.parents('.notification-check-delegate').addClass('has-checked');
            var count = $('.notifition-count').text();
            count = parseInt(count);
            count = count - 1;
            if (count <= 0) {
              $('.notifition-count').remove();
            } else {
              $('.notifition-count').text(count);
            }
            self.remove();
          }
        },
        error: function() {
          alert('Oops, something goes wrong here!');
        }
      });
    });

    $('.check-all-notification').on('click', function() {
      $.ajax({
        url: 'notificationcheck/all',
        type: 'POST',
        dataType: 'json',
        success: function(data) {
          if (data.status === 'success') {
            window.location.href = location.href;
          }
        },
        error: function() {
          alert('Oops, something goes wrong here!');
        }
      });
    });
});