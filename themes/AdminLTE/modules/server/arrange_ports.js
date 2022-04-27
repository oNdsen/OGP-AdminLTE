$(document).ready(function() {
        $('.card-body [href^="?m=server&p=edit&rhost_id"]').addClass('btn btn-sm btn-primary');

        $('[name="delete_range"]').removeClass('btn-primary').addClass('btn-danger');
});
