/**
 * Created by nicholas_xue on 14-6-24.
 */
$(document).ready(function() {
    $('#btn-signin').click(function(event) {
        var $form = $('#signin-wrap').find('form');
        var name = $form.find('input[name="name"]').val();
        var pass = $form.find('input[name="pass"]').val();
        $.ajax({
            url: '/signin',
            type: 'POST',
            data: {name: name, pass: pass},
            async: false,
            dataType: 'json',
            success: function(res) {
               if (res.status === 'fail') {
                   $form.find('.error').append('<div class="form-group"><div class="alert alert-warning"><strong>'
                   + res.error
                   +'</strong></div></div>');
                return;
               } else {
                   window.location.href="http://127.0.0.1:1337";
                   return;
               }
            },
            complete: function() {
                return;
            },
            error: function() {
                alert('Something wrong here!');
            }
        });
    });
    $('#btn-signup').click(function(event) {
        var $form = $('#signup-wrap').find('form');
        var name = $form.find('input[name="name"]').val();
        var email = $form.find('input[name="email"]').val();
        var pass = $form.find('input[name="pass"]').val();
        var repass = $form.find('input[name="repass"]').val();
        $.ajax({
            url: '/signup',
            type: 'POST',
            data: {name: name, email: email, pass: pass, repass: repass},
            async: false,
            dataType: 'json',
            success: function(res) {
               if (res.status === 'fail') {
                   $form.find('.error').append('<div class="form-group"><div class="alert alert-warning"><strong>'
                       + res.error
                       + '</strong></div></div>');
                    return;
               }
            },
            complete: function() {
                return;
            },
            error: function() {
                alert('Something wrong here!');
            }
        });
    });
});