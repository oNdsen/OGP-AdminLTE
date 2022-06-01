$(document).ready(function()
{
    $('.main [href="?m=server"]').addClass('btn btn-sm btn-primary');
	$('.main input[name="reset_firewall"]').removeClass('btn-primary').addClass('btn-danger');

	$('.main [href$="ch_fw_status=disable"]').addClass('btn btn-sm btn-danger my-2').prepend('<i class="fas fa-stop-circle mr-1"></i>');
	$('.main [href$="ch_fw_status=enable"]').addClass('btn btn-sm btn-success my-2').prepend('<i class="fas fa-play-circle mr-1"></i>');
});
