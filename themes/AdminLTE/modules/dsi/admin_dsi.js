$(document).ready(function()
{
	$('p[style^="color:"]').each(function()
	{
		var thisClass = '';
		if($(this).css('color')=='rgb(0, 128, 0)')
		{
			thisClass = 'success';
		}
		else
		{
			thisClass = 'error';
		}
		$(this).replaceWith('<div class="callout callout-'+thisClass+' mt-2"><p>'+$(this).html()+'</p></div>');
	});
});