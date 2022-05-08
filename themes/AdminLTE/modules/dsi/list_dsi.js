$(document).ready(function()
{
	$('.main br').remove();
	$('.main input:not([type="SUBMIT"]), .main select').addClass('form-control');
	$('.main button, .main [type="SUBMIT"]').addClass('btn btn-sm btn-primary');
	$('.main table').addClass('table table-striped table-sm');
});