if(controller == 'dashboard'){

	switch(action){

		case 'index':
			
			$(document).on('click', '.basicStats', function(e){
				e.preventDefault();
				basicStats();
			});

			function basicStats()
			{
				// CSRF Hash
				var csrfName = $('.csrf').attr('name'); // CSRF Token name
				var csrfHash = $('.csrf').val(); // CSRF hash

				var jqxhr = $.ajax({
				    url: urlbase + 'admin/dashboard/basicStats',
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

				    $('#showData').html($(data.output).hide().fadeIn(200));

				}).fail(function(jqXHR, textStatus, error){
				    toastr.error(error);
				}).always(function(){
				    $(".btn").prop("disabled", false);
				    $('#showLoader').css('display', 'none').html('');
				});
			}

			basicStats();

		break;
	}

}