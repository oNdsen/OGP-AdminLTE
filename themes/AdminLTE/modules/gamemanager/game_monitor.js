$(document).ready(function()
{
	$('section.content .container-fluid > form').wrapAll('<div class="row"><div class="col-12"><div class="card"><div class="card-body"></div></div></div></div>');
	$('section.content .container-fluid > table').wrapAll('<div class="row"><div class="col-12"><div class="card"><div class="card-body"></div></div></div></div>');
	
	$('#server_icon.btn').click(function()
	{
		$(this).find('[type="radio"]').prop("checked", true);
	});
	
	$('.monitorbutton').addClass('btn btn-primary');
	
	$('[id^="refreshed"]').bind("DOMSubtreeModified",function()
	{
		$('button').addClass('btn btn-sm btn-primary');
	});
	
	$('tfoot').removeAttr('style');
	
});

$(window).load(function()
{
	$('#mgamemanagerpgamemonitor .user_menu_link').each(function()
	{
		if(window.location.href.indexOf($(this).attr('href'))>0)
		{
			$(this).attr('aria-expanded', 'true').parent('li').parent('ul').addClass('in').attr('aria-expanded', 'true').prev('a').attr('aria-expanded', 'true');
		}
	});

	$('#mgamemanagerpgamemonitor > .panel > a').each(function()
	{
		if(window.location.href.indexOf($(this).attr('link'))>0)
		{
			$(this).attr('aria-expanded', 'true').removeAttr('class').next('ul').addClass('in').attr('aria-expanded', 'true');
		}
	});
	
	$('.upload-image').addClass('btn btn-primary btn-sm');
});
