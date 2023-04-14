/* Parameters for data list sorting */
var tokensColumn = 'id';
var tokensOrder = 'asc';
var tokensPage = 1;

/* The posts sent with showAll */
var tokensPosts = { column: tokensColumn, order: tokensOrder, page: tokensPage }
	
/* Collect list data */
function showTokens(id){

	if(id){
		tokensPosts['seller_id'] = id;
	}

    // CSRF Hash
    var csrfName = $('.csrf').attr('name'); // CSRF Token name
    var csrfHash = $('.csrf').val(); // CSRF hash

    tokensPosts[csrfName] = csrfHash;

    var jqxhr = $.ajax({
        url: urlbase + 'admin/tokens/show',
        headers: {'X-Requested-With': 'XMLHttpRequest'},
        method: 'post',
        dataType: 'json', 
        data: tokensPosts,
        beforeSend: function(){
            $('#showLoader').css('display', 'block').html('<img src="' + urlbase + 'assets/img/ajax-loader.gif">');
        }
    }).done(function(data){

        // Update CSRF hash
        $('.csrf').val(data.token);

        $('#showTokens').html(data.output);

    }).fail(function(jqXHR, textStatus, error){
        toastr.error(error);
    }).always(function(){
        $('#showLoader').css('display', 'none').html('');
    });
}

/* Listener for sorting data */
$(document).on('click', '.tokensSorting a.tokenSort', function(e){
    e.preventDefault();
    var tokensColumn = $(this).data('column');
    var tokensOrder = $(this).data('order');
    tokensPosts['column'] = tokensColumn;
    tokensPosts['order'] = tokensOrder;
    showTokens();
});

/* Listener for pagination data */
$(document).on('click', '.tokensPagination li a', function(e){
    e.preventDefault();
    var tokensPage = $(this).data('page');
    tokensPosts['page'] = tokensPage;
    showTokens();
});

/* Listener for resetting sorting data */
$(document).on('click', '#linkResetTokens', function(e){
    e.preventDefault();
    tokensPosts = resetSorting();
    showTokens();
});

/* Function for removing sorting data sessions */
function resetSorting(){
    tokensPosts['column'] = 'id';
    tokensPosts['order'] = 'asc';
    tokensPosts['page'] = 1
    return tokensPosts;
}

/* Listener to delete tokens */
$(document).on('submit', '.deleteToken', function(e){
    e.preventDefault();
    var formData = new FormData(this);
    var message = $(this).data('message');
    var itemlastpage = $('#itemlastpage').data('itemlastpage');
    deleteToken(formData, message, itemlastpage);
});

/* Function to delete tokens */
function deleteToken(formData, message, itemlastpage)
{
    if(confirm(message)){

    // CSRF Hash
    var csrfName = $('.csrf').attr('name'); // CSRF Token name
    var csrfHash = $('.csrf').val(); // CSRF hash

    formData.append([csrfName], csrfHash);

    var jqxhr = $.ajax({
        url: urlbase + 'admin/tokens/delete',
        headers: {'X-Requested-With': 'XMLHttpRequest'},
        method: 'post',
        dataType: 'json', 
        data: formData, 
        contentType: false, 
        cache: false,
        processData: false,
        beforeSend: function(){
            $(".btn-primary, .btn-danger, .btn-success, .btn-info").prop("disabled", true);
            $('#showLoader').css('display', 'block').html('<img src="' + urlbase + 'assets/img/ajax-loader.gif">');
        }
        }).done(function(data){

            // Update CSRF hash
            $('.csrf').val(data.token);

            if(data.errors){
                toastr.error(data.message);
            } else {

                if(data.result == true) {
                    if(itemlastpage == 1) {
                        if(posts['page'] > 1){
                            posts['page'] = posts['page'] - 1;
                        } else {
                            posts['page'] = 1;
                        }
                    }
                    toastr.success(data.message);
                    showTokens($("#id").data('value'));
                } else if(data.result == false){
                    toastr.error(data.message);
                }

            }

        }).fail(function(jqXHR, textStatus, error){
            toastr.error(error);
        }).always(function(){
            $(".btn-primary, .btn-danger, .btn-success, .btn-info").prop("disabled", false);
            $('#showLoader').css('display', 'none').html('');
        });
    } 
}