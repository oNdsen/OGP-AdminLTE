$(document).ready(function()
{
	//icon replacement
	$('img[src="modules/faq/faq.png"]').replaceWith('<small><i class="fas fa-list-alt mr-1"></i></small>');
	$('img[src="modules/faq/faqlower.png"]').replaceWith('<small><i class="fas fa-question-circle mr-1"></i></small>');
	
	$('li.faqblock > a').addClass('btn btn-sm btn-primary mr-1');
	
	//accordions
	var allAccs = 1
	$('.accordion-toggle').each(function()
	{
		var accTitle = $(this).html();
		var accContent = $(this).next('.accordion-content').html();
		
		$(this).next('.accordion-content').remove();
		
		var newAcc = '\
		<div class="card card-faq">\
			<a class="d-block w-100 collapsed" data-toggle="collapse" href="#faqacc'+allAccs+'" aria-expanded="false">\
				<div class="card-header">\
					<h4 class="card-title w-100">'+accTitle+'</h4>\
				</div>\
			</a>\
			<div id="faqacc'+allAccs+'" class="collapse" data-parent="#accordion" style="">\
				<div class="card-body">'+accContent+'</div>\
			</div>\
		</div>\
		';
		
		$(this).replaceWith(newAcc);
		
		allAccs++;
	});
	
	//new search
	$('#search').jcOnPageFilter({
		animateHideNShow: false,
		focusOnLoad: true,
		highlightColor: "yellow",
		textColorForHighlights: "#000000",
		caseSensitive: false,
		hideNegatives: true,
		parentLookupClass: "card-faq",
		childBlockClass: "collapse"
	});
	
	// show all elements if search is empty
	$('#search').on("keyup input", function()
	{
		var inputVal = $(this).val();
		if(inputVal.length==0)
		{
			$('.card-faq').removeAttr('style');
		}
	});
});
