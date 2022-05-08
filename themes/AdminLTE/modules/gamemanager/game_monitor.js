$(document).ready(function()
{
	$('.main').addClass('main-content');
	
	$('.monitorbutton.size').click(function(){
		$(this).addClass('loading');
		$(this).bind("DOMSubtreeModified",function(){
			$(this).removeClass('loading');
		});
	});
	
	$('#server_icon.btn').click(function()
	{
		$(this).find('[type="radio"]').prop("checked", true);
	});
	
	$('#server_icon[class^="action-start"]').addClass('btn btn-sm btn-success');
	$('#server_icon[class^="action-stop"]').addClass('btn btn-sm btn-danger');
	$('#server_icon[class^="action-restart"]').addClass('btn btn-sm btn-warning');
	
	$('.monitorbutton').addClass('btn btn-primary d-flex flex-column justify-content-center align-items-center');
	
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
