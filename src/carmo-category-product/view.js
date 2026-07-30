/**
 * Front-end behaviour for the product carousel: prev/next navigation that
 * scrolls the track by one visible "page" of slides.
 *
 * The scrollable <ul> is rendered by the native WooCommerce Product
 * Collection block, so we locate it inside our `.carmo-carousel__collection`
 * wrapper rather than assuming a class name of our own.
 */

function getStep( track ) {
	const slide = track.querySelector( ':scope > li' );

	if ( ! slide ) {
		return track.clientWidth;
	}

	const trackStyles = window.getComputedStyle( track );
	const gap = parseFloat( trackStyles.columnGap || trackStyles.gap || 0 );

	return slide.getBoundingClientRect().width + gap;
}

function initCarousel( carousel ) {
	const track = carousel.querySelector( '.carmo-carousel__collection ul' );
	const prevButton = carousel.querySelector( '.carmo-carousel__nav--prev' );
	const nextButton = carousel.querySelector( '.carmo-carousel__nav--next' );

	if ( ! track ) {
		return;
	}

	prevButton?.addEventListener( 'click', () => {
		track.scrollBy( { left: -getStep( track ), behavior: 'smooth' } );
	} );

	nextButton?.addEventListener( 'click', () => {
		track.scrollBy( { left: getStep( track ), behavior: 'smooth' } );
	} );
}

document
	.querySelectorAll( '.carmo-carousel' )
	.forEach( ( carousel ) => initCarousel( carousel ) );
