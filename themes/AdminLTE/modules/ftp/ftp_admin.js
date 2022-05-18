$(document).ready(function()
{
	// ftp account table to div conversion
	$('.main > form').prepend('<div class="row addacc mb-2"></div>');
	$('.main > form > table tr:first-child > td').each(function()
	{
		$('.main .addacc').append('<div class="col-12 col-lg-3 col-md-6">'+$(this).html()+'</div>');
	});
	$('.main .addacc').append('<div class="col-12 mt-1">'+$('.main > form > table tr:last-child > td').html()+'</div>');
	$('.main > form > table').remove();
});

$(window).load(function()
{
	$('.tablesorter-hasChildRow td.collapsed').html('<i class="fa fa-plus-square"</i>');
	
	$('.tablesorter-hasChildRow td.collapsible').click(function()
	{
		if($(this).hasClass('collapsed'))
		{
			$(this).html('<i class="fa fa-plus-square"></i>');
		}else
		{
			$(this).html('<i class="fa fa-minus-square"</i>');
		}
	});
});
