$(document).ready(function()
{
	var adminButtonTable = $('.main table.administration-table').first();
	
	$('<div class="administration-table d-flex flex-wrap justify-content-start"></div>').insertAfter(adminButtonTable);
	
	$(adminButtonTable).find('a.administration-buttons').each(function()
	{
		console.log($(this).attr('href'));
		$('div.administration-table').append('<a class="admin-buttons btn btn-primary d-flex flex-column justify-content-center align-items-center" href="' + $(this).attr('href') + '"><span>' + $(this).find('div').text() + '</span></a>');
	});
	
	$(adminButtonTable).remove();
});

$(window).load(function()
{
	$('[name="download"]').prepend('<i class="fas fa-download mr-1"></i>').addClass('btn-secondary');
	$('[name="restore"]').prepend('<i class="fas fa-upload mr-1"></i>').addClass('btn-warning');
	$('.main .custom-file').removeAttr('style');
});