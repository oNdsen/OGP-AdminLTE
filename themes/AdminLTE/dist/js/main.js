$(document).ready(function()
{
	/* *** Toastr Init *** */
	toastr.options = {
		"debug": false,
		"positionClass": "toast-bottom-right",
		"onclick": null,
		"fadeIn": 300,
		"fadeOut": 1000,
		"timeOut": 5000,
		"extendedTimeOut": 1000,
		"progressBar": true,
		toastClass: 'elevation-4',
	}
	
	/* *** Cutting Title *** */
	var headTitle = document.getElementsByTagName("title")[0].innerHTML;
	if(headTitle.includes("["))
	{
		headTitle = headTitle.substring(0, headTitle.lastIndexOf(" [") + 1);
	}
	// $('.brand-text').text(headTitle);
	
	
	/* *** Text Replacement *** */
	$('input[type="submit"]').each(function()
	{
		var thisValue = $(this).val();
		// Remove all "<<" from Buttons
		if(thisValue.includes("<"))
		{
			$(this).val(thisValue.substring(thisValue.lastIndexOf("<") + 1, thisValue.length).trim());
		}
	});
	
	/* *** Messages *** */
	var allMessages = ''
	var errMessages = ''
	
	// error messages
	if($('.failure:not(#errorHeader), .ticketError').length > 0)
	{
		var errt = [];
		$(".failure:not(#errorHeader), .ticketError").each(function ()
		{
			var failureText = $(this).text().trim();
			if(failureText !== "")
			{
				// console.log("failureText: " + failureText);
				errt.push(failureText);
			}
		})

		if(errt.length > 0)
		{
			if(errt.length > 1)
			{
				errMessages = '<ul><li>'+errt.join("</li><li>")+'</li></ul>';
			}else
			{
				errMessages = '<p>'+errt[0]+'</p>';
			}
			
			allMessages += '<div class="callout callout-danger col-12">'+errMessages+'</div>';
		}
	}
	
	// refresh message
	if($('#refresh-manual').length > 0)
	{
		allMessages += '<div class="callout callout-info col-12">'+$('#refresh-manual').html()+'</div>';
	}
	
	
	/* *** Invalid Image replacement *** */
	$('.main img, .main input[type="image"]').error(function()
	{
		$(this).unbind("error").attr("src", "themes/AdminLTE/dist/img/image_not_found.png").attr("style", "max-width:250px;").removeAttr('height');
	});
	
	
	/* *** Theme Change *** */
	$('#themeChanger').change(function()
	{
		if($(this).is(":checked"))
		{
			themeChanger('dark', true);
		}else
		{
			themeChanger('light', true);
		}
	});
	
	
	/* *** Login Page Mod *** */
	if(location.pathname.substring(location.pathname.length-1) == "/" || location.pathname.substring(location.pathname.length-9) == "index.php")
	{
		// login form mod
		if($('form[name="login_form"]').length > 0)
		{
			// get recaptcha
			if ($('.g-recaptcha').length > 0)
			{
				var recaptcha_pubkey = $('.g-recaptcha').attr('data-sitekey');
				var recaptcha = "<div class='text-center' style='margin-bottom:10px'><script src='//www.google.com/recaptcha/api.js'></script><div style='display: inline-block;' class='g-recaptcha' data-sitekey='"+recaptcha_pubkey+"' data-theme='dark'></div></div>";
			}
			else
			{
				var recaptcha = "";
			}
			
			$('select[name=lang]').addClass('form-control');

			var title = $('.main h4').text();
			var lang = $('[name="login_form"] tr:nth-child(1) td:first-child').text().replace(':', '');
			var user = $('[name="login_form"] tr:nth-child(2) td:first-child').text().replace(':', '');
			var pass = $('[name="login_form"] tr:nth-child(3) td:first-child').text().replace(':', '');
			var forgot = $('[href="?m=lostpwd"]').text();
			var lbtn = $('[name="login"]').val();
			var langinput = $('[name="lang"]').parent('td').html();

			if($('[href="?m=register&p=form"]').length > 0)
			{
				var bottomLinks = '\
				<p class="mb-1">\
					<a href="?m=lostpwd">'+forgot+'</a>\
				</p>\
				<p class="mb-0">\
					<a href="?m=register&p=form">'+$('[href="?m=register&p=form"] > span').text()+'</a>\
				</p>\
				';
			}
			else
			{
				var bottomLinks = '\
				<p class="mb-0">\
					<a href="?m=lostpwd">'+forgot+'</a>\
				</p>\
				';
			}
			
			new_form = '\
			<form action="index.php" name="login_form" method="post" class="form-group">\
				<div class="input-group mb-3">\
					<input type="text" name="ulogin" id="ulogin" class="form-control" placeholder="'+user+'">\
					<div class="input-group-append">\
						<div class="input-group-text">\
							<span class="fas fa-envelope"></span>\
						</div>\
					</div>\
				</div>\
				<div class="input-group mb-3">\
					<input type="password" name="upassword" class="form-control" placeholder="'+pass+'">\
					<div class="input-group-append">\
						<div class="input-group-text">\
							<span class="fas fa-lock"></span>\
						</div>\
					</div>\
				</div>\
				<div class="input-group mb-3">\
					'+langinput+'\
					<div class="input-group-append">\
						<div class="input-group-text">\
							<span class="fas fa-language"></span>\
						</div>\
					</div>\
				</div>\
				'+recaptcha+'\
				<div class="row">\
					<div class="col-12">\
						<input type="submit" name="login" class="btn btn-primary btn-block" value="'+lbtn+'" \>\
					</div>\
				</div>\
			</form>\
			'+bottomLinks+'\
			';
			
			$('select[name=lang] > option:first-child').replaceWith('<option value="-" selected="selected">'+lang+'</option>');
		}

		// *** Lost Password Form ***
		if(window.location.href.indexOf('?m=lostpwd') > -1)
		{
			var title = $('.content-header h2').text();
			
			if ($('.main > strong').length > 0 || $('.main > p').text().toLowerCase().indexOf('smtp')>=0)
			{
				// *** Error Message ***
				var err = $('.main strong').text();
				var err_msg = $('.main p').text();

				new_form = '\
				<div class="callout callout-danger"><strong>'+err+'</strong><p>'+err_msg+'</p></div>\
				<p class="mb-0">\
					<a href="m=lostpwd">Back</a>\
				</p>\
				';
			}
			else if ($('.main > p > b[style="color:red;"]').length > 0)
			{
				// *** Sent Password ***
				var msgb = $('.main > p > b[style="color:red;"]').text();
				var msg = $('.main > p').text();
				
				new_form = '\
				<div class="callout callout-success"><strong>'+msg+'</strong><p>'+msgb+'</p></div>\
				<p class="mb-0">\
					<a href="m=lostpwd">Back</a>\
				</p>\
				';
			}
			else
			{
				var alert = "";
				if ($('.main td > p').length > 0)
				{
					var alertClass = 'success';
					if($('.main td > p').attr('style')=='color: red;')
					{
						var alertClass = 'danger';
					}
					
					var errt = [];
					$('.main td > p').each(function()
					{
						errt.push($(this).text());
					});
					
					if(errt)
					{
						var alert = '<div class="row"><div class="callout callout-'+alertClass+' col-12"><ul><li>'+errt.join("</li><li>")+'</li></ul></div></div>';
					}
				}

				var email = $('.main label[for="email_address"]').text();
				var lbtn = $('td > [type="submit"]').val();
				var bbtn = $('[action="index.php"] > input[type="submit"]').val();

				new_form = '\
				'+alert+'\
				<form action="index.php" name="login_form" method="post" class="form-group">\
					<div class="input-group mb-3">\
						<input type="text" name="email_address" class="form-control" placeholder="Email">\
						<div class="input-group-append">\
							<div class="input-group-text">\
								<span class="fas fa-envelope"></span>\
							</div>\
						</div>\
					</div>\
					<div class="row">\
						<div class="col-12">\
							<input type="submit" class="btn btn-primary btn-block submit-button" value="'+lbtn+'" \>\
						</div>\
					</div>\
				</form>\
				<p class="mb-0">\
					<a href="?">'+bbtn+'</a>\
				</p>\
				';
			}
			
		}
		
		var lbm = ''
		if(title !== undefined)
		{
			if (title.length > 0)
			{
				lbm = '<p class="login-box-msg">' + title + '</p>';
			}
		}
		
		if(allMessages && !errMessages && new_form === undefined)
		{
			var new_form = '<h1 class="text-center text-success"><i class="fas fa-check-circle"></i></h1>'
		}
		else if(new_form === undefined)
		{
			var new_form = '<h1 class="text-center"><i class="fas fa-exclamation-circle"></i></h1>'
		}
		
		var new_body = '\
		<div class="login-box">\
			' + allMessages + '\
			<div class="card card-outline card-primary">\
				<div class="card-header text-center">\
					<!--<h1>' + headTitle + '</h1>-->\
					<img src="themes/AdminLTE/dist/img/ogp_logo_dark_is.svg" class="brand-image">\
				</div>\
				<div class="card-body">\
					' + lbm + '\
					' + new_form + '\
				</div>\
			</div>\
		</div>\
		';
		
		$('body').empty().addClass('login-page').html(new_body);
	}
	else
	{
		/* *** Messages Replacement *** */
		// wrap allMessages into row
		// if(allMessages)
		// {
			// allMessages = '<div class="row">'+allMessages+'</row>';
		// }
		$('.failure, .ticketErrorHolder, #refresh-manual').remove();
		$('section.content > .container-fluid').prepend(allMessages);
		
		/* *** Remove CSS and JS Files *** */
		$('link[href="css/global.css"]').remove();
		$('link[href="js/bootstrap/css/bootstrap-combined.min.css"]').remove();
		// $('section').find('link').remove();


		/* *** Removing Chars from Links *** */
		$('a:not(.user_menu_link), a span').each(function(){
			$(this).html($(this).html().replace('[','').replace(']',''));
		});


		/* *** Table Styles *** */
		$('table:not(".online_servers")').each(function()
		{
			// $(this).addClass('table').addClass('table-dark').addClass('table-striped').addClass('table-sm');
			$(this).addClass('table').addClass('table-striped').addClass('table-sm');
		});
		$('table .first_row > td').each(function(){
			$(this).replaceWith('<th>'+$(this).html()+'</th>');
		});


		/* *** Root Links to Buttons *** */
		$('section > div > a').addClass('btn btn-primary');


		/* *** Add Header to Content *** */
		// var currentTitle = $('section > div > h2').first();
		var currentTitle = $('.main > h2').first();
		if(currentTitle.length)
		{
			var addHeader = ' \
				<div class="content-header pb-0"> \
						<div class="container-fluid"> \
								<div class="row mb-2"> \
										<div class="col-12"> \
												<h1 class="m-0">' + $(currentTitle).text() + '</h1> \
										</div> \
								</div> \
						</div> \
				</div> \
				';
			$(currentTitle).remove();
			$('body > .wrapper > .content-wrapper').prepend(addHeader);
		}

		/* *** Forms *** */
		var buttons = $('button:not(".btn-tool"), input[type="button"], input[type="submit"], input[type="SUBMIT"], input[type="reset"], [href^="?m=gamemanager&p=update&update=refresh"], .main [href="?m=modulemanager&p=update"], .main [href="?m=simple-billing&p=shop"], .main [href^="home.php?m=TS3Admin&changevServer"], .main [href^="?m=gamemanager&p=game_monitor&home_id="], .serverIdToggle, .main [href="?m=settings&p=api_hosts"]');
		$(buttons).addClass('btn').addClass('btn-sm').addClass('btn-primary');

		var inputs = $('input, textarea, select').not('input[type=button], input[type="submit"], input[type="SUBMIT"], input[type=reset], input[type=radio], input[type=checkbox], input[type=image], input[type="file"]');
		$(inputs).addClass('form-control').removeAttr('style');


		/* *** Remove unwanted fixed Styles *** */
		$('[style]').css('width', '').css('float', '');
		$('.clear').remove();


		/* *** Several Class and Style Stuff *** */
		$(window).load(function ()
		{
			$('tr, td, div:not([class*="nicEdit"])').css("background-color", "");
			$('div:not([class*="nicEdit"], #refreshed-0)').css("border", "").css("height", "");
			$('input').css("width", "");
			if($.trim($("div").text()) == "") {
				$(this).remove();
			}
			$('.footer.center').removeClass('center');
		});


		/* *** MENU *** */
		// original menu is nested in divs. remove them
		var menu = $('.menu > ul').html();
		$('.menu-bg').remove();
		$('.nav-sidebar').html(menu);
		
		$('.menu ul[id^=submenu] span').each(function() {
			var img_url = $(this).attr('data-icon_path');
			$(this).before("<img src='"+img_url+"'/>");
		});

		// tree class for all ul elements
		$('.nav-sidebar ul').removeAttr('id').addClass('nav').addClass('nav-treeview');

		$('.nav-sidebar li').each(function()
		{
			var tli = $(this);

			// item class for all li elements
			$(tli).addClass('nav-item');

			// check if element has submenu and add dropdown icon
			if($(tli).has('ul').length)
			{
				$(tli).children('a').children('span').append('<i class="right text-sm fas fa-angle-left"></i>');
			}

			// check all nav links and add active/selected state
			$(tli).find('a').each(function()
			{
				// links need nav-link class
				var ta = $(this);
				$(ta).addClass('nav-link text-truncate');

				// check if current link has classes
				var thisClass = $(ta).attr('class');
				if(thisClass !== undefined)
				{
					// check if a class contains selected to set the element active/open
					if(thisClass.includes('selected'))
					{
						$(tli).addClass('menu-open');
						$(ta).addClass('active');
					}
				}
			});

			// Replace all span with paragraphs
			$(tli).find('span').each(function()
			{
				// check if span has img attribute and add it before paragraph
				var checkImage = $(this).attr('data-icon_path');
				if(checkImage !== undefined)
				{
					$(this).replaceWith('<img class="nav-icon" src="'+checkImage+'"/><p>' + $(this).html() + '</p>');
				}else
				{
					$(this).replaceWith('<p>' + $(this).html() + '</p>');
				}
			});
		});
		
		// Add Default Icon to each Link
		$('.nav-sidebar .nav-link').each(function()
		{
			if($(this).find('img').length==0)
			{
				$(this).prepend('<i class="nav-icon text-sm fas fa-bullseye"></i>');
			}
		});

		// Add Submenu Icon to all Submenus
		$('.nav-sidebar .nav-treeview').each(function()
		{
			if($(this).has('ul').length)
			{
				$(this).children('li').children('a').children('p').append('<i class="right fas fa-angle-left"></i>');
			}
		});

		// Only follow Link when Menu is open
		$('.nav-sidebar .nav-item > a').click(function(e)
		{
			if($(this).parent('li').hasClass('menu-open'))
			{
				e.preventDefault();
				window.location = $(this).attr('href');
			}
		});


		// Remove User Element and update top User Area
		var lastNavItem = $('.nav-sidebar > li').last();
		$('.user-panel > .info > a').text($(lastNavItem).children('a').children('p').text()).attr('href', $(lastNavItem).children('a').attr('href'));
		$(lastNavItem).remove();
		
		
		/* *** Pagination *** */
		$('#pagination').each(function(){
			$(this).replaceWith('<ul class="pagination justify-content-center mt-3 mb-0">'+$(this).html()+'</ul>');
			var pm = $('.pagination');

			var ps = $(pm).find('[class$="_paginationStart"]');
			var pp = $(pm).find('[class$="_paginationPages"]');
			var pe = $(pm).find('[class$="_paginationEnd"]');

			if($(ps).length){
				$(ps).find('a').each(function()
				{
					var tl = $(this).attr('href');
					var tc = $(this).text();
					$(pm).append('<li class="page-item"><a class="page-link" href="'+tl+'">'+tc+'</a></li>');
				});
				if($(ps).find('span').length){
					$(pm).append('<li class="page-item"><a class="page-link">...</a></li>');
				}
				$(ps).remove();
			}
			$(pp).find('a').each(function()
			{
				var tl = $(this).attr('href');
				var tc = $(this).text().replace('[','').replace(']','');
				if($(this).is('[class$="_currentPageLink"]')){
					$(pm).append('<li class="page-item active"><a class="page-link" href="'+tl+'">'+tc+'</a></li>');
				}else{
					$(pm).append('<li class="page-item"><a class="page-link" href="'+tl+'">'+tc+'</a></li>');
				}
			});
			$(pp).remove();

			if($(pe).length){
				if($(pe).find('span').length)
				{
					$(pm).append('<li class="page-item"><a class="page-link">...</a></li>');
				}
				$(pe).find('a').each(function()
				{
					var tl = $(this).attr('href');
					var tc = $(this).text();
					$(pm).append('<li class="page-item"><a class="page-link" href="'+tl+'">'+tc+'</a></li>');
				});
				$(pe).remove();
			}

		});
		
		
		/* *** Message Replacement *** */
		$('.success, .warning, .error, #refresh-manual').each(function()
		{
			if($(this).hasClass('success'))
			{
				var thisClass = 'success';
			}
			else if($(this).hasClass('warning'))
			{
				var thisClass = 'warning';
			}
			else if($(this).hasClass('error'))
			{
				var thisClass = 'error';
			}
			else if($(this).is('#refresh-manual'))
			{
				var thisClass = 'info';
			}
			$(this).replaceWith('<div class="callout callout-'+thisClass+'"><p>'+$(this).html()+'</p></div>');
		});
		
		
		/* *** Footer Mod *** */
		$('.main-footer .OGPVersionArea').addClass('d-none');
		$('.footer').html($('.footer').html().replace("Theme - ", "Theme for OGP by <a href='https://www.ondsen.ch' target='_blank'>oNdsen</a> - "))
	}
	
	
	/* *** Get Theme Settings *** */
	// check if theme cookie is set
	if(Cookies.get('theme') === undefined)
	{
		// load theme settings from db
		$.ajax({
			cache: false,
			async: false,
			type: 'GET',
			url: 'themes/AdminLTE/dist/php/settings.php?m=global&p=theme',
			dataType: 'json',
			success: function(theme)
			{
				// create theme cookie
				Cookies.set('theme', theme);
				// change theme
				themeChanger(theme);
			}
		});
	}else
	{
		// change theme
		themeChanger(Cookies.get('theme'));
	}
	
	$('[href="?logout=true"]').click(function()
	{
		// remove theme cookie on logout
		Cookies.remove('theme')
	});
});

