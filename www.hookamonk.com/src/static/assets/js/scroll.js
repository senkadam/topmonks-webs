// JavaScript Document
	
	//jQuery for page scrolling feature - requires jQuery Easing plugin
	$(function() {
		$('.page-scroll a').bind('click', function(event) {
			var $anchor = $(this);
			$('html, body').stop().animate({
				scrollTop: $($anchor.attr('href')).offset().top
			}, 1500, 'easeInOutExpo');
			event.preventDefault();
		});
	});
	
	// Closes the Responsive Menu on Menu Item Click
	$('.navbar-collapse ul li a').click(function() {
	    $('.navbar-toggle:visible').click();
	});