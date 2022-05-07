$(document).ready(function()
{
	$('.main [href="?m=user_admin&p=show_groups"], .main [href="?m=user_admin"]').addClass('btn btn-sm btn-primary');
	
	$('input[name="unassign"]').removeClass('btn-primary').addClass('btn-danger');
});
