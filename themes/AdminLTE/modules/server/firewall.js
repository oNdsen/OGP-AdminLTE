$(document).ready(function() {
    $('.card-body [href="?m=server"]').addClass('btn btn-sm btn-primary');
	$('input[name="reset_firewall"]').removeClass('btn-primary').addClass('btn-danger');

	$('.card-body [href$="ch_fw_status=disable"]').addClass('btn btn-sm btn-danger');
	$('.card-body [href$="ch_fw_status=enable"]').addClass('btn btn-sm btn-success');

});
