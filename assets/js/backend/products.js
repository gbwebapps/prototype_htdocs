if(controller === 'products'){

	$(document).on('change', '#select_brand_id', function(e){
		if($(this).val() == ''){
			$('#categoriesProducts').prop("disabled", true);
			categoriesDropdown(0);
		} else {
			$('#categoriesProducts').prop("disabled", false);
			categoriesDropdown($(this).val());
		}
	});

	function categoriesDropdown(id){

		// CSRF Hash
		var csrfName = $('.csrf').attr('name'); // CSRF Token name
		var csrfHash = $('.csrf').val(); // CSRF hash

		var jqxhr = $.ajax({
		    url: urlbase + 'admin/products/categoriesDropdown',
		    headers: {'X-Requested-With': 'XMLHttpRequest'},
		    method: 'post',
		    data: { id: id, [csrfName]: csrfHash }, 
		    dataType: 'json', 
		    beforeSend: function(){
		        $(".btn").prop("disabled", true);
		        $('#showLoader').css('display', 'block').html('<img src="' + urlbase + 'assets/img/ajax-loader.gif">');
		    }
		}).done(function(data){

		    // Update CSRF hash
		    $('.csrf').val(data.token);

		    $('#categoriesProducts').html(data.output);

		}).fail(function(jqXHR, textStatus, error){
		    toastr.error(error);
		}).always(function(){
		    $(".btn").prop("disabled", false);
		    $('#showLoader').css('display', 'none').html('');
		});
	}

	// Starting the price calculate zone mechanism
	var type = 'net_tax_final';

	// Listener to change price calculate zone
	$(document).on('click', '#reverseBtn', function(e){
		e.preventDefault();

		var type = $(this).data('type');
		var id = $(this).data('id');

		priceCalculateZone(type, id);
	});

	// Function to change price calculate zone
	function priceCalculateZone(type, id)
	{
		// CSRF Hash
		var csrfName = $('.csrf').attr('name'); // CSRF Token name
		var csrfHash = $('.csrf').val(); // CSRF hash

		var jqxhr = $.ajax({
		    url: urlbase + 'admin/products/priceCalculateZone',
		    headers: {'X-Requested-With': 'XMLHttpRequest'},
		    method: 'post',
		    data: { id: id, type: type, [csrfName]: csrfHash }, 
		    dataType: 'json', 
		    beforeSend: function(){
		        $(".btn").prop("disabled", true);
		        $('#showLoader').css('display', 'block').html('<img src="' + urlbase + 'assets/img/ajax-loader.gif">');
		    }
		}).done(function(data){

		    // Update CSRF hash
		    $('.csrf').val(data.token);

		    $('#priceCalculateZone').html(data.output).hide().fadeIn(200);

		}).fail(function(jqXHR, textStatus, error){
		    toastr.error(error);
		}).always(function(){
		    $(".btn").prop("disabled", false);
		    $('#showLoader').css('display', 'none').html('');
		});
	}

	switch(action){

		case 'index':
			// Some code here
		break;

		case 'showAll':
			/* Manage search input posts */
			var product = $('#product').val();
			(product != '') ? $('#product').closest('.input-group').find('.resetSearchFields').css('display', 'block') : null;
			var brand_id = $('#brand_id').val();
			// (brand_id != '') ? $('#brand_id').closest('.input-group').find('.resetSearchFields').css('display', 'block') : null;

			/* Add search input posts */
			posts.searchFields['product'] = product;
			posts.searchFields['brand_id'] = brand_id;

			/* Create search input listener */
			searchFieldsListener('keyup', ['product']);
			searchFieldsListener('change', ['brand_id']);
			
			// Calling to the main function to list all records
			showAllAction();
		break;

		case 'add':
			priceCalculateZone(type);
		break;

		case 'edit':
			// I grab some values to calculate on fly the new available quantity after typed the new absolute quantity
			var old_quantity = $('#initial_quantity').val();
			var old_available = $('#available').val();

			// Listener for change quantity product
			$(document).on('keyup', '#initial_quantity', function(){
				var quantity = $(this).val();
				if(quantity != ''){
					if (globalTimeout != null) {
					    clearTimeout(globalTimeout);
					}
					globalTimeout = setTimeout(function() {
					    globalTimeout = null;  
					    checkProductQuantity(quantity, $("input[name='id']").val());
					}, delayTime);
				}
			});

			function checkProductQuantity(quantity, id)
			{
				// CSRF Hash
				var csrfName = $('.csrf').attr('name'); // CSRF Token name
				var csrfHash = $('.csrf').val(); // CSRF hash
				
				var jqxhr = $.ajax({
				    url: urlbase + 'admin/products/checkProductQuantity',
				    headers: {'X-Requested-With': 'XMLHttpRequest'},
				    method: 'post',
				    data: { id: id, quantity: quantity, [csrfName]: csrfHash }, 
				    dataType: 'json', 
				    beforeSend: function(){
				        $(".btn").prop("disabled", true);
				        $('#showLoader').css('display', 'block').html('<img src="' + urlbase + 'assets/img/ajax-loader.gif">');
				    }
				}).done(function(data){

				    // Update CSRF hash
				    $('.csrf').val(data.token);

				    if(data.result == false){
				        toastr.error(data.message);
				    } else {
				    	var new_quantity = $('#initial_quantity').val();
				    	var diff = Number(new_quantity) - Number(old_quantity);
				    	var new_available = Number(old_available) + Number(diff);
				    	$('#available').val(new_available);
				    }

				}).fail(function(jqXHR, textStatus, error){
				    toastr.error(error);
				}).always(function(){
				    $(".btn").prop("disabled", false);
				    $('#showLoader').css('display', 'none').html('');
				});
			}

			priceCalculateZone(type, $("input[name='id']").val());
			showGalleryOne($("input[name='id']").val(), 'edit');
		break;

		case 'show':
			showGalleryOne($("#id").data('value'), 'show');
		break;

	}

}