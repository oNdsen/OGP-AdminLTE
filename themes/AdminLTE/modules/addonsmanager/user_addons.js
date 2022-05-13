$(document).ready(function()
{
	$('.main > table').before('<div class="addons d-flex mb-1"></div>');
	$('.main td').contents().appendTo('.addons');
	$('.main > table').remove();
	
	$('.main [type="submit"]').removeClass('btn-primary').addClass('btn-secondary');
	
	$('.main [href*="&addon_type="]').each(function()
	{
		$(this).addClass('btn btn-primary d-flex flex-column justify-content-center align-items-center').wrapInner('<span>');
		
		var btnTextSplit = $(this).find('span').text().split('(');
		var btnText = btnTextSplit[0];
		var btnMods = btnTextSplit[1].split(')')[0];
		
		$(this).find('span').text(btnText);
		$(this).prepend('<span class="badge bg-secondary">' + btnMods + '</span>');
	});
});
