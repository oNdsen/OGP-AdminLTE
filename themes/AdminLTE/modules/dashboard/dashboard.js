$(document).ready(function()
{
	// remove old js
	$('script[src="js/modules/dashboard.js"]').remove();

	// image replacements
	$('img[src$="game_monitor.png"]').replaceWith('<h2 class="d-inline float-right m-2"><i class="fas fa-desktop"></i></h2>');
	$('img[src$="support.png"]').replaceWith('<h2 class="d-inline float-right m-2"><i class="fas fa-question-circle"></i></h2>');

	// head sections
	$('.column').each(function()
	{
		if(!$(this).parent('div').hasClass('row'))
		{
			$(this).parent('div').addClass('row').removeAttr('style');
		}
			
		var columnContent = $(this).html();
		
		if($(this).hasClass('one_two'))
		{
			$(this).replaceWith("<section class='col-12 col-md-6 connectedSortable' id='"+$(this).attr('id')+"'>" + columnContent + "</section>");
		}
		else if($(this).hasClass('one_fourth'))
		{
			$(this).replaceWith("<section class='col-12 col-md-3 connectedSortable' id='"+$(this).attr('id')+"'>" + columnContent + "</section>");
		}
		else
		{
			$(this).replaceWith("<section class='col-12 connectedSortable' id='"+$(this).attr('id')+"'>" + columnContent + "</section>");
		}
	});
	
	// dragbox / bloc to card conversion
	$('.dragbox, .bloc').each(function()
	{
		var isCollapsed = false
		var collapseBtn = 'fa-minus';
		var thisContent = $(this).find('.dragbox-content');
		if($(thisContent).length > 0)
		{
			// check if dragbox has attribute "style"
			if(typeof $(thisContent).attr('style') !== 'undefined' && $(thisContent).attr('style') !== false)
			{
				// check if dragbox has style "display:none"
				if($(thisContent).attr('style').indexOf("display:none") >= 0)
				{
					isCollapsed = true
					var collapseBtn = 'fa-plus';
				}
			}
			$(thisContent).removeClass('dragbox-content').addClass('card-body').removeAttr('style');
			
			// check if dragbox is a link
			if(typeof $(thisContent).attr('onclick') !== 'undefined' && $(thisContent).attr('onclick') !== false)
			{
				// add cursor pointer style
				$(thisContent).css('cursor', 'pointer');
				
				// check if link is external to change event to window.open (new window)
				var thisURL = $(thisContent).attr('onclick').replace("location.href='", "").replace("'", "");
				if(thisURL.includes("://"))
				{
					$(thisContent).attr("onclick", "window.open('"+thisURL+"')");
				}
			}
		}
		
		if(isCollapsed)
		{
			$(this).attr('class', '').addClass('card collapsed-card');
		}else
		{
			$(this).attr('class', '').addClass('card');
		}
		
		var boxTitle = $(this).find('h4').text();
		$(this).find('h4').replaceWith("\
		<div class='card-header ui-sortable-handle' style='cursor: move;'>\
			<h3 class='card-title'>" + boxTitle + "</h3>\
			<div class='card-tools'>\
				<button type='button' class='btn btn-tool' data-card-widget='collapse'>\
					<i class='fas " + collapseBtn + "'></i>\
				</button>\
			</div>\
		</div>");
	});

	// padding fix
	$('.online_servers').parent('.card-body').addClass('p-2');
	
	if($('#refreshed-5').length > 0)
	{
		// old dashboard behaviour
		
		// remove old refresh element
		$('#refreshed-5').remove();
	}else
	{
		// new dashboard behaviour
		
		// remove old refresh element
		$('#refreshed-0').remove();
	}
	
	// hide elements before data refresh mod
	$('.main > .row > h0, .main > .row > br, .main > .row > #column4').addClass('d-none');
	
	/* *** Data Refresh Mod *** */
	// get columnsettings
	$.get('themes/AdminLTE/dist/php/settings.php?m=dashboard&p=columnsettings',
		function(columnsettings){
			// build server status card
			var serverStatusTitle = $('.container-fluid h0').last().text();
			var serverSelectTitle = $('.container-fluid #column4 h3').text();
			var serverSelectForm = $('.container-fluid #column4 center').html();
			$('.container-fluid h0').last().remove();
			$('.container-fluid #column4').remove();
			
			// add new sections
			$('.content > .container-fluid').append("\
			<div class='row'>\
				<section class='col-12 col-md-6 connectedSortable' id='column4'></section>\
				<section class='col-12 col-md-6 connectedSortable' id='column5'></section>\
			</div>\
			<div class='row'>\
				<section class='col-12 connectedSortable' id='column6'></section>\
			</div>");
			
			// add cards to new sections
			// console.log(columnsettings);
			Object.keys(columnsettings).forEach(function(key)
			{
				item = columnsettings[key]['item']
				section = columnsettings[key]['section']
				collapsed = columnsettings[key]['collapsed']
				
				if(item=='item6')
				{
					$('#' + section).append(createCard(item, serverSelectTitle, serverSelectForm, collapsed));
				}
				else if(item=='item7')
				{
					$('#' + section).append(createCard(item, serverStatusTitle, '', true, collapsed));
				}
				else
				{
					$('#' + section).append(createCard(item, '', '', true, collapsed));
				}
			})
			
			// define regexes
			var axrgx = /jQuery\.ajax\(\{(.*?)\}\)\;(.*?)\}\)\;/sg;		// get all ajax definitions
			var urlrgx = /url\: \"(.*?)\"/m;							// get url from ajax object
			var destrgx = /\$\(\'(.*?)\'\)\.html/;					// get destination from ajax object
			
			// get complete js content
			var embjs = $('.main > script:not([src])').html();
			$('.main > script:not([src])').remove();
			
			var refreshDashboardServerInterval;
			// var enableCallbacks = true;
			var aradded = [];
			embjs.match(axrgx).forEach((element, index) => {
				var url = element.match(urlrgx)[1];
				var dest = element.match(destrgx)[1];
				
				if(!aradded.includes(url))
				{
					if(url.toLowerCase().indexOf("remote_server_id") >= 0)
					{
						aradded.push(url);
						
						function refreshDashboardServerStats()
						{
							jQuery.ajax({
								url: url,
								cache: false,
								// beforeSend: function(xhr)
								// {
									// $('a').click(function()
									// {
										// xhr.abort();
										// enableCallbacks = false;
									// });
								// },
								success: function(data, textStatus)
								{
									// if (!enableCallbacks) return;
									updateServerStats(data);
								}
							});
						}
						
						if (!refreshDashboardServerInterval)
						{
							refreshDashboardServerStats();
							
							var refreshDashboardServerInterval = setInterval(function()
							{
								refreshDashboardServerStats();
							}, 10000);
						}
					}
				}
			});
			
			// clear intervals on link follow
			$('a:not([data-widget="control-sidebar"]):not([data-widget="pushmenu"])').click(function()
			{
				if(typeof refreshServerInterval !== 'undefined')
				{
					clearInterval(refreshServerInterval);
					refreshServerInterval = null;
				}
			});
			
			// Make the dashboard widgets sortable Using jquery UI
			$('.connectedSortable').sortable(
			{
				placeholder: 'sort-highlight',
				connectWith: '.connectedSortable',
				handle: '.card-header',
				forcePlaceholderSize: true,
				zIndex: 999999,
				start: function(event, ui){
					// console.log('start: ' + event + ' - ' + ui);
					// $(ui.item).toggle();
				},
				stop: function(){
					// console.log('stop');
					updateNewWidgetData();
				}
			});
			$('.connectedSortable .card-header').css('cursor', 'move');
			
			$('[data-card-widget="collapse"]').click(function()
			{
				setTimeout(function()
				{
					updateNewWidgetData();
				}, 1000);
			})
			
			// loading
			var loading = '\
			<div class="d-flex justify-content-center w-100 m-1">\
				<div class="spinner-grow spinner-grow-sm" role="status">\
					<span class="sr-only">Loading...</span>\
				</div>\
			</div>';
			$('[id^=refreshed]').html(loading);
		}
	);
});


