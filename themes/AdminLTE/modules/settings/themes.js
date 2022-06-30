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
	$('.main #theme').parents('tr').after('\
	<tr>\
		<td align="right">\
			<label for="themeNavWidth" class="mb-0">'+langConsts['OGP_LANG_theme']+' Nav Width:</label>\
			<small class="currentNavWidth text-muted d-block"></small>\
		</td>\
		<td align="left">\
			<div class="form-group mb-0">\
				<input type="range" class="form-control-range" min="250" max="350" value="'+localStorage.getItem('themeNavWidth')+'" id="themeNavWidth" name="themeNavWidth">\
			</div>\
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
	
	// add theme serverstats option
	var themeServerstatsOptions = {'remove' : langConsts['OGP_LANG_off'], 'activate' : langConsts['OGP_LANG_on']}
	var themeServerstatsOptionsOut = ''
	for(var key in themeServerstatsOptions)
	{
		if(key==localStorage.getItem('themeServerstats'))
		{
			themeServerstatsOptionsOut += '<option value="'+key+'" selected>'+themeServerstatsOptions[key]+'</option>';
		}else
		{
			themeServerstatsOptionsOut += '<option value="'+key+'">'+themeServerstatsOptions[key]+'</option>';
		}
	}
	
	
	if(localStorage.getItem('themeServerstats')=='activate')
	{
		// load themeServerstatsNum settings from db
		var themeServerstatsNum = 10;
		$.ajax({
			cache: false,
			async: false,
			type: 'GET',
			url: 'themes/AdminLTE/dist/php/settings.php?m=global&p=themeServerstats&v=displayNum',
			success: function(data)
			{
				themeServerstatsNum = data;
			}
		});
		
		var themeServerstatsNumOptions = ''
		for(var i of [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20])
		{
			if(i==themeServerstatsNum)
			{
				themeServerstatsNumOptions += '<option value="'+i+'" selected>'+i+'</option>';
			}else
			{
				themeServerstatsNumOptions += '<option value="'+i+'">'+i+'</option>';
			}
		}
		
		themeServerstatsDisplayNum = '\
		<tr>\
			<td align="right">\
				<label for="themeServerstatsNum" class="mb-0">Server Player Stats Num:</label>\
				<small class="text-muted d-block">Displays last n measurements</small>\
			</td>\
			<td align="left">\
				<div class="form-group mb-0">\
					<select id="themeServerstatsNum" name="themeServerstatsNum" class="form-control">\
						' + themeServerstatsNumOptions + '\
					</select>\
				</div>\
			</td>\
			<td>\
				<div class="image-tip" data-toggle="tooltip" data-html="true" title="Displays last n measurements in Playercharts on Dashboard"><i class="far fa-question-circle"></i></div>\
			</td>\
		</tr>\
		'
	}
	
	$('.main #theme').parents('tr').after('\
	<tr>\
		<td align="right">\
			<label for="themeServerstats" class="mb-0">Server Player Stats:</label>\
			<small class="text-muted d-block">Displays custom Server Boxes on Dashboard</small>\
		</td>\
		<td align="left">\
			<div class="form-group mb-0">\
				<select id="themeServerstats" name="themeServerstats" class="form-control">\
					' + themeServerstatsOptionsOut + '\
				</select>\
			</div>\
		</td>\
		<td>\
			<div class="image-tip" data-toggle="tooltip" data-html="true" title="Activates user stats for each server, also installs a running cronjob on first server (1/5min check each server)"><i class="far fa-question-circle"></i></div>\
		</td>\
	</tr>\
	' + themeServerstatsDisplayNum + '\
	');
	
	
	// display current themeNavWidth
	$('.currentNavWidth').text('Current Width: '+localStorage.getItem('themeNavWidth')+'px');
	
	// themeNavWidth slide
	$(document).on('input', '#themeNavWidth', function()
	{
		// call setNavWidth function from main.js
		setNavWidth($(this).val());
		
		// change currentNavWidth text
		$('.currentNavWidth').text('Current Width: ' + $(this).val() + 'px');
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
				
				// display current themeNavWidth
				$('.currentNavWidth').text('Current Width: '+themeNavWidth+'px');
				
				// reset themeLogo tooltip message
				$('#themeLogo').closest('tr').find('.image-tip').attr('title', langConsts['OGP_LANG_theme']+' Logo - Max Size: '+(themeNavWidth-32)+' x 33px');
				
				toastr.success('Successfully changed '+langConsts['OGP_LANG_theme']+' Nav Width to ' + themeNavWidth + 'px');
			}
		});
	});
	
	// themeServerstats change
	$('#themeServerstats').change(function()
	{
		// disable form button
		$('[name="update_settings"]').attr('disabled', 'disabled');
		
		// message
		toastr.info('themeServerstats change initiated');
		
		var themeServerstatsVal = $(this).val();
		
		// console.log('themes/AdminLTE/dist/php/settings.php?m=settings&p=themeServerstats&v='+$(this).val());
		$.ajax({
			cache: false,
			async: true,
			type: 'GET',
			url: 'themes/AdminLTE/dist/php/settings.php?m=settings&p=themeServerstats&v=' + themeServerstatsVal,
			success: function(html)
			{
				// message
				toastr.success('Successfully ' + themeServerstatsVal + 'd themeServerstats');
				
				// set localStorage cache
				localStorage.setItem('themeServerstats', themeServerstatsVal);
			},
			error: function(error)
			{
				toastr.error('Error: ' + error);
			}	
		}).done(function()
		{
			// enable form button
			$('[name="update_settings"]').removeAttr('disabled');
		});
	});
	
	
	// themeServerstatsNum change
	$('#themeServerstatsNum').change(function()
	{
		// disable form button
		$('[name="update_settings"]').attr('disabled', 'disabled');
		
		// message
		toastr.info('themeServerstatsNum change initiated');
		
		var themeServerstatsNumVal = $(this).val();
		
		console.log('themes/AdminLTE/dist/php/settings.php?m=settings&p=themeServerstats&v=setNum&num='+$(this).val());
		$.ajax({
			cache: false,
			async: true,
			type: 'GET',
			url: 'themes/AdminLTE/dist/php/settings.php?m=settings&p=themeServerstats&v=setNum&num=' + themeServerstatsNumVal,
			success: function(html)
			{
				// message
				toastr.success('Successfully set themeServerstatsNum');
			},
			error: function(error)
			{
				toastr.error('Error: ' + error);
			}	
		}).done(function()
		{
			// enable form button
			$('[name="update_settings"]').removeAttr('disabled');
		});
	});
});


$(window).load(function()
{
	// themeLogo upload
	$('input[type=file]#themeLogo').change(function()
	{
		$(this).simpleUpload('themes/AdminLTE/dist/php/settings.php?m=settings&p=fileUpload', {
			allowedExts: ["jpg", "jpeg", "jpe", "jif", "jfif", "jfi", "png", "gif", "svg"],
			allowedTypes: ["image/pjpeg", "image/jpeg", "image/png", "image/x-png", "image/gif", "image/x-gif", "image/svg", "image/svg+xml"],
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
		<div class="themeLogoRemoval my-2">\
			<img src="' + themeLogo + '?t=' + d.getTime() + '" class="brand-image">\
			<a class="btn btn-xs btn-danger m-1" id="removeThemeLogo">\
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