$(document).ready(function() {
	$('.card-body [href="?m=update&p=blacklist"], .card-body [href*="commits"]').addClass('btn btn-sm btn-primary');
	$('.card-body [href*="commit"]:not([href*="commits"])').addClass('label label-primary');

	$('.card-body ul > br').remove();
	$('.card-body ul').addClass('list-group');
	$('.card-body li').addClass('list-group-item');
});
