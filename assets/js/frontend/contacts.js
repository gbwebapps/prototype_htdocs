var request;

// Listener for contacts
$(document).on('submit', '#contacts_form', function(e){
    e.preventDefault();
    var formData = new FormData(this);
    contacts_action(formData);
});

// Action for contacts
function contacts_action(formData){

    if (request) { request.abort(); }

    grecaptcha.ready(function () {
        grecaptcha.execute('6LcXSU4jAAAAAEvY4KUpcRew5yDenLOCPcOnr7Qv', {action: 'submit'}).then(function (token) {

            formData.append('g-recaptcha-response', token);

            // CSRF Hash
            var csrf_name = $('.csrf').prop('name');
            var csrf_value = $('.csrf').val();
            formData.append([csrf_name], csrf_value);

            var jqxhr = $.ajax({
                url: urlbase + controller,
                headers: {'X-Requested-With': 'XMLHttpRequest'},
                method: 'post',
                dataType: 'json', 
                data: formData, 
                contentType: false, 
                cache: false,
                processData: false,
                beforeSend: function(){
                    $(".btn-primary, .btn-danger, .btn-success, .btn-info").prop("disabled", true);
                    $('#show_loader').css('display', 'block').html('<img src="' + urlbase + 'assets/img/ajax-loader.gif">');
                }
            }).done(function(data){

                // Update CSRF hash
                $('.csrf').val(data.token);
                
                if(data.errors){
                    $("small[class^='error_']").empty();
                    $.each(data.errors, function(key, value) {
                        var element = $(".error_" + key);
                        element.html(value);
                    });
                    toastr.error(data.message);
                } else {
                    $("small[class^='error_']").empty();
                    $('#contacts_form').get(0).reset();

                    if(data.result == true) {
                        toastr.success(data.message);
                    } else if(data.result == false){
                        toastr.error(data.message);
                    }
                }

            }).fail(function(jqXHR, textStatus, error){
                toastr.error(error);
            }).always(function(){
                $(".btn-primary, .btn-danger, .btn-success, .btn-info").prop("disabled", false);
                $('#show_loader').css('display', 'none').html('');
            });

        });

    });
}