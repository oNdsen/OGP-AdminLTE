$(document).ready(function()
{
	$('[href="?m=tickets&p=submitticket"]').addClass('btn btn-primary btn-sm').prepend('<i class="fas fa-comment mr-1"></i>');
	
	$('.main .ticket_closed').addClass('text-muted');
	$('.main .ticket_closed td:nth-child(2)').html('<span class="badge badge-danger"><i class="fas fa-times-circle mr-1"></i>'+$('.main .ticket_closed td:nth-child(2)').html()+'</span>');

	// check if current user is admin for correct response color
	$.ajax({
		cache: false,
		async: true,
		type: 'GET',
		url: 'themes/AdminLTE/dist/php/settings.php?m=global&p=check&v=isadmin',
		success: function(isadmin)
		{
			if(isadmin==1)
			{
				$('.main .ticket_admin_response td:nth-child(2)').html('<span class="badge badge-secondary"><i class="fas fa-comment-dots mr-1"></i>'+$('.main .ticket_admin_response td:nth-child(2)').html()+'</span>');
				$('.main .ticket_customer_response td:nth-child(2)').html('<span class="badge badge-warning"><i class="fas fa-exclamation-triangle mr-1"></i>'+$('.main .ticket_customer_response td:nth-child(2)').html()+'</span>');
			}else
			{
				$('.main .ticket_admin_response td:nth-child(2)').html('<span class="badge badge-warning"><i class="fas fa-exclamation-triangle mr-1"></i>'+$('.main .ticket_admin_response td:nth-child(2)').html()+'</span>');
				$('.main .ticket_customer_response td:nth-child(2)').html('<span class="badge badge-secondary"><i class="fas fa-comment-dots mr-1"></i>'+$('.main .ticket_customer_response td:nth-child(2)').html()+'</span>');
			}
		}
	});

	$('.main .ticketRow a').prepend('<i class="fas fa-angle-double-right mr-1 text-sm"></i>');
});