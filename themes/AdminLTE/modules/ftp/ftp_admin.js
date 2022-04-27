$(window).load(function(){
	$('.tablesorter-hasChildRow td.collapsed').html('<i class="fa fa-plus-square"</i>');
	
	$('.tablesorter-hasChildRow td.collapsible').click(function()
	{
		if($(this).hasClass('collapsed'))
		{
			$(this).html('<i class="fa fa-plus-square"></i>');
		}else
		{
			$(this).html('<i class="fa fa-minus-square"</i>');
		}
	});
});
