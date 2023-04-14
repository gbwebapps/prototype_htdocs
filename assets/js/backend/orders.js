if(controller == 'orders'){

	$(document).on('click', '#getProductRow', function(e){
		e.preventDefault();
		getProductRow();
	});

	function getProductRow()
	{
		// CSRF Hash
		var csrfName = $('.csrf').attr('name'); // CSRF Token name
		var csrfHash = $('.csrf').val(); // CSRF hash

		var jqxhr = $.ajax({
		    url: urlbase + 'admin/orders/getProductRow',
		    headers: {'X-Requested-With': 'XMLHttpRequest'},
		    method: 'post',
		    data: { [csrfName]: csrfHash }, 
		    dataType: 'json', 
		    beforeSend: function(){
		        $(".btn").prop("disabled", true);
		        $('#showLoader').css('display', 'block').html('<img src="' + urlbase + 'assets/img/ajax-loader.gif">');
		    }
		}).done(function(data){

		    // Update CSRF hash
		    $('.csrf').val(data.token);

		    $('#productRows').append($(data.output).hide().fadeIn(200));

		}).fail(function(jqXHR, textStatus, error){
		    toastr.error(error);
		}).always(function(){
		    $(".btn").prop("disabled", false);
		    $('#showLoader').css('display', 'none').html('');
		});
	}

	$(document).on('click', '.removeProductRow', function(e) {
		e.preventDefault();
		var uniqid = $(this).data('uniqid');
		removeProductRow(uniqid);
	});

	function removeProductRow(uniqid)
	{
		$('#row_' + uniqid).fadeOut(200, function() {
		    $('#row_' + uniqid).remove();
		});
	}

	$(document).on('change', '.brand_id', function(e){

		var uniqid = $(this).data('uniqid');

		$('.product_' + uniqid).prop("disabled", true);

		productsDropdown(0, uniqid, 0);

		$('#net_price_' + uniqid).val('0.00');
		$('#tax_amount_' + uniqid).val('0.00');
		$('#gross_price_' + uniqid).val('0.00');
		$('#total_net_price_' + uniqid).val('0.00');
		$('#total_tax_amount_' + uniqid).val('0.00');
		$('#total_gross_price_' + uniqid).val('0.00');
		$('.quantity_' + uniqid).val('').prop("disabled", true);
		$('.showTax_' + uniqid).text('');

		if($(this).val() == ''){

			$('.category_' + uniqid).prop("disabled", true);
			categoriesDropdown(0, uniqid);

			$('#net_price_' + uniqid).val('0.00');
			$('#tax_amount_' + uniqid).val('0.00');
			$('#gross_price_' + uniqid).val('0.00');
			$('#total_net_price_' + uniqid).val('0.00');
			$('#total_tax_amount_' + uniqid).val('0.00');
			$('#total_gross_price_' + uniqid).val('0.00');
			$('.quantity_' + uniqid).val('').prop("disabled", true);
			$('.showTax_' + uniqid).text('');

		} else {

			$('.category_' + uniqid).prop("disabled", false);
			categoriesDropdown($(this).val(), uniqid);

		}

	});

	$(document).on('change', '.category_id', function(e){

		var uniqid = $(this).data('uniqid');

		$('.product_' + uniqid).prop("disabled", true);

		$('#net_price_' + uniqid).val('0.00');
		$('#tax_amount_' + uniqid).val('0.00');
		$('#gross_price_' + uniqid).val('0.00');
		$('#total_net_price_' + uniqid).val('0.00');
		$('#total_tax_amount_' + uniqid).val('0.00');
		$('#total_gross_price_' + uniqid).val('0.00');
		$('.quantity_' + uniqid).val('').prop("disabled", true);
		$('.showTax_' + uniqid).text('');

		if($(this).val() == ''){

			$('.product_' + uniqid).prop("disabled", true);
			productsDropdown(0, uniqid, 0);

			$('#net_price_' + uniqid).val('0.00');
			$('#tax_amount_' + uniqid).val('0.00');
			$('#gross_price_' + uniqid).val('0.00');
			$('#total_net_price_' + uniqid).val('0.00');
			$('#total_tax_amount_' + uniqid).val('0.00');
			$('#total_gross_price_' + uniqid).val('0.00');
			$('.quantity_' + uniqid).val('').prop("disabled", true);
			$('.showTax_' + uniqid).text('');

		} else {

			var brand_id = $('.brand_' + uniqid).val();
			$('.product_' + uniqid).prop("disabled", false);
			productsDropdown($(this).val(), uniqid, brand_id);

		}

	});

	$(document).on('change', '.product_id', function(e){

		var uniqid = $(this).data('uniqid');

		var selected = $(this).find('option:selected');

		$('#total_net_price_' + uniqid).val('0.00');
		$('#total_tax_amount_' + uniqid).val('0.00');
		$('#total_gross_price_' + uniqid).val('0.00');
		$('.quantity_' + uniqid).val('').prop("disabled", true);
		$('.showTax_' + uniqid).text('');

		if($(this).val() == ''){

			$('#net_price_' + uniqid).val('0.00');
			$('#tax_amount_' + uniqid).val('0.00');
			$('#gross_price_' + uniqid).val('0.00');
			$('#total_net_price_' + uniqid).val('0.00');
			$('#total_tax_amount_' + uniqid).val('0.00');
			$('#total_gross_price_' + uniqid).val('0.00');
			$('.quantity_' + uniqid).val('').prop("disabled", true);
			$('.showTax_' + uniqid).text('');

		} else {

			var net_price = Number(selected.attr('net_price'));
			var tax_amount = Number(selected.attr('tax_amount'));
			var gross_price = Number(selected.attr('gross_price'));
			$('#net_price_' + uniqid).val(net_price.toFixed(2));
			$('#tax_amount_' + uniqid).val(tax_amount.toFixed(2));
			$('#gross_price_' + uniqid).val(gross_price.toFixed(2));
			$('.quantity_' + uniqid).val('').prop("disabled", false);
			$('.showTax_' + uniqid).text('(' + selected.attr('tax_percentage') + '%)');

		}

	});

	$(document).on('keyup', '.quantity', function(){

		var uniqid = $(this).data('uniqid');
		var quantity = $(this).val();

		if(quantity != ''){
			if (globalTimeout != null) {
			    clearTimeout(globalTimeout);
			}
			globalTimeout = setTimeout(function() {
			    globalTimeout = null;  

			    var productid = $('#product_id_' + uniqid).val();

			    var orderid = (action == 'edit') ? $("input[name='id']").val() : null;
			    checkOrderQuantity(productid, quantity, orderid);
			}, delayTime);

			var total_net_price = Number(quantity * $('#net_price_' + uniqid).val());
			var total_tax_amount = Number(quantity * $('#tax_amount_' + uniqid).val());
			var total_gross_price = Number(quantity * $('#gross_price_' + uniqid).val());
			
			$('#total_net_price_' + uniqid).val(total_net_price.toFixed(2));
			$('#total_tax_amount_' + uniqid).val(total_tax_amount.toFixed(2));
			$('#total_gross_price_' + uniqid).val(total_gross_price.toFixed(2));
		}

	});

	function productsDropdown(category_id, uniqid, brand_id)
	{
		// CSRF Hash
		var csrfName = $('.csrf').attr('name'); // CSRF Token name
		var csrfHash = $('.csrf').val(); // CSRF hash

		var jqxhr = $.ajax({
		    url: urlbase + 'admin/orders/productsDropdown',
		    headers: {'X-Requested-With': 'XMLHttpRequest'},
		    method: 'post',
		    data: { category_id: category_id, brand_id: brand_id, [csrfName]: csrfHash }, 
		    dataType: 'json', 
		    beforeSend: function(){
		        $(".btn").prop("disabled", true);
		        $('#showLoader').css('display', 'block').html('<img src="' + urlbase + 'assets/img/ajax-loader.gif">');
		    }
		}).done(function(data){

		    // Update CSRF hash
		    $('.csrf').val(data.token);

		    $('.product_' + uniqid).html(data.output);

		}).fail(function(jqXHR, textStatus, error){
		    toastr.error(error);
		}).always(function(){
		    $(".btn").prop("disabled", false);
		    $('#showLoader').css('display', 'none').html('');
		});
	}

	function categoriesDropdown(id, uniqid)
	{
		// CSRF Hash
		var csrfName = $('.csrf').attr('name'); // CSRF Token name
		var csrfHash = $('.csrf').val(); // CSRF hash

		var jqxhr = $.ajax({
		    url: urlbase + 'admin/orders/categoriesDropdown',
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

		    $('.category_' + uniqid).html(data.output);

		}).fail(function(jqXHR, textStatus, error){
		    toastr.error(error);
		}).always(function(){
		    $(".btn").prop("disabled", false);
		    $('#showLoader').css('display', 'none').html('');
		});
	}

	function checkOrderQuantity(productid, quantity, orderid)
	{
		// CSRF Hash
		var csrfName = $('.csrf').attr('name'); // CSRF Token name
		var csrfHash = $('.csrf').val(); // CSRF hash

		var jqxhr = $.ajax({
		    url: urlbase + 'admin/orders/checkOrderQuantity',
		    headers: {'X-Requested-With': 'XMLHttpRequest'},
		    method: 'post',
		    data: { productid: productid, quantity: quantity, orderid: orderid, [csrfName]: csrfHash }, 
		    dataType: 'json', 
		    beforeSend: function(){
		        $(".btn").prop("disabled", true);
		        $('#showLoader').css('display', 'block').html('<img src="' + urlbase + 'assets/img/ajax-loader.gif">');
		    }
		}).done(function(data){

		    // Update CSRF hash
		    $('.csrf').val(data.token);

		    if(data.result === false){
		        toastr.error(data.message);
		    }

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
			var seller_id = $('#seller_id').val();
			(seller_id != '') ? $('#seller_id').closest('.input-group').find('.resetSearchFields').css('display', 'block') : null;
			var customer_id = $('#customer_id').val();
			(customer_id != '') ? $('#customer_id').closest('.input-group').find('.resetSearchFields').css('display', 'block') : null;
			var payment = $('#payment').val();
			(payment != '') ? $('#payment').closest('.input-group').find('.resetSearchFields').css('display', 'block') : null;

			/* Add search input posts */
			posts.searchFields['seller_id'] = seller_id;
			posts.searchFields['customer_id'] = customer_id;
			posts.searchFields['payment'] = payment;

			/* Create search input listener */
			searchFieldsListener('change', ['seller_id', 'customer_id', 'payment']);

			/* Manage search date posts */
			var from = $('#from').val();
			var to = $('#to').val();

			/* Add search date posts */
			posts.searchDate['from'] = from; 
			posts.searchDate['to'] = to;

			/* Create date search datepicker instances */
			datePickerRange('from', 'to');

			// Calling to the main function to list all records
			showAllAction();
		break;

		case 'add':
			datePicker('orders_date');
		break;

		case 'edit':
			datePicker('orders_date');
			showGalleryOne($("input[name='id']").val(), 'edit');
		break;

		case 'show':
			showGalleryOne($("#id").data('value'), 'show');
		break;

	}

}