$(document).ready(function()
{
	$('.main > br').remove();
	
	// remove original logo link
	$('#logo_link').parents('tr').remove();
	
	// remove original background wrapper
	$('#bg_wrapper').parents('tr').remove();
	
	// add multiform attribute for image upload
	$('form[action="?m=settings&p=themes"]').attr('enctype','multipart/form-data');
	
	// add theme width option
	var themeNavWidthOptions = {'250px (Default)':'250', '300px':'300', '350px':'350'}
	var themeNavWidthOptionsOut = ''
	for(var key in themeNavWidthOptions)
	{
		if(themeNavWidthOptions[key]==localStorage.getItem('themeNavWidth'))
		{
			themeNavWidthOptionsOut += '<option value="'+themeNavWidthOptions[key]+'" selected>'+key+'</option>';
		}else
		{
			themeNavWidthOptionsOut += '<option value="'+themeNavWidthOptions[key]+'">'+key+'</option>';
		}
	}
	$('.main #theme').parents('tr').after('\
	<tr>\
		<td align="right">\
			<label for="themeNavWidth">'+langConsts['OGP_LANG_theme']+' Nav Width:</label>\
		</td>\
		<td align="left">\
			<select id="themeNavWidth" name="themeNavWidth" class="form-control">\
				'+themeNavWidthOptionsOut+'\
			</select>\
		</td>\
		<td>\
			<div class="image-tip" data-toggle="tooltip" data-html="true" title="Sets '+langConsts['OGP_LANG_theme']+' Navigation Width for all Users"><i class="far fa-question-circle"></i></div>\
		</td>\
	</tr>\
	');
	
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
			<div class="image-tip" data-toggle="tooltip" data-html="true" title="'+langConsts['OGP_LANG_theme']+' Logo - Max Size: '+(localStorage.getItem('themeNavWidth')-32)+'x50px"><i class="far fa-question-circle"></i></div>\
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
	
	// themeNavWidth change
	$('#themeNavWidth').change(function()
	{
		$.ajax({
			cache: false,
			async: true,
			type: 'GET',
			url: 'themes/AdminLTE/dist/php/settings.php?m=settings&p=themeNavWidth&v='+$(this).val(),
			start: function()
			{
				toastr.info(langConsts['OGP_LANG_theme']+' Nav Width change initiated');
			},
			success: function(themeNavWidth)
			{
				// reseset themeNavWidth cache
				localStorage.setItem('themeNavWidth', themeNavWidth);
				
				// call setNavWidth function from main.js
				setNavWidth(themeNavWidth);
				
				// reset themeLogo tooltip message
				$('#themeLogo').closest('tr').find('.image-tip').attr('title', langConsts['OGP_LANG_theme']+' Logo - Max Size: '+(themeNavWidth-32)+'x50px');
				
				toastr.success('Successfully changed '+langConsts['OGP_LANG_theme']+' Nav Width to ' + themeNavWidth + 'px');
			}
		});
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