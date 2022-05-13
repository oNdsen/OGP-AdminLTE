$(document).ready(function()
{
	var d = new Date();
	
	$('.main [href="?m=user_admin&p=add"]').addClass('btn btn-sm btn-primary').prepend('<i class="fas fa-user-plus mr-1"></i>');
	$('.main [href^="?m=user_admin&p=edit_user&user_id="]').addClass('btn btn-xs btn-primary').prepend('<i class="fas fa-user-edit mr-1"></i>');
	$('.main [href^="?m=user_games&p=assign&user_id="]').addClass('btn btn-xs btn-success').prepend('<i class="fas fa-plus-square mr-1"></i>');
	$('.main [href^="?m=user_admin&p=del&user_id="]').addClass('btn btn-xs btn-danger').prepend('<i class="fas fa-trash-alt mr-1"></i>');

	$('.main style').remove();
	$('.main .userListTable .actions > br').remove();
	
	$('.main .userListTable tr').each(function()
	{
		if($(this).find('td:nth-child(3)').text().toLowerCase()==langConsts['OGP_LANG_user'].toLowerCase())
		{
			$(this).find('td:nth-child(3)').html('<span class="badge badge-info">'+langConsts['OGP_LANG_user']+'</span>');
		}
		else if($(this).find('td:nth-child(3)').text().toLowerCase()==langConsts['OGP_LANG_admin'].toLowerCase())
		{
			$(this).find('td:nth-child(3)').html('<span class="badge badge-danger">'+langConsts['OGP_LANG_admin']+'</span>');
		}
		
		var thisUserId = $(this).attr('uid');
		var setThisUserAvatar = 'themes/AdminLTE/dist/img/default-avatar.png';
		
		$(this).find('td:nth-child(2)').prepend('<img src="'+setThisUserAvatar+'" class="img-circle elevation-2 mr-2" alt="User Image">');
		
		var thisUserImage = $(this).find('td:nth-child(2)').find('img');
		
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
