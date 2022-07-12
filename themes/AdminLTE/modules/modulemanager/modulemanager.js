$(document).ready(function()
{
	$('[href^="?m=modulemanager&p=del"]').addClass('btn btn-danger btn-xs').prepend('<i class="fas fa-trash-alt mr-1"></i>');
	$('[href^="?m=modulemanager&p=add"]').addClass('btn btn-success btn-xs').prepend('<i class="fas fa-plus mr-1"></i>');
});