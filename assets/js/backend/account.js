if(controller == 'account'){

	switch(action){

		case 'edit_account':

			// Listener for edit
			$(document).on('submit', '#edit_account', function(e){
			    e.preventDefault();
			    var formData = new FormData(this);
			    editAccount(formData);
			});

			// Action for edit
			function editAccount(formData){
			    
			    // CSRF Hash
			    var csrfName = $('.csrf').attr('name'); // CSRF Token name
			    var csrfHash = $('.csrf').val(); // CSRF hash

			    formData.append([csrfName], csrfHash);

			    var jqxhr = $.ajax({
			        url: urlbase + 'admin/account/edit',
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

			        if(data.errors){
			            $("div[class^='error_']").empty();
			            $.each(data.errors, function(key, value) {
			                var element = $(".error_" + key);
			                element.html(value);
			            });
			            toastr.error(data.message);
			        } else {

			            $("div[class^='error_']").empty();

			            if(data.result === true) {
			                toastr.success(data.message);
			                $('#showData').html(data.output);
			                $('#menuTop').html(data.menuTop);
			            } else if(data.result === false){
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

			// Listener for refresh
			$(document).on('click', '#refresh_account', function(e){
			    e.preventDefault();
			    var message = $(this).data('message');
			    refreshAccount(message);
			});

			// Action for refresh
			function refreshAccount(message){
			    if(confirm(message)){

			        // CSRF Hash
			        var csrfName = $('.csrf').attr('name'); // CSRF Token name
			        var csrfHash = $('.csrf').val(); // CSRF hash

			        var jqxhr = $.ajax({
			            url: urlbase + 'admin/account/edit',
			            headers: {'X-Requested-With': 'XMLHttpRequest'},
			            method: 'post',
			            data: { action: 'refreshAccount', [csrfName]: csrfHash }, 
			            dataType: 'json', 
			            beforeSend: function(){
			                $(".btn").prop("disabled", true);
			                $('#showLoader').css('display', 'block').html('<img src="' + urlbase + 'assets/img/ajax-loader.gif">');
			            }
			        }).done(function(data){

			            // Update CSRF hash
			            $('.csrf').val(data.token);

			            $('#showData').html(data.output);

			        }).fail(function(jqXHR, textStatus, error){
			            toastr.error(error);
			        }).always(function(){
			            $(".btn").prop("disabled", false);
			            $('#showLoader').css('display', 'none').html('');
			        });
			    }
			}

		break;

		case 'permissions':
			// Some code here
		break;

		case 'reset':
			
			$(document).on('submit', '#reset_account', function(e){
				e.preventDefault();
				var message = $(this).data('message');
				var formData = new FormData(this);
				resetAccount(message, formData);
			});

			function resetAccount(message, formData)
			{
				if(confirm(message)){

				// CSRF Hash
				var csrfName = $('.csrf').attr('name'); // CSRF Token name
				var csrfHash = $('.csrf').val(); // CSRF hash

				formData.append([csrfName], csrfHash);

				var jqxhr = $.ajax({
				    url: urlbase + 'admin/account/reset',
				    headers: {'X-Requested-With': 'XMLHttpRequest'},
				    method: 'post',
				    dataType: 'json', 
				    data: formData, 
				    contentType: false, 
				    cache: false,
				    processData: false,
				    beforeSend: function(){
				        $('#showLoader').css('display', 'block').html('<img src="' + urlbase + 'assets/img/ajax-loader.gif">');
				    }
					}).done(function(data){

					    // Update CSRF hash
					    $('.csrf').val(data.token);

					    if(data.errors){
					        toastr.error(data.message);
					    } else {

						    if(data.result === true){
					        	toastr.success(data.message);
					            $('#showData').html(data.output);
						    } else if(data.result === false) {
						    	toastr.error(data.message);
						    }

						}

					}).fail(function(jqXHR, textStatus, error){
					    toastr.error(error);
					}).always(function(){
					    $('#showLoader').css('display', 'none').html('');
					});
				}
			}

		break;

		case 'images':

			$(document).on('submit', '#images_account', function(e){
				e.preventDefault();
				var formData = new FormData(this);
				accountImages(formData);
			});

			function accountImages(formData)
			{
				// CSRF Hash
				var csrfName = $('.csrf').attr('name'); // CSRF Token name
				var csrfHash = $('.csrf').val(); // CSRF hash

				formData.append([csrfName], csrfHash);

				var jqxhr = $.ajax({
				    url: urlbase + 'admin/account/images',
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

				    if(data.errors){
				        $("div[class^='error_']").empty();
				        $.each(data.errors, function(key, value) {
				            var element = $(".error_" + key);
				            element.html(value);
				        });
				        toastr.error(data.message);
				    } else {

				        $("div[class^='error_']").empty();

				        if(data.result == true) {
				            toastr.success(data.message);
				            $('#showData').html(data.output);
				            $('#menuTop').html(data.menuTop);
				            showGalleryOne($("#id").data('value'), 'edit');
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

			showGalleryOne($("#id").data('value'), 'edit');

		break;

		case 'tokens':
			
			// Calling to the main function to list all tokens
			showTokens($("#id").data('value'));

		break;

	}

}