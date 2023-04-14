/* GalleryOne handling */
function showGalleryOne(id, view){

    // CSRF Hash
    var csrfName = $('.csrf').attr('name'); // CSRF Token name
    var csrfHash = $('.csrf').val(); // CSRF hash

    var jqxhr = $.ajax({
        url: urlbase + 'admin/galleryOne/show',
        headers: {'X-Requested-With': 'XMLHttpRequest'},
        method: 'post',
        dataType: 'json',
        data: { id: id, view: view, entity: entity, [csrfName]: csrfHash },
        beforeSend: function(){
            $('#showLoader').css('display', 'block').html('<img src="' + urlbase + 'assets/img/ajax-loader.gif">');
        }
    }).done(function(data){

        // Update CSRF hash
        $('.csrf').val(data.token);

        $('.showGalleryOne').html(data.output);
        
    }).fail(function(jqXHR, textStatus, error){
        toastr.error(error);
    }).always(function(){
        $('#showLoader').css('display', 'none').html('');
    });
}

$(document).on('click', '.deleteGalleryOne', function(e){
    e.preventDefault();
    deleteGalleryOne($(this).data('id'), $(this).data('entityid'));
});

function deleteGalleryOne(id, entityid){
    if(confirm('Are you sure to delete the file?')){

        // CSRF Hash
        var csrfName = $('.csrf').attr('name'); // CSRF Token name
        var csrfHash = $('.csrf').val(); // CSRF hash

        var jqxhr = $.ajax({
            url: urlbase + 'admin/galleryOne/delete',
            headers: {'X-Requested-With': 'XMLHttpRequest'},
            method: 'post',
            dataType: 'json',
            data: { id: id, controller: controller, entity: entity, [csrfName]: csrfHash },
            beforeSend: function(){
                $('#showLoader').css('display', 'block').html('<img src="' + urlbase + 'assets/img/ajax-loader.gif">');
            }
        }).done(function(data){

            // Update CSRF hash
            $('.csrf').val(data.token);

            if(data.result == true) {
                toastr.success(data.message);
                
                if(controller === 'account'){
                    $('#menuTop').html(data.menuTop);
                }

            } else if(data.result == false){
                toastr.error(data.message);
            }

            showGalleryOne(entityid, 'edit');
            
        }).fail(function(jqXHR, textStatus, error){
            toastr.error(error);
        }).always(function(){
            $('#showLoader').css('display', 'none').html('');
        });
    }
}

$(document).on('click', '.setCoverGalleryOne', function(e){
    e.preventDefault();
    setCoverGalleryOne($(this).data('id'), $(this).data('entityid'));
});

function setCoverGalleryOne(id, entityid){
    if(confirm('Are you sure to set this image as cover?')){

        // CSRF Hash
        var csrfName = $('.csrf').attr('name'); // CSRF Token name
        var csrfHash = $('.csrf').val(); // CSRF hash

        var jqxhr = $.ajax({
            url: urlbase + 'admin/galleryOne/setCover',
            headers: {'X-Requested-With': 'XMLHttpRequest'},
            method: 'post',
            dataType: 'json',
            data: { id: id, entityid: entityid, controller: controller, entity: entity, [csrfName]: csrfHash },
            beforeSend: function(){
                $('#showLoader').css('display', 'block').html('<img src="' + urlbase + 'assets/img/ajax-loader.gif">');
            }
        }).done(function(data){

            // Update CSRF hash
            $('.csrf').val(data.token);

            if(data.result == true) {
                toastr.success(data.message);
                
                if(controller === 'account'){
                    $('#menuTop').html(data.menuTop);
                }

            } else if(data.result == false){
                toastr.error(data.message);
            }

            showGalleryOne(entityid, 'edit');
            
        }).fail(function(jqXHR, textStatus, error){
            toastr.error(error);
        }).always(function(){
            $('#showLoader').css('display', 'none').html('');
        });
    }
}

$(document).on('click', '.removeCoverGalleryOne', function(e){
    e.preventDefault();
    removeCoverGalleryOne($(this).data('id'), $(this).data('entityid'));
});

function removeCoverGalleryOne(id, entityid){
    if(confirm('Are you sure to remove this image as cover?')){

        // CSRF Hash
        var csrfName = $('.csrf').attr('name'); // CSRF Token name
        var csrfHash = $('.csrf').val(); // CSRF hash

        var jqxhr = $.ajax({
            url: urlbase + 'admin/galleryOne/removeCover',
            headers: {'X-Requested-With': 'XMLHttpRequest'},
            method: 'post',
            dataType: 'json',
            data: { id: id, entityid: entityid, controller: controller, entity: entity, [csrfName]: csrfHash }, 
            beforeSend: function(){
                $('#showLoader').css('display', 'block').html('<img src="' + urlbase + 'assets/img/ajax-loader.gif">');
            }
        }).done(function(data){

            // Update CSRF hash
            $('.csrf').val(data.token);

            if(data.result == true) {
                toastr.success(data.message);
                
                if(controller === 'account'){
                    $('#menuTop').html(data.menuTop);
                }

            } else if(data.result == false){
                toastr.error(data.message);
            }
            
            showGalleryOne(entityid, 'edit');
            
        }).fail(function(jqXHR, textStatus, error){
            toastr.error(error);
        }).always(function(){
            $('#showLoader').css('display', 'none').html('');
        });
    }
}