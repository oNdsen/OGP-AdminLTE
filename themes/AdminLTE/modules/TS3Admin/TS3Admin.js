$(document).ready(function()
{
	$('link[href="modules/TS3Admin/webinterface.css"]').remove();
	$('#loadingImage').remove();
	
	$('.main a[href$="changevServer"]').prepend('<i class="fas fa-exchange-alt mr-1"></i>').addClass('btn-secondary mb-2 ');
	$('.main > form > br').remove();
	
	$('.main span').each(function()
	{
		if($(this).attr('style'))
		{
			$(this).removeAttr('style');
		}
	});
	
	$('.main [name="startvServer"]').addClass('btn-success');
	$('.main [name="stopvServer"]').addClass('btn-danger');
	
	$('.main #clearLink').parent('div').addClass('text-muted mb-1');
	
	$('.main > .infoBox').wrapAll('<div class="row"></div>');
	$('.main > .row > .infoBox').each(function()
	{
		$(this).wrapAll('<div class="col-12 col-md-6"><div class="card"><div class="card-body"></div></div></div>');
	});
	
	$('.edit').each(function()
	{
		var imgURL = $(this).find('img').attr('src');
		
		$(this).addClass('btn btn-sm btn-primary').find('img').remove();
		
		if (imgURL.toLowerCase().indexOf("edit.png") >= 0)
		{
			$(this).addClass('btn-secondary').html('<i class="fas fa-edit"></i>');
		}
		else if (imgURL.toLowerCase().indexOf("refresh.png") >= 0)
		{
			$(this).html('<i class="fas fa-sync"></i>');
		}
	});
	
	$('#serverstatus.online').addClass('badge bg-success');
	$('#serverstatus.offline').addClass('badge bg-danger');
	
	$('#jsMsg + div a').each(function()
	{
		
	});
});
