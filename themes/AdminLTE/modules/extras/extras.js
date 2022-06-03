$(document).ready(function()
{
	//remove main card
	$('.main').removeClass('card-body').parent('.card').removeClass('card');
	
	// add new row
	$('.main').append('<div class="row"></div>');

	// remove all minus
	$('.main .dragbox-content').html(function(index, text)
	{
		return text.replace(/\ - /g, '');
	});

	$('.main [href^="#uninstall_"]').addClass('btn btn-danger btn-xs order-9').removeAttr('style').prepend('<i class="fas fa-upload mr-1"></i>');
	$('.main [href^="#remove_"]').addClass('btn btn-danger btn-xs order-9').removeAttr('style').prepend('<i class="fas fa-trash-alt mr-1"></i>');
	$('.main [href^="#install_"]').addClass('btn btn-success btn-xs order-9').removeAttr('style').removeAttr('href').prepend('<i class="fas fa-download mr-1"></i>');
	$('.main [href^="?m=extras&searchForUpdates="]').addClass('btn btn-primary btn-xs order-9').removeAttr('style').prepend('<i class="fas fa-search mr-1"></i>');

	$('.main .dragbox-content').each(function()
	{
		var form_selector = $(this);
		$(form_selector).prepend('<br>');
		$(form_selector.find('br')).each(function()
		{
			var $set = $();
			var nxt = this.nextSibling;
			while(nxt) {
				if(!$(nxt).is('br')) {
					$set.push(nxt);
					nxt = nxt.nextSibling;
				} else break;
			}
			$set.wrapAll('<tr><td class="d-flex"></td></tr>');
		});
		$(form_selector.find('br')).remove();
		$(form_selector.find('tr')).wrapAll('<table class="table table-sm table-striped mb-1" />');
	});

    $('.main b[style*="green"]').addClass('badge badge-success').prepend('<i class="fas fa-check-circle mr-1"></i>');
    $('.main b[style*="red"]').addClass('badge badge-secondary');
	$('.main b[style*="orange"]').addClass('badge badge-warning').prepend('<i class="fas fa-exclamation-circle mr-1"></i>');
	$('.main b[style]').removeAttr('style').wrap('<span class="order-1" />');

	$('.main .search').click(function(){
		$(this).replaceWith('<a class="search btn btn-primary btn-xs" href="'+$(this).attr('href')+'" disabled>'+$(this).text()+' <i class="fa fa-refresh fa-spin fa-fw" aria-hidden="true"></i></a>');
	});
	
	$('.main .dragbox').each(function()
	{
		var boxTitle = $(this).find('h4').text();
		var boxContent = $(this).find('.dragbox-content').html();
		
		$('.main > .row').append("\
		<div class='col-md-6 col-12'>\
			<div class='card extra'>\
				<div class='card-header'>\
					<h3 class='card-title'>" + boxTitle + "</h3>\
				</div>\
				<div class='card-body p-0'>\
					" + boxContent + "\
				</div>\
			</div>\
		</div>\
		");
	});
	
	
	// add buttons below each table
	var btnText = $('button[name="update"]').text();
	$('.main .card-body').each(function()
	{
		$(this).append("\
		<div id='updateButton' class='ml-3 mb-3 mt-1'>\
			<button name='update' class='btn btn-sm btn-primary'><i class='fas fa-download mr-1'></i>" + btnText + "</button>\
		</div>\
		");
	});
	
	$('.main > table').remove();
	
	// replace checkboxes
	$('.main [type="checkbox"]').each(function()
	{
		var checkboxName = $(this).attr('name');
		var checkboxValue = $(this).attr('value');
		var checkboxDisabled = $(this).attr('disabled');
		var checkboxText = $(this).next('b').text();
		
		// remove old text
		$(this).next('b').remove();
		
		var disabledAttr = '';
		if($(this).is(':disabled'))
		{
			disabledAttr = ' disabled="disabled"'
		}
		
		$(this).replaceWith('\
		<div class="custom-control custom-checkbox d-inline-block mr-auto">\
			<input class="custom-control-input" type="checkbox" id="' + checkboxName + '_' + checkboxValue + '" name="' + checkboxName + '" value="' + checkboxValue + '"' + disabledAttr + '>\
			<label for="' + checkboxName + '_' + checkboxValue + '" class="custom-control-label">' + checkboxText + '</label>\
		</div>\
		');
	});

	// wrap all links/buttons
	$('.main .extra a').each(function()
	{
		$(this).wrap('<span class="order-2" />');
	});
});


$(window).load(function()
{
	$('[name="update"]').click(function()
	{
		$('body').append('<div class="loading-overlay"><img src="themes/AdminLTE/dist/img/dual_ring.svg"></div>');
	});
});