$(document).ready(function() {
        $('#servermonitor [href$="&delete"], #servermonitor [href$="&remove_db').addClass('btn btn-xs btn-danger');
        $('#servermonitor [href$="&edit"], #servermonitor [href$="&assign"], #servermonitor [href$="&edit_db_settings"]').addClass('btn btn-xs btn-primary');

        $('#servermonitor .success').addClass('badge').addClass('badge-success').removeClass('success');
        $('#servermonitor .failure').addClass('badge').addClass('badge-danger').removeClass('failure');

});

