$(document).ready(function()
{
	$('.main [href^="?m=steam_workshop&p=uninstall"]').addClass('btn btn-sm btn-danger').prepend('<i class="fas fa-puzzle-piece mr-1"></i>');
	$('.main [href="?m=steam_workshop&p=main"]').addClass('btn btn-sm btn-success');
	$('.main [name="install"]').removeClass('btn-primary').addClass('btn-success');
	$('.main [name="remove_mods"], .main [name="uninstall"]').removeClass('btn-primary').addClass('btn-danger').prepend('<i class="fas fa-trash-alt mr-1"></i>');
	$('.main [href^="?m=steam_workshop&p=main&home_id-mod_id-ip-port="]').addClass('btn btn-sm btn-primary').prepend('<i class="fas fa-puzzle-piece mr-1"></i>');
	
	$('.main [href^="?m=gamemanager"]').each(function()
	{
		if($(this).text()==langConsts['OGP_LANG_back'])
		{
			$(this).addClass('btn btn-sm btn-primary mt-1').prepend('<i class="fas fa-angle-double-left mr-1"></i>');
		}
	});
	
	$('.main [href^="?m=steam_workshop"]').each(function()
	{
		if($(this).text()==langConsts['OGP_LANG_install_mod'])
		{
			$(this).addClass('btn-sm').prepend('<i class="fas fa-puzzle-piece mr-1"></i>');
		}
	});
});
