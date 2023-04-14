/* HTML references */
var controller = $('#controller').data('controller');
var entity = $('#entity').data('entity');
var action = $('#action').data('action');
var urlbase = $('#urlbase').data('urlbase');
 
/* JS Vars for search */
var globalTimeout = null;
var delayTime = 500;

/* Parameters for data list sorting */
var column = 'created_at';
var order = 'asc';
var page = 1;

// /* The posts sent with showAll */
var posts = { column: column, order: order, page: page, searchFields: {}, searchDate: {} }

/* Scrollup */
$(window).scroll(function() {
    if ($(this).scrollTop() > 120) {
        $(".scrollup").fadeIn();
    } else {
        $(".scrollup").fadeOut();
    }
})

$(".scrollup").on("click", function() {
    $("html, body").animate({
        scrollTop: 0
    }, 600);
    return false;
});

/* Toastr options */
toastr.options = {
  'closeButton': true,
  'debug': false,
  'newestOnTop': true,
  'progressBar': true,
  'positionClass': 'toast-top-full-width',
  'preventDuplicates': true,
  'onclick': null,
  'showDuration': '300',
  'hideDuration': '1000',
  'timeOut': '5000',
  'extendedTimeOut': '1000',
  'showEasing': 'swing',
  'hideEasing': 'linear',
  'showMethod': 'fadeIn',
  'hideMethod': 'fadeOut'
}

/* Function for range date advanced search */
function datePickerRange(from, to){
    var date_from = $("#" + from).datepicker({
        defaultDate: "+0d",
        changeMonth: false,
        numberOfMonths: 1, 
        dateFormat: "yy-mm-dd"
    }).on("change", function() {
        date_to.datepicker("option", "minDate", getDate(this));
        posts = resetSorting();
        var var_from = $("#" + from).val();
        posts.searchDate[from] = var_from;
        callShowAllAction();
    });
    var date_to = $("#" + to).datepicker({
        defaultDate: "+0d",
        changeMonth: false,
        numberOfMonths: 1, 
        dateFormat: "yy-mm-dd"
    }).on("change", function() {
        date_from.datepicker("option", "maxDate", getDate(this));
        posts = resetSorting();
        var var_to = $("#" + to).val();
        posts.searchDate[to] = var_to;
        callShowAllAction();
    });
}

/* Function for datePickerRange */
function getDate(element) {
    var date;
    try {
        date = $.datepicker.parseDate("yy-mm-dd", element.value);
    } catch(error) {
        date = null;
    }
    return date;
}

/* Function for single datepicker */
function datePicker(selector){
    $("#" + selector).datepicker({
        dateFormat: "yy-mm-dd"
    });
}

/* Listener for sorting data */
$(document).on('click', '.sorting a.sort', function(e){
    e.preventDefault();
    var column = $(this).data('column');
    var order = $(this).data('order');
    posts['column'] = column;
    posts['order'] = order;
    showAllAction();
});

/* Listener for pagination data */
$(document).on('click', '.pagination li a', function(e){
    e.preventDefault();
    var page = $(this).data('page');
    posts['page'] = page;
    showAllAction();
});

/* Listener for resetting sorting data */
$(document).on('click', '#linkResetSorting', function(e){
    e.preventDefault();
    posts = resetSorting();
    showAllAction();
});

/* Listener for show all view refreshing */
$(document).on('click', '#linkRefresh', function(e){
    e.preventDefault();
    showAllAction();
});

/* Function for removing sorting data sessions */
function resetSorting(){
    posts['column'] = 'created_at';
    posts['order'] = 'asc';
    posts['page'] = 1
    return posts;
}

/* Listener for opening or closing the search bar */
$(document).on('click', '#linkSearch', function(e){
    e.preventDefault();
    searchBar();
});

/* Listener for cleaning search fields */
$(document).on('click', '.resetSearchFields', function(e){
    e.preventDefault();
    var field = $(this).closest('.input-group').find("input[type='text']").attr('id');
    $(this).closest('.input-group').find("input[type='text']").val('');
    posts.searchFields[field] = '';
    $(this).css('display', 'none');
    showAllAction();
});

