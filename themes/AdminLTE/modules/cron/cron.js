$(document).ready(function()
{
	$('.main [href="?m=administration&p=main"], .main [href="javascript:history.go(-1)"], .main [href="home.php?m=cron&p=cron"], .main a[href="home.php?m=cron&p=user_cron"]').addClass('btn btn-sm btn-primary');
	$('.main input[name="removeJob"]').removeClass('btn-primary').addClass('btn-danger');
	$('.main a[href="home.php?m=cron&p=user_cron"]').removeClass('btn-primary').addClass('btn-secondary').prepend('<i class="fas fa-angle-double-left mr-1"></i>');

	$('.main > .log, .main > form, .main > table').wrap('<div class="table-responsive"/>');
	
	$('.hundred td[colspan="6"]').attr('colspan',8);
	$('.main th:last-child').attr('colspan', 2);
});

$(window).load(function()
{
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