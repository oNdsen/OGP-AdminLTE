$(document).ready(function()
{
	/* *** Initializations *** */
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
	bsCustomFileInput.init();
	var d = new Date();
	
	
	/* *** Cutting Title *** */
	var headTitle = document.getElementsByTagName("title")[0].innerHTML;
	if(headTitle.includes("["))
	{
		headTitle = headTitle.substring(0, headTitle.lastIndexOf(" [") + 1);
	}
	// $('.brand-text').text(headTitle);
	
	
	/* *** Replacements *** */
	$('a.btn').each(function()
	{
		// Remove all "<<" from Links
		var thisText = $(this).text();
		if(thisText.includes("<"))
		{
			$(this).text(thisText.substring(thisText.lastIndexOf("<") + 1, thisText.length).trim()).prepend('<i class="fas fa-angle-double-left mr-1"></i>');
		}
	});
	$('input[type="submit"]').each(function()
	{
		// Remove all "<<" from Buttons
		var thisValue = $(this).val();
		if(thisValue.includes("<"))
		{
			$(this).val(thisValue.substring(thisValue.lastIndexOf("<") + 1, thisValue.length).trim());
		}
	});
	$('img[src="modules/addonsmanager/loading.gif"]').replaceWith('<i class="fas fa-spinner fa-spin loadinggif"></i>');
	$('img[src="images/online.png"], img[src$="icon_online.gif"]').replaceWith('<i class="fa fa-circle text-success"></i>');
	$('img[src="images/offline.png"], img[src$="icon_offline.gif"]').replaceWith('<i class="fa fa-circle text-danger"></i>');
	$('img[src="images/magnifglass.png"]').replaceWith('<i class="fas fa-search"></i>');
	$('[src="modules/administration/images/remove.gif"]').attr('src', 'themes/AdminLTE/dist/img/remove-icon.png').css('max-width', '1rem').css('margin-bottom', '-2px').addClass('mx-1');
	
	
	/* *** Menu: Tickets Num *** */
	if($('script[src="js/modules/tickets_global.js"]').length)
	{
		$('script[src="js/modules/tickets_global.js"]').remove();
		
		$.getJSON("home.php?m=tickets&p=notifications&type=cleared", function(data)
		{
			if(data['notificationCount'] > 0)
			{
				$('.nav-link[href="?m=tickets"]').append('<span class="badge badge-danger right">' + data['notificationCount'] + '</span>');
			}
		});
	}
	
	
	/* *** Messages *** */
	var allMessages = ''
	var errMessages = ''
	
	// error messages
	if($('.failure:not(#errorHeader), .ticketError').length > 0)
	{
		// only replace failure message if main has class X
		if($('.main').hasClass('game-monitor'))
		{
			$(".failure:not(#errorHeader), .ticketError").each(function ()
			{
				var failureText = $(this).text().trim();
				if(failureText !== "" &&  isNaN(failureText))
				{
					$(this).replaceWith('<div class="callout callout-danger">'+$(this).text().trim()+'</div>');
				}
			});
		}else
		{
			var errt = [];
			$(".failure:not(#errorHeader), .ticketError").each(function ()
			{
				var failureText = $(this).text().trim();
				if(failureText !== "" &&  isNaN(failureText))
				{
					errt.push(failureText);
				}
			});

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
	}
	
	// refresh message
	if($('#refresh-manual').length > 0)
	{
		allMessages += '<div class="callout callout-info col-12">'+$('#refresh-manual').html()+'</div>';
	}
	
	$('.failure, .ticketErrorHolder, #refresh-manual').remove();
	
	
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
		
		// login form mod
		if($('form[name="login_form"]').length > 0)
		{
			// clear possible storage vars
			clearLocalStorageItems();
		
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
			
			if($('.main form').length==0)
			{
				// *** Error Message ***
				var err = $('.main strong').text();
				var err_msg = [];
				$('.main p').each(function()
				{
					err_msg.push($(this).html());
				});
				
				var thisErrOut = '';
				if(allMessages=='')
				{
					thisErrOut = '<div class="callout callout-info"><strong>'+err+'</strong><ul><li>'+err_msg.join("</li><li>")+'</li></ul></div>';
				}

				new_form = '\
				' + thisErrOut + '\
				<p class="mb-0">\
					<a href="?m=lostpwd">Back</a>\
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
				<form action="?m=lostpwd" method="post" class="form-group">\
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
		
		// register form mod
		if($('form[action^="?m=register"]').length > 0)
		{
			var title = $('.main h2').text();
			var user = $('[name="loginForm"] label[for="login_name"]').text().replace(':', '');
			var pass = $('[name="loginForm"] label[for="users_passwd"]').text().replace(':', '');
			var vpass = $('[name="loginForm"] label[for="users_cpasswd"]').text().replace(':', '');
			var fname = $('[name="loginForm"] label[for="users_fname"]').text().replace(':', '');
			var lname = $('[name="loginForm"] label[for="users_lname"]').text().replace(':', '');
			var email = $('[name="loginForm"] label[for="users_email"]').text().replace(':', '');
			
			var ucv = $('[name="users_comment"]').val();
			var sbtn = $('[name="Submit"]').val();
			
			var errout = "";

			if($('.main > table').length > 0)
			{
				var errt = [];
				$(".main > table tr").each(function ()
				{
					var tdtxt = $(this).find('td').text();
					if(!tdtxt.includes('<img'))
					{
						errt.push(tdtxt);
					}
				})
			}

			if(errt)
			{
				errout = '<div class="callout callout-danger col-12"><ul><li>'+errt.join("</li><li>")+'</li></ul></div>';
			}
			
			new_form = '\
			' + errout + '\
			<form action="?m=register&p=exec" name="loginForm" method="post" class="form-group">\
				<div class="input-group mb-3">\
					<input type="text" name="login_name" id="login_name" class="form-control" placeholder="'+user+'">\
					<div class="input-group-append">\
						<div class="input-group-text">\
							<span class="fas fa-user"></span>\
						</div>\
					</div>\
				</div>\
				<div class="input-group mb-3">\
					<input type="password" name="users_passwd" id="users_passwd" class="form-control" placeholder="'+pass+'">\
					<div class="input-group-append">\
						<div class="input-group-text">\
							<span class="fas fa-lock"></span>\
						</div>\
					</div>\
				</div>\
				<div class="input-group mb-3">\
					<input type="password" name="users_cpasswd" id="users_cpasswd" class="form-control" placeholder="'+vpass+'">\
					<div class="input-group-append">\
						<div class="input-group-text">\
							<span class="fas fa-lock"></span>\
						</div>\
					</div>\
				</div>\
				<div class="input-group mb-3">\
					<input type="text" name="users_fname" id="users_fname" class="form-control" placeholder="'+fname+'">\
					<div class="input-group-append">\
						<div class="input-group-text">\
							<span class="fas fa-user"></span>\
						</div>\
					</div>\
				</div>\
				<div class="input-group mb-3">\
					<input type="text" name="users_lname" id="users_lname" class="form-control" placeholder="'+lname+'">\
					<div class="input-group-append">\
						<div class="input-group-text">\
							<span class="fas fa-user"></span>\
						</div>\
					</div>\
				</div>\
				<div class="input-group mb-3">\
					<input type="text" name="users_email" id="users_email" class="form-control" placeholder="'+email+'">\
					<div class="input-group-append">\
						<div class="input-group-text">\
							<span class="fas fa-envelope"></span>\
						</div>\
					</div>\
				</div>\
				<input type="hidden" name="users_comment" value="'+ucv+'" class="form-control">\
				'+recaptcha+'\
				<div class="row">\
					<div class="col-12">\
						<input type="submit" name="Submit" class="btn btn-primary btn-block" value="'+sbtn+'" \>\
					</div>\
				</div>\
			</form>\
			';
		}
		
		var lbm = ''
		if(title !== undefined)
		{
			if (title.length > 0)
			{
				lbm = '<p class="login-box-msg">' + title + '</p>';
			}
		}
		
		var boxClass = 'login-box';
		var headerContent = '\
		<!--<h1>' + headTitle + '</h1>-->\
		<img src="themes/AdminLTE/dist/img/ogp_logo_dark.svg" class="brand-image">\
		';
		
		if(new_form !== undefined)
		{
			$('body').addClass('login-page');
		}
		
		if(allMessages && !errMessages && new_form === undefined)
		{
			var new_form = '<h1 class="text-center"><i class="fas fa-spinner fa-spin"></i></h1>'
		}
		else if(new_form === undefined)
		{
			boxClass = 'col-md-8 col-12 main';
			headerContent = '<h4>' + $('.main > h2').text() + '</h4>';
			
			$('body').removeClass('login-page');
			$('.main > h2').remove();
			var new_form = $('.main').html();
		}
		
		// menu links
		var allLinks = [];
		$('.menu a').each(function()
		{
			allLinks.push('<li class="nav-item d-sm-inline-block"><a class="nav-link" href="'+$(this).attr('href')+'">'+$(this).find('span').text()+'</a></li>');
		});
		
		
		// Maintenance Hook
		$.ajax({
			async: true,
			type: 'GET',
			url: 'themes/AdminLTE/dist/php/settings.php?m=global&p=check&v=maintenance',
			dataType: 'json',
			success: function(data)
			{
				if(data['maintenance_mode'] > 0)
				{
					toastr.info(data['maintenance_message'], data['maintenance_title'], {
						"timeOut": 0,
						"extendedTimeOut": 0,
						"preventDuplicates": true,
						"disableTimeOut" : true,
						"closeButton": true,
					});
					toastr.error('', langConsts['OGP_LANG_maintenance_mode_on'], {
						"timeOut": 0,
						"extendedTimeOut": 0,
						"preventDuplicates": true,
						"disableTimeOut" : true,
						"closeButton": true,
					});
				}
			}
		});
		
		var new_body = '\
		<nav class="navbar navbar-expand-lg navbar-dark bg-dark">\
			<button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">\
				<span class="navbar-toggler-icon"></span>\
			</button>\
			<div class="collapse navbar-collapse" id="navbarSupportedContent">\
				<ul class="navbar-nav mr-auto">\
					'+allLinks.join(' ')+'\
				</ul>\
			</div>\
		</nav>\
		<div class="mx-auto mt-3 ' + boxClass + '">\
			' + allMessages + '\
			<div class="card card-outline card-primary">\
				<div class="card-header text-center">\
					' + headerContent + '\
				</div>\
				<div class="card-body">\
					' + lbm + '\
					' + new_form + '\
				</div>\
			</div>\
		</div>\
		';
		
		// apply new body
		var preLoader = $('.preloader');
		$('body').empty().html(preLoader);
		$('body').append(new_body);
		
		// navbar toggler z-index hook
		$('.navbar-toggler').click(function()
		{
			console.log("css: " + $(this).parent('.navbar').css('z-index'));
			if($(this).parent('.navbar').css('z-index') == 'auto')
			{
				$(this).parent('.navbar').css('z-index', 9999);
			}else
			{
				$(this).parent('.navbar').css('z-index', '');
			}
		});
	}
	else
	{
		/* *** Messages Replacement *** */
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
			$(this).addClass('table table-striped table-sm').removeAttr('style').wrap('<div class="table-responsive"></div>');;
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
		$(buttons).addClass('btn btn-sm btn-primary');

		var inputs = $('input, textarea, select').not('input[type=button], input[type="submit"], input[type="SUBMIT"], input[type=reset], input[type=radio], input[type=checkbox], input[type=image], input[type="file"]');
		$(inputs).addClass('form-control').removeAttr('style');


		/* *** Remove unwanted fixed Styles *** */
		$('[style]').css('width', '').css('float', '');
		$('.clear').remove();
		$('pre').removeAttr('style');


		/* *** MENU *** */
		// original menu is nested in divs. remove them
		var menu = $('.menu > ul').html();
		$('.menu-bg').remove();
		$('.nav-sidebar').html(menu);
		
		$('.menu ul[id^=submenu] span').each(function()
		{
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
			// check if link contains paragraph
			if($(this).find('p').length==0)
			{
				// fix missing paragraph
				$(this).html('<p>'+$(this).html()+'</p>');
			}
			
			// check if nav-link has icon missing
			if($(this).find('img').length==0)
			{
				if($(this).parents('.nav-item').hasClass('osIcon'))
				{
					// add OS icon
					if($(this).parents('.osIcon').attr('class').includes('linux'))
					{
						$(this).prepend('<i class="nav-icon text-sm fab fa-linux"></i>');
					}else
					{
						$(this).prepend('<i class="nav-icon text-sm fab fa-windows"></i>');
					}
				}else
				{
					// Add Default Icon
					$(this).prepend('<i class="nav-icon text-sm fas fa-angle-double-right"></i>');
				}
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
				e.stopPropagation();
				// e.preventDefault();
				window.location = $(this).attr('href');
			}
		});
		// Remove User Element and update top User Area
		var userNavItem = $('.nav-sidebar [href^="?m=user_admin&p=edit_user&user_id"]').parent('.nav-item');
		var userProfileLink = $(userNavItem).children('a').attr('href');
		var userId = new URLSearchParams(userProfileLink).get('user_id');
		var setUserAvatar = 'themes/AdminLTE/dist/img/default-avatar.png';
		
		if(userId)
		{
			if(!localStorage.getItem('avatar_' + userId))
			{
				var d = new Date();
				
				// set loading avatar
				setUserAvatar = 'themes/AdminLTE/dist/img/spinner.gif';
				$('.user-panel > .image > img').attr('src', setUserAvatar + "?t=" + d.getTime()).removeClass('elevation-2');
				
				// load avatar from db
				$.ajax({
					cache: false,
					async: true,
					type: 'GET',
					url: 'themes/AdminLTE/dist/php/settings.php?m=user&p=getavatar&userid=' + userId,
					success: function(avatar)
					{
						var d = new Date();
						
						// set avatar cache
						localStorage.setItem('avatar_' + userId, avatar);
						
						// set user avatar
						$('.user-panel > .image > img').attr('src', avatar + "?t=" + d.getTime()).addClass('elevation-2');
						
						// set user avatar variable
						setUserAvatar = avatar;
					}
				});
			}else
			{
				// set user avatar variable
				setUserAvatar = localStorage.getItem('avatar_' + userId);
			}
		}
		
		// set user avatar and link
		$('.user-panel > .image > img').attr('src', setUserAvatar + "?t=" + d.getTime());
		$('.user-panel > .info > a').text($(userNavItem).children('a').children('p').text()).attr('href', userProfileLink);
		
		// check if user contains additional submenus
		if($(userNavItem).find('.nav').find('.nav-item:not(:last-of-type)').length > 0)
		{
			$(userNavItem).find('.nav').find('.nav-item:not(:last-of-type)').each(function()
			{
				$('.main-sidebar .nav-sidebar').append('<li class="' + $(this).attr('class') + '">' + $(this).html() + '</li>');
			});
		}
		
		// remove old user menu item
		$(userNavItem).remove();
		
		
		/* *** add missing menu highlights *** */
		var checkMenuLinks = ['?m=subusers', '?m=user_admin&p=show_groups'];
		checkMenuLinks.forEach((url, index) => {
			if(window.location.href.indexOf(url) > -1)
			{
				$('.main-sidebar .nav-sidebar [href^="' + url + '"]').addClass('active');
			}
		});
		
		// menu higlight fix for theme settings
		if(window.location.href.indexOf('?m=settings&p=themes') > -1)
		{
			$('.main-sidebar .nav-sidebar [href="?m=settings"]').removeClass('active');
		}
		
		// menu higlight fix for gameserver
		if(window.location.href.indexOf('admin')==-1 && window.location.href.indexOf('m=user_games')==-1 && window.location.href.indexOf('m=config_games')==-1 && window.location.href.indexOf('m=fast_download')==-1)
		{
			if(window.location.href.indexOf('home_id-mod_id-ip-port') > -1 || window.location.href.indexOf('home_cfg_id') > -1 || window.location.href.indexOf('&home_id') > -1)
			{
				// specific server (can also be logs etc)
				if(window.location.href.indexOf('home_id-mod_id-ip-port') > -1)
				{
					var uri = window.location.href.substring(window.location.href.indexOf('home_id-mod_id-ip-port='));
					
					// check if uri contains other parameters
					if(uri.includes('&'))
					{
						// cut uri before next parameter
						uri = uri.substring(0, uri.lastIndexOf("&"));
					}
					
					uri = 'href$="'+uri+'"';
				}
				// all servers by config
				else if(window.location.href.indexOf('home_cfg_id') > -1)
				{
					var uri = window.location.href.substring(window.location.href.indexOf('?'));
					uri = 'href$="'+uri+'"';
				}
				// specific server by home_id
				else if(window.location.href.indexOf('home_id') > -1)
				{
					const urlParams = new URLSearchParams(window.location.search);
					var homeId = urlParams.get('home_id');
					
					var uri = '?m=gamemanager&p=game_monitor&home_id-mod_id-ip-port='+homeId+'-';
					uri = 'href^="'+uri+'"';
				}
				
				$('.nav-sidebar .active').removeClass('active');
				$('.nav-sidebar .nav-link['+uri+']').addClass('active');
				
				if(window.location.href.indexOf('home_id-mod_id-ip-port') > -1 || window.location.href.indexOf('home_cfg_id') > -1 || window.location.href.indexOf('home_id') > -1)
				{
					$('.nav-sidebar .nav-link['+uri+']').parents('.nav-item').addClass('menu-open');
				}
			}
		}
		
		
		/* *** Pagination *** */
		$('#pagination').each(function()
		{
			$(this).replaceWith('<ul class="pagination justify-content-center mt-3 mb-0">'+$(this).html()+'</ul>');
			var pm = $('.pagination');

			var ps = $(pm).find('[class$="_paginationStart"]');
			var pp = $(pm).find('[class$="_paginationPages"]');
			var pe = $(pm).find('[class$="_paginationEnd"]');

			if($(ps).length)
			{
				$(ps).find('a').each(function()
				{
					var tl = $(this).attr('href');
					var tc = $(this).text();
					$(pm).append('<li class="page-item"><a class="page-link" href="'+tl+'">'+tc+'</a></li>');
				});
				if($(ps).find('span').length)
				{
					$(pm).append('<li class="page-item"><a class="page-link">...</a></li>');
				}
				$(ps).remove();
			}
			$(pp).find('a').each(function()
			{
				var tl = $(this).attr('href');
				var tc = $(this).text().replace('[','').replace(']','');
				if($(this).is('[class$="_currentPageLink"]'))
				{
					$(pm).append('<li class="page-item active"><a class="page-link" href="'+tl+'">'+tc+'</a></li>');
				}else
				{
					$(pm).append('<li class="page-item"><a class="page-link" href="'+tl+'">'+tc+'</a></li>');
				}
			});
			$(pp).remove();

			if($(pe).length)
			{
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
		var msgReplBodySkip = ['services', 'simple-billing'];
		var skipMsgRepl = false;
		for(i = 0; i < msgReplBodySkip.length; i++)
		{
			if($('.main').hasClass(msgReplBodySkip[i]))
			{
				skipMsgRepl = true;
			}
		}
		
		$('.success, .warning, .error, #refresh-manual').each(function()
		{
			
			if(!$('.main').hasClass('services'))
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
				
				if(!skipMsgRepl)
				{
					$(this).replaceWith('<div class="callout callout-'+thisClass+'"><p>'+$(this).html()+'</p></div>');
				}else
				{
					$(this).addClass('text-' + thisClass);
				}
			}
		});
		
		
		/* *** Footer Mod *** */
		$('.main-footer .OGPVersionArea').addClass('d-none');
		$('.main-footer a').attr('target', '_blank').addClass('text-dark');
		$('.main-footer .footer').html($('.main-footer .footer').html().replace("Theme - ", "Theme for OGP by <a href='https://www.ondsen.ch' target='_blank' class='text-dark'>oNdsen</a> - "))
		$('.main-footer .footer.center').removeClass('center');
		$('.main-footer .OGPVersionArea .version').remove()
		$('.main-footer .OGPVersionArea').removeClass('inline-block').addClass('d-inline-block');
		$('.main-footer .footer > br').last().remove()
	}
	
	
	/* *** Get Theme Settings *** */
	// check if theme cache is set
	if(!localStorage.getItem('theme'))
	{
		// load theme settings from db
		$.ajax({
			cache: false,
			async: true,
			type: 'GET',
			url: 'themes/AdminLTE/dist/php/settings.php?m=global&p=theme',
			dataType: 'json',
			success: function(theme)
			{
				// create theme cache
				localStorage.setItem('theme', theme);
				
				// change theme
				themeChanger(theme);
			}
		});
	}else
	{
		// change theme
		themeChanger(localStorage.getItem('theme'));
	}
	
	
	/* *** Get ThemeNavWidth Setting *** */
	if(!localStorage.getItem('themeNavWidth'))
	{
		// load themeNavWidth settings from db
		$.ajax({
			cache: false,
			async: true,
			type: 'GET',
			url: 'themes/AdminLTE/dist/php/settings.php?m=global&p=themeNavWidth',
			dataType: 'json',
			success: function(themeNavWidth)
			{
				// create themeNavWidth cache
				localStorage.setItem('themeNavWidth', themeNavWidth);
				
				// set themeNavWidth
				setNavWidth(themeNavWidth);
			}
		});
	}else
	{
		// set themeNavWidth
		setNavWidth(localStorage.getItem('themeNavWidth'));
	}
	
	
	/* *** Get Theme Logo Settings *** */
	// check if theme logo cache is set
	if(!localStorage.getItem('themeLogo'))
	{
		// load themeLogo settings from db
		$.ajax({
			cache: false,
			async: true,
			type: 'GET',
			url: 'themes/AdminLTE/dist/php/settings.php?m=global&p=themeLogo',
			dataType: 'json',
			success: function(themeLogo)
			{
				if(themeLogo!='0')
				{
					// create themeLogo cache
					localStorage.setItem('themeLogo', themeLogo);
					
					var d = new Date();
					
					// set themeLogo
					$('img.brand-image').attr('src', localStorage.getItem('themeLogo') + "?" + d.getTime());
				}
			}
		});
	}else
	{
		// check if file exists and then apply themeLogo
		$.get(localStorage.getItem('themeLogo')).done(function()
		{
			var d = new Date();
			
			// set themeLogo
			$('img.brand-image').attr('src', localStorage.getItem('themeLogo') + "?" + d.getTime());
		});
	}
	
	
	/* *** Avatar Upload *** */
	$('input[type=file]#userAvatar').change(function()
	{
		var userId = new URLSearchParams(userProfileLink).get('user_id');
		$(this).simpleUpload('themes/AdminLTE/dist/php/settings.php?m=user&p=setavatar&userid=' + userId, {
			allowedExts: ["jpg", "jpeg", "jpe", "jif", "jfif", "jfi", "png", "gif"],
			allowedTypes: ["image/pjpeg", "image/jpeg", "image/png", "image/x-png", "image/gif", "image/x-gif"],
			maxFileSize: 5242880, // 5mb in bytes
			limit: 1,
			start: function()
			{
				toastr.info('Avatar Upload initiated');
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
							
							// overwrite avatar cache
							localStorage.setItem('avatar_' + userId, jsonData['data']);
							
							// launch success toastr
							toastr.success('Successfully uploaded new Avatar');
							
							// set user avatar
							$('.user-panel > .image > img').attr('src', jsonData['data'] + "?t=" + d.getTime());
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
	
	
	/* *** File Style Hack *** */
	$.fn.input_file_styling = function()
	{
		var totalFileInputs = 1
		$('.main input[type="file"]').each(function()
		{
			if($(this).parent().hasClass('custom-file')==false)
			{
				if(!$(this).is('[id]'))
				{
					// add id to element
					$(this).attr('id', 'file-'+totalFileInputs);
				}
				$(this).css('display', 'none').wrap('<div class="custom-file" style="width:200px">');
				$(this).parent('.custom-file').append('<label class="custom-file-label" for="'+$(this).attr('id')+'">Select file</label>');
			}
			totalFileInputs++;
		});
		
		// label text fix
		$(document).on('change', ':file', function()
		{
			numFiles = $(this).get(0).files ? $(this).get(0).files.length : 1,
			label = $(this).val().replace(/\\/g, '/').replace(/.*\//, '');
			
			$(this).next('label').text(label);
		});
	}
	// Init Call of the Function
	$.fn.input_file_styling();
	// Restyle after Adding a File Input
	$('#add_file_attachment').click(function()
	{
		setTimeout($.fn.input_file_styling, 1);
	});
	
	
	/* *** Tooltip Replacement *** */
	$('.main .image-tip').each(function()
	{
		$(this).attr('data-toggle', 'tooltip').attr('data-html', 'true').attr('title', $(this).find('.tip').html()).html('<i class="far fa-question-circle"></i>');
	});
	// init tooltips
	$('[data-toggle="tooltip"]').tooltip();
});

$(window).load(function()
{
	$('tr, td, div:not([class*="nicEdit"])').css("background-color", "");
	$('div:not([class*="nicEdit"], #refreshed-0)').css("border", "").css("height", "");
	$('input').css("width", "");
	if($.trim($("div").text()) == "")
	{
		$(this).remove();
	}
	
	$('.main-footer .versionInfo').click(function()
	{
		$('.OGPVersionArea, .OGPVersionArea .version, .OGPVersionArea .versionNumber').removeClass('d-none').removeClass('hide');
		
		// add blink class to versionNumber
		$('.OGPVersionArea .versionNumber').addClass('shortblink');
		// remove after 4 seconds
		setTimeout(function(){
			$('.OGPVersionArea .versionNumber').removeClass('shortblink');
		}, 4000);
		
		var copy = copyToClipboard($('.OGPVersionArea .versionNumber'));
		toastr.info('"' + copy + '" ' + $('.OGPVersionArea .copyVersionResult').attr('lang'));
	});
	
	// circular notifications
	if($('body > #notification').length > 0)
	{
		var noteMsg = $('body > #notification').html().split("<br>");
		$('body > #notification').remove();
		
		$('.content > .container-fluid').prepend('\
		<div class="row">\
			<div class="col-12">\
				<div class="callout callout-info">\
					<h5>' + noteMsg[0] + '</h5>\
					<p>' + noteMsg[1] + '</p>\
				</div>\
			</div>\
		</div>\
		');
	}
	
	/* *** End of JS - Check if .main is empty to remove Element *** */
	if($('.main').length > 0)
	{
		if($('.main').html().trim().length==0)
		{
			$('.main').parent('.card').remove();
		}
	}
});


/* *** menu sidebar hover hack because firefox doesnt support nested pseudo classes *** */
$(document).on('collapsed.lte.pushmenu', function()
{
	$('body.sidebar-collapse .main-sidebar').hover(function()
	{
		$(this).addClass('hover');
	}, function()
	{
		$(this).removeClass('hover');
	});
});


function themeChanger(changeTo, save = false)
{
	if(changeTo=='dark')
	{
		$('#themeChanger').prop("checked", true);
		$('body').removeClass('light-mode').addClass('dark-mode');
		$('nav.main-header').addClass('navbar-dark');
		$('aside.main-sidebar').removeClass('sidebar-light-primary').addClass('sidebar-dark-primary');
		$('aside.control-sidebar').removeClass('control-sidebar-light').addClass('control-sidebar-dark');
		
		if(!localStorage.getItem('themeLogo'))
		{
			$('img.brand-image').attr('src', 'themes/AdminLTE/dist/img/ogp_logo_dark.svg');
		}
		
		$('link[href*="jquery-ui.min"]').attr('href', 'themes/AdminLTE/plugins/jquery-ui/jquery-ui.min.dark.css');
		$('link[href*="jquery-ui.structure.min"]').attr('href', 'themes/AdminLTE/plugins/jquery-ui/jquery-ui.structure.min.dark.css');
		$('link[href*="jquery-ui.theme.min"]').attr('href', 'themes/AdminLTE/plugins/jquery-ui/jquery-ui.theme.min.dark.css');
		
		if(save)
		{
			$.ajax({
				async: true,
				type: 'GET',
				url: 'themes/AdminLTE/dist/php/settings.php?m=global&p=theme&v=dark',
				dataType: 'json',
				success: function(data)
				{
					toastr.success('Successfully saved theme to dark');
					localStorage.setItem('theme', 'dark');
				}
			});
		}
	}
	else if(changeTo=='light')
	{
		$('#themeChanger').prop("checked", false);
		$('body').removeClass('dark-mode').addClass('light-mode');
		$('nav.main-header').removeClass('navbar-dark');
		$('aside.main-sidebar').removeClass('sidebar-dark-primary').addClass('sidebar-light-primary');
		$('aside.control-sidebar').removeClass('control-sidebar-dark').addClass('control-sidebar-light');
		
		if(!localStorage.getItem('themeLogo'))
		{
			$('img.brand-image').attr('src', 'themes/AdminLTE/dist/img/ogp_logo_light.svg');
		}
		
		$('link[href*="jquery-ui.min"]').attr('href', 'themes/AdminLTE/plugins/jquery-ui/jquery-ui.min.light.css');
		$('link[href*="jquery-ui.structure.min"]').attr('href', 'themes/AdminLTE/plugins/jquery-ui/jquery-ui.structure.min.light.css');
		$('link[href*="jquery-ui.theme.min"]').attr('href', 'themes/AdminLTE/plugins/jquery-ui/jquery-ui.theme.min.light.css');
		
		if(save)
		{
			$.ajax({
				async: true,
				type: 'GET',
				url: 'themes/AdminLTE/dist/php/settings.php?m=global&p=theme&v=light',
				dataType: 'json',
				success: function(data)
				{
					toastr.success('Successfully saved theme to light');
					localStorage.setItem('theme', 'light');
				}
			});
		}
	}
	
	// ace editor dark skin
	if($('.ace_editor').length > 0)
	{
		if(changeTo=='dark')
		{
			$.getScript('modules/litefm/ace/theme-tomorrow_night.js', function(data, textStatus, jqxhr)
			{
				$('.ace_editor').removeClass('ace-tomorrow').addClass('ace-tomorrow-night');
			});
		}
		else if(changeTo=='light')
		{
			$('.ace_editor').removeClass('ace-tomorrow-night').addClass('ace-tomorrow');
		}
	}
}

function setNavWidth(width)
{
	// only set if wider than 250px (default) and smaller than 350px (max)
	if(width>250 && width<=350)
	{
		// avoid dual set
		if($('style[id="themeNavWidth"]').length>0)
		{
			$('style[id="themeNavWidth"]').remove();
		}
		
		// add custom width style to body
		$('body').prepend('\
			<style id="themeNavWidth">\
			.main-sidebar,\
			.layout-navbar-fixed .wrapper .brand-link,\
			.layout-navbar-fixed .wrapper .main-sidebar:hover .brand-link,\
			.layout-fixed .brand-link {\
				width: '+width+'px;\
			}\
			@media (min-width: 768px) {\
				body:not(.sidebar-mini-md):not(.sidebar-mini-xs):not(.layout-top-nav) .content-wrapper,\
				body:not(.sidebar-mini-md):not(.sidebar-mini-xs):not(.layout-top-nav) .main-footer,\
				body:not(.sidebar-mini-md):not(.sidebar-mini-xs):not(.layout-top-nav) .main-header {\
					margin-left: '+width+'px;\
				}\
			}\
			@media (max-width: 991.98px) {\
				body:not(.sidebar-mini-md):not(.sidebar-mini-xs):not(.layout-top-nav) .content-wrapper,\
				body:not(.sidebar-mini-md):not(.sidebar-mini-xs):not(.layout-top-nav) .main-footer,\
				body:not(.sidebar-mini-md):not(.sidebar-mini-xs):not(.layout-top-nav) .main-header {\
					margin-left: 0;\
				}\
			}\
			@media (min-width: 992px) {\
				.sidebar-mini.sidebar-collapse .main-sidebar:not(.sidebar-no-expand):hover,\
				.sidebar-mini.sidebar-collapse .main-sidebar:not(.sidebar-no-expand).sidebar-focused,\
				.sidebar-mini.sidebar-collapse.layout-fixed .main-sidebar:hover .brand-link {\
					width: '+width+'px;\
				}\
			}\
			.sidebar-collapse .main-sidebar,\
			.sidebar-collapse .main-sidebar::before {\
				margin-left: -'+width+'px;\
			}\
			.sidebar-mini:not(.sidebar-collapse) .main-sidebar .nav-link,\
			.sidebar-mini.sidebar-collapse .main-sidebar:hover .nav-child-indent .nav-link {\
				width: calc('+width+'px - 0.5rem * 2);\
			}\
			.sidebar-mini:not(.sidebar-collapse) .main-sidebar .nav-child-indent .nav-treeview .nav-link {\
				width: calc('+width+'px - 0.5rem * 2 - 1rem);\
			}\
			.sidebar-mini:not(.sidebar-collapse) .main-sidebar .nav-child-indent .nav-treeview .nav-treeview .nav-link {\
				width: calc('+width+'px - 0.5rem * 2 - 2rem);\
			}\
			.brand-image {\
				max-width: calc('+width+'px - 2rem) !important;\
				max-height: 33px;\
			}\
			</style>\
		');
	}else
	{
		// remove possible themeNavWidth style
		if($('style[id="themeNavWidth"]').length>0)
		{
			$('style[id="themeNavWidth"]').remove();
		}
		
		$('body').prepend('\
			<style>\
			.brand-image {\
				max-width: calc(250px - 2rem) !important;\
			}\
			</style>\
		');
	}
}

function copyToClipboard(node)
{
	var elementText = $(node).text().replace(/\s/g, "");
	
    var $temp = $("<input>");
    $("body").append($temp);
    $temp.val(elementText).select();
    document.execCommand("copy");
    $temp.remove();
	
	return elementText;
}

function clearLocalStorageItems()
{
	// loop trough all localStorage Items
	Object.keys(localStorage).forEach(function(key)
	{
		// remove item
		localStorage.removeItem(key);
		
		// console.log('Removed localStorage Item: ' + key)
	});
}