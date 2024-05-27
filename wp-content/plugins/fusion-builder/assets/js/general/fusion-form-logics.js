window.fusionFormLogics = {

	/**
	 * Run actions on ready.
	 *
	 * @since 3.3
	 *
	 * @return {void}
	 */
	onReady: function() {
		// Handles conditional logics.
		jQuery( '.fusion-form input, .fusion-form select, .fusion-form textarea' ).on( 'change keyup', function () {
			window.fusionFormLogics.formLogics( jQuery( this ) );
		} );
	},

	/**
	 * Handle form logics.
	 *
	 * @since 3.3
	 *
	 * @return {void}
	 */
	formLogics: function( $item = '' ) {

		// If we are doing it on first load.
		if ( '' === $item ) {
			jQuery( '.fusion-form.fusion-form-builder' ).each( function() {
				var formID = jQuery( this ).data( 'form-id' );
				window.fusionFormLogics.applyLogics( formID );
			} );
		} else {
			window.fusionFormLogics.applyLogics( $item.closest( '.fusion-form-field' ).data( 'form-id' ), $item.attr( 'name' ) );
		}
	},

	/**
	 * Apply logic.
	 *
	 * @since 3.3
	 *
	 * @return {void}
	 */
	applyLogics: function( formID, name = '' ) {
		var formCreatorConfigObj = jQuery( '.fusion-form-form-wrapper.fusion-form-' + formID ).data( 'config' ),
			logics               = formCreatorConfigObj.field_logics,
			relevantLogics       = {};

		// Get relevant logics.
		if ( '' !== name ) {
			jQuery.each( logics, function( value, key ) {
				if ( ( -1 !== name.indexOf( value ) || -1 !== key.indexOf( name ) ) && '' !== key ) {
					relevantLogics[ value ] = key;
				}
			} );
		}

		logics = Object.keys( relevantLogics ).length ? relevantLogics : logics;

		// Process logics.
		jQuery.each( logics, function( field, value ) {
			window.fusionFormLogics.checkFieldLogic( field, value, formID );
		} );
	},

	/**
	 * Check field logic.
	 *
	 * @since 3.3
	 *
	 * @return {void}
	 */
	checkFieldLogic: function( field, value, formID ) {
		var conditions = '' !== value ? JSON.parse( value ) : [],
			$form        = jQuery( '.fusion-form-' + formID ),
			$field       = $form.find( '[name="' + field + '"]' ),
			$notice      = $form.find( '.data-' + field ),
			$element     = $form.find( '[data-form-element-name="' + field + '"]' ),
			isMatch      = false,
			checks       = [];

		$field = $field.length ? $field : $form.find( '[name="' + field + '[]"]' );
		jQuery.each( conditions, function( index, condition ) {
			var check    = [],
			operator     = 'undefined' !== typeof condition.operator ? condition.operator : '',
			comparison   = 'undefined' !== typeof condition.comparison ? condition.comparison : '',
			fieldName    = 'undefined' !== typeof condition.field ? condition.field : '',
			desiredValue = 'undefined' !== typeof condition.value ? condition.value : '',
			fieldValue;

			fieldValue = window.fusionFormLogics.getFieldValue( fieldName, $form );
			check.push( operator );
			check.push( 'false' !== fieldValue ? window.fusionFormLogics.isMatch( fieldValue, desiredValue, comparison ) : false );
			checks.push( check );
		} );

		if ( checks.length ) {
			isMatch = window.fusionFormLogics.MatchConditions( checks );

			window.fusionFormLogics.toggleField( isMatch, $field );
			window.fusionFormLogics.toggleNotice( isMatch, $notice );
			window.fusionFormLogics.toggleElement( isMatch, $element );
		}
	},

	/**
	 * Toggle field.
	 *
	 * @since 3.3
	 *
	 * @return {void}
	 */
	toggleField: function( isShow, $field ) {
		var isRequired = $field.attr( 'aria-required' );
		if ( isShow ) {
			$field.closest( '.fusion-form-field' ).removeClass( 'fusion-form-field-hidden' );

			// Add required Param.
			if ( 'undefined' !== typeof isRequired && 'true'  === isRequired ) {
				$field.attr( 'required', true );
			}
		} else {
			$field.closest( '.fusion-form-field' ).addClass( 'fusion-form-field-hidden' );
		}
	},

	/**
	 * Toggle notice.
	 *
	 * @since 3.9.2
	 *
	 * @return {void}
	 */
	toggleNotice: function( isShow, $notice ) {
		if ( isShow ) {
			$notice.removeClass( 'fusion-form-notice-hidden' );
		} else {
			$notice.addClass( 'fusion-form-notice-hidden' );
		}
	},

	/**
	 * Toggle element.
	 *
	 * @since 3.10.2
	 *
	 * @return {void}
	 */
	toggleElement: function( isShow, $element ) {
		if ( isShow ) {
			$element.removeClass( 'fusion-form-field-hidden' );
		} else {
			$element.addClass( 'fusion-form-field-hidden' );
		}
	},

	/**
	 * Get field value.
	 *
	 * @since 3.3
	 *
	 * @return {string}
	 */
	getFieldValue: function( field, $form ) {
		var $field  = $form.find( '[name="' + field + '"]' ),
			isArray = -1 !== jQuery.inArray( $field.attr( 'type' ), [ 'checkbox', 'radio' ] );

		if ( $field.closest( '.fusion-form-field-hidden' ).hasClass( 'fusion-form-field-hidden' ) ) {
			return false;
		}
		return isArray ? window.fusionFormLogics.getArrayTypeValue( $field, $form ) : $field.val();
	},

	/**
	 * Get value if field is of type radio or checkbox.
	 *
	 * @since 3.3
	 *
	 * @return {string}
	 */
	getArrayTypeValue: function( $field, $form ) {
		var values = [];

		if ( 'radio' === $field.attr( 'type' ) ) {
			return $form.find( 'input[name="' + $field.attr( 'name' ) + '"]:checked' ).val();
		}

		jQuery.each( $form.find( 'input[name="' + $field.attr( 'name' ) + '"]:checked' ), function() {
			values.push( jQuery( this ).val() );
		} );

		return values.join( ' | ' );
	},

	/**
	 * Match conditions.
	 *
	 * @since 3.3
	 *
	 * @return {boolean}
	 */
	isMatch: function ( firstValue, secondValue, operation ) {
		firstValue  = firstValue ? firstValue.toLowerCase() : '';
		secondValue = secondValue ? secondValue.toLowerCase() : '';

		switch ( operation ) {
			case 'equal':
				return firstValue === secondValue;

			case 'not-equal':
				return firstValue !== secondValue;

			case 'greater-than':
				return parseFloat( firstValue ) > parseFloat( secondValue );

			case 'less-than':
				return parseFloat( firstValue ) < parseFloat( secondValue );

			case 'contains':
				return 0 <= firstValue.indexOf( secondValue );
		}
	},

	/**
	 * Match conditions.
	 *
	 * @since 3.3
	 *
	 * @return {boolean}
	 */
	MatchConditions: function( checks ) {
		var isMatch = null,
			i;

		// if all conditions are of OR type.
		if ( -1 == checks.toString().indexOf( 'and' ) ) {
			for ( i = 0; i < checks.length; i++ ) {
				isMatch = null === isMatch ? checks[ i ][ 1 ] : isMatch;
				isMatch = isMatch || checks[ i ][ 1 ];
			}
			return isMatch;
		}

		// if all conditions are of AND type.
		if ( -1 == checks.toString().indexOf( 'or' ) ) {
			for ( i = 0; i < checks.length; i++ ) {
				isMatch = null === isMatch ? checks[ i ][ 1 ] : isMatch;
				isMatch = isMatch && checks[ i ][ 1 ];
			}
			return isMatch;
		}

		return window.fusionFormLogics.matchMixedConditions( checks );
	},

	/**
	 * Match mixed conditions.
	 *
	 * @since 3.3
	 *
	 * @return {boolean}
	 */
	matchMixedConditions: function( checks ) {
		var collectedConditions   = [],
			currentOperator       = '',
			j                     = 0,
			k                     = 0,
			size                  = checks.length,
			finalConditions       = [],
			mainOperator          = '',
			tempResult            = '',
			innerOperator         = '',
			firstOperand          = '',
			secondOperand         = '',
			i;

		// Combine conditions based on comparison operator change.
		for ( i = 0; i < size; i++ ) {

			if ( 'undefined' === typeof collectedConditions[ j ] ) {
				collectedConditions[ j ] = [];
			}

			if ( '' === currentOperator || currentOperator == checks[ i ][ 0 ] ) {
				collectedConditions[ j ][ k ] = checks[ i ][ 1 ];
				k++;
				collectedConditions[ j ][ k ] = checks[ i ][ 0 ];
				k++;
				currentOperator = checks[ i ][ 0 ];
			} else {
				collectedConditions[ j ][ k ] = checks[ i ][ 1 ];
				k++;
				collectedConditions[ j ][ k ] = checks[ i ][ 0 ];
				j++;
				k = 0;
				currentOperator = '';
			}
		}

		// Process conditions.
		jQuery.each( collectedConditions, function( key, condition ) {
			size = condition.length;
			if ( 3 > size ) {
				finalConditions.push( condition[ 0 ] );
				finalConditions.push( condition[ 1 ] );
				return;
			}

			for ( i = 0; i < size - 1; i++ ) {
				if ( '' === tempResult ) {
					firstOperand  = condition[ i ];
					secondOperand = condition[ i + 2 ];
					innerOperator = condition[ i + 1 ];
					tempResult    = 'or' === innerOperator ? firstOperand || secondOperand : firstOperand && secondOperand;
					i             = i + 2;
				} else {
					firstOperand  = tempResult;
					secondOperand = condition[ i + 1 ];
					innerOperator = condition[ i ];
					tempResult    = 'or' === innerOperator ? firstOperand || secondOperand : firstOperand && secondOperand;

					i++;
				}

				if ( true !== tempResult ) {
					tempResult = false;
				}
			}

			mainOperator = condition;

			finalConditions.push( tempResult );
			finalConditions.push( mainOperator[ size - 1 ] );
			tempResult = '';
		} );

		// Final comparisons.
		tempResult    = '';
		innerOperator = '';
		firstOperand  = '';
		secondOperand = '';
		size          = finalConditions.length;

		if ( 3 > size ) {
			return finalConditions[ 0 ];
		}

		for ( i = 0; i < size - 1; i++ ) {
			if ( '' === tempResult  ) {
				firstOperand  = finalConditions[ i ];
				secondOperand = finalConditions[ i + 2 ];
				innerOperator = finalConditions[ i + 1 ];
				i             = i + 2;
				tempResult    = 'or' === innerOperator ? ( firstOperand || secondOperand ) : ( firstOperand && secondOperand );
			} else {
				firstOperand  = tempResult;
				secondOperand = finalConditions[ i + 1 ];
				innerOperator = finalConditions[ i ];
				tempResult    = 'or' === innerOperator ? ( firstOperand || secondOperand ) : ( firstOperand && secondOperand );
				i++;
			}

			if ( true !== tempResult ) {
				tempResult = false;
			}
		}

		return tempResult;
	}
};

( function( jQuery ) {

	// Trigger actions on ready event.
	jQuery( document ).ready( function() {
		window.fusionFormLogics.onReady();
		window.fusionFormLogics.formLogics();
	} );
}( jQuery ) );
