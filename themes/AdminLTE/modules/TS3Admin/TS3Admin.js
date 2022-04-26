$(document).ready(function()
{
	$('link[href="modules/TS3Admin/webinterface.css"]').remove();
	$('#loadingImage').remove();
	
	$('section.content .container-fluid > form').wrapAll('<div class="row mt-2"><div class="col-12"><div class="card"><div class="card-body"></div></div></div></div>');
	
	$('section.content .container-fluid > .infoBox').wrapAll('<div class="row"></div>');
	
	$('section.content .container-fluid > .row > .infoBox').each(function()
	{
		$(this).wrapAll('<div class="col-12 col-md-6"><div class="card"><div class="card-body"></div></div></div>');
	});
	
	$('.edit').each(function()
	{
		var imgURL = $(this).find('img').attr('src');
		
		$(this).addClass('btn btn-sm btn-primary').find('img').remove();
		
		if (imgURL.toLowerCase().indexOf("edit.png") >= 0)
		{
			$(this).html('<i class="fas fa-edit"></i>');
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
