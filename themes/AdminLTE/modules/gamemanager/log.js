$(document).ready(function()
{
	$('.main [href^="?m=gamemanager&p=game_monitor&home_id-mod_id-ip-port="]').addClass('btn btn-sm btn-primary');
	$('.main [name="size"]').addClass('float-right');
});

$(window).load(function()
{
	$('.main [name="remote_send_rcon_command"]').removeClass('btn-sm');
});