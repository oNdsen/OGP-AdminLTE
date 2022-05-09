$(document).ready(function()
{
	$('.main').addClass('main-content').parent().attr('id', 'content');
	$('.main input[type="submit"]').last().removeClass('btn-primary').addClass('btn-secondary');
});
