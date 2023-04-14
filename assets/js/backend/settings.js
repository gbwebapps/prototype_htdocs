if(controller === 'settings'){

	var section;

	/* Listener for collecting the section */
	$(document).on('click', '.openCard', function(e){
		e.preventDefault();
		section = $(this).data('section');
	});

	/* Listener for opening and collecting the section */
	$(document).on('shown.bs.collapse', '#accordionBackend', function () {
		getSettings(section);
	})

	/* Function to show the section */
	function getSettings(section)
	{
		// CSRF Hash
		var csrfName = $('.csrf').attr('name'); // CSRF Token name
		var csrfHash = $('.csrf').val(); // CSRF hash

		var jqxhr = $.ajax({
		    url: urlbase + 'admin/settings/getSettings',
		    headers: {'X-Requested-With': 'XMLHttpRequest'},
		    method: 'post',
		    dataType: 'json',
		    data: { section: section, [csrfName]: csrfHash },
		    beforeSend: function(){
		        $('#showLoader').css('display', 'block').html('<img src="' + urlbase + 'assets/img/ajax-loader.gif">');
		    }
		}).done(function(data){

		    // Update CSRF hash
		    $('.csrf').val(data.token);

		    if(data.result === true) {
		        $('#' + section).html(data.output).hide().fadeIn(200);
		    } else if(data.result === false){
		        toastr.error(data.message);
		    }
		    
		}).fail(function(jqXHR, textStatus, error){
		    toastr.error(error);
		}).always(function(){
		    $('#showLoader').css('display', 'none').html('');
		});
	}

	/* Listener for submitting settings section */
	$(document).on('submit', '.settings_form', function(e){
		e.preventDefault();
		var formData = new FormData(this);
		saveSettings(formData);
	});

	function saveSettings(formData)
	{
		// CSRF Hash
		var csrfName = $('.csrf').attr('name'); // CSRF Token name
		var csrfHash = $('.csrf').val(); // CSRF hash

		formData.append([csrfName], csrfHash);

		var jqxhr = $.ajax({
		    url: urlbase + 'admin/settings/saveSettings',
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

			    if(data.result === true) {
			        toastr.success(data.message);
			        $('#' + section).html(data.output);
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

}