$(window).load(function ()
{
	//welcome title
	if($(".main > div:not(.row)").length)
	{
		$(".main > div:not(.row)").addClass('card-body').wrap('<div class="card welcome-card"></div>');
		$(".main .welcome-card").prependTo('section.content > .container-fluid');
	}
});


$.fn.inlineStyle = function(prop)
{
	var thisProb = this.prop("style")[$.camelCase(prop)];
	if(thisProb !== undefined || thisProb!='')
	{
		return thisProb;
	}
	else
	{
		return false;
	}
};


function updateNewWidgetData()
{
	var items = [];  
	$('section.connectedSortable').each(function()
	{
		var columnId = $(this).attr('id');
		$(this).find('.card').each(function(order)
		{
			var collapsed = 0;
			if($(this).hasClass('collapsed-card'))
			{
				collapsed = 1;
			}
			
			//Create Item object for current panel
			var item = {
				id: $(this).attr('id'),
				collapsed: collapsed,
				order : order,
				column: columnId
			};
			
			//Push item object into items array
			items.push(item);
		});
	});
	
	// console.log(items);
	
	//Assign items array to sortorder JSON variable
	var sortorder = {items: items};
	var successOrderChange = true;
	
	//Pass sortorder variable to server using ajax to save state (OGP sections)
	$.post('home.php?m=dashboard&p=updateWidgets', 'data='+$.toJSON(sortorder), function(response)
	{
		var checkRespone = $(response).filter('section.content');
		
		if(response.indexOf("success") < 0)
		{
			successOrderChange = false;
			// toastr.error('Failed to update widget order');
		}else
		{
			// toastr.success('Successfully update widget order');
		}
	});
	
	//Pass sortorder variable to server using ajax to save state (Theme sections)
	$.post('themes/AdminLTE/dist/php/settings.php?m=dashboard&p=updatecolumnsettings', 'data='+$.toJSON(sortorder), function(response)
	{
		var checkRespone = $(response).filter('section.content');
		
		if(response.indexOf("success") < 0)
		{
			successOrderChange = false;
			// toastr.error('Failed to update widget order');
		}else
		{
			// toastr.success('Successfully update widget order');
		}
	});
	
	if(successOrderChange)
	{
		toastr.success('Successfully update widget order');
	}else
	{
		toastr.error('Failed to update widget order');
	}
}