/* Listener for resetting search and sorting data */
$(document).on('click', '#linkResetSearch', function(e){
    e.preventDefault();
    posts = resetSearch();
    showAllAction();
});

/* Function for opening or closing the search bar */
function searchBar(){
    if($('#searchBar').css('display') == 'none') {
        $('#searchBar').show(300);
    } else if($('#searchBar').css('display') == 'block') {
        $('#searchBar').hide(300);
    }
}

/* This function creates as many listeners as requested by the arguments passed */
function searchFieldsListener(event, data){
    $.each(data, function(key, value) {
        var field = [value];
        $(document).on(event, "#" + field, function(){
            posts = resetSorting();
            var field = $(this).val();
            posts.searchFields[value] = field;
            if(field != '' && event != 'change'){
                $(this).closest('.input-group').find('.resetSearchFields').css('display', 'block');
            } else {
                $(this).closest('.input-group').find('.resetSearchFields').css('display', 'none');
            }
            callShowAllAction();
        });
    });
}

/* Function for removing sorting data and advanced search sessions */
function resetSearch(){
    posts['column'] = 'created_at';
    posts['order'] = 'asc';
    posts['page'] = 1;

    $.each(posts.searchFields, function(key, value){
        localStorage.removeItem(key);
        $('#' + key).val('');
        posts.searchFields[key] = '';
    });

    $('.resetSearchFields').css('display', 'none');

    if(controller == 'orders'){
        $.each(posts.searchDate, function(key, value){
            $('#' + key).val('');
            posts.searchDate[key] = '';
        });

        $("#from, #to").datepicker("destroy");
        datePickerRange('from', 'to');
    }

    return posts;
}

/* This function delay the calling to the showAll function */
function callShowAllAction(){
    if (globalTimeout != null) {
        clearTimeout(globalTimeout);
    }
    globalTimeout = setTimeout(function() {
        globalTimeout = null;  
        showAllAction();
    }, delayTime);
}

