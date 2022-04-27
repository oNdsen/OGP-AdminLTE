$(document).ready(function() {
	$('#servermonitor [href$="&delete"]').addClass('btn btn-xs btn-danger');
	$('#servermonitor [href$="&edit"]').addClass('btn btn-xs btn-primary');
	$('#servermonitor [href^="?m=server&p=reboot"]').addClass('btn btn-xs btn-warning');
	$('#servermonitor [href^="?m=server&p=restart"]').addClass('btn btn-xs btn-warning');
	$('#servermonitor [href^="?m=server&p=log"], #servermonitor [href^="?m=server&p=firewall"]').addClass('btn btn-xs btn-primary');

	$('#servermonitor .success').addClass('badge badge-success').removeClass('success');
	$('#servermonitor .failure').addClass('badge badge-danger').removeClass('failure');

	$('#servermonitor img[src="images/magnifglass.png"]').each(function(){
		$(this).replaceWith('<span data-toggle="tooltip" class="image-tooltip" title="<img src=\''+$(this).attr('data-url')+'\' />"><i class="fa fa-search" aria-hidden="true"></i></span>');
	});
});