function createCard(id, title, body, refresh = false, collapsed = 0)
{
	var addBody = ''
	var collapsedClass = ''
	var maximize = ''
	
	if(refresh)
	{
		addBody = " id='refreshed'"
	}
	
	if(collapsed==1)
	{
		collapsedClass = ' collapsed-card'
	}
	
	//add maximize button
	if(id=='item8')
	{
		maximize = '<button type="button" class="btn btn-tool" data-card-widget="maximize"><i class="fas fa-expand"></i></button>';
	}
	
	return "\
	<div class='card " + collapsedClass + "' id='" + id + "'>\
		<div class='card-header'>\
			<h3 class='card-title'>" + title + "</h3>\
			<div class='card-tools'>\
				" + maximize + "\
				<button type='button' class='btn btn-tool' data-card-widget='collapse'>\
					<i class='fas fa-minus'></i>\
				</button>\
			</div>\
		</div>\
		<div class='card-body'" + addBody + ">\
			" + body + "\
		</div>\
	</div>\
	";
}


function updateServerStats(html)
{
	var dataOut = '';
	var brExp = /<br\s*\/?>/i;
	
	// System Uptime
	var data = clone(html);
	var sysUptime = $(data).filter('#column4:nth-child(1)');
	if($(sysUptime).length > 0)
	{
		var sysUptimeTitle = $(sysUptime).find('h4').html();
		var sysUptimeContent = '';
		var sysUptimeSplit = $(sysUptime).find('b').html().split(brExp);
		$.each(sysUptimeSplit, function(i, element)
		{
			sysUptimeContent += '<p class="mb-0">'+element.trim()+'</p>';
		});
		
		$('#item9 .card-title').text(sysUptimeTitle);
		$('#item9 .card-body').html(sysUptimeContent);
	}
	
	// CPU Usage
	var data = clone(html);
	var cpu = $(data).filter('#column4:nth-child(2)');
	if($(cpu).length > 0)
	{
		// var progressCPU = '<div class="mb-2 vertical-progress">';
		var progressCPU = '';
		var cpuTitle = $(cpu).find('h4').text();
		
		$(cpu).find('.dragbox-content').children('b').each(function()
		{
			var cpuName = $(this).text().split(':')[0].trim();
			var cpuLoad = $(this).text().split(':')[1].trim().split(' ')[0].trim();
			var cpuLoad = $(this).text().split(':')[1].trim().split(' ')[0].trim();
			
			progressCPU += '\
			<div class="progress-group">\
				'+cpuName+'\
				<span class="float-right"><b>'+cpuLoad+' %</b> / 100 %</span>\
				<div class="progress progress-sm">\
					<div class="progress-bar bg-primary" style="width: '+cpuLoad+'%"></div>\
				</div>\
			</div>\
			';
			
			// progressCPU += '<input type="text" class="knob" value="'+cpuLoad+'" data-thickness="0.1" data-width="70" data-height="70" data-fgColor="#007bff"><div class="knob-label text-sm">'+cpuName+'</div>';
		});
		
		// progressCPU += '</div>';
		
		dataOut += progressCPU
	}
	
	// RAM Usage
	var data = clone(html);
	var ram = $(data).filter('#column4:nth-child(3)');
	if($(ram).length > 0)
	{
		var ramTitle = $(ram).find('h4').text();
		var ram = $(ram).find('.dragbox-content').html();
		
		var ramUsage = ram.split(':')[1].trim().split('of')[0].trim();
		var ramTotal = ram.split(':')[1].trim().split('of')[1].trim().split('<')[0].trim();
		var ramPerc = $(ram).find('.progress-bar').attr('data');
		
		var progressRam = '\
		<div class="progress-group">\
			'+ramTitle+'\
			<span class="float-right"><b>'+ramUsage+'</b> / '+ramTotal+'</span>\
			<div class="progress progress-sm">\
			<div class="progress-bar bg-primary" style="width: '+ramPerc+'%"></div>\
			</div>\
		</div>\
		';
		
		dataOut += progressRam
	}
	
	// Storage Space
	var data = clone(html);
	var storage = $(data).filter('#column4:nth-child(4)');
	if($(storage).length > 0)
	{
		var spaceTitle = $(storage).find('h4').text();
		var storage = $(storage).find('.dragbox-content').html();
		var storagelines = storage.split(brExp);
		
		// console.log('spaceTitle: ' + spaceTitle);
		// console.log('storage: ' + storage);
		// console.log('storagelines: ' + storagelines);
		
		var spaceTotal = storagelines[0].split(':')[1].trim();
		var spaceUsed = storagelines[1].split(':')[1].trim().split('(')[0].trim();
		var spaceUsedPerc = storagelines[1].match(/\((.*?)\)/)[1];
		var spaceFree = storagelines[2].split(':')[2].trim().split('<')[0].trim();
		
		var progressStorage = '\
		<div class="progress-group">\
			'+spaceTitle+'\
			<span class="float-right"><b>'+spaceUsed+'</b> / '+spaceTotal+'</span>\
			<div class="progress progress-sm">\
			<div class="progress-bar bg-primary" style="width: '+spaceUsedPerc+'"></div>\
			</div>\
		</div>\
		';
		
		dataOut += progressStorage
	}
	
	$('#item7 .card-body').html(dataOut);
	
	
	// Process Monitor
	var procMonTitle = $(data).filter('#column4:nth-child(5)').find('h4').text();
	var procMonContent = $(data).filter('#column4:nth-child(5)').find('.dragbox-content').html();
	$('#item8 .card-title').text(procMonTitle);
	$('#item8 .card-body').html(procMonContent);
	
	// knob init
	// $('.knob').knob();
}


function clone(obj)
{
	if (null == obj || "object" != typeof obj) return obj;
	var copy = obj.constructor();
	for (var attr in obj)
	{
		if (obj.hasOwnProperty(attr)) copy[attr] = obj[attr];
	}
	return copy;
}


function animateProgressBars()
{
	// image replacement
	$('img[src$="magnifglass.png"]').replaceWith('<i class="fas fa-search mr-2"></i>');
	
	// online servers
	$('.online_servers [id^=refreshed]').each(function()
	{
		var thisLink = $(this).find('.name').find('a').attr('href');
		$(this).addClass('btn btn-sm btn-primary').attr('onclick', 'location.href=\''+thisLink+'\'');
	});
	
	$('#item2 .card-body > br').remove();
	$('#item2 .card-body > center br').replaceWith('&nbsp;');
	$('.currently-online').addClass('table table-striped table-sm');
	$('.currently-online td').removeAttr('style');
	$('.currently-online > tr:first-of-type > td').replaceWith('<th>'+$('.currently-online > tr:first-of-type td').text()+'</th>');
}