/* Collect list data */
function showAllAction(){

    // CSRF Hash
    var csrfName = $('.csrf').attr('name'); // CSRF Token name
    var csrfHash = $('.csrf').val(); // CSRF hash

    posts[csrfName] = csrfHash;

    var jqxhr = $.ajax({
        url: urlbase + 'admin/' + controller + '/showAll',
        headers: {'X-Requested-With': 'XMLHttpRequest'},
        method: 'post',
        dataType: 'json', 
        data: posts,
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
            $('#showData').html('<div class="card"><div class="card-body"><div class="text-center font-weight-bold">' + data.message + '</div></div></div>');
        } else {
        
            $("div[class^='error_']").empty();
            if(data.result == true) {
                $('#showData').html(data.output);
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

// Listener for reset
$(document).on('click', '#addReset', function(e){
    e.preventDefault();
    var message = $(this).data('message');
    addReset(message);
});

// Action for reset
function addReset(message){
    if(confirm(message)){

        // CSRF Hash
        var csrfName = $('.csrf').attr('name'); // CSRF Token name
        var csrfHash = $('.csrf').val(); // CSRF hash

        var jqxhr = $.ajax({
            url: urlbase + 'admin/' + controller + '/add',
            headers: {'X-Requested-With': 'XMLHttpRequest'},
            method: 'post',
            data: { action: 'addReset', [csrfName]: csrfHash }, 
            dataType: 'json', 
            beforeSend: function(){
                $(".btn").prop("disabled", true);
                $('#showLoader').css('display', 'block').html('<img src="' + urlbase + 'assets/img/ajax-loader.gif">');
            }
        }).done(function(data){

            // Update CSRF hash
            $('.csrf').val(data.token);

            $('#showData').html(data.output);
            (controller === 'orders') ? datePicker('orders_date') : '';
            (controller === 'products') ? priceCalculateZone(type, $("input[name='id']").val()) : '';

        }).fail(function(jqXHR, textStatus, error){
            toastr.error(error);
        }).always(function(){
            $(".btn").prop("disabled", false);
            $('#showLoader').css('display', 'none').html('');
        });
    }
}

// Listener for refresh
$(document).on('click', '#editRefresh', function(e){
    e.preventDefault();
    var message = $(this).data('message');
    editRefresh(message);
});

// Action for refresh
function editRefresh(message){
    if(confirm(message)){

        // CSRF Hash
        var csrfName = $('.csrf').attr('name'); // CSRF Token name
        var csrfHash = $('.csrf').val(); // CSRF hash

        var jqxhr = $.ajax({
            url: urlbase + 'admin/' + controller + '/edit/' + $("input[name='id']").val(),
            headers: {'X-Requested-With': 'XMLHttpRequest'},
            method: 'post',
            data: { action: 'editRefresh', [csrfName]: csrfHash }, 
            dataType: 'json', 
            beforeSend: function(){
                $(".btn").prop("disabled", true);
                $('#showLoader').css('display', 'block').html('<img src="' + urlbase + 'assets/img/ajax-loader.gif">');
            }
        }).done(function(data){

            // Update CSRF hash
            $('.csrf').val(data.token);

            $('#showData').html(data.output);
            (controller === 'orders') ? datePicker('orders_date') : '';
            (controller === 'products') ? priceCalculateZone(type, $("input[name='id']").val()) : '';
            showGalleryOne($("input[name='id']").val(), 'edit');

        }).fail(function(jqXHR, textStatus, error){
            toastr.error(error);
        }).always(function(){
            $(".btn").prop("disabled", false);
            $('#showLoader').css('display', 'none').html('');
        });
    }
}

// Listener for add
$(document).on('submit', '#' + controller + '_add', function(e){
    e.preventDefault();
    var formData = new FormData(this);
    addAction(formData);
});

// Action for add
function addAction(formData){

    // CSRF Hash
    var csrfName = $('.csrf').attr('name'); // CSRF Token name
    var csrfHash = $('.csrf').val(); // CSRF hash

    formData.append([csrfName], csrfHash);

    var jqxhr = $.ajax({
        url: urlbase + 'admin/' + controller + '/add',
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
            
            (controller === 'products') ? $('#categoriesProducts').prop("disabled", true) : '';
            (controller === 'products') ? $('#categoriesProducts').html('') : '';
            (controller === 'products') ? priceCalculateZone(type) : '';

            if(data.result === true) {
                controller === 'orders' ? $('#productRows').html('') : '';
                $('#' + controller + '_add').get(0).reset();
                toastr.success(data.message);
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

// Listener for edit
$(document).on('submit', '#' + controller + '_edit', function(e){
    e.preventDefault();
    var formData = new FormData(this);
    editAction(formData);
});

// Action for edit
function editAction(formData){
    
    // CSRF Hash
    var csrfName = $('.csrf').attr('name'); // CSRF Token name
    var csrfHash = $('.csrf').val(); // CSRF hash

    formData.append([csrfName], csrfHash);

    var jqxhr = $.ajax({
        url: urlbase + 'admin/' + controller + '/edit/' + formData.get('id'),
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
            $('#' + controller + '_edit').get(0).reset();

            if(data.result == true) {
                toastr.success(data.message);
                $('#showData').html(data.output);
                (controller === 'products') ? priceCalculateZone(type, formData.get('id')) : '';
                showGalleryOne(formData.get('id'), 'edit');
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

$(document).on('submit', '.deleteForm', function(e){
    e.preventDefault();
    var formData = new FormData(this);
    var message = $(this).data('message');
    var itemlastpage = $('#itemlastpage').data('itemlastpage');
    deleteAction(formData, message, itemlastpage);
});

function deleteAction(formData, message, itemlastpage){
    if(confirm(message)){

    // CSRF Hash
    var csrfName = $('.csrf').attr('name'); // CSRF Token name
    var csrfHash = $('.csrf').val(); // CSRF hash

    formData.append([csrfName], csrfHash);

    var jqxhr = $.ajax({
        url: urlbase + 'admin/' + controller + '/delete',
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
                    showAllAction();
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
}