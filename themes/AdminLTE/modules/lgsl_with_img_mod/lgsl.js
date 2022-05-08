$(document).ready(function()
{
	$('.main [href="http://www.greycube.com"], .main [href="http://cgx24.com/"]').attr('target', '_blank').addClass('mt-2 d-inline-block');
	$('.main br').remove();
	$('.main [href="?m=lgsl_with_img_mod&p=lgsl"]').addClass('btn btn-sm btn-primary');

	$('.main img[src$="icon_details.gif"]').replaceWith('<i class="fas fa-search"></i>');
	$('.main [href^="?m=lgsl_with_img_mod&p=lgsl&s="]').addClass('btn btn-xs btn-primary');

	$('.main [title="GAME LINK"] > a').addClass('badge badge-primary badge-size');
});

$(window).load(function()
{
	$('.main input').addClass('form-control');
	$('.main table').addClass('table table-striped table-sm');
});