$(document).ready(function()
{
	$('.monitorbutton.size').click(function(){
		$(this).addClass('loading');
		$(this).bind("DOMSubtreeModified",function(){
			$(this).removeClass('loading');
		});
	});
	
	$('#server_icon[class^="action-start"]').addClass('btn btn-sm btn-success');
	$('#server_icon[class^="action-stop"]').addClass('btn btn-sm btn-danger');
	$('#server_icon[class^="action-restart"]').addClass('btn btn-sm btn-warning');
	
	$('.monitorbutton').addClass('btn btn-primary d-flex flex-column justify-content-center align-items-center');
	
	$('[id^="refreshed"]').bind("DOMSubtreeModified",function()
	{
		$('button').addClass('btn btn-sm btn-primary');
	});
	
	$('tfoot').removeAttr('style');
	
});

$(window).load(function()
{
	$('#server_icon.btn').click(function()
	{
		$(this).find('[type="radio"]').prop("checked", true);
	});
	
	$('#mgamemanagerpgamemonitor .user_menu_link').each(function()
	{
		if(window.location.href.indexOf($(this).attr('href'))>0)
		{
			$(this).attr('aria-expanded', 'true').parent('li').parent('ul').addClass('in').attr('aria-expanded', 'true').prev('a').attr('aria-expanded', 'true');
		}
	});

	$('#mgamemanagerpgamemonitor > .panel > a').each(function()
	{
		if(window.location.href.indexOf($(this).attr('link'))>0)
		{
			$(this).attr('aria-expanded', 'true').removeAttr('class').next('ul').addClass('in').attr('aria-expanded', 'true');
		}
	});
	
	$('.upload-image').addClass('btn btn-primary btn-sm').attr('onclick', 'uploadMapImg2(this);');
	
	var timestamp = new Date().getTime(); 
	$('.mapicon').attr('src', $('.mapicon').attr('src') + '?t=' + timestamp);
});


function uploadMapImg2(button)
{
	var home_id = $(button).attr('id');
	var mod_id = $(button).attr('data-mod_id');
	var map = $(button).attr('data-map');
	
	var title = $('#translation').attr('data-title');
	var upload_button = $('#translation').attr('data-upload_button');
	var bad_file = $('#translation').attr('data-bad_file');
	var upload_failure = $('#translation').attr('data-upload_failure');
	
	$('.main').append('\
	<div class="dialog-form'+home_id+'" title="'+title+'" >\
		<form class="upload-mapImage-form'+home_id+'" enctype="multipart/form-data" >\
			<input type="hidden" name="map" value="'+map+'" />\
			<input type="file" name="map-image" class="'+home_id+'" value="" />\
			<input type="hidden" name="home_id" value="'+home_id+'" />\
			<input type="hidden" name="mod_id" value="'+mod_id+'" />\
		</form>\
	</div>\
	');

	$( ".dialog-form"+home_id ).dialog({
		autoOpen: true,
		height: 145,
		width: 350,
		modal: true,
		buttons: [{
			text: upload_button, click: function()
			{
				var filename = $('input[name=map-image].'+home_id).val().split('\\').pop();
				var extension = filename.split('.').pop();
				
				if(extension.match(/png|jpg|gif/) != null)
				{
					var filesize = $('input[name=map-image].'+home_id)[0].files[0].fileSize;
					
					if(filesize > 1048576)
					{
						toastr.error(bad_file);
					}
					else
					{
						$(".upload-mapImage-form"+home_id).append('<input type="hidden" name="extension" value="'+extension+'" />');
						
						toastr.info("Please wait...");
						
						data = new FormData($(".upload-mapImage-form"+home_id)[0]);
						
						$.ajax({
							type: 'POST',
							url: 'home.php?m=gamemanager&p=upload_map_image&type=cleared',
							data: data,
							cache: false,
							contentType: false,
							processData: false,
						}).done(function(data)
						{
							if(data.toLowerCase().indexOf("success") >= 0)
							{
								toastr.success($.trim(data));
								$( ".dialog-form"+home_id ).remove();
								location.reload();
							}else
							{
								toastr.warning(data);
							}
						}).fail(function(jqXHR,status, errorThrown) {
							toastr.error(upload_failure);
							
							console.log(errorThrown);
							console.log(jqXHR.responseText);
							console.log(jqXHR.status);
						});
					}
				}
				else
				{
					toastr.error(bad_file);
				}
			}
		}],
		close: function() {
			$( ".dialog-form"+home_id ).remove();
		}
	});
}