if(controller == 'customers'){

	switch(action){

		case 'index':
			// Some code here
		break;

		case 'showAll':
			/* Manage search input posts */
			var customer = $('#customer').val();
			(customer != '') ? $('#customer').closest('.input-group').find('.resetSearchFields').css('display', 'block') : null;
			var tax_code = $('#tax_code').val();
			(tax_code != '') ? $('#tax_code').closest('.input-group').find('.resetSearchFields').css('display', 'block') : null;
			var email = $('#email').val();
			(email != '') ? $('#email').closest('.input-group').find('.resetSearchFields').css('display', 'block') : null;
			var phone = $('#phone').val();
			(phone != '') ? $('#phone').closest('.input-group').find('.resetSearchFields').css('display', 'block') : null;

			/* Add search input posts */
			posts.searchFields['customer'] = customer;
			posts.searchFields['tax_code'] = tax_code;
			posts.searchFields['email'] = email;
			posts.searchFields['phone'] = phone;

			/* Create search input listener */
			searchFieldsListener('keyup', ['customer', 'tax_code', 'email', 'phone']);
			
			// Calling to the main function to list all records
			showAllAction();
		break;

		case 'add':
		break;

		case 'edit':
			showGalleryOne($("input[name='id']").val(), 'edit');
		break;

		case 'show':
			showGalleryOne($("#id").data('value'), 'show');
		break;

	}

}