$(window).load(function()
{
	$('.main-footer .versionInfo').click(function()
	{
		$('.OGPVersionArea, .OGPVersionArea .version, .OGPVersionArea .versionNumber').removeClass('d-none').removeClass('hide');
	});
});

$(function() {
	$.fn.EveryWhat = function(arg1)
	{
		var arr = [];
		if($.isNumeric(arg1))
		{
			$.each(this, function(idx, item)
			{
				var newNum = idx + 1;
				if(newNum%arg1 == 0)
				{
					arr.push(item);
				}
			});
		}
		return this.pushStack(arr, "EveryWhat", "");
	}
});

function themeChanger(changeTo, save = false)
{
	if(changeTo=='dark')
	{
		if(save)
		{
			$.ajax({
				async: false,
				type: 'GET',
				url: 'themes/AdminLTE/dist/php/settings.php?m=global&p=theme&v=dark',
				dataType: 'json',
				success: function(data)
				{
					toastr.success('Successfully saved theme to dark');
					Cookies.set('theme', 'dark');
				}
			});
		}
		$('#themeChanger').prop("checked", true);
		$('body').removeClass('light-mode').addClass('dark-mode');
		$('nav.main-header').addClass('navbar-dark');
		$('aside.main-sidebar').removeClass('sidebar-light-primary').addClass('sidebar-dark-primary');
		$('aside.control-sidebar').removeClass('control-sidebar-light').addClass('control-sidebar-dark');
		$('img[src^="themes/AdminLTE/dist/img/ogp_logo"]').attr('src', 'themes/AdminLTE/dist/img/ogp_logo_dark_is.svg');
	}
	else if(changeTo=='light')
	{
		if(save)
		{
			$.ajax({
				async: false,
				type: 'GET',
				url: 'themes/AdminLTE/dist/php/settings.php?m=global&p=theme&v=light',
				dataType: 'json',
				success: function(data)
				{
					toastr.success('Successfully saved theme to light');
					Cookies.set('theme', 'light');
				}
			});
		}
		$('#themeChanger').prop("checked", false);
		$('body').removeClass('dark-mode').addClass('light-mode');
		$('nav.main-header').removeClass('navbar-dark');
		$('aside.main-sidebar').removeClass('sidebar-dark-primary').addClass('sidebar-light-primary');
		$('aside.control-sidebar').removeClass('control-sidebar-dark').addClass('control-sidebar-light');
		$('img[src^="themes/AdminLTE/dist/img/ogp_logo"]').attr('src', 'themes/AdminLTE/dist/img/ogp_logo_light_is.svg');
	}
}