$(document).ready(function()
{
	$('.main [href="?m=administration&p=main"], .main [href="javascript:history.go(-1)"], .main [href="home.php?m=cron&p=cron"]').addClass('btn btn-sm btn-primary');
	$('input[name="removeJob"]').removeClass('btn-primary').addClass('btn-danger');
	
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