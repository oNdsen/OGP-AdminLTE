$(document).ready(function()
{
	$('.main p > a').addClass('btn btn-primary btn-sm');

	$('.main [name="change_user_id_main"]').removeClass('btn-primary').addClass('btn-warning');
	$('.main [href*="&delete_ip&"]').addClass('btn btn-xs btn-danger');

	$('.main form[action^="?m=user_games&p=edit&home_id="]').addClass('mb-1');

	$('.main #mods').bind("DOMSubtreeModified",function()
	{
		$(this).find('table').addClass('table table-sm table-striped');
		$(this).find('select').addClass('form-control');
		$(this).find('input[type="text"]').addClass('form-control');
		$(this).find('[href$="&submit=delete_mod"]').addClass('btn btn-xs btn-danger');
		$(this).find('[href^="?m=user_games&p=install_cmds&home_id="]').addClass('btn btn-xs btn-primary');
		$(this).find('.set_options').addClass('btn btn-sm btn-primary');
		$(this).find('[type="submit"]').addClass('btn btn-sm btn-primary');
		$(this).find('[id^="mod_cfg_id_"] > td').find('br').remove();
		
		$(this).find('[href$="&submit=delete_mod"]').each(function()
		{
			var thisValue = $(this).text();
			if(thisValue.includes('['))
			{
				$(this).text(thisValue.replace('[','').replace(']','').trim());
			}
		});
	});
	
	$('.main td.right').attr('rowspan', 2);
	$('.main td.info').addClass('text-sm text-muted').css('border-top', 'none');
});
