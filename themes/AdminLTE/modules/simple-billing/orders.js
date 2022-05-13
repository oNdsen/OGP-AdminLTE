$(document).ready(function()
{
	var d = new Date();
	
	$('.main').addClass('simple-billing');
	$('.main > style').remove();
	$('.main > h4').each(function()
	{
		$(this).replaceWith('<div class="callout callout-info">'+$(this).text()+'</div>');
	});
	
	$('input[name="remove"]').addClass('btn-danger');
	
	$('.main table').removeAttr('style');
	
	$('.main [href^="?m=user_admin"]').each(function()
	{
		var thisUserProfileLink = $(this).attr('href');
		var thisUserId = new URLSearchParams(thisUserProfileLink).get('user_id');
		var setThisUserAvatar = 'themes/AdminLTE/dist/img/default-avatar.png';
		
		$(this).parent('td').prepend('<img src="'+setThisUserAvatar+'" class="img-circle elevation-2 mr-2" alt="User Image">');
		
		var thisUserImage = $(this).parent('td').find('img');
		
		if(thisUserId)
		{
			if(!localStorage.getItem('avatar_' + thisUserId))
			{
				// set loading avatar
				$(thisUserImage).attr('src', 'themes/AdminLTE/dist/img/spinner.gif?'+ d.getTime()).removeClass('elevation-2');
				
				// load avatar from db
				$.ajax({
					cache: false,
					async: true,
					type: 'GET',
					url: 'themes/AdminLTE/dist/php/settings.php?m=user&p=getavatar&userid=' + thisUserId,
					success: function(avatar)
					{
						// set avatar cache
						localStorage.setItem('avatar_' + thisUserId, avatar);
						
						// set user avatar
						$(thisUserImage).attr('src', avatar + "?" + d.getTime()).addClass('elevation-2');
					}
				});
			}else
			{
				// set user avatar variable
				setThisUserAvatar = localStorage.getItem('avatar_' + thisUserId);
			}
		}
		
		$(thisUserImage).attr('src', setThisUserAvatar + "?" + d.getTime());
	});
});
