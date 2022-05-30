$(document).ready(function()
{
	$('.main [href^="?m=user_games&p="]').each(function() {
		var newContent = $(this).text().replace('[', '').replace(']', '');
        	$(this).text(newContent);
	});
	$('.main .size').each(function() {
		var newSize = $(this).text().replace('[', '').replace(']', '')
		$(this).text(newSize);
	});
	$('.main .size').addClass('btn btn-xs btn-default');
	
	$('.main [href="?m=user_games&p=add"]').prepend('<i class="fas fa-plus-square mr-1"></i>').addClass('btn btn-primary btn-sm');
	$('.main [href^="?m=user_games&p=del&home_id"]').prepend('<i class="fas fa-trash-alt mr-1"></i>').addClass('btn btn-danger btn-xs');
	$('.main [href^="?m=user_games&p=edit&home_id"]').prepend('<i class="fas fa-edit mr-1"></i>').addClass('btn btn-primary btn-xs');
	$('.main [href^="?m=user_games&p=clone&home_id"]').prepend('<i class="fas fa-clone mr-1"></i>').addClass('btn btn-primary btn-xs');

	$('.main th:last-of-type').css('width', '150px');
	$('.main tr:last-of-type > td[colspan="2"]').removeAttr('colspan').attr('colspan', 3);
});
