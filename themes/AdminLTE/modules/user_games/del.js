$(document).ready(function()
{
	$('.main > p:nth-child(1)').replaceWith('\
	<div class="row">\
		<div class="col-12">\
			<div class="callout callout-warning">\
				<p>'+$('.main > p:nth-child(1)').html()+'</p>\
			</div>\
		</div>\
	</div>\
	');
	
	
	$('.main > p:nth-child(2)').replaceWith('<table class="table table-sm table-striped"><tr><td>'+$('.main > p:nth-child(2)').html()+'</td></table>');
	$('.main td').each(function()
	{
		$(this).html($(this).html().replace('|',''));
	});

	$('.main [href$="&files=y"]').addClass('btn btn-sm btn-danger').prepend('<i class="fas fa-trash-alt mr-1"></i>');
	$('.main [href^="?m=user_games&p=del&y=y&home_id="]').addClass('btn btn-sm btn-danger');
	$('.main [href="?m=user_games"]').addClass('btn btn-sm btn-primary');
});
