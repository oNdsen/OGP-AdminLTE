$(document).ready(function()
{
	$('.main > table').before('<div class="addons"></div>');
	$('.main td').contents().appendTo('.addons');
	$('.main > table').remove();
	
	$('.main [href*="&addon_type="]').each(function()
	{
		$(this).addClass('btn-primary').wrapInner('<span>');
		
		var btnTextSplit = $(this).find('span').text().split('(');
		var btnText = btnTextSplit[0];
		var btnMods = btnTextSplit[1].split(')')[0];
		
		$(this).find('span').text(btnText);
		$(this).prepend('<span class="badge bg-secondary">' + btnMods + '</span>');
	});
});
