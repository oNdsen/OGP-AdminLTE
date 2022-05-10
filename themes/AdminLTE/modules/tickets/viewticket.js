$(document).ready(function()
{
	//prepare main row for side by side layout
	$('section.content > .container-fluid > .row > .col-12').addClass('col-md-6');
	
	//replace css table with real table
	$('.divTableCell').each(function()
	{
		$(this).replaceWith('<td>'+$(this).html()+'</td>');
	});
	$('.divTableRow').each(function()
	{
		$(this).replaceWith('<tr>'+$(this).html()+'</tr>');
	});
	$('.divTableBody').each(function()
	{
		$(this).replaceWith('<tbody>'+$(this).html()+'</tbody>');
	});
	$('.divTable').each(function()
	{
		$(this).replaceWith('<table>'+$(this).html()+'</table>');
	});
	
	//buttons
	$('#add_file_attachment').addClass('btn-secondary');
	$('[name="ticket_close"]').addClass('btn-danger');
	
	if($('.ticket_closed').length>0)
	{
		$('.ticket_closed').wrap('<div class="callout callout-danger mt-2"><p></p></div>');
		
		var newReplyBox = '\
		<div class="card collapsed-card">\
			<div class="card-header">\
				<h3 class="card-title">'+$('#toggleNoticeMessage').text()+'\</h3>\
				<div class="card-tools">\
					<button type="button" class="btn btn-tool" data-card-widget="collapse">\
						<i class="fas fa-plus"></i>\
					</button>\
				</div>\
			</div>\
			<div class="card-body" style="display: none;">\
				'+$('.ticket_ReplyBox').html()+'\
			</div>\
		</div>\
		';
		
		$('.ticket_reply_notice').remove();
		$('.ticket_ReplyBox').replaceWith(newReplyBox);
	}
});


$(window).load(function()
{
	//replace direct chat
	var username = $('.user-panel > .info > a').text();
	var allChats = []; 
	$('.ticket_reply').each(function()
	{
		if($(this).hasClass('admin'))
		{
			var isAdmin = true
		}else
		{
			var isAdmin = false
		}
		
		if($(this).find('.name').find('a').text()==username)
		{
			var direction = 'left'
		}else
		{
			var direction = 'right'
		}
		
		var date = $(this).find('.date').text().replace(/\s+/g, ' ').trim();
		var user = $(this).find('.name').html().replace(/\s+/g, ' ').trim();
		var message = $(this).find('.message').html().trim();
		var footer = $(this).find('.ticket_footer').html().trim();
		
		//Create chatItem object for current reply
		var chatItem = {
			direction: direction,
			isAdmin: isAdmin,
			date: date,
			user: user,
			message: message,
			footer: footer
		};
		
		//Push chatItem object into allChats array
		allChats.push(chatItem);
	});
	
	//remove .replyContainer
	$('.replyContainer').remove();
	
	var newReplyContainer = '\
	<div class="col-12 col-md-6">\
		<div class="card card-primary direct-chat direct-chat-primary">\
			<div class="card-body p-2">\
				<div class="direct-chat-messages">\
	';			
	
	Object.keys(allChats).forEach(function(key)
	{
		var isAdmin = '';
		if(allChats[key]['isAdmin'])
		{
			isAdmin = '<span class="badge badge-danger mx-1">Admin</span>';
		}
		
		var avatarUrl = 'themes/AdminLTE/dist/img/default-avatar.png';
		var avatarUserId = new URLSearchParams($($.parseHTML(allChats[key]['user'])).filter('a').attr('href')).get('user_id');
		if(!localStorage.getItem('avatar_' + avatarUserId))
		{
			// load avatar from db
			$.ajax({
				cache: false,
				async: false,
				type: 'GET',
				url: 'themes/AdminLTE/dist/php/settings.php?m=user&p=getavatar&userid=' + avatarUserId,
				success: function(avatar)
				{
					// create avatar cookie
					localStorage.setItem('avatar_' + avatarUserId, avatar);
					
					// set user avatar
					avatarUrl = avatar;
				}
			});
		}else
		{
			// read user avatar cookie value
			avatarUrl = localStorage.getItem('avatar_' + avatarUserId);
		}
		
		if(allChats[key]['direction']=='left')
		{
			newReplyContainer += '\
					<div class="direct-chat-msg">\
						<div class="direct-chat-infos clearfix">\
							<span class="direct-chat-name float-left">' + allChats[key]['user'] + isAdmin + '</span>\
							<span class="direct-chat-timestamp float-right">' + allChats[key]['date'] + '</span>\
						</div>\
						<img class="direct-chat-img" src="' + avatarUrl + '" data-userid="' + avatarUserId + '" alt="message user image">\
						<div class="direct-chat-text">\
							' + allChats[key]['message'] + '\
						</div>\
						<div class="direct-chat-footer">\
							' + allChats[key]['footer'] + '\
						</div>\
					</div>\
			';
		}else
		{
			newReplyContainer += '\
					<div class="direct-chat-msg right">\
						<div class="direct-chat-infos clearfix">\
							<span class="direct-chat-name float-right">' + isAdmin + allChats[key]['user'] + '</span>\
							<span class="direct-chat-timestamp float-left">' + allChats[key]['date'] + '</span>\
						</div>\
						<img class="direct-chat-img" src="' + avatarUrl + '" data-userid="' + avatarUserId + '" alt="message user image">\
						<div class="direct-chat-text">\
							' + allChats[key]['message'] + '\
						</div>\
						<div class="direct-chat-footer">\
							' + allChats[key]['footer'] + '\
						</div>\
					</div>\
			';
		}
	});
	
	newReplyContainer += '\
				</div>\
			</div>\
		</div>\
	</div>\
	';
	
	$('section.content > .container-fluid > .row').append(newReplyContainer);
	$('.downloadAttachmentLink').addClass('btn btn-primary btn-sm')
});