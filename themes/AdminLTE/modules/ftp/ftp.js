$(document).ready(function()
{
	if(window.location.href.indexOf("home.php?m=ftp") != -1 )
	{
		$('iframe').attr('id', 'ftp_iframe').css('background-color', '');
		$('iframe').load(function()
		{
			$(this).contents().find("tr").removeAttr("onmouseover").removeAttr("onmouseout");
			$(this).contents().find("body").addClass('ftp_iframe dark-mode');
			$(this).contents().find("div, input").removeAttr("style");
			$(this).contents().find("table").removeAttr("style").removeAttr("colspan").addClass('table table-sm table-striped');
			$(this).contents().find(".page > table > tbody > tr:nth-child(3)").remove();
			$(this).contents().find('b[style="color:red;"]').removeAttr('style').addClass('alert alert-danger');
			$(this).contents().find('.table .table').addClass('inner-table');

			$(this).contents().find('link').remove();
			
			var main_css = '<link rel="stylesheet" type="text/css" href="../../themes/AdminLTE/dist/css/main.css">';
			var ftp_css = '<link rel="stylesheet" type="text/css" href="../../themes/AdminLTE/modules/ftp/main.css">';
			var fa_css = '<link rel="stylesheet" type="text/css" href="../../themes/AdminLTE/plugins/fontawesome-free/css/all.min.css">';
			var bs = '<link rel="stylesheet" href="../../themes/AdminLTE/dist/css/adminlte.css">';
			var js = '<link rel="stylesheet" href="../../themes/AdminLTE/dist/js/main.js">';
			
			$(this).contents().find("head").append(bs);
			$(this).contents().find("head").append(js);
			$(this).contents().find("head").append(main_css);
			$(this).contents().find("head").append(ftp_css);
			$(this).contents().find("head").append(fa_css);

			$(this).contents().find('button, input[type=button], [type=submit], input[type=reset], .swfuploadbtn').addClass('btn btn-sm btn-primary mb-1');
			$(this).contents().find('textarea, select, input[type=text]').addClass('form-control').removeAttr('style');
			$(this).contents().find('form').addClass('form-group');

			$(this).contents().find('.browse_rows_heading a').removeAttr('style').addClass('btn btn-xs btn-primary');
			$(this).contents().find('[href^="javascript:submitBrowseForm(\'%2F\'"]').addClass('btn btn-xs btn-primary').prepend('<i class="fa fa-arrow-up"></i>&nbsp;');
			$(this).contents().find('[href^="javascript:submitBrowseForm"]:not(.btn)').addClass('badge badge-default');
			$(this).contents().find('[onclick*="view"] > a').addClass('btn btn-xs btn-success');
			$(this).contents().find('[onclick*="edit"] > a').addClass('btn btn-xs btn-warning');
			$(this).contents().find('[href^="javascript:toggleElement(\'upload\')"]').addClass('btn btn-xs btn-danger');

			$(this).contents().find('img[src$="folder.png"]').replaceWith('<i class="fa fa-folder-open"></i>');
			$(this).contents().find('img[src$="txt.png"]').replaceWith('<i class="fa fa-pencil-square"></i>');
			$(this).contents().find('img[src$="mime.png"], img[src$="exec.png"]').replaceWith('<i class="fa fa-cog"></i>');
			$(this).contents().find('img[src$="bookmark.png"]').replaceWith('<i class="fa fa-bookmark"></i>');
			$(this).contents().find('img[src$="info.png"]').replaceWith('<i class="fa fa-info-circle"></i>');
			$(this).contents().find('img[src$="exit.png"]').replaceWith('<i class="fas fa-sign-out-alt"></i>');
			$(this).contents().find('img[src$="view_tree.png"]').replaceWith('<i class="fa fa-list-alt"></i>');
			$(this).contents().find('img[src$="mime.png"]').replaceWith('<i class="fas fa-file"></i>');
			$(this).contents().find('img[src$="tgz.png"]').replaceWith('<i class="fas fa-file-archive"></i>');
			$(this).contents().find('img[src$="document.png"]').replaceWith('<i class="fas fa-file-alt"></i>');
			$(this).contents().find('img[src$="terminal.png"]').replaceWith('<i class="fa fa-terminal"></i>');
			$(this).contents().find('img[src$="colors.png"]').replaceWith('<i class="fa fa-file-image"></i>');
			$(this).contents().find('img[src$="misc.png"]').remove();
			$(this).contents().find('img[src$="back.png"]').replaceWith('<i class="fa fa-arrow-circle-left"></i>');

			$(this).contents().find('[accesskey="h"]').addClass('btn btn-warning');
			$(this).contents().find('[accesskey="i"]:not(input)').addClass('btn btn-info');
			$(this).contents().find('[accesskey="l"]').addClass('btn btn-danger');
			$(this).contents().find('[accesskey="b"]').addClass('btn btn-primary');

			$('iframe').contents().find('table h1').each(function(){
				$(this).parent('td').replaceWith('<th>'+$(this).parent('td').html()+'</th>');
			});

			$('iframe').contents().find("body").css('display', 'block');
		});
	}
});
