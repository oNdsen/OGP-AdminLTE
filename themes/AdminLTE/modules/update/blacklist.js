$(document).ready(function()
{
	$('.main [href="?m=update"]').addClass('btn btn-xs btn-primary');

	$('.main img[src^="images"]').each(function()
	{
		if($(this).attr('src')=='images/folder.png')
		{
			var icon = '<i class="fa fa-folder-open mr-1"></i>';
		}else
		{
			var icon = '<i class="fas fa-pencil-alt mr-1"></i>'
		}
		
		if($(this).next('a').length>0)
		{
			var content = '<a href="' + $(this).next('a').attr('href') + '" class="text-dark badge">' + $(this).next('a').text() + '</a>';
		}else
		{
			var content = '<span class="text-dark badge">' + $(this).parent('td').text() + '</span>';
		}
		
		$(this).parent('td').html(icon + content);
	});
	
	$('.main a[href$="&back"]').each(function()
	{
		$(this).addClass('btn btn-xs btn-secondary').text('.. ' + langConsts['OGP_LANG_level_up'].replace(/\^/g, '')).prepend('<i class="fas fa-level-up-alt mr-1"></i>');
	});
});

