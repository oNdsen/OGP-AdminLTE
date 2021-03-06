$(document).ready(function()
{
	// add additional classes to main for ogp scripts
	$('.main').addClass('main-content game-monitor');
	
	// responsive table
	$('#servermonitor').wrap('<div class="table-responsive"></div>');
	
	// add loading class on size click
	$('.monitorbutton.size').click(function()
	{
		$(this).addClass('loading');
		$(this).bind("DOMSubtreeModified",function()
		{
			$(this).removeClass('loading');
		});
	});
	
	// table header icons
	$('img[id="action-stop"]').replaceWith('<i class="fas fa-stop-circle text-danger text-sm" id="action-stop"></i>');
	$('img[id="action-restart"]').replaceWith('<i class="fas fa-arrow-alt-circle-left text-warning text-sm" id="action-restart"></i>');
	$('img[id="action-start"]').replaceWith('<i class="fas fa-play-circle text-success text-sm" id="action-start"></i>');
	
	// bulk update buttons
	$('#server_icon[class^="action-start"]').addClass('btn btn-sm btn-success');
	$('#server_icon[class^="action-stop"]').addClass('btn btn-sm btn-danger');
	$('#server_icon[class^="action-restart"]').addClass('btn btn-sm btn-warning');
	$('.main .tablesorter-header-inner > [id^="action-"]').click(function()
	{
		$('div[class^="' + $(this).attr('id') + '"]').trigger('click');
	});
	
	// style monitorbuttons
	$('.main .monitorbutton').addClass('btn btn-primary d-flex flex-column justify-content-center align-items-center');
	
	// ip's add badge
	$('.main .serverIPAddress[data-status="online"] > a').addClass('badge badge-success');
	$('.main .serverIPAddress[data-status="offline"]').each(function()
	{
		$(this).html('<span class="badge badge-danger">' + $(this).text() + '</span>');
	});
	
	$('[id^="refreshed"]').addClass('row');
	$('[id^="refreshed"] .monitor-1').addClass('col-md-10 d-flex');
	$('[id^="refreshed"] .monitor-2').addClass('col-md-2');
	
	$('.main form > input[value="'+langConsts['OGP_LANG_show_all']+'"]').parent('form').addClass('d-inline-block my-2');
	
	// all server images
	$('[id^="refreshed"]').each(function()
	{
		var thisRefresh = $(this);
		let thisVar = document.getElementById($(thisRefresh).attr('id'))
		
		observerMapIcon = new MutationObserver(mCallback);
		function mCallback(mutations)
		{
			for (let mutation of mutations)
			{
				if (mutation.type === 'childList')
				{
					// add timestamp to image for reload
					var timestamp = new Date().getTime();
					$('img.mapicon').each(function()
					{
						$(this).attr('src', $(this).attr('src') + '?t=' + timestamp);
					});
					
					$('.upload-image').addClass('btn btn-sm btn-primary');
					$('#' + $(thisRefresh).attr('id') + ' .monitor-1').addClass('col-md-10 d-flex');
					$('#' + $(thisRefresh).attr('id') + ' .monitor-2').addClass('col-md-2');
				}
			}
		}
		observerMapIcon.observe(thisVar, { childList: true });
	});
	
	// server image upload form
	const observerUploadForm = new MutationObserver(function(mutations_list)
	{
		mutations_list.forEach(function(mutation)
		{
			mutation.addedNodes.forEach(function(node)
			{
				// check if modified node has classes
				if(node.classList)
				{
					var nodeClasses = node.classList.value;
					if(nodeClasses.startsWith('status'))
					{
						var statusText = $('.'+nodeClasses).text();$
						if(statusText.length > 0)
						{
							if(statusText.toLowerCase().indexOf("success") >= 0)
							{
								toastr.success(statusText);
								
								// add timestamp to image for reload
								var timestamp = new Date().getTime();
								$('img.mapicon').attr('src', $('img.mapicon').attr('src') + '?t=' + timestamp);
								
								// close all ui dialogs
								$('[class^="dialog-form"]').dialog("close");
								
								// reload page after 2 seconds
								setTimeout(function () {
									location.reload(true);
								}, 2000);
							}
							else
							{
								toastr.warning(statusText);
							}
						}
					}
				}
			});
		});
	});
	observerUploadForm.observe(document.querySelector('body'), { subtree: true, childList: true });
});

$(window).load(function()
{
	// add loader icon to collapsed servers
	$('.main .serverIPAddress[data-status="online"]').parent('tr').next('.expand-child').find('td').each(function()
	{
		if($(this).css('display')=='none')
		{
			$(this).find('[id^="refreshed-"]').html('\
				<div class="spinner-grow spinner-grow-sm m-3" role="status">\
					<span class="sr-only">Loading...</span>\
				</div>\
			');
		}
	});
	
	// loading fix when click on ServerID (nothing is loading then)
	$('.serverId').click(function()
	{
		$(this).parent('tr').find('.serverName').trigger('click');
	});
	
	// global buttons radio fix
	$('#server_icon.btn').click(function()
	{
		$(this).find('[type="radio"]').prop("checked", true);
	});
	
	// remvoe foot style
	$('tfoot').removeAttr('style');
});
