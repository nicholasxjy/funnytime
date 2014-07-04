/**
 * Created by nicholas_xue on 14-6-24.
 */
$(document).ready(function() {

  //tooltip init
  $('.nav-tooltip').tooltip();

  //popover
  $('.info-popover').popover();

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
      this.on('successmultiple', function(file, res) {
          if (res.status === 'fail') {
            $('#post-warning').html('');
            $('#post-warning').html('<div class="alert alert-warning fade in" role="alert"><button type="button" class="close" data-dismiss="alert"><span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button><strong>Oops!</strong> ' + res.error + '</div>');
            $('.alert').alert();
          } else {
            window.location.href = 'http://127.0.0.1:1337';
          }
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

  // setting form submit
  $('.setting-btn-submit').on('click', function() {
    $('.setting-form-wrap').find('form').submit();
  });

  // follow post
  $('.follow-btn').on('click', function() {
    var self = $(this);
    var userid = self.data('userid');
    var action = self.data('action');
    var count = $('.following-users-count').text();
    count = parseInt(count);
    $.ajax({
      url: '/u/follow',
      type: 'POST',
      dataType: 'json',
      data: {userid: userid, action: action},
      success: function(data) {
        if (data.status === 'success') {
          if (action === 'follow') {
            $('.following-users-count').text(count+1);
            self.text('已关注').removeClass('btn-info').addClass('btn-danger');
            self.data('action', 'unfollow');
          } else {
            $('.following-users-count').text(count-1 || 0);
            self.text('加入关注').removeClass('btn-danger').addClass('btn-info');
            self.data('action', 'follow');
          }
        }
      },
      error: function() {
        alert('Oops, something gose wrong here!');
      }
    });
  });
});