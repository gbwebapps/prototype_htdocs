if(controller = 'auth'){

    switch(action){

        case 'login':

            $(document).on('submit', '#auth_login', function(e){
                e.preventDefault();
                var formData = new FormData(this);
                loginAction(formData);
            });

            function loginAction(formData)
            {
                // CSRF Hash
                var csrfName = $('.csrf').attr('name'); // CSRF Token name
                var csrfHash = $('.csrf').val(); // CSRF hash

                formData.append([csrfName], csrfHash);

                var jqxhr = $.ajax({
                    url: urlbase + 'admin/auth/login',
                    headers: {'X-Requested-With': 'XMLHttpRequest'},
                    method: 'post',
                    dataType: 'json', 
                    data: formData, 
                    contentType: false, 
                    cache: false,
                    processData: false,
                    beforeSend: function(){
                        $(".btn").prop("disabled", true);
                        $('#showLoader').css('display', 'block').html('<img src="' + urlbase + 'assets/img/ajax-loader.gif">');
                    }
                }).done(function(data){

                    // Update CSRF hash
                    $('.csrf').val(data.token);

                    $("div[class^='error_']").empty();
                    $('#auth_login').get(0).reset();

                    if(data.errors){
                        $.each(data.errors, function(key, value) {
                            var element = $(".error_" + key);
                            element.html(value);
                        });
                        toastr.error(data.message);
                        $('#email').focus();
                    } else {
                        if(data.result == true) {
                            window.location.href = urlbase + 'admin/dashboard';
                        } else if(data.result == false){
                            toastr.error(data.message);
                            $('#email').focus();
                        }
                    }
                }).fail(function(jqXHR, textStatus, error){
                    toastr.error(error);
                }).always(function(){
                    $(".btn").prop("disabled", false);
                    $('#showLoader').css('display', 'none').html('');
                });
            }

        break;

        case 'recovery':

            $(document).on('submit', '#auth_recovery', function(e){
                e.preventDefault();
                var formData = new FormData(this);
                recoveryAction(formData);
            });

            function recoveryAction(formData)
            {
                // CSRF Hash
                var csrfName = $('.csrf').attr('name'); // CSRF Token name
                var csrfHash = $('.csrf').val(); // CSRF hash

                formData.append([csrfName], csrfHash);

                var jqxhr = $.ajax({
                    url: urlbase + 'admin/auth/recovery',
                    headers: {'X-Requested-With': 'XMLHttpRequest'},
                    method: 'post',
                    dataType: 'json', 
                    data: formData, 
                    contentType: false, 
                    cache: false,
                    processData: false,
                    beforeSend: function(){
                        $(".btn").prop("disabled", true);
                        $('#showLoader').css('display', 'block').html('<img src="' + urlbase + 'assets/img/ajax-loader.gif">');
                    }
                }).done(function(data){

                    // Update CSRF hash
                    $('.csrf').val(data.token);

                    $("div[class^='error_']").empty();
                    $('#auth_recovery').get(0).reset();

                    if(data.errors){
                        $.each(data.errors, function(key, value) {
                            var element = $(".error_" + key);
                            element.html(value);
                        });
                        toastr.error(data.message);
                    } else {
                        if(data.result == true) {
                            toastr.success(data.message);
                        } else if(data.result == false){
                            toastr.error(data.message);
                        }
                    }
                }).fail(function(jqXHR, textStatus, error){
                    toastr.error(error);
                }).always(function(){
                    $(".btn").prop("disabled", false);
                    $('#showLoader').css('display', 'none').html('');
                });
            }

        break;

        case 'set_password':
        
            $(document).on('submit', '#auth_set_password', function(e){
                e.preventDefault();
                var formData = new FormData(this);
                setPasswordAction(formData);
            });

            function setPasswordAction(formData)
            {
                // CSRF Hash
                var csrfName = $('.csrf').attr('name'); // CSRF Token name
                var csrfHash = $('.csrf').val(); // CSRF hash

                formData.append([csrfName], csrfHash);

                var jqxhr = $.ajax({
                    url: urlbase + 'admin/auth/setPassword/' + formData.get('code'),
                    headers: {'X-Requested-With': 'XMLHttpRequest'},
                    method: 'post',
                    dataType: 'json', 
                    data: formData, 
                    contentType: false, 
                    cache: false,
                    processData: false,
                    beforeSend: function(){
                        $(".btn").prop("disabled", true);
                        $('#showLoader').css('display', 'block').html('<img src="' + urlbase + 'assets/img/ajax-loader.gif">');
                    }
                }).done(function(data){

                    // Update CSRF hash
                    $('.csrf').val(data.token);

                    $("div[class^='error_']").empty();
                    $('#auth_set_password').get(0).reset();

                    if(data.errors){
                        $.each(data.errors, function(key, value) {
                            var element = $(".error_" + key);
                            element.html(value);
                        });
                        toastr.error(data.message);
                        $('#password').focus();
                    } else {
                        if(data.result == true) {
                            toastr.success(data.message);
                        } else if(data.result == false){
                            toastr.error(data.message);
                        }

                        $('#password').focus();
                    }
                }).fail(function(jqXHR, textStatus, error){
                    toastr.error(error);
                }).always(function(){
                    $(".btn").prop("disabled", false);
                    $('#showLoader').css('display', 'none').html('');
                });
            }

        break;

    }

}