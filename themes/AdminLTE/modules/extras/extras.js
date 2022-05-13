$(document).ready(function()
{
	//remove main card
	$('.main').removeClass('card-body').parent('.card').removeClass('card');

	$('.dragbox-content').html(function(index, text) {
		return text.replace(/\ - /g, '');
	});

	$('[href^="#uninstall_"]').addClass('btn btn-danger btn-xs').removeAttr('style').prepend('<i class="fas fa-ban mr-1"></i>');
	$('[href^="#remove_"]').addClass('btn btn-danger btn-xs').removeAttr('style').prepend('<i class="fas fa-trash-alt mr-1"></i>');
	$('[href^="#install_"]').addClass('btn btn-success btn-xs').removeAttr('style').removeAttr('href').prepend('<i class="fas fa-plus-square mr-1"></i>');
	$('[href^="?m=extras&searchForUpdates="]').addClass('btn btn-primary btn-xs').removeAttr('style').prepend('<i class="fas fa-globe-americas mr-1"></i>');

	$('.dragbox-content').each(function()
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
			$set.wrapAll('<tr><td></td></tr>');
		});
		$(form_selector.find('br')).remove();
		$(form_selector.find('tr')).wrapAll('<table class="table table-sm table-striped" />');
	});

    $('b[style*="green"]').addClass('badge').addClass('badge-success').css("color", "");
    $('b[style*="red"]').addClass('badge').addClass('badge-danger').css("color", "");
	$('b[style*="orange"]').addClass('badge').addClass('badge-warning').css("color", "");

	$('.search').click(function(){
		$(this).replaceWith('<a class="search btn btn-primary btn-xs" href="'+$(this).attr('href')+'" disabled>'+$(this).text()+' <i class="fa fa-refresh fa-spin fa-fw" aria-hidden="true"></i></a>');
	});
	
	$('.main').append('<div class="row"></div>');
	
	$('.dragbox').each(function()
	{
		var boxTitle = $(this).find('h4').text();
		var boxContent = $(this).find('.dragbox-content').html();
		
		$('.main > .row').append("\
		<div class='col-md-6 col-12'>\
			<div class='card'>\
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
	
	var btnText = $('button[name="update"]').text();
	$('.main > .row').append("\
	<div class='col-12'>\
		<div class='card'>\
			<div class='card-body' id='updateButton'>\
				<button name='update' class='btn btn-sm btn-primary'><i class='fas fa-cloud-download-alt mr-1'></i>" + btnText + "</button>\
			</div>\
		</div>\
	</div>\
	");
	
	$('.main > table').remove();
});


$(window).load(function()
{
	$('[name="update"]').click(function()
	{
		$('body').append('<div class="loading-overlay"><img src="themes/AdminLTE/dist/img/dual_ring.svg"></div>');
	});
});