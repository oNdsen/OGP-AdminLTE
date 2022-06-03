$(document).ready(function()
{
	var adminButtonTable = $('.main table.administration-table').first();
	
	$('<div class="administration-table d-flex flex-wrap justify-content-start"></div>').insertAfter(adminButtonTable);
	
	$(adminButtonTable).find('a.administration-buttons').each(function()
	{
		$('div.administration-table').append('<a class="admin-buttons btn btn-primary d-flex flex-column justify-content-center align-items-center" href="' + $(this).attr('href') + '"><span>' + $(this).find('div').text() + '</span></a>');
	});
	
	$(adminButtonTable).remove();
	
	// better remove link buttons
	$('.remove-button').each(function()
	{
		$(this).replaceWith('<button class="btn btn-sm btn-danger"><i class="fas fa-trash mr-1"></i>'+langConsts['OGP_LANG_delete']+'</button>')
	});
});

$(window).load(function()
{
	$('.main [name="download"]').prepend('<i class="fas fa-download mr-1"></i>').addClass('btn-secondary');
	$('.main [name="restore"]').prepend('<i class="fas fa-upload mr-1"></i>').addClass('btn-warning');
	$('.main .custom-file').removeAttr('style');
	
	// better links
	if($('img[src$="link.png"]').length>0)
	{
		var parentTable = $('img[src$="link.png"]').closest('.table-responsive');
		$(parentTable).after('<div class="administration-table externalLinks d-flex flex-wrap justify-content-start p-1"></div>');
		$(parentTable).find('td').each(function()
		{
			$('.externalLinks').append('<div class="elink">'+$(this).html()+'</div>');
		});
		$(parentTable).remove();
		
		$('.main .elink > a').each(function()
		{
			$(this).addClass('admin-buttons btn btn-primary d-flex flex-column justify-content-center align-items-center');
			
			// since that iframe shizzle isnt modern conform, i reset all links to external links
			$(this).attr('href', $(this).attr('href').replace('?m=administration&p=iframe&external_link=', '')).attr('target', '_blank');
		});
	}
	
	// remove empty tables
	$('.main table').each(function()
	{
		if($(this).text().trim().length==0)
		{
			$(this).parent('.table-responsive').remove();
		}
	});
	
	
	// content to cards mod
	$('.main').removeClass('main');
	$('section.content > .container-fluid > .row > div').addClass('main');
	
	var fillBox = false
	$('.main .card-body > *').each(function()
	{
		if($(this).is('h2'))
		{
			// add new box
			$('.main').append('\
			<div class="card">\
				<div class="card-header">\
					<h5 class="card-title">' + $(this).text() + '</h5>\
				</div>\
				<div class="card-body">\
				</div>\
			</div>\
			');
			
			// remove title
			$(this).remove();
			
			// set fillBox to true, so content filling can start
			fillBox = true
		}else
		{
			if(fillBox)
			{
				// append this object to newest card
				$('.main > .card:last-child > .card-body').append($(this));
			}
		}
	});
});