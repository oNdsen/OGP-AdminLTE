$(document).ready(function()
{
	$('[href="?m=tickets&p=submitticket"]').addClass('btn btn-primary btn-sm').prepend('<i class="fas fa-comment mr-1"></i>');
	
	$('.main .ticket_closed').addClass('text-muted');
	$('.main .ticket_closed td:nth-child(2)').html('<span class="badge badge-danger"><i class="fas fa-times-circle mr-1"></i>'+$('.main .ticket_closed td:nth-child(2)').html()+'</span>');
	$('.main .ticket_admin_response td:nth-child(2)').html('<span class="badge badge-info"><i class="fas fa-comment-dots mr-1"></i>'+$('.main .ticket_admin_response td:nth-child(2)').html()+'</span>');
	
	$('.main .ticketRow a').prepend('<i class="fas fa-angle-double-right mr-1 text-sm"></i>');
});