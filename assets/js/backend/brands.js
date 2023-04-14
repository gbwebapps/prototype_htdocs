if(controller === 'brands'){

	switch(action){

		case 'index':
			// Some code here
		break;

		case 'showAll':
			/* Manage search input posts */
			var brand = $('#brand').val();
			(brand != '') ? $('#brand').closest('.input-group').find('.resetSearchFields').css('display', 'block') : null;

			/* Add search input posts */
			posts.searchFields['brand'] = brand;

			/* Create search input listener */
			searchFieldsListener('keyup', ['brand']);
			
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