/* eslint-disable no-undef */
/* global gsap, ScrollTrigger, TweenLite, TimelineMax, Power1, Modernizr */
( function( jQuery ) {
	function initMotionEffects() {
		jQuery( '[data-motion-effects]' ).each( function() {
			const 	motionData 	= getMotionData( this ),
					el = this;

			gsap.registerPlugin( ScrollTrigger );

			// set the initial props.
			const 	initialProps = {},
					scrollFxs = [],
					scrollDevices = el.dataset.scrollDevices || 'small-visibility, medium-visibility, large-visibility';

			let applyScroll = true,
				currentDevice = 'large';

			if ( Modernizr.mq( 'only screen and (max-width: ' + fusionJSVars.visibility_medium + 'px)' ) ) {
				currentDevice = 'medium';
			}

			if ( Modernizr.mq( 'only screen and (max-width: ' + fusionJSVars.visibility_small + 'px)' ) ) {
				currentDevice = 'small';
			}

			if ( ! scrollDevices.includes( currentDevice ) ) {
				applyScroll = false;
			}

			motionData.forEach( ( effect ) => {
				const fxProps = {};
				if ( 'scroll' === effect.type && applyScroll ) {
					const 	scrollType = effect.scroll_type || 'transition',
							startEl = effect.start_element || 'top',
							startVP = effect.start_viewport || 'bottom',
							endEl = effect.end_element || 'bottom',
							endVP = effect.end_viewport || 'up';

					let startOffset = '+=0';
					// Transition.
					if ( 'transition' === scrollType ) {
						const 	direction = effect.scroll_direction || 'up',
								speed = effect.transition_speed || 1;


						if ( 'up' === direction ) {
							initialProps.y = 50 * speed;
							fxProps.y = -( 50 * speed );
							startOffset = '-=' + ( ( 50 * speed ) );
						} else if ( 'down' === direction ) {
							initialProps.y = -( 50 * speed );
							fxProps.y = 50 * speed;
						} else if ( 'right' === direction ) {
							initialProps.x = -( 50 * speed );
							fxProps.x = 50 * speed;
						} else if ( 'left' === direction ) {
							initialProps.x = 50 * speed;
							fxProps.x = -( 50 * speed );
						}
					} else if ( 'fade' === scrollType ) {
						const fadeType = effect.fade_type || 'in';

						if ( 'in' === fadeType ) {
							initialProps.opacity = 0;
							fxProps.opacity = 1;
						} else if ( 'out' === fadeType ) {
							initialProps.opacity = 1;
							fxProps.opacity = 0;
						}
					} else if ( 'scale' === scrollType ) {
						const 	scaleType = effect.scale_type || 'up',
								initScale = effect.initial_scale || 1,
								maxScale = effect.max_scale || 1.5,
								minScale = effect.min_scale || 0.5;

						initialProps.scale = initScale;
						if ( 'up' === scaleType ) {
							fxProps.scale = maxScale;
						} else if ( 'down' === scaleType ) {
							fxProps.scale = minScale;
						}
					} else if ( 'rotate' === scrollType ) {
						const 	initRotate = effect.initial_rotate || 1,
								endRotate = effect.end_rotate || 30;

						initialProps.rotation = initRotate;
						fxProps.rotation = endRotate;
					} else if ( 'blur' === scrollType ) {
						const 	initBlur = effect.initial_blur || 0,
								endBlur = effect.end_blur || 3;

						initialProps.filter = `blur(${initBlur}px)`;
						fxProps.blur = endBlur;
					}

					fxProps.start = `${startEl}${startOffset} ${startVP}`;
					fxProps.end = `${endEl} ${endVP}`;

				}
				scrollFxs.push( fxProps );

				if ( 'mouse' === effect.type ) {
					const 	mouseEffect = effect.mouse_effect || 'track',
							direction = effect.mouse_effect_direction || 'opposite',
							speed = effect.mouse_effect_speed || 2;
					let 	range = speed * 5;

					if ( 'tilt' === mouseEffect ) {
						range = speed * 3;
					}

					let xPosition;
					let yPosition;
					let mapWidth;
					let mapHeight;

						// eslint-disable-next-line no-inner-declarations
						function setMaps() {
							mapWidth = gsap.utils.mapRange( 0, innerWidth, -range, range );
							mapHeight = gsap.utils.mapRange( 0, innerHeight, -range, range );
						}
						window.addEventListener( 'resize', setMaps );
						setMaps();

					if ( 'track' === mouseEffect ) {

						// eslint-disable-next-line no-inner-declarations
						const trackMouse = function () {
							gsap.to( el, {
								xPercent: 'same' === direction ? xPosition : -xPosition,
								yPercent: 'same' === direction ? yPosition : -yPosition,
								ease: 'none'
							} );
						};
						gsap.ticker.add( trackMouse );

					} else if ( 'tilt' === mouseEffect ) {
						// eslint-disable-next-line no-inner-declarations
						const tilt = function () {
							if ( ! xPosition ) {
								xPosition = 0;
							}
							if ( ! yPosition ) {
								yPosition = 0;
							}
							gsap.to( el, {
								rotationX: 'same' === direction ? - ( yPosition * speed ) : yPosition * speed,
								rotationY: 'same' === direction ? xPosition * speed : -( xPosition * speed ),
								ease: 'none',
								transformPerspective: 1500
							} );
						};
						gsap.ticker.add( tilt );
					}
					// updating the mouse coordinates
					window.addEventListener( 'mousemove', function( event ) {
						xPosition = mapWidth( event.clientX );
						yPosition = mapHeight( event.clientY );
					} );
				}
				if ( 'infinite' === effect.type ) {
					const 	animation = effect.infinite_animation || 'float',
							speed = effect.infinite_animation_speed || 2;

					if ( 'float' === animation ) {

							const tl = new TimelineMax( { repeat: -1 } );
							tl
							.to( el, 6 / speed, { y: '-=' + randomNumber( 22, 30 ), x: '+=' + randomNumber( 13, 20 ),  rotation: '-=3', ease: Power1.easeInOut } )
							.to( el, 6 / speed, { y: '+=' + randomNumber( 22, 30 ), x: '-=' + randomNumber( 13, 20 ), rotation: '+=3', ease: Power1.easeInOut } )
							.to( el, 6 / speed, { y: '-=' + randomNumber( 22, 30 ),  rotation: '+=' + randomNumber( 2, 4 ), ease: Power1.easeInOut } )
							.to( el, 6 / speed, { y: '+=' + randomNumber( 22, 30 ),  rotation: '-=' + randomNumber( 2, 4 ), ease: Power1.easeInOut } )
							.to( el, 6 / speed, { y: '-=' + randomNumber( 22, 30 ), rotation: '+=' + randomNumber( 2, 4 ), ease: Power1.easeInOut } )
							.to( el, 6 / speed, { y: '+=' + randomNumber( 22, 30 ), rotation: '-=' + randomNumber( 2, 4 ), ease: Power1.easeInOut } )
							.to( el, 6 / speed, { y: '-=' + randomNumber( 22, 30 ), rotation: '+=' + randomNumber( 2, 4 ), ease: Power1.easeInOut } )
							.to( el, 6 / speed, { y: '+=' + randomNumber( 22, 30 ), rotation: '-=' + randomNumber( 2, 4 ), ease: Power1.easeInOut } )
							.to( el, 6 / speed, { y: '-=' + randomNumber( 12, 20 ), ease: Power1.easeInOut } )
							.to( el, 6 / speed, { y: '+=' + randomNumber( 12, 20 ), ease: Power1.easeInOut } );

							TweenLite.to( tl, 27, { ease: Power1.easeInOut } );

					} else if ( 'pulse' === animation ) {
						const tl = new TimelineMax();
						tl
						.to( el, 3 / speed, {
							scale: 1.3,
							repeat: -1,
							yoyo: true
						} );

						TweenLite.to( tl, 27, { ease: Power3.easeInOut } );
					} else if ( 'rotate' === animation ) {
						gsap
						.timeline()
						.fromTo( el, {
							opacity: 0,
							scale: 0
							}, {
							opacity: 1,
							scale: 1,
							duration: 1,
							ease: 'power2.out'
							} )
						.fromTo( el, {
							rotation: 0
							}, {
							rotation: 360,
							duration: 10 / speed,
							repeat: -1,
							repeatDelay: 0.01,
							ease: 'linear'
							}, 0 );
					}  else if ( 'wiggle' === animation ) {
						gsap.set( el, { xPercent: -10, x: -1 } );

						gsap
						.to( el, {
								repeat: -1,
								yoyo: true,
								xPercent: 10,
								duration: 2 / speed,
								ease: 'power1.inOut'
							}
						);

					}
				}

			} );

			// Apply scroll effects if exist.
			if ( Object.keys( scrollFxs ).length ) {
				gsap.set( el, initialProps );
				scrollFxs.forEach( ( fx ) => {
					const fxOptions = {
						scrollTrigger: {
							trigger: el,
							scrub: 0,
							start: fx.start,
							end: fx.end
						}
					};
					if ( 'y' in fx ) {
						fxOptions.y = fx.y;
					}
					if ( 'x' in fx ) {
						fxOptions.x = fx.x;
					}
					if ( 'opacity' in fx ) {
						fxOptions.opacity = fx.opacity;
					}
					if ( 'scale' in fx ) {
						fxOptions.scale = fx.scale;
					}
					if ( 'rotation' in fx ) {
						fxOptions.rotation = fx.rotation;
					}
					if ( 'blur' in fx ) {
						fxOptions.filter = `blur(${fx.blur}px)`;
					}
					gsap.to( el, fxOptions );
				} );
			}

		} );
	}

	initMotionEffects();

	// Run in studio preview.
	jQuery( 'body' ).on( 'avada-studio-preview-done', function() {
		initMotionEffects();
	} );

	/**
	 * Get motion data from HTMl attribute.
	 *
	 * @since 3.10
	 * @param {Element} el - The HTML element.
	 * @return {Array} data Array if it has valid JSON or null if not valid.
	 */
	function getMotionData( el ) {
		const data = el.dataset.motionEffects;
		try {
			return JSON.parse( data );
		} catch ( err ) {
			return null;
		}
	}
	function randomNumber( min, max ) {
		const delta = max - min;
		return ( min + delta ) * Math.random();
	}
}( jQuery ) );
