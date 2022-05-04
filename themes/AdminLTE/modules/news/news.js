$(document).ready(function() {
	$('.news-btn').addClass('btn btn-primary btn-sm');

	$('.pagination b').parent('a').parent('li').addClass('active');

	$('h3 > .failure').parent('h3').each(function(){
		var thtml = $(this).html();
		$(thtml).appendTo('.main');
		$(this).remove();
	});
	
	//remove main card
	$('.main').removeClass('card-body').parent('.card').removeClass('card');
	$('.main > br, .main > .clearfix').remove();
	
	$('.news-half > br').first().remove();
	$('.news-half').first().attr('class', 'ml-auto');
	$('.news-half').last().attr('class', 'mr-auto');
	
	// news list
	if($('.main > .news-container').length > 0)
	{
		$('.news-container > .panel').each(function()
		{
			$(this).addClass('card');
			
			$(this).find('.panel-heading').addClass('card-header');
			$(this).find('.panel-heading').addClass('card-header');
			$(this).find('.panel-title').addClass('card-title');
			
			$(this).find('.news-auto').replaceWith($(this).find('.news-auto').html());
			
			var newsBody = $(this).find('.panel-body').find('.news-row').first().html();
			var newsFooter = $(this).find('.panel-body').find('.news-row').last().html();
			
			$(this).find('.panel-body').addClass('card-body').html(newsBody);
			$(this).append('<div class="card-footer d-flex flex-row-reverse">' + newsFooter + '</div>');
		});
	}
	
	// single news
	if($('.main > .news-row').length > 0)
	{
		$('.main > .news-row > .news-row > br').first().remove();
		
		var newsContent = $('.main > .news-row > .news-row').html();
		var newsFooter = $('.main > .news-row').last().html();
		
		$('.main').append('\
		<div class="card">\
			<div class="card-body">\
				' + newsContent + '\
			</div>\
			<div class="card-footer d-flex flex-row-reverse">\
				' + newsFooter + '\
			</div>\
		</div>\
		');
		
		$('.main > .news-row').remove();
	}
});
