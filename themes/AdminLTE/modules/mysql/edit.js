$(document).ready(function()
{
	$('.main [href="?m=mysql&p=mysql_admin"]').addClass('btn btn-sm btn-primary');
	$('.main [id="mysql_root_passwd"], .main [id="db_passwd"]').attr('type', 'password');
	
	// reveal pass on focus, hide on leave
	$('.main [id="mysql_root_passwd"], .main [id="db_passwd"]').on("focus", function()
	{
		$(this).attr('type', 'text');
	}).on("focusout", function()
	{
		$(this).attr('type', 'password');
	});
});
