/**
 * Created by nicholas_xue on 14-6-24.
 */
$(document).ready(function() {
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
});