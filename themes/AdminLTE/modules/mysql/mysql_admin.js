$(document).ready(function()
{
	$('#servermonitor [href$="&delete"], #servermonitor [href$="&remove_db').addClass('btn btn-xs btn-danger').prepend('<i class="fas fa-trash-alt mr-1"></i>');;
	$('#servermonitor [href$="&edit"], #servermonitor [href$="&edit_db_settings"]').addClass('btn btn-xs btn-primary');

	$('#servermonitor [href$="&edit"], #servermonitor [href$="&edit_db_settings"]').prepend('<i class="fas fa-cogs mr-1"></i>');
	$('#servermonitor [href$="&assign"]').addClass('btn btn-xs btn-success').prepend('<i class="fas fa-user-check mr-1"></i>');

	$('#servermonitor .success').addClass('badge badge-success').removeClass('success');
	$('#servermonitor .failure').addClass('badge badge-danger').removeClass('failure');

	$('.main [id="mysql_root_passwd"]').attr('type', 'password');
	
	// reveal pass on focus, hide on leave
	$('.main [id="mysql_root_passwd"]').on("focus", function()
	{
		$(this).attr('type', 'text');
	}).on("focusout", function()
	{
		$(this).attr('type', 'password');
	});
	
	// hide plaintext passwords
	$('#servermonitor .expand-child').each(function()
	{
		var regex = new RegExp(`(\s*)<b>${langConsts['OGP_LANG_mysql_root_passwd']}:<\/b> (.*?)<br>`, "m");
		var dbInfos = $(this).find('td:first-of-type');
		
		var pass = dbInfos.html().match(regex)[2];
		
		if(pass)
		{
			$(dbInfos).html(function(index,html)
			{
				return html.replace(regex, '<b>' + langConsts['OGP_LANG_mysql_root_passwd'] + '</b>: <span class="pass">'+pass+'</span><br>');
			});
		}
	});
});

