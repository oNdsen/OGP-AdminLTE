$(document).ready(function()
{
	// remove original logo link
	$('#logo_link').parents('tr').remove();
	
	// remove original background wrapper
	$('#bg_wrapper').parents('tr').remove();
	
	// add multiform attribute for image upload
	$('form[action="?m=settings&p=themes"]').attr('enctype','multipart/form-data');
	
	// add logo upload form
	$('.main #theme').parents('tr').after('\
	<tr>\
		<td align="right">\
			<label for="themeLogo">'+langConsts['OGP_LANG_theme']+' Logo:</label>\
		</td>\
		<td align="left">\
			<div class="form-group mb-0">\
				<div class="input-group">\
					<div class="custom-file">\
						<input type="file" class="custom-file-input" name="themeLogo" id="themeLogo">\
						<label class="custom-file-label" for="themeLogo">Choose Image</label>\
					</div>\
				</div>\
			</div>\
		</td>\
		<td>\
			<div class="image-tip" id="0" data-toggle="tooltip" data-html="true" title="'+langConsts['OGP_LANG_theme']+' Logo - Max Size: 300x50px"><i class="far fa-question-circle"></i></div>\
		</td>\
	</tr>\
	');
	
	// add themeLogo removal if set
	$.ajax({
		cache: false,
		async: true,
		type: 'GET',
		url: 'themes/AdminLTE/dist/php/settings.php?m=global&p=themeLogo',
		dataType: 'json',
		success: function(themeLogo)
		{
			if(themeLogo)
			{
				// add themeRemoval
				addThemeRemoval(themeLogo);
			}
		}
	});
});


$(window).load(function()
{
	// themeLogo upload
	$('input[type=file]#themeLogo').change(function()
	{
		$(this).simpleUpload('themes/AdminLTE/dist/php/settings.php?m=settings&p=fileUpload', {
			allowedExts: ["jpg", "jpeg", "jpe", "jif", "jfif", "jfi", "png", "gif"],
			allowedTypes: ["image/pjpeg", "image/jpeg", "image/png", "image/x-png", "image/gif", "image/x-gif"],
			maxFileSize: 5242880, // 5mb in bytes
			limit: 1,
			start: function()
			{
				toastr.info(langConsts['OGP_LANG_theme']+' Logo Upload initiated');
			},
			success: function(data)
			{
				var jsonData = $.parseJSON(data);
				
				if(jsonData['code']=="success")
				{
					$.ajax({
						url: jsonData['data'],
						type: 'HEAD',
						error: function()
						{
							toastr.error('Error: Uploaded File not found');
						},
						success: function()
						{
							var d = new Date();
							
							// overwrite themeLogo cache
							localStorage.setItem('themeLogo', jsonData['data']);
							
							// set themeLogo
							$('img.brand-image').attr('src', jsonData['data'] + "?t=" + d.getTime());
							
							if($('.themeLogoRemoval').length==0)
							{
								// add themeRemoval
								addThemeRemoval(jsonData['data']);
							}
							
							toastr.success('Successfully uploaded new '+langConsts['OGP_LANG_theme']+' Logo');
						}
					});
				}else
				{
					toastr.error(jsonData['data']);
				}
			},
			error: function(error)
			{
				toastr.error('Error: ' + error);
			}
		});
	});
});


function addThemeRemoval(themeLogo)
{
	var d = new Date();
	$('.main #themeLogo').parents('.form-group').after('\
		<div class="themeLogoRemoval mt-1">\
			<img src="' + themeLogo + '?t=' + d.getTime() + '" class="brand-image">\
			<a class="btn btn-sm btn-danger ml-1" id="removeThemeLogo">\
				<i class="fas fa-trash-alt mr-1"></i>Remove ' + langConsts['OGP_LANG_theme'] + ' Logo\
			</a>\
		</div>\
	');
	
	$('#removeThemeLogo').click(function()
	{
		$.ajax({
			async: true,
			type: 'GET',
			url: 'themes/AdminLTE/dist/php/settings.php?m=settings&p=themeLogo&v=remove',
			success: function(data)
			{
				// remove themeLogoRemoval div
				$('.themeLogoRemoval').remove();
				
				// remove themeLogo from localStorage
				localStorage.removeItem('themeLogo');
				
				// change theme for image updates
				themeChanger(localStorage.getItem('theme'));
				
				toastr.success('Successfully removed '+langConsts['OGP_LANG_theme']+' Logo');
			}
		});
	});
}