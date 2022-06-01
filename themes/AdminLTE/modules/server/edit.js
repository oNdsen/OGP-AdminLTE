$(document).ready(function() {
	$('.main [href="?m=server"]').addClass('btn btn-sm btn-primary');
	$('.main [href$="&delete&y=y"]').addClass('btn btn-sm btn-danger');
	$('.main input[name="ip"]').addClass('mb-1');
	
	$('.main [name="remove_ip"]').removeClass('btn-primary').addClass('btn-danger');
	
	$('.main .info').each(function()
	{
		$(this).replaceWith('\
		<div class="callout callout-info">\
			<p class="mb-0">' + $(this).html() + '</p>\
		</div>\
		');
	});
});
