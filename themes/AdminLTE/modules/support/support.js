$(document).ready(function()
{
	// content to table translation
	$('.main .contactForm').each(function()
	{
		var form_selector = $(this);
		$(form_selector).prepend('<br>');
		$(form_selector.find('br')).each(function()
		{
			// skip if this br is in head paragraph
			if($(this).parent('p').length==0)
			{
				var $set = $();
				var nxt = this.nextSibling;
				while(nxt) {
					if(!$(nxt).is('br'))
					{
						$set.push(nxt);
						nxt = nxt.nextSibling;
					} else break;
				}
				$set.wrapAll('<tr><td></td></tr>');
				
				// remove this br after wrap
				$(this).remove();
			}
		});
		$(form_selector.find('tr')).wrapAll('<table class="table table-sm table-striped" />');
	});
	
	// remove main br
	$('.main > br').remove();
	
	// remove empty rows
	$('.main .contactForm td').each(function()
	{
		if($(this).html().trim()=="")
		{
			$(this).parent('tr').remove();
		}
	});
	
	// remove style attr from submit button
	$('.main .contactForm input[type="submit"]').removeAttr('style');
	
	// remove style attribute from paragraphs
	$('.main p').removeAttr('style');
});
