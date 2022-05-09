$(document).ready(function()
{
	$('.main [href="?m=simple-billing&p=cart"]').addClass('btn btn-sm btn-primary').prepend('<i class="fa fa-shopping-cart" aria-hidden="true"></i>');
	$('.main > table').addClass('mb-2');
	
	$('.main').append('<div class="shop-items d-flex"></div>');
	
	
	if($('form[action^="?m=simple-billing&p=add_to_cart"]').length==0)
	{
		$('.main > div > div').each(function()
		{
			var serviceId = $(this).find('[name="service_id"]').val();
			var serviceImageSrc = $(this).find('[type="image"]').attr('src');
			var serviceImageAlt = $(this).find('[type="image"]').attr('alt');
			var serviceImageVal = $(this).find('[type="image"]').val();
			var serviceTitle = $(this).find('center').first().text();
			var serviceCost = $(this).find('center').last().find('em').html();
			
			var newItem = '\
			<div class="card card-widget widget-user shadow shop-item">\
				<form action="" method="POST">\
					<input name="service_id" type="hidden" value="'+serviceId+'" class="form-control">\
					<div class="widget-user-header bg-secondary">\
						<h3 class="widget-user-username">'+serviceTitle+'</h3>\
					</div>\
					<div class="widget-user-image">\
						<img class="elevation-2" src="'+serviceImageSrc+'" alt="'+serviceImageAlt+'">\
					</div>\
					<div class="card-footer">\
						<div class="row">\
							<div class="col-sm-6 border-right">\
								<div class="description-block">\
									<h5 class="description-header">'+langConsts['OGP_LANG_starting_on']+'</h5>\
									<span class="description-text">'+serviceCost.split(' ')[2]+'</span>\
								</div>\
							</div>\
								<div class="col-sm-6">\
									<div class="description-block">\
									<h5 class="description-header">'+serviceCost.split('(')[1].split(')')[0].split(' ')[0]+'</h5>\
									<span class="description-text">'+serviceCost.split('(')[1].split(')')[0].split(' ')[1]+'</span>\
									</div>\
								</div>\
							</div>\
						</div>\
					</div>\
				</form>\
			</div>\
			';
			
			$('.main .shop-items').append(newItem);
		});
		
		$('.main > div:not(.shop-items)').remove();
	}
});

$(window).load(function()
{
	$('.shop-item form').click(function()
	{
		$(this).submit();
	});
});