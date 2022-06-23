$(document).ready(function()
{
	$('.content-wrapper [href="?m=administration&p=main"], .main [href="javascript:history.go(-1)"], .main [href="home.php?m=cron&p=cron"], .main a[href="home.php?m=cron&p=user_cron"]').addClass('btn btn-sm btn-primary');
	$('.content-wrapper input[name="removeJob"]').removeClass('btn-primary').addClass('btn-danger');
	$('.content-wrapper a[href="home.php?m=cron&p=user_cron"]').removeClass('btn-primary').addClass('btn-secondary').prepend('<i class="fas fa-angle-double-left mr-1"></i>');
	
	$('.content-wrapper .hundred td[colspan="6"]').attr('colspan',8);
	$('.content-wrapper th:last-child').attr('colspan', 2);
});

$(window).load(function()
{
	// check if cron is the updateserverstats cron
	$('.content-wrapper input[name="command"]').each(function()
	{
		if($(this).val().toLowerCase().indexOf('adminlte/dist/php/settings.php')>=0)
		{
			// wrap theme cron input into input-group
			$(this).wrap('\
			<div class="input-group mb-2 mr-sm-2">\
				<div class="input-group-prepend">\
					<div class="input-group-text border-danger">Theme Cron</div>\
				</div>\
			</div>\
			');
			
			// colorize all fields
			$(this).closest('tr').find('.form-control').addClass('border-danger');
		}
	});
	
	// wrap scheduled jobs into separate card
	var doWrap = false;
	$('.main > *').each(function(index)
	{
		if($(this).is('h2'))
		{
			doWrap = true;
			$('.content .row > div').append('<div class="card"><div class="card-header"><h3 class="card-title">'+$(this).text()+'</h3></div><div class="card-body"></div></div>');
			$(this).remove();
		}else
		{
			if(doWrap)
			{
				$('.content .card-body:not(.main)').append($(this));
			}
		}
	});
});