$(document).ready(function()
{
	/* *** Invalid Image replacement *** */
	$('.main img, .main input[type="image"]').error(function()
	{
		$(this).unbind("error").attr("src", "themes/AdminLTE/dist/img/image_not_found.png").attr("style", "max-width:250px;").removeAttr('height');
	});
	
	$('.main > p:first-of-type').css("background-color", "").css("color", "");
	$('p > [href="?m=register&p=form"], p > [href="index.php"]').addClass('btn').addClass('btn-xs').addClass('btn-primary');
});

$(window).load(function()
{
	$('.main [href="?m=simple-billing&p=cart"]').addClass('btn btn-sm btn-primary').prepend('<i class="fa fa-shopping-cart" aria-hidden="true"></i>');
	$('.main > table').addClass('mb-2');
	
	$('.main .card-body').append('<div class="shop-items row d-flex flex-wrap"></div>');
	
	$('.main .card-body > div > div').each(function()
	{
		if($(this).find('[type="image"]').length > 0)
		{
			var serviceImage = $(this).find('[type="image"]');
		}else
		{
			var serviceImage = $(this).find('img');
		}
		
		var serviceId = $(this).find('[name="service_id"]').val();
		var serviceTitle = $(this).find('center').first().text();
		var serviceCost = $(this).find('center').last().find('em').html();
		var serviceImageSrc = $(serviceImage).attr('src');
		var serviceImageAlt = $(serviceImage).attr('alt');
		var serviceImageVal = $(serviceImage).val();
		
		var newItem = '\
		<div class="col-12 col-md-4">\
			<div class="card card-widget widget-user shadow shop-item">\
				<div class="widget-user-header bg-secondary">\
					<h3 class="widget-user-username">'+serviceTitle+'</h3>\
				</div>\
				<div class="widget-user-image">\
					<img class="elevation-2" src="'+serviceImageSrc+'" alt="'+serviceImageAlt+'">\
				</div>\
				<div class="card-footer">\
					<div class="row">\
						<div class="col-sm-8 border-right">\
							<div class="description-block">\
								<h5 class="description-header">'+langConsts['OGP_LANG_starting_on']+'</h5>\
								<span class="description-text">'+serviceCost.split(' ')[2]+'</span>\
							</div>\
						</div>\
						<div class="col-sm-4">\
							<div class="description-block">\
								<h5 class="description-header">'+serviceCost.split('(')[1].split(')')[0].split(' ')[0]+'</h5>\
								<span class="description-text">'+serviceCost.split('(')[1].split(')')[0].split(' ')[1]+'</span>\
							</div>\
						</div>\
					</div>\
				</div>\
			</div>\
		</div>\
		';
		
		$('.main .card-body .shop-items').append(newItem);
	});
	
	$('.main .card-body > div:not(.shop-items)').remove();
	
	$('.shop-item form').click(function()
	{
		$(this).submit();
	});
});