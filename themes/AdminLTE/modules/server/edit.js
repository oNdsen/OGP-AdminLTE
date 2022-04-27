$(document).ready(function() {
	$('.card-body [href="?m=server"]').addClass('btn btn-sm btn-primary');
	$('.card-body [href$="&delete&y=y"]').addClass('btn btn-sm btn-danger');

	$('[name="remove_ip"]').removeClass('btn-primary').addClass('btn-danger');
});
