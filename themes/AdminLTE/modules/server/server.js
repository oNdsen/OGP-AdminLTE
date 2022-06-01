$(document).ready(function()
{
	$('#servermonitor [href$="&delete"]').addClass('btn btn-xs btn-danger').prepend('<i class="fas fa-trash-alt mr-1"></i>');
	$('#servermonitor [href$="&edit"]').addClass('btn btn-xs btn-primary').prepend('<i class="fas fa-cogs mr-1"></i>');
	$('#servermonitor [href^="?m=server&p=reboot"]').addClass('btn btn-xs btn-warning').prepend('<i class="fas fa-sync-alt mr-1"></i>');
	$('#servermonitor [href^="?m=server&p=restart"]').addClass('btn btn-xs btn-warning').prepend('<i class="fas fa-user-astronaut mr-1"></i>');
	$('#servermonitor [href^="?m=server&p=log"]').addClass('btn btn-xs btn-primary').prepend('<i class="fas fa-search mr-1"></i>');
	$('#servermonitor [href^="?m=server&p=firewall"]').addClass('btn btn-xs btn-primary').prepend('<i class="fas fa-shield-alt mr-1"></i>');
	

	$('#servermonitor .success').addClass('badge badge-success').removeClass('success');
	$('#servermonitor .failure').addClass('badge badge-danger').removeClass('failure');

	$('#servermonitor img[src="images/magnifglass.png"]').each(function(){
		$(this).replaceWith('<span data-toggle="tooltip" class="image-tooltip" title="<img src=\''+$(this).attr('data-url')+'\' />"><i class="fa fa-search" aria-hidden="true"></i></span>');
	});
});
