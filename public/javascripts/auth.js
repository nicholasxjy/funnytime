$(document).ready(function() {
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
});