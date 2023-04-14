if(controller == 'sellers'){

	$(document).on('submit', '.changeStatus', function(e){
		e.preventDefault();
		var from = $(this).data('from');
		var message = $(this).data('message');
		var action = 'changeStatus';
		var formData = new FormData(this);
		changeAction(from, message, action, formData);
	});

	$(document).on('submit', '.resetPsw', function(e){
		e.preventDefault();
		var from = $(this).data('from');
		var message = $(this).data('message');
		var action = 'resetPsw';
		var formData = new FormData(this);
		changeAction(from, message, action, formData);
	});

	function changeAction(from, message, action, formData)
	{
		if(confirm(message)){

		// CSRF Hash
		var csrfName = $('.csrf').attr('name'); // CSRF Token name
		var csrfHash = $('.csrf').val(); // CSRF hash

		formData.append([csrfName], csrfHash);

		var jqxhr = $.ajax({
		    url: urlbase + 'admin/sellers/' + action,
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

				    if(data.result == true){
				    	toastr.success(data.message);
				   
				    	if(from == 'showAll'){
				    		showAllAction();
				    	} else if(from == 'show') {
				    		show($("#id").data('value'));
				    	}

				    } else if(data.result == false) {
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

	$(document).on('click', '.select_all', function(e){
		e.preventDefault();
		var controller = $(this).data('controller');
		if($('input:checkbox[class="' + controller + '"]').is(':checked')){
			$('input:checkbox[class="' + controller + '"]').prop('checked', false);
		}else{
			$('input:checkbox[class="' + controller + '"]').prop('checked', true);
		}
	});

	switch(action){

		case 'index':
			// Some code here
		break;

		case 'showAll':
			/* Manage search input posts */
			var firstname = $('#firstname').val();
			(firstname != '') ? $('#firstname').closest('.input-group').find('.resetSearchFields').css('display', 'block') : null;
			var lastname = $('#lastname').val();
			(lastname != '') ? $('#lastname').closest('.input-group').find('.resetSearchFields').css('display', 'block') : null;
			var email = $('#email').val();
			(email != '') ? $('#email').closest('.input-group').find('.resetSearchFields').css('display', 'block') : null;
			var phone = $('#phone').val();
			(phone != '') ? $('#phone').closest('.input-group').find('.resetSearchFields').css('display', 'block') : null;

			/* Add search input posts */
			posts.searchFields['firstname'] = firstname;
			posts.searchFields['lastname'] = lastname;
			posts.searchFields['email'] = email;
			posts.searchFields['phone'] = phone;

			/* Create search input listener */
			searchFieldsListener('keyup', ['firstname', 'lastname', 'email', 'phone']);
			
			// Calling to the main function to list all records
			showAllAction();
		break;

		case 'add':
		break;

		case 'edit':
			showGalleryOne($("input[name='id']").val(), 'edit');
		break;

		case 'show':
			$(document).on('click', '.changePermission', function(e){
				e.preventDefault();
				var message = $(this).data('message');
				var formData = new FormData(this);
				changePermission(message, formData);
			});

			function changePermission(message, formData)
			{
				if(confirm(message)){

				// CSRF Hash
				var csrfName = $('.csrf').attr('name'); // CSRF Token name
				var csrfHash = $('.csrf').val(); // CSRF hash

				formData.append([csrfName], csrfHash);

				var jqxhr = $.ajax({
				    url: urlbase + 'admin/sellers/changePermission',
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

						    if(data.result == true){
						    	toastr.success(data.message);
						   
						    	show($("#id").data('value'));

						    } else if(data.result == false) {
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
			
			function show(id)
			{
				// CSRF Hash
				var csrfName = $('.csrf').attr('name'); // CSRF Token name
				var csrfHash = $('.csrf').val(); // CSRF hash

				var jqxhr = $.ajax({
				    url: urlbase + 'admin/sellers/show/' + id,
				    headers: {'X-Requested-With': 'XMLHttpRequest'},
				    method: 'get',
				    dataType: 'json',
				    beforeSend: function(){
				        $('#showLoader').css('display', 'block').html('<img src="' + urlbase + 'assets/img/ajax-loader.gif">');
				    }
				}).done(function(data){

				    // Update CSRF hash
				    $('.csrf').val(data.token);

				    $('#showData').html(data.output);
				    showGalleryOne(id, 'show');
				    showTokens(id);

				}).fail(function(jqXHR, textStatus, error){
				    toastr.error(error);
				}).always(function(){
				    $('#showLoader').css('display', 'none').html('');
				});
			}
			showGalleryOne($("#id").data('value'), 'show');
			showTokens($("#id").data('value'));
		break;

		case 'tokens':
			showTokens();
		break;

	}

}