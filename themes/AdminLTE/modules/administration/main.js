$(document).ready(function()
{
	var adminButtonTable = $('table.administration-table').first();
	
	$('<div class="administration-table d-flex flex-wrap justify-content-start"></div>').insertAfter(adminButtonTable);
	
	$(adminButtonTable).find('a.administration-buttons').each(function()
	{
		console.log($(this).attr('href'));
		$('div.administration-table').append('<a class="admin-buttons btn btn-primary d-flex flex-column justify-content-center align-items-center" href="' + $(this).attr('href') + '"><span>' + $(this).find('div').text() + '</span></a>');
	});
	
	$(adminButtonTable).remove();
});
