$(document).ready(function() {
	$('.main [href="?m=user_admin&p=add"]').addClass('btn btn-sm btn-primary').prepend('<i class="fas fa-user-plus mr-1"></i>');
	$('.main [href^="?m=user_admin&p=edit_user&user_id="]').addClass('btn btn-xs btn-primary').prepend('<i class="fas fa-user-edit mr-1"></i>');
	$('.main [href^="?m=user_games&p=assign&user_id="]').addClass('btn btn-xs btn-success').prepend('<i class="fas fa-plus-square mr-1"></i>');
	$('.main [href^="?m=user_admin&p=del&user_id="]').addClass('btn btn-xs btn-danger').prepend('<i class="fas fa-minus-square mr-1"></i>');

	$('.main style').remove();

});
