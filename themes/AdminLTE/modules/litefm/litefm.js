$(document).ready(function()
{
	$('.main .operations-button').addClass('btn btn-xs btn-primary');
	$('.main .operations-button#remove').addClass('btn-danger');
	
	$('.main [href^="?m=gamemanager&p=game_monitor&home_id="]').addClass('btn btn-primary btn-sm');

	$('.main img[src="images/folder.png"]').replaceWith('<i class="fas fa-folder-open"></i>');
	$('.main img[src="images/txt.png"]').remove();
	$('.main img[src="images/exec.png"]').replaceWith('<i class="fas fa-cogs"></i>');

	$('.main .unlocked').children('span').addClass('btn btn-xs btn-danger').css('min-width','90px').prepend('<i class="fas fa-lock text-light mr-1"></i>');
	$('.main .locked').children('span').addClass('btn btn-xs btn-success').css('min-width','90px').prepend('<i class="fas fa-unlock text-light mr-1"></i>');
	
	$('.main a[href^="javascript:downloadFile"], a[href$="&type=directory"]').addClass('text-dark');
	$('.main a[href*="&p=read_file"]').addClass('btn btn-xs btn-primary').prepend('<i class="fas fa-edit text-light mr-1"></i>');
	
	$('.main [href*="&item="], [href^="javascript:downloadFile"]').addClass('badge badge-default');
	$('.main [href$="&p=read_file"]').removeClass('badge').removeClass('badge-default').addClass('btn btn-primary btn-xs');

	$('.main a[href$="&back"]').each(function()
	{
		$(this).addClass('btn btn-xs btn-secondary').text('.. ' + langConsts['OGP_LANG_level_up'].replace(/\^/g, '')).prepend('<i class="fas fa-level-up-alt mr-1"></i>');
	});

	/* *** Long Name Fix *** */
	$('.main td > h3').each(function()
	{
		$(this).parent('td').attr('style', 'max-width:400px');
		$(this).attr('title', $(this).text()).attr('style', 'overflow:hidden;text-overflow:ellipsis;display:inline-block;white-space:nowrap;max-width:100%;');
	});
});