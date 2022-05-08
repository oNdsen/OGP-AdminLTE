$(document).ready(function()
{
	$('.operations-button').addClass('btn btn-xs btn-primary');
	$('.main [href^="?m=gamemanager&p=game_monitor&home_id="]').addClass('btn btn-primary btn-sm');

	$('img[src="images/folder.png"]').replaceWith('<i class="fas fa-folder-open"></i>');
	$('img[src="images/txt.png"]').replaceWith('<i class="fas fa-edit"></i>');
        $('img[src="images/exec.png"]').replaceWith('<i class="fas fa-cogs"></i>');

	$('.unlocked').children('span').addClass('btn btn-xs btn-danger').css('min-width','80px');
	$('.locked').children('span').addClass('btn btn-xs btn-success').css('min-width','80px');

	$('[href*="&item="], [href^="javascript:downloadFile"]').addClass('badge badge-default');
	$('[href$="&p=read_file"]').removeClass('badge').removeClass('badge-default').addClass('btn btn-primary btn-xs');

	/* *** Long Name Fix *** */
	$('td > h3').each(function()
	{
		$(this).parent('td').attr('style', 'max-width:400px');
		$(this).attr('title', $(this).text()).attr('style', 'overflow:hidden;text-overflow:ellipsis;display:inline-block;white-space:nowrap;max-width:100%;');
	});
});