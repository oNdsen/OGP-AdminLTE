$(document).ready(function()
{
	$('.main [href="http://www.greycube.com"], .main [href="http://cgx24.com/"]').attr('target', '_blank').addClass('mt-2 d-inline-block');
	$('.main br').remove();
	$('.main [href="?m=lgsl_with_img_mod&p=lgsl"]').addClass('btn btn-sm btn-primary');

	$('img[src$="icon_details.gif"]').replaceWith('<i class="fa fa-search" aria-hidden="true"></i>');
	$('.main [href^="?m=lgsl_with_img_mod&p=lgsl&s="]').addClass('btn btn-xs btn-primary');

	$('.main [title="GAME LINK"] > a').addClass('badge badge-primary badge-size');
});
