/**
 * Created by nicholas_xue on 14-6-24.
 */
$(document).ready(function() {
  //tooltip init
  $('.nav-tooltip').tooltip();

  //popover
  $('.info-popover').popover();
  $('#btn-signin').click(function(event) {
    var $form = $('#signin-wrap');
    var name = $form.find('input[name="name"]').val();
    var pass = $form.find('input[name="pass"]').val();
    $.ajax({
      url: "/signin",
      type: "POST",
      data: {
        name: name,
        pass: pass
      },
      dataType: "json",
      async: false,
      success: function(res) {
        if (res.status === 'fail') {
          $form.find('.error').html('');
          $form.find('.error').html('<div class="alert alert-warning fade in" role="alert"><button type="button" class="close" data-dismiss="alert"><span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button><strong>Oops!</strong> ' + res.error + '</div>');
          $('.alert').alert();
        } else {
          window.location.href = "http://127.0.0.1:1337";
        }
      },
      error: function() {
        $form.find('.error').html('');
        $form.find('.error').html('<div class="alert alert-warning fade in" role="alert"><button type="button" class="close" data-dismiss="alert"><span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button><strong>Holy Shit!</strong> Something goes wrong here!</div>');
        $('.alert').alert();
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
      data: {
        name: name,
        email: email,
        pass: pass,
        repass: repass
      },
      dataType: "json",
      async: false,
      success: function(res) {
        if (res.status === 'fail') {
          $form.find('.error').html('');
          $form.find('.error').html('<div class="alert alert-warning fade in" role="alert"><button type="button" class="close" data-dismiss="alert"><span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button><strong>Oops!</strong> ' + res.error + '</div>');
          $('.alert').alert();
        } else {
          $form.find('.success').html('');
          $form.find('.success').html('<div class="alert alert-success fade in" role="alert"><button type="button" class="close" data-dismiss="alert"><span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button><strong>All right!</strong> ' + res.success + '</div>');
          $('.alert').alert();
        }
      },
      error: function() {
        $form.find('.error').html('');
        $form.find('.error').html('<div class="alert alert-warning fade in" role="alert"><button type="button" class="close" data-dismiss="alert"><span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button><strong>Holy Shit!</strong> Something goes wrong here!</div>');
        $('.alert').alert();
      }
    });
  });

  //comment show
  $('.comment-show').on('click', function() {
    var itemid = $(this).data('itemid');
    var $comment = $('#' + itemid);
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

    var modal = '<div class="modal fade" id="comment-post-modal" tabindex="-1" role="dialog" aria-labelledby="myPostModalLabel" aria-hidden="true"><div class="modal-dialog"><div class="modal-content"><div class="modal-header"><button type="button" class="close" data-dismiss="modal"><span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button><h4 class="modal-title" id="myModalLabel">' + '回复@' + username + '</h4></div><div class="modal-body"><div class="modal-comment-item"><div class="modal-comment-inner-left"><img class="img-rounded img-responsive nav-tooltip" src="' + avatar + '" title="' + username + '" width="48" height="48"></div><div class="modal-comment-inner-right"><div class="author-information"><a href="/u/' + username + '"><strong class="fullname">' + username + '</strong></a><small class="create-time"><a class="nav-tooltip" href="#">' + time + '</a></small></div><p>' + content + '</p></div></div><div class="comment-input-area"><textarea class="share-words" row="3">' + '@' + username + ' ' + '</textarea></div></div><div class="modal-footer"><button id="modal-post-btn" type="button" class="btn btn-primary btn-post-comment"><i class="fa fa-pencil-square-o"></i></button></div></div></div></div>';
    $('#comment-post-modal').remove();
    $('.wrap').append(modal);
    $('#comment-post-modal').modal();
  });
  //init drozpne
  Dropzone.options.myDropzone = {
    url: '/create/new',
    method: 'post',
    paramName: 'file',
    maxFilesize: 10,
    parallelUploads: 10,
    acceptedFiles: 'image/*',
    addRemoveLinks: true,
    autoProcessQueue: false,
    uploadMultiple: true,
    init: function() {
      var btnpost = document.getElementById('modal-post-btn');
      var btnlink = document.getElementById('attachment-link');
      var btnvideo = document.getElementById('attachment-video');
      var myDropzone = this;
      btnpost.addEventListener('click', function(e) {
          var content = $('#share-what-new').val();
          var link = $('#share-link').val();
          var video = $('#video-input').val();
          var selectval = $('#authorize-select').val();
          var question = $('#puzzle-input').val();
          var answer = $('#puzzle-answer').val();
          $('#hiddencontent').val(content);
          $('#hiddenlink').val(link);
          $('#hiddenvideo').val(video);
          $('#hiddenselect').val(selectval);
          $('#hiddenquestion').val(question);
          $('#hiddenanswer').val(answer);
          e.stopPropagation();
          if (myDropzone.files && myDropzone.files.length !== 0 && link === '' && video === '') {
              myDropzone.processQueue();
          } else {
              $('#my-dropzone').submit();
          }
      });
      btnlink.addEventListener('click', function() {
        var sharecontent = $('#share-what-new').val();
        myDropzone.removeAllFiles();
        if (sharecontent !== '') {
          $('#modal-post-btn').removeAttr('disabled');
        } else {
          $('#modal-post-btn').attr('disabled', 'disabled');
        }

      });
      btnvideo.addEventListener('click', function() {
        var sharecontent = $('#share-what-new').val();
        myDropzone.removeAllFiles();
        if (sharecontent !== '') {
          $('#modal-post-btn').removeAttr('disabled');
        } else {
          $('#modal-post-btn').attr('disabled', 'disabled');
        }
      });
      this.on('addedfile', function(file) {
        if (file) {
          $('#modal-post-btn').removeAttr('disabled');
        }
      });
      this.on('removedfile', function() {
        var sharecontent = $('#share-what-new').val();
        if (myDropzone.files.length === 0 && sharecontent === '') {
          $('#modal-post-btn').attr('disabled', 'disabled');
        }
      });
      this.on('successmultiple', function(file, req) {
          location.href = 'http://127.0.0.1:1337';
      });
    }
  };
  //attach-photo-link click
  $('.attach-photo-link').on('click', function() {
    $('#link-wrap').hide();
    $('#video-wrap').hide();
    $('#share-link').val('');
    $('#video-input').val('');
    $('#dropzone-wrap').show();
  });
  $('.attach-link-link').on('click', function() {
    $('#dropzone-wrap').hide();
    $('#video-wrap').hide();
    $('#video-input').val('');
    $('#link-wrap').show();
  });

  $('.attach-video-link').on('click', function() {
    $('#dropzone-wrap').hide();
    $('#link-wrap').hide();
    $('#share-link').val('');
    $('#video-wrap').show();
  });

  $('.attach-link-cancel').on('click', function() {
    $('.attach-link-input').val('');
  });

  $('.video-input-cancel').on('click', function() {
    $('#video-input').val('');
  });

  $('.puzzle-input-cancel').on('click', function() {
    $('#puzzle-input').val('');
    $('#puzzle-input').html('');
  });

  $('.puzzle-answer-cancel').on('click', function() {
    $('#puzzle-answer').val('');
  });

  // select change
  $('#authorize-select').on('change', function() {
    var value = $(this).val();
    if (value !== '0') {
      $('.question-wrap').show();
    } else {
      $('.question-wrap').hide();
    }
  });
  //bind keyup event to remove disabled of button post
  $('#share-what-new, #share-link, #video-input').on('keyup', function() {
    var value = $(this).val();
    if (value && value !== '') {
      $('#modal-post-btn').removeAttr('disabled');
    } else {
      $('#modal-post-btn').attr('disabled', 'disabled');
    }
  });


});