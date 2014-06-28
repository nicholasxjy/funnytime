/**
 * Created by nicholas_xue on 14-6-24.
 */
$(document).ready(function() {
    //tooltip init
    $('.nav-tooltip').tooltip();
    $('#btn-signin').click(function(event) {
        var $form = $('#signin-wrap');
        var name = $form.find('input[name="name"]').val();
        var pass = $form.find('input[name="pass"]').val();
        $.ajax({
            url: "/signin",
            type: "POST",
            data: {name: name, pass: pass},
            dataType: "json",
            async: false,
            success: function(res) {
               if (res.status === 'fail') {
                   $form.find('.error').html('');
                   $form.find('.error').append('<div class="form-group"><div class="alert alert-warning"><strong>'
                   + res.error
                   +'</strong></div></div>');
               } else {
                   window.location.href="http://127.0.0.1:1337";
               }
            },
            error: function() {
                alert('Something wrong here!');
            }
        });
    });
    $('#btn-signup').click(function(event) {
        var $form = $('#signup-wrap');
        var name = $form.find('input[name="name"]').val();
        var email = $form.find('input[name="email"]').val();
        var pass = $form.find('input[name="pass"]').val();
        var repass = $form.find('input[name="repass"]').val();
        $.ajax({
            url: "/signup",
            type: "POST",
            data: {name: name, email: email, pass: pass, repass: repass},
            dataType: "json",
            async: false,
            success: function(res) {
               if (res.status === 'fail') {
                    $form.find('.error').html('');
                    $form.find('.error').append('<div class="form-group"><div class="alert alert-warning"><strong>'
                       + res.error
                       + '</strong></div></div>');
               } else {
                    $form.find('.success').html('');
                    $form.find('.success').append('<div class="form-group"><div class="alert alert-success"><strong>'
                       + res.success
                       + '</strong></div></div>');
               }
            },
            error: function() {
                alert('Something wrong here!');
            }
        });
    });

    //comment show
    $('.comment-show').on('click', function() {
      var itemid = $(this).data('itemid');
      var $comment = $('#'+ itemid);
      var display = $comment.css('display');
      if (display === 'none') {
        $comment.show();
        $(this).find('b').text('收起评论');
      } else {
        $comment.hide();
        $(this).find('b').text('展开评论');
      }
    });

    //comment reply
    $('.comment-reply').on('click', function() {
      //get parent container
      var $parent = $(this).parents('.content-bottom');
      var username = $parent.data('username');
      var avatar = $parent.data('useravatar');
      var time = $parent.data('posttime');
      var content = $parent.data('postcontent') || '';

      var modal = '<div class="modal fade" id="comment-post-modal" tabindex="-1" role="dialog" aria-labelledby="myPostModalLabel" aria-hidden="true"><div class="modal-dialog"><div class="modal-content"><div class="modal-header"><button type="button" class="close" data-dismiss="modal"><span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button><h4 class="modal-title" id="myModalLabel">'+ '回复@'+ username +'</h4></div><div class="modal-body"><div class="comment-item"><div class="comment-item-inner-left"><img class="img-rounded img-responsive nav-tooltip" src="'+ avatar +'" data-toggle="tooltip" title="' + username + '" width="32" height="32"></div><div class="comment-item-inner-right"><div class="author-information"><a href="/u/' + username + '"><strong class="fullname">' + username + '</strong></a><small class="create-time"><a class="nav-tooltip" href="#">' + time + '</a></small></div><p>' + content + '</p></div></div></div><div class="modal-footer"><button id="modal-post-btn" type="button" class="btn btn-primary btn-post-comment"><i class="fa fa-pencil-square-o"></i></button></div></div></div></div>';
      $('#comment-post-modal').remove();
      $('.wrap').append(modal);
      $('#comment-post-modal').modal();
    });
});