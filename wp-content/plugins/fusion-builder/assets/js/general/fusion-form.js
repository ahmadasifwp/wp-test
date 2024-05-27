/* global formCreatorConfig, grecaptcha, active_captcha, fusion */

window.fusionForms = {

	/**
	 * Run actions on load.
	 *
	 * @since 3.1
	 *
	 * @return {void}
	 */
	onLoad: function() {
		var isPreviewIframe = jQuery( 'body' ).hasClass( 'fusion-builder-live' );

		// Set heights of select arrows correctly
		setTimeout( function() {
			window.fusionForms.calcSelectArrowDimensions();
		}, 100 );

		// Calculate tooltip width and assign it to its container.
		window.fusionForms.calcTooltipWidth();

		if ( ! isPreviewIframe && ! jQuery( '#fusion-form-preview' ).length && ! jQuery( 'body' ).hasClass( 'awb-generating-critical-css' ) ) {
			jQuery.each( jQuery( '.fusion-form-builder' ), function( index, form ) { // eslint-disable-line no-unused-vars
				var config = jQuery( this ).data( 'config' );
				if ( 'undefined' === typeof config.nonce_method || 'ajax' === config.nonce_method ) {
					window.fusionForms.ajaxUpdateView( this );
				}
			} );
		}

		// Custom validation messages.
		document.querySelectorAll( '.fusion-form-input' ).forEach( ( input ) => {
			if ( null !== input.getAttribute( 'data-empty-notice' ) || null !== input.getAttribute( 'data-invalid-notice' ) ) {
				input.addEventListener( 'input', () => {
					input.setCustomValidity( '' );
					input.checkValidity();
				} );

				input.addEventListener( 'invalid', () => {
					if ( window.fusionForms.checkIfEmpty( input ) && null !== input.getAttribute( 'data-empty-notice' ) ) {
						input.setCustomValidity( input.getAttribute( 'data-empty-notice' ) );
					} else if ( null !== input.getAttribute( 'data-invalid-notice' ) ) {
						input.setCustomValidity( input.getAttribute( 'data-invalid-notice' ) );
					}

					return false;
				} );

				input.addEventListener( 'change', () => {
					if ( 'radio' === input.type || 'checkbox' === input.type ) {
						document.querySelectorAll( 'input[name="' + input.name + '"]' ).forEach( ( item ) => {
							item.setCustomValidity( '' );
						} );
					}
				} );
			}
		} );
	},

	/**
	 * Run actions on ready.
	 *
	 * @since 3.1
	 *
	 * @return {void}
	 */
	onReady: function() {

		// Set post_id property.
		formCreatorConfig.post_id = 'undefined' !== typeof fusion && 'function' === typeof fusion.getCurrentPostID ? fusion.getCurrentPostID() : 0;

		// Start flatpickr
		window.fusionForms.startFlatpickr();

		// Handle the range slider input sync.
		jQuery( '.fusion-form-range-field-container' ).on( 'change input', function( event ) {
			var $element = jQuery( event.target ),
				max 	 = parseInt( $element.attr( 'max' ) ),
				min 	 = parseInt( $element.attr( 'min' ) ),
				value    = parseInt( $element.val() ),
				sibling  = $element.hasClass( 'fusion-form-range-value' ) ? '.fusion-form-input' : '.fusion-form-range-value';

			if ( value < min || value > max ) {
				value = value < min ? min : max;
				$element.val( value );
			}
			$element.siblings( sibling ).val( value );
		} );

		// Handle file upload.
		jQuery( '.fusion-form-upload-field-button' ).on( 'click', function( event ) {
			event.preventDefault();
			jQuery( this ).closest( '.fusion-form-upload-field-container' ).find( 'input[type="file"]' ).trigger( 'click' );
		} );

		jQuery( '.fusion-form-upload-field-container input[type="file"]' ).on( 'change', function() {
			window.fusionForms.fileUploadChange( this );
		} );

		// Trigger form submit on submit button click.
		jQuery( '.form-form-submit, a[href="#nextStep"]' ).on( 'click', function( event ) {
			window.fusionForms.hiddenFields( event, this );
			window.fusionForms.submitClick( event, this );
		} );

		// Form submit trigger.
		jQuery( 'form.fusion-form' ).on( 'submit', function( event ) {
			window.fusionForms.submitForm( event, this );
		} );

		// Next/previous steps
		jQuery( 'a[href="#previousStep"]' ).on( 'click', function( event ) {
			window.fusionForms.applyStep( event, jQuery( this ) );
		} );

		// Handle alerts closing.
		jQuery( 'body' ).on( 'click', '.fusion-alert .close', function( event ) {
			event.preventDefault();
			jQuery( this ).parent().slideUp();
		} );

		// Check invalid inputs and update if now valid.
		jQuery( '.fusion-form-field input, .fusion-form-field textarea' ).on( 'blur', function() {
			var $field = jQuery( this ).closest( '.fusion-form-field' );
			if ( jQuery( this ).attr( 'data-must-match' ) ) {
				window.fusionForms.checkFieldMatches( jQuery( this ) );
			}
			if ( $field.hasClass( 'error' ) && this.checkValidity() ) {
				$field.removeClass( 'error' );
			}
		} );

		// Handle reveal password click.
		jQuery( '.awb-form-pw-reveal-icon' ).on( 'click', function( event ) {
			event.preventDefault();

			const password = jQuery( this ).prev();
			const type     = 'password' === password.attr( 'type' ) ? 'text' : 'password';

			password.attr( 'type', type );

			if ( 'text' === type ) {
				jQuery( this ).removeClass( 'awb-icon-eye-slash' ).addClass( 'awb-icon-eye' );
			} else {
				jQuery( this ).removeClass( 'awb-icon-eye' ).addClass( 'awb-icon-eye-slash' );
			}

		} );

		jQuery( '.fusion-form-upload-field' ).on( 'drag dragstart dragend dragover dragenter dragleave drop', function( e ) {
			e.preventDefault();
			e.stopPropagation();
		} )
		.on( 'dragover dragenter', function() {
			jQuery( this ).addClass( 'focused' );
		} )
		.on( 'dragleave dragend drop', function() {
			jQuery( this ).removeClass( 'focused' );
		} )
		.on( 'drop', function( e ) {
			var droppedFiles = e.originalEvent.dataTransfer.files;
			jQuery( this ).find( 'input[type="file"]' ).prop( 'files', droppedFiles ).trigger( 'change' );
		} );
	},

	/**
	 * Apply the step for multi-step form.
	 *
	 * @since 3.11
	 *
	 *
	 * @return {void}
	 */
	applyStep: function( event, el ) {
		var $form		= el.closest( '.fusion-form' ),
			$currStep	= $form.find( '.awb-form-step.active' ),
			newStep;

		event.preventDefault();
		if (  'undefined' !== typeof el.attr( 'href' ) && $currStep.length  ) {

			// Previous form step.
			if ( '#previousStep' === el.attr( 'href' ) && $currStep.prev().hasClass( 'awb-form-step' ) ) {
				$currStep.removeClass( 'active' ).hide().prev().fadeIn( 300 ).addClass( 'active' );
				newStep = parseInt( $form.find( '.awb-form-step.active' ).data( 'step' ) );
				this.manageFormNavActiveStep( $form, newStep );
				if ( ! this.withinViewport( $form.find( '.awb-form-step.active' ) ) && 'function' === typeof window.awbScrollToTarget ) {
					window.awbScrollToTarget( $form.find( '.awb-form-step.active' ) );
				}
			}
		}
	},

	/**
	 * Checks if input is empty.
	 *
	 * @since 3.8
	 *
	 *
	 * @return {Boolean}
	 */
	checkIfEmpty: function( input ) {
		var isEmpty = false;

		switch ( input.type ) {
			case 'radio':
			case 'checkbox':
				isEmpty = null === document.querySelector( 'input[name="' + input.name + '"]:checked' ) ? true : false;
				break;
			default:
				isEmpty = '' === input.value ? true : false;
		}

		return isEmpty;
	},

	/**
	 * Initialize flatpickr script on inputs.
	 *
	 * @since 3.1
	 *
	 *
	 * @return {void}
	 */
	startFlatpickr: function () {
		// Date inputs.
		jQuery( '.fusion-form-field input[type="date"]' ).each( function() {
			var $element  = jQuery( this ),
				type      = $element.attr( 'data-type' ),
				format    = $element.attr( 'data-format' ),
				disabled  = $element.attr( 'data-disabled-days' ),
				useMobile = 'custom' === type,
				firstDay  = $element.attr( 'data-first-day' ),
				weekDays  = [
					'sunday',
					'monday',
					'tuesday',
					'wednesday',
					'thursday',
					'friday',
					'saturday'
				];

			// Native, do not init.
			if ( 'native' === type ) {
				return;
			}

			format   = 'undefined' === typeof format || '' === format ? 'Y-m-d' : format;
			disabled = 'undefined' === typeof disabled || '' === disabled ? '' : disabled;
			disabled = disabled.split( ',' );

			if ( disabled.length ) {
				disabled = disabled.map( function ( x ) {
					return weekDays.indexOf( x );
				} );
			}

			$element.flatpickr( {
				allowInput: true,
				disableMobile: useMobile,
				dateFormat: format,
				minDate: $element.attr( 'min' ),
				maxDate: $element.attr( 'max' ),
				disable:
				[
					function( date ) {
						return ( disabled.includes( date.getDay() ) );
					}
				],
				locale:
					{
					'firstDayOfWeek': firstDay
					}
			} );
		} );

		// Time inputs.
		jQuery( '.fusion-form-field input[type="time"]' ).each( function() {
			var $element  = jQuery( this ),
				type      = $element.attr( 'data-type' ),
				useMobile = 'custom' === type,
				fullClock = 'full' === $element.attr( 'data-clock' );

			// Native, do not init.
			if ( 'native' === type ) {
				return;
			}
			$element.flatpickr( {
				allowInput: true,
				disableMobile: useMobile,
				enableTime: true,
				noCalendar: true,
				dateFormat: fullClock ? 'H:i' : 'h:i K',
				time_24hr: fullClock
			} );
		} );
	},

	/**
	 * Render reCAPTCHA.
	 *
	 * @since 3.1
	 *
	 * @return {void}
	 */
	renderRecaptcha: function() {
		var reCaptchaID;
		jQuery.each( jQuery( '.fusion-form-recaptcha-v2' ), function( index, reCaptcha ) { // eslint-disable-line no-unused-vars
			reCaptchaID = jQuery( this ).attr( 'id' );

			grecaptcha.render( reCaptchaID, {
				sitekey: jQuery( this ).data( 'sitekey' ),
				type: jQuery( this ).data( 'type' ),
				theme: jQuery( this ).data( 'theme' )
			} );
		} );
	},

	/**
	 * Calculate tooltips width and assign it to parent container.
	 *
	 * @since 3.1
	 *
	 * @return {void}
	 */
	calcTooltipWidth: function() {
		jQuery.each( jQuery( '.fusion-form-tooltip-content' ), function( index, tooltip ) {
			var tooltipWidth = '';

			jQuery( tooltip ).closest( '.fusion-form-tooltip' ).css( { 'position': 'inherit' } );
			tooltipWidth = jQuery( tooltip ).width() + 23;
			jQuery( tooltip ).css( { width: tooltipWidth + 'px' } );
			jQuery( tooltip ).closest( '.fusion-form-tooltip' ).removeAttr( 'style' );
		} );
	},

	/**
	 * Wrap form creator select and add arrow.
	 *
	 * @since 3.1
	 *
	 * @return {void}
	 */
	calcSelectArrowDimensions: function() {
		jQuery( '.fusion-form-select-wrapper .select-arrow' ).filter( ':visible' ).each( function() {
			if ( 0 < jQuery( this ).prev().innerHeight() ) {
				jQuery( this ).css( {
					height: jQuery( this ).prev().innerHeight(),
					width: jQuery( this ).prev().innerHeight(),
					'line-height': jQuery( this ).prev().innerHeight() + 'px'
				} );
			}
		} );
	},

	/**
	 * Check if an element is within the viewport.
	 *
	 * @since 3.1
	 *
	 * @param {Object} el - The JS element.
	 *
	 * @return {boolean}
	 */
	withinViewport: function( $element ) {
		var elementTop     = $element.offset().top,
			viewportTop    = jQuery( window ).scrollTop(),
			viewportBottom = viewportTop + jQuery( window ).height();

		return elementTop > viewportTop && elementTop < viewportBottom;
	},

	/**
	 * Handle clicking the submit button.
	 *
	 * @since 3.1
	 *
	 * @param {Object} event - The JS event.
	 * @param {*} el - The JS element.
	 *
	 * @return {void}
	 */
	submitClick: function( event, el ) {
		var fusionForm           = jQuery( el ).closest( 'form.fusion-form' ),
			formNumber           = jQuery( el ).data( 'form-number' ),
			formCreatorConfigObj = '',
			holdPrivateDate      = [],
			triggerEvent;

		// Next form step.
		if (  'undefined' === typeof formNumber && jQuery( el ).closest( '.fusion-form' ).length  ) {
			formNumber = parseInt( jQuery( el ).closest( '.fusion-form-form-wrapper' ).data( 'form-id' ) );
		}

		// Get form config.
		formCreatorConfigObj = jQuery( '.fusion-form-form-wrapper.fusion-form-' + formNumber ).data( 'config' );
		if ( 'post' === formCreatorConfigObj.form_type ) {
			return;
		}
		event.preventDefault();

		fusionForm.find( '[data-holds-private-data="true"]' ).each( function( index, input ) {
			holdPrivateDate.push( input.name );
		} );

		if ( ! fusionForm.find( '[name="fusion-fields-hold-private-data"]' ).length ) {
			fusionForm.append( '<input type="hidden" name="fusion-fields-hold-private-data" value="' + holdPrivateDate.join( ',' ) + '">' );
		}

		// Submit the form.
		// Add a short delay of just a few milliseconds to make sure the form gets submitted
		// after the privacy-data has been added.
		setTimeout( function() {

			// Trigger custom event.
			triggerEvent = new CustomEvent( 'fusion-form-before-submit', {
				detail: {
					event: event,
					form: fusionForm,
					formConfig: formCreatorConfigObj
				}
			} );
			window.dispatchEvent( triggerEvent );

			fusionForm.trigger( 'submit' );
		}, 50 );
	},

	/**
	 * Handle hidden fields.
	 *
	 * @since 3.3
	 *
	 * @param {Object} event - The JS event.
	 * @param {Object} el - The JS Element.
	 *
	 * @return {void}
	 */
	hiddenFields: function( event, el ) {
		var $fusionForm = jQuery( el ).closest( 'form.fusion-form' );

		$fusionForm.find( '.fusion-form-field-hidden' ).find( 'input, textarea, select' ).attr( 'required', false );

		// Find required fields in next steps, and make non required since they have not been made visible yet.
		$fusionForm.find( '.awb-form-step.active' ).nextAll( '.awb-form-step' ).find( '[required]' ).attr( 'required', false ).attr( 'data-required', true );

		// Make current step's visible fields required.
		$fusionForm.find( '.awb-form-step.active' ).find( '[data-required]' ).attr( 'required', true ).removeAttr( 'data-required' );
	},

	/**
	 * Handle form submission.
	 *
	 * @since 3.1
	 *
	 * @param {Object} event - The JS event.
	 * @param {Object} el - The JS Element.
	 *
	 * @return {void}
	 */
	submitForm: function( event, el ) {
		var $form                    = jQuery( el ),
			$this                    = $form,
			formNumber               = $this.find( '.form-form-submit' ).data( 'form-number' ),
			honeyPots                = $this.find( '[data-fusion-is-honeypot="true"]' ),
			fusionForms              = $this.find( '[data-awb-fieldset-min-required], [data-awb-fieldset-max-required]' ),
			$mustMatches             = $this.find( '[data-must-match]' ),
			formCreatorConfigObj;

		// Get form ID from closest form when no submit button.
		if (  'undefined' === typeof formNumber && jQuery( el ).closest( '.fusion-form' ).length  ) {
			formNumber = parseInt( jQuery( el ).closest( '.fusion-form-form-wrapper' ).data( 'form-id' ) );
		}

		// Get form config.
		formCreatorConfigObj = jQuery( '.fusion-form-form-wrapper.fusion-form-' + formNumber ).data( 'config' );

		// Check the form submission type, return if post.
		if ( 'post' === formCreatorConfigObj.form_type ) {
			return;
		}

		event.preventDefault();

		// Remove class from flagged inputs.
		$this.find( '.fusion-form-field.error' ).removeClass( 'error' );

		fusionForms.each( function( index, element ) {
			if ( ! window.fusionForms.checkCustomRequiredCheckboxNum( jQuery( element ) ) ) {
				window.fusionForms.insertCustomRequiredCheckboxMessage( jQuery( element ) );
			}
		} );

		$mustMatches.each( function( index, element ) {
			window.fusionForms.checkFieldMatches( jQuery( element ) );
		} );

		// Native browser validation.
		if ( ! $form[ 0 ].checkValidity() ) {
			$form[ 0 ].reportValidity();

			// Add class for overall styling if desired.
			$this.find( 'input:invalid, textarea:invalid' ).each( function() {
				jQuery( this ).closest( '.fusion-form-field' ).addClass( 'error' );
			} );
			return;
		}

		// Verify if the form contains a filled honeypot. The honeypots can be added via a form element.
		honeyPots = honeyPots.filter( function( index, honeyEl ) {
			var isNotEmpty = ( jQuery( honeyEl ).val() ? true : false );
			return isNotEmpty;
		} );
		if ( honeyPots.length ) {
			this.revealAlert( $this, 'error' );
			return;
		}

		// Check if there's no error left in the form.
		if ( 0 == $this.find( '.error:not(.fusion-alert)' ).length ) {
			if ( $form.find( '.awb-form-step.active' ).length && ! $form.find( '.awb-form-step.active' ).is( '[data-final="1"]' ) ) {
				$form.find( '.awb-form-step.active' ).removeClass( 'active' ).hide().next().fadeIn( 300 ).addClass( 'active' );
				this.manageFormNavActiveStep( $form, parseInt( $form.find( '.awb-form-step.active' ).attr( 'data-step' ) ) );
				if ( ! this.withinViewport( $form.find( '.awb-form-step.active' ) ) && 'function' === typeof window.awbScrollToTarget ) {
					window.awbScrollToTarget( $form.find( '.awb-form-step.active' ) );
				}
			} else {
				window.fusionForms.ajaxSubmit( $this, formCreatorConfigObj );
			}
		}
	},

	/**
	 * Make all steps until active steps marked as completed, and after active as not completed.
	 *
	 * @param {jQuery|Node} form
	 * @param {int} activeStep
	 */
	manageFormNavActiveStep( form, activeStep ) {
		var nav           = jQuery( form ).parent().find( '.awb-form-nav' ),
			isTimeline    = nav.hasClass( 'awb-form-nav--timeline' ),
			timelineActive = 'awb-form-nav__tl-step-wrapper--active',
			timelineCompleted = 'awb-form-nav__tl-step-wrapper--completed',
			isProgressBar = nav.hasClass( 'awb-form-nav--progress' ),
			steps,
			ariaCurrentStep,
			ariaCompletedStep,
			nrSteps,
			progressValueEl,
			progressTitle,
			newStyle,
			matches,
			currentPercentage;


		if ( isTimeline ) {
			steps = nav.find( '.awb-form-nav__tl-step-wrapper' );
			ariaCurrentStep   = nav.attr( 'data-aria-current' );
			ariaCompletedStep = nav.attr( 'data-aria-completed' );
			steps.each( function() {
				var el = jQuery( this ),
					elStep = parseInt( el.attr( 'data-step' ) );

				if ( elStep < activeStep ) {
					el.addClass( timelineCompleted ).removeClass( timelineActive );
					el.find( '.awb-form-nav__tl-aria-info' ).html( ariaCompletedStep );
				} else if ( elStep === activeStep ) {
					el.addClass( timelineActive ).removeClass( timelineCompleted );
					el.find( '.awb-form-nav__tl-aria-info' ).html( ariaCurrentStep );
				} else {
					el.removeClass( timelineActive ).removeClass( timelineCompleted );
					el.find( '.awb-form-nav__tl-aria-info' ).html( '' );
				}
			} );
		} else if ( isProgressBar ) {
			nrSteps = parseInt( nav.attr( 'data-steps' ) );
			nrSteps = ( 0 < nrSteps ? nrSteps : 1 );
			currentPercentage = Math.round( ( activeStep * 100 ) / nrSteps );
			nav.find( '.progress-bar-content' ).css( 'width', currentPercentage + '%' );
			progressValueEl = nav.find( '.fusion-progressbar-value' );
			if ( 'undefined' !== typeof progressValueEl && progressValueEl.length ) {
				progressValueEl.html( progressValueEl.html().replace( parseInt( progressValueEl.html() ), currentPercentage ) );
			}
			nav.find( '.progress-bar-content' ).attr( 'aria-valuenow', currentPercentage );

			progressTitle = nav.find( '.progress-title' );
			if ( progressTitle.attr( 'style' ) ) {
				// Needed to match dynamic text alignment, like "right: calc(15px + 60%);".
				matches = progressTitle.attr( 'style' ).match( /((?:right|left):\s*calc\s*\(.*?\s*[+\-*\/%]\s*)\d*(%\s*\)\s*;)/i ); // eslint-disable-line no-useless-escape
				if ( matches && matches.length ) {
					newStyle = matches[ 1 ] + ( 100 - currentPercentage ) + matches[ 2 ];
					progressTitle.attr( 'style',  progressTitle.attr( 'style' ).replace( matches[ 0 ], newStyle ) );
				}
			}
		}
	},

	/**
	 * Get the form data.
	 *
	 * @since 3.1
	 *
	 * @param {Object} $this - jQuery( el ).
	 * @param {Object} formCreatorConfigObj - The form config object.
	 *
	 * @return {Object}
	 */
	getFormData: function( $this, formCreatorConfigObj ) {
		var formData         = new FormData(),
			$files           = $this.find( 'input[type="file"]' ),
			serializedForm   = $this.serializeArray(),
			formID           = $this.parent().data( 'form-id' ),
			hiddenFieldNames = [],
			n,
			len;

		if ( $files.length ) {
			$files.each( function() {
				var name      = jQuery( this ).attr( 'name' ).replace( '[]', '' ),
					length    = this.files.length;

				jQuery.each( this.files, function( j, file ) {
					if ( 1 < length ) {
						formData.append( 'files[' + name + '@|@' + ( j + 1 ) + ']', file );
					} else {
						formData.append( 'files[' + name + ']', file );
					}
				} );
			} );
		}

		jQuery.each( $this.find( '.fusion-form-field-hidden input:not(.fusion-form-range-value):not(.fusion-form-upload-field), .fusion-form-field-hidden textarea, .fusion-form-field-hidden select, .fusion-form-honeypot-field input' ), function() {
			var hiddenFieldName = jQuery( this ).attr( 'name' );

			if ( ! hiddenFieldName ) {
				return;
			}

			hiddenFieldName = hiddenFieldName.replace( '[]', '' );

			// Prevent adding same name multiple times, for example with checkboxes.
			if ( -1 === hiddenFieldNames.indexOf( hiddenFieldName ) ) {
				hiddenFieldNames.push( hiddenFieldName );
			}
		} );

		// Trim values.
		for ( n = 0, len = serializedForm.length; n < len; n++ ) {
			serializedForm[ n ].value = jQuery.trim( serializedForm[ n ].value );
		}
		formData.append( 'formData', jQuery.param( serializedForm ) );
		formData.append( 'action', 'fusion_form_submit_ajax' );
		formData.append( 'fusion_form_nonce', $this.find( '#fusion-form-nonce-' + formID ).val() );
		formData.append( 'form_id', formCreatorConfigObj.form_id );
		formData.append( 'post_id', formCreatorConfigObj.post_id );
		formData.append( 'field_labels', JSON.stringify( formCreatorConfigObj.field_labels ) );
		formData.append( 'field_types', JSON.stringify( formCreatorConfigObj.field_types ) );
		formData.append( 'hidden_field_names', JSON.stringify( hiddenFieldNames ) );
		if ( $this.find( '.fusion-form-recaptcha-v2' ).length ) {
			formData.append( 'g-recaptcha-response', $this.find( '.g-recaptcha-response' ).val() );
		}

		if ( $this.find( '.fusion-form-recaptcha-v3' ).length ) {
			formData.append( 'g-recaptcha-response', $this.find( '.g-recaptcha-response' ).val() );
		}

		// If URL method, Add the defined URL as an extra param in data.
		if ( 'url' === formCreatorConfigObj.form_type ) {
			formData.append( 'fusionAction', $this.attr( 'action' ) );
			formData.append( 'fusionActionMethod', $this.attr( 'method' ) );
		}

		return formData;
	},

	/**
	 * Submit the form via AJAX.
	 *
	 * @since 3.1
	 *
	 * @param {Object} $this - jQuery( el ).
	 * @param {Object} formCreatorConfigObj - The form config object.
	 *
	 * @return {void}
	 */
	ajaxSubmit: function( $this, formCreatorConfigObj ) {
		var self     = this,
			formData = window.fusionForms.getFormData( $this, formCreatorConfigObj );

		$this.find( '.form-form-submit' ).addClass( 'fusion-form-working' );
		jQuery.ajax( {
			type: 'POST',
			url: formCreatorConfig.ajaxurl,
			data: formData,
			action: 'fusion_form_submit_ajax',
			dataType: 'json',
			processData: false,
			contentType: false
		} )
		.done( function( result ) {
			if ( ! result.captcha && 'success' == result.status ) {
				jQuery( $this )[ 0 ].reset();
			}
			if ( 'success' == result.status && 'redirect' == formCreatorConfigObj.confirmation_type && '' !== formCreatorConfigObj.redirect_url ) {
				window.location = formCreatorConfigObj.redirect_url;
			} else {
				self.revealAlert( $this, result );
			}

			jQuery( window ).trigger( 'fusion-form-ajax-submit-done', { result: result, formConfig: formCreatorConfigObj, data: formData } );

			// Open off canvas action if exists and form success.
			if ( 'success' == result.status ) {
				const offCanvas = $this.parent( '.fusion-form' ).data( 'off-canvas' );
				if ( offCanvas ) {
					window.awbOffCanvas.open_off_canvas( offCanvas );
				}
			}
		} )
		.fail( function() {
			self.revealAlert( $this, 'error' );
			jQuery( window ).trigger( 'fusion-form-ajax-submit-fail', { formConfig: formCreatorConfigObj } );
		} )
		.always( function() {
			$this.find( '.form-form-submit' ).removeClass( 'fusion-form-working' );
			window.fusionForms.reloadCaptcha( $this );
			jQuery( window ).trigger( 'fusion-form-ajax-submitted', { formConfig: formCreatorConfigObj, data: formData } );
		} );
	},

	reloadCaptcha: function( el ) {
		var fusionForm = jQuery( el ).closest( 'form.fusion-form' );
		var captcha_id = fusionForm.find( 'div.recaptcha-container' ).attr( 'id' );
		if ( 'undefined' !== typeof captcha_id && 'undefined' !== typeof active_captcha && 'undefined' !== typeof active_captcha[ captcha_id ] ) {
			grecaptcha.execute( active_captcha[ captcha_id ], { action: 'contact_form' } ).then( function ( token ) {
				fusionForm.find( 'div.recaptcha-container' ).find( '.g-recaptcha-response' ).val( token );
			} );
		}
	},

	/**
	 * Reveal notice for error or success.
	 *
	 * @since 3.1
	 *
	 * @param {Object} $this         - Form element.
	 * @param {String} errorTypetype - Type of alert to show.
	 *
	 * @return {void}
	 */
	revealAlert: function( $this, error ) {
		var $notices = $this.find( '.form-submission-notices' ).not( '.fusion-form-notice-hidden' ),
			type     = 'object' === typeof error && 'undefined' !== typeof error.status ? error.status : error,
			$type    = -1 !== type.indexOf( 'error' ) ? 'error' : type,
			$alert   = $notices.find( ' > .fusion-form-response-' + $type ),
			$updatedStep;

		// If we have steps, make the step with the alert active.
		if (  $this.find( '.awb-form-step' ).length ) {

			if ( $this.find( '.form-submission-notices' ).length && ! $this.find( '.form-submission-notices' ).closest( '.awb-form-step' ).hasClass( 'active' ) ) {
				$this.find( '.awb-form-step.active' ).removeClass( 'active' ).hide();
				$updatedStep = $this.find( '.form-submission-notices' ).closest( '.awb-form-step' );
				$updatedStep.addClass( 'active' ).fadeIn( 300 );

				// Check if it is in viewport.
				if ( ! this.withinViewport( $updatedStep ) && 'function' === typeof window.awbScrollToTarget ) {
					window.awbScrollToTarget( $updatedStep );
				}
				this.manageFormNavActiveStep( $this, parseInt( $updatedStep.data( 'step' ) ) );

			} else if ( ! $this.find( '.form-submission-notices' ).length ) {
				$this.find( '.awb-form-step.active' ).removeClass( 'active' ).hide();
				$this.find( '.awb-form-step[data-step="1"]' ).addClass( 'active' ).fadeIn( 300 );

				// Check if it is in viewport.
				if ( ! this.withinViewport( $this.find( '.awb-form-step.active' ) ) && 'function' === typeof window.awbScrollToTarget ) {
					window.awbScrollToTarget( $this.find( '.awb-form-step.active' ) );
				}
				this.manageFormNavActiveStep( $this, 1 );
			}
		}

		// Hide already shown ones.
		$this.find( '.form-submission-notices' ).find( '.fusion-form-response' ).hide();

		// Show email errors.
		if ( 'error' === type && 'object' === typeof error && 'object' === typeof error.info ) {

			const $errors_el = $alert.find( '.fusion-alert-content span.errors-wrap' );
			if ( $errors_el.length ) {
				$errors_el.empty();
			} else {
				$alert.find( '.fusion-alert-content' ).append( '<span class="errors-wrap"></span>' );
			}

			jQuery.each( error.info, function( index, details ) { // eslint-disable-line no-unused-vars
				$alert.find( '.fusion-alert-content span.errors-wrap' ).append( '<br><br>' + details );
			} );
		}

		if ( $alert.length ) {


			if ( ! this.withinViewport( $notices ) && 'function' === typeof window.awbScrollToTarget ) {
				$alert.attr( 'role', 'alert' );
				$alert.css( { display: 'block' } );
				window.awbScrollToTarget( $notices );
			} else {
				$alert.attr( 'role', 'alert' );
				$alert.slideDown( 300 );
			}
		}
	},

	/**
	 * Update the form view via AJAX.
	 *
	 * @since 3.1
	 *
	 * @param {Object} el - The element.
	 *
	 * @return {void}
	 */
	ajaxUpdateView: function( el ) {
		jQuery.ajax( {
			type: 'POST',
			url: formCreatorConfig.ajaxurl,
			data: {
				action: 'fusion_form_update_view',
				form_id: jQuery( el ).data( 'form-id' )
			},
			success: function( response ) {
				jQuery( el ).find( '.fusion-form' ).append( response );
			},
			dataType: 'html'
		} );
	},


	/**
	 * Handles changes to file-upload fields.
	 *
	 * @since 2.3.0
	 *
	 * @param {Object} el - The element.
	 *
	 * @return {void}
	 */
	fileUploadChange: function( el ) {
		var $el      = jQuery( el ),
			fileName = $el.val(),
			allowed  = $el.attr( 'accept' ),
			fileSize = ( ( jQuery( el ).prop( 'files' )[ 0 ].size / 1024 ) / 1024 ).toFixed( 4 ),
			maxSize  = $el.data( 'size' ),
			$wrapper = $el.closest( '.fusion-form-upload-field' ),
			ext      = fileName.match( /\.([^\.]+)$/ )[ 1 ].toLowerCase(); // eslint-disable-line no-useless-escape

		$wrapper.removeClass( 'error' );

		if ( 1 < jQuery( el ).prop( 'files' ).length ) {
			fileName = '';
			jQuery.each( jQuery( el ).prop( 'files' ), function( index, data ) {
				fileSize = ( ( data.size / 1024 ) / 1024 ).toFixed( 4 );
				ext      = data.name.match( /\.([^\.]+)$/ )[ 1 ].toLowerCase(); // eslint-disable-line no-useless-escape

				fileName += '' !== fileName ? ', ' + data.name.split( '\\' ).pop() : data.name.split( '\\' ).pop();

				if ( 'undefined' !== typeof allowed && ! allowed.toLowerCase().includes( ext ) ) {
					$wrapper.find( 'input[type="text"]' ).val( formCreatorConfig.file_ext_error + allowed );
					$wrapper.addClass( 'error' );
					$el.val( '' );
					return false;
				}

				if ( 'undefined' !== typeof maxSize && fileSize > maxSize ) {
					$wrapper.find( 'input[type="text"]' ).val( formCreatorConfig.file_size_error + maxSize + 'MB' );
					$wrapper.addClass( 'error' );
					$el.val( '' );
					return false;
				}
			} );

			if ( $wrapper.hasClass( 'error' ) ) {
				return;
			}
		} else {
			fileName = fileName.split( '\\' ).pop();

			if ( 'undefined' !== typeof allowed && ! allowed.toLowerCase().includes( ext ) ) {
				$wrapper.find( 'input[type="text"]' ).val( formCreatorConfig.file_ext_error + allowed );
				$wrapper.addClass( 'error' );
				$el.val( '' );
				return;
			}

			if ( 'undefined' !== typeof maxSize && fileSize > maxSize ) {
				$wrapper.find( 'input[type="text"]' ).val( formCreatorConfig.file_size_error + maxSize + 'MB' );
				$wrapper.addClass( 'error' );
				$el.val( '' );
				return;
			}
		}

		$el.closest( '.fusion-form-upload-field-container' ).find( '.fusion-form-upload-field' ).val( fileName ).trigger( 'change' );
	},

	/**
	 * Check if the field matches.
	 *
	 * @since 3.5

	 * @return {bool} Whether or not the field meet requirements.
	 */
	checkFieldMatches: function( $field ) {
		var thisVal              = $field.val(),
			target               = $field.attr( 'data-must-match' ),
			$form                = $field.closest( '.fusion-form-form-wrapper' ),
			formCreatorConfigObj = $form.data( 'config' ),
			$target              = $form.find( 'input[name="' + target + '"]' ),
			targetVal            = $target.length ? $target.val() : false,
			label                = 'string' === typeof formCreatorConfigObj.field_labels[ target ] && '' !== formCreatorConfigObj.field_labels[ target ] ? formCreatorConfigObj.field_labels[ target ] : false;

		if ( ! label ) {
			label = 'string' === typeof $target.attr( 'placeholder' ) && '' !== $target.attr( 'placeholder' ) ? $target.attr( 'placeholder' ).replace( '*', '' ) : target;
		}
		if ( ! $target.length ) {
			return $field[ 0 ].setCustomValidity( '' );
		}

		if ( $field.is( ':hidden' ) ) {
			return $field[ 0 ].setCustomValidity( '' );
		}

		if ( thisVal === targetVal ) {
			$field[ 0 ].setCustomValidity( '' );
		} else {
			$field[ 0 ].setCustomValidity( formCreatorConfig.must_match.replace( '%s', label ) );
		}
	},

	/**
	 * Check if the fieldset meet the minimum and maximum required checkboxes.
	 *
	 * @since 3.5
	 * @param {Object} formFieldSet - The fieldset element that contains all the checkboxes.
	 * @return {bool} Whether or not the fieldset meet requirements.
	 */
	checkCustomRequiredCheckboxNum: function( formFieldSet ) {
		var minRequired = formFieldSet.attr( 'data-awb-fieldset-min-required' );
		var maxRequired = formFieldSet.attr( 'data-awb-fieldset-max-required' );
		var inputs = formFieldSet.find( 'input' );
		var checkedInputs = formFieldSet.find( 'input:checked' ).length;
		var firstInput = inputs.first();

		if ( isNaN( minRequired ) ) {
			minRequired = 0;
		}

		if ( isNaN( maxRequired ) ) {
			maxRequired = 0;
		}

		firstInput = firstInput.get( 0 );
		if ( firstInput && firstInput.nodeType ) {
			// Refresh custom message, no matter what.
			firstInput.setCustomValidity( '' );
		}

		if ( formFieldSet.is( ':hidden' ) ) {
			return true;
		}

		if ( checkedInputs >= minRequired ) {
			if ( checkedInputs <= maxRequired || 0 === parseInt( maxRequired ) ) {
				return true;
			}
		}

		return false;
	},

	/**
	 * Display the error message for the fieldset.
	 *
	 * @since 3.5
	 * @param {Object} formFieldSet - The fieldset element that contains all the checkboxes.
	 * @return {bool} Whether or not the fieldset meet requirements.
	 */
	insertCustomRequiredCheckboxMessage: function( formFieldSet ) {
		var inputs = formFieldSet.find( 'input' );
		var firstInput = inputs.first();
		var errorText = formFieldSet.attr( 'data-awb-fieldset-error' );

		if ( ! firstInput.length ) {
			return;
		}

		firstInput = firstInput.get( 0 );
		if ( firstInput && firstInput.nodeType ) {
			firstInput.setCustomValidity( errorText );
		}
	}
};

( function( jQuery ) {

	// Trigger action on load event.
	jQuery( window ).on( 'load', function() {
		window.fusionForms.onLoad();
	} );

	// Trigger actions on ready event.
	jQuery( document ).ready( function() {
		window.fusionForms.onReady();
	} );

	jQuery( window ).on( 'fusion-element-render-fusion_form', function() {
		window.fusionForms.startFlatpickr();
	} );
}( jQuery ) );
