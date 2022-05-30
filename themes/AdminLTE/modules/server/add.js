$(document).ready(function()
{
    $('.main [href="?m=server"]').replaceWith('<button onclick="history.back()" class="btn btn-sm btn-primary"><i class="fas fa-angle-double-left mr-1"></i>' + langConsts['OGP_LANG_back'] + '</button>');
});
