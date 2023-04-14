if(controller == 'categories'){

	switch(action){

		case 'index':
			// Some code here
		break;

		case 'showAll':
			/* Manage search input posts */
			var category = $('#category').val();
			(category != '') ? $('#category').closest('.input-group').find('.resetSearchFields').css('display', 'block') : null;

			/* Add search input posts */
			posts.searchFields['category'] = category;

			/* Create search input listener */
			searchFieldsListener('keyup', ['category']);
			
			// Calling to the main function to list all records
			showAllAction();
		break;

		case 'add':
			// Some code here
		break;

		case 'edit':
			showGalleryOne($("input[name='id']").val(), 'edit');
		break;

		case 'show':
			showGalleryOne($("#id").data('value'), 'show');
		break;

	}

}