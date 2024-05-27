/* global Chart */
( function( jQuery ) {
	'use strict';

	jQuery.fn.fusionChartElement = function() {
		var chart,
			$element             = jQuery( this ),
			chartType            = 'undefined' !== typeof $element.data( 'type' ) ? $element.data( 'type' ) : 'line',
			chartBorderSize      = 'undefined' !== typeof $element.data( 'border_size' ) ? $element.data( 'border_size' ) : 1,
			chartBorderType      = 'undefined' !== typeof $element.data( 'border_type' ) ? $element.data( 'border_type' ) : 'smooth',
			chartFill            = 'undefined' !== typeof $element.data( 'chart_fill' ) ? $element.data( 'chart_fill' ) : 'yes',
			xAxisLabel           = 'undefined' !== typeof $element.data( 'x_axis_label' ) ? $element.data( 'x_axis_label' ) : '',
			yAxisLabel           = 'undefined' !== typeof $element.data( 'y_axis_label' ) ? $element.data( 'y_axis_label' ) : '',
			valuesArr            = [],
			showTooltips         = 'undefined' !== typeof $element.data( 'show_tooltips' ) ? $element.data( 'show_tooltips' ) : 'yes',
			bgColors             = [],
			bgColor              = '',
			borderColors         = [],
			borderColor          = '',
			axisTextColor        = 'undefined' !== typeof $element.data( 'chart_axis_text_color' ) ? $element.data( 'chart_axis_text_color' ) : null,
			gridlineColor        = 'undefined' !== typeof $element.data( 'chart_gridline_color' ) ? $element.data( 'chart_gridline_color' ) : null,
			maxValueCount        = 0,
			legendLabels         = [],
			legendPosition       = 'undefined' !== typeof $element.data( 'chart_legend_position' ) ? $element.data( 'chart_legend_position' ) : 'off',
			pointStyle           = 'undefined' !== typeof $element.data( 'chart_point_style' ) ? $element.data( 'chart_point_style' ) : '',
			pointRadius          = 'undefined' !== typeof $element.data( 'chart_point_size' ) ? $element.data( 'chart_point_size' ) : '',
			pointBorderColor     = 'undefined' !== typeof $element.data( 'chart_point_border_color' ) ? $element.data( 'chart_point_border_color' ) : '',
			pointBackgroundColor = 'undefined' !== typeof $element.data( 'chart_point_bg_color' ) ? $element.data( 'chart_point_bg_color' ) : '',
			isPastryChart        = false,
			isRTL                = jQuery( 'body' ).hasClass( 'rtl' ),
			chartData            = {
				labels: [],
				datasets: []
			},
			chartOptions = {
				responsive: true,
				tooltips: {
					enabled: true
				},
				scales: {
					xAxes: [
						{
							display: false
						}
					],
					yAxes: [
						{
							display: false
						}
					]
				},
				legend: {
					labels: {},
					display: true
				},
				layout: {

					// Padding is needed to prevent chart clipping when axes are missing.
					padding: {
						left: 5,
						right: 5,
						top: 5,
						bottom: 5
					}
				}
			},
			chartDataElems  = $element.find( '.fusion-chart-dataset' ),
			maxDatasetCount = jQuery( chartDataElems ).length,
			dataSetValues,
			label,
			cnt,
			i;

		if ( 0 === maxDatasetCount ) {
			return;
		}

		if ( 5 < pointRadius || 5 < chartBorderSize ) {
			chartOptions.layout.padding.top = pointRadius < chartBorderSize ? chartBorderSize : pointRadius;
		}

		if ( 'polarArea' === chartType || 'radar' === chartType ) {
			chartOptions.scale = {};
		}

		isPastryChart = ( ( 'pie' === chartType || 'doughnut' === chartType || 'polarArea' === chartType ) || ( ( 'bar' === chartType || 'horizontalBar' === chartType ) && 1 === chartDataElems.length ) ) ? true : false;

		// For pastry charts we fetch this settings from parent shortcode element. For other chart types we pick that from child elements.
		if ( isPastryChart ) {
			if ( 'undefined' !== typeof $element.data( 'bg_colors' ) ) {
				bgColors = $element.data( 'bg_colors' ).toString().split( '|' );
			}

			if ( 'undefined' !== typeof $element.data( 'border_colors' ) ) {
				borderColors = $element.data( 'border_colors' ).toString().split( '|' );
			}

			if ( 'undefined' !== typeof $element.data( 'x_axis_labels' ) ) {
				legendLabels = $element.data( 'x_axis_labels' ).toString().split( '|' );
			}
		}

		if ( 'off' === chartFill ) {
			chartFill = false;
		}

		chartOptions.tooltips.enabled = 'yes' === showTooltips ? true : false;

		// Iterate through all child elements to get data.
		for ( cnt = 0; cnt < maxDatasetCount; cnt++ ) {
			label = '';

			if ( ! isPastryChart ) {
				if ( 'undefined' !== typeof jQuery( chartDataElems[ cnt ] ).data( 'label' ) ) {
					label = jQuery( chartDataElems[ cnt ] ).data( 'label' ).toString().trim();
					chartData.labels.push( label );

					legendLabels.push( label );
				}
			}

			if ( ! isPastryChart ) {
				if ( 'undefined' !== typeof jQuery( chartDataElems[ cnt ] ).data( 'background_color' ) ) {
					bgColors.push( jQuery( chartDataElems[ cnt ] ).data( 'background_color' ).toString().trim() );
				}

				if ( 'undefined' !== typeof jQuery( chartDataElems[ cnt ] ).data( 'border_color' ) ) {
					borderColors.push( jQuery( chartDataElems[ cnt ] ).data( 'border_color' ).toString().trim() );
				}
			}

			if ( 'undefined' !== typeof jQuery( chartDataElems[ cnt ] ).data( 'values' ) ) {
				valuesArr[ cnt ] = jQuery( chartDataElems[ cnt ] ).data( 'values' ).toString().split( '|' );

				if ( ! isPastryChart && maxValueCount < valuesArr[ cnt ].length ) {
					maxValueCount = valuesArr[ cnt ].length;
				}
			}
		}

		// Number of labels should match number of values (or chart is weird).
		if ( 'undefined' !== typeof $element.data( 'x_axis_labels' ) ) {
			chartData.labels = $element.data( 'x_axis_labels' ).toString().split( '|' );
		} else if ( 'pie' === chartType || 'doughnut' === chartType || 'polarArea' === chartType ) {
			chartData.labels = new Array( chartDataElems.length );
		} else {
			chartData.labels = new Array( maxValueCount );
		}

		if ( true === isRTL ) {
			chartData.labels = chartData.labels.reverse();
			bgColors = bgColors.reverse();
			borderColors = borderColors.reverse();
			legendLabels = legendLabels.reverse();

			for ( i = 0; i < valuesArr.length; i++ ) {
				valuesArr[ i ] = valuesArr[ i ].reverse();
			}
		}

		// Build chartJS datasets based on chart type.
		for ( cnt = 0; cnt < maxDatasetCount; cnt++ ) {
			dataSetValues = [];

			if ( isPastryChart ) {
				bgColor       = bgColors;
				borderColor   = borderColors;
				dataSetValues = valuesArr[ cnt ];
				label = 'undefined' !== typeof jQuery( chartDataElems[ cnt ] ).data( 'label' ) ? jQuery( chartDataElems[ cnt ] ).data( 'label' ).toString().trim() : '';
			} else {
				bgColor       = 'undefined' !== typeof bgColors[ cnt ] ? bgColors[ cnt ] : '';
				borderColor   = 'undefined' !== typeof borderColors[ cnt ] ? borderColors[ cnt ] : '';
				dataSetValues = valuesArr[ cnt ];
				label = 'undefined' !== typeof legendLabels[ cnt ]  && true === Array.isArray( legendLabels ) ? legendLabels[ cnt ] : '';
			}

			chartData.datasets.push( {
				label: label,
				data: dataSetValues,
				backgroundColor: bgColor,
				borderColor: borderColor,
				borderWidth: chartBorderSize
			} );

			if ( 'line' === chartType ) {
				chartData.datasets[ cnt ].fill = chartFill;

				if ( 'stepped' === chartBorderType ) {
					chartData.datasets[ cnt ].steppedLine = true;
				}

				if ( '' !== pointStyle ) {
					chartData.datasets[ cnt ].pointStyle = pointStyle;
				}

				if ( '' !== pointRadius ) {
					chartData.datasets[ cnt ].pointRadius      = pointRadius;
					chartData.datasets[ cnt ].pointHoverRadius = pointRadius;
				}

				if ( '' !== pointBorderColor ) {
					chartData.datasets[ cnt ].pointBorderColor = pointBorderColor;
				}

				if ( '' !== pointBackgroundColor ) {
					chartData.datasets[ cnt ].pointBackgroundColor = pointBackgroundColor;
				}
			}
		}

		// Needed for pastry charts.
		if ( isPastryChart ) {
			chartData.labels = legendLabels;
		}

		// Start Y axis at 0 for this charts.
		if ( 'bar' === chartType || 'line' === chartType ) {
			chartOptions.scales.yAxes[ 0 ].ticks = {
				beginAtZero: true
			};
		}

		// And this one as well.
		if ( 'horizontalBar' === chartType ) {
			chartOptions.scales.xAxes[ 0 ].ticks = {
				beginAtZero: true
			};
		}

		// We don't display axes for this chart types in any case.
		if ( '' !== xAxisLabel && 'pie' !== chartType && 'doughnut' !== chartType && 'polarArea' !== chartType && 'radar' !== chartType ) {
			chartOptions.scales.xAxes[ 0 ].display = true;
			chartOptions.scales.xAxes[ 0 ].scaleLabel = {
				display: true,
				labelString: xAxisLabel
			};

			if ( null !== axisTextColor ) {
				chartOptions.scales.xAxes[ 0 ].scaleLabel.fontColor = axisTextColor;
			}
		}

		// We don't display axes for this chart types in any case.
		if ( '' !== yAxisLabel && 'pie' !== chartType && 'doughnut' !== chartType && 'polarArea' !== chartType && 'radar' !== chartType ) {
			chartOptions.scales.yAxes[ 0 ].display = true;
			chartOptions.scales.yAxes[ 0 ].scaleLabel = {
				display: true,
				labelString: yAxisLabel
			};

			if ( null !== axisTextColor ) {
				chartOptions.scales.yAxes[ 0 ].scaleLabel.fontColor = axisTextColor;
			}

			if ( true === isRTL && 'horizontalBar' !== chartType ) {
				chartOptions.scales.yAxes[ 0 ].position = 'right';
			}
		}

		if ( 'line' === chartType && 'non_smooth' === chartBorderType ) {
			chartOptions.elements = {
				line: {
					tension: 0.000001
				}
			};
		}

		// We have custom legend.
		chartOptions.legend.display = false;

		// Define custom legend generator function.
		chartOptions.legendCallback = function( scopedChart ) {
			var text = [],
				l,
				scopedBgColor;

			text.push( '<ul class="fusion-chart-legend-' + scopedChart.id + '">' );

			for ( l = 0; l < legendLabels.length; l++ ) {
				scopedBgColor = 'undefined' !== typeof bgColors[ l ] ? bgColors[ l ] : 'transparent';
				text.push( '<li><span style="background-color:' + scopedBgColor + '">' );
				if ( legendLabels[ l ] ) {
					text.push( legendLabels[ l ] );
				}
				text.push( '</span></li>' );
			}
			text.push( '</ul>' );

			return text.join( '' );
		};

		if ( null !== gridlineColor ) {

			if ( 'polarArea' === chartType || 'radar' === chartType ) {
				if ( 'undefined' === typeof chartOptions.scale.gridLines ) {
					chartOptions.scale.gridLines  = {};
					chartOptions.scale.angleLines = {};
				}

				chartOptions.scale.gridLines.color  = gridlineColor;
				chartOptions.scale.angleLines.color = gridlineColor;
			} else {
				if ( 'undefined' === typeof chartOptions.scales.yAxes[ 0 ].gridLines ) {
					chartOptions.scales.yAxes[ 0 ].gridLines = {};
				}

				if ( 'undefined' === typeof chartOptions.scales.xAxes[ 0 ].gridLines ) {
					chartOptions.scales.xAxes[ 0 ].gridLines = {};
				}

				chartOptions.scales.xAxes[ 0 ].gridLines.color = gridlineColor;
				chartOptions.scales.yAxes[ 0 ].gridLines.color = gridlineColor;
			}

		}

		if ( null !== axisTextColor ) {

			if ( 'polarArea' === chartType || 'radar' === chartType ) {
				if ( 'undefined' === typeof chartOptions.scale.ticks ) {
					chartOptions.scale.ticks = {};
				}

				chartOptions.scale.ticks.fontColor = axisTextColor;
			} else {
				if ( 'undefined' === typeof chartOptions.scales.yAxes[ 0 ].ticks ) {
					chartOptions.scales.yAxes[ 0 ].ticks = {};
				}

				if ( 'undefined' === typeof chartOptions.scales.xAxes[ 0 ].ticks ) {
					chartOptions.scales.xAxes[ 0 ].ticks = {};
				}

				chartOptions.scales.xAxes[ 0 ].ticks.fontColor = axisTextColor;
				chartOptions.scales.yAxes[ 0 ].ticks.fontColor = axisTextColor;
			}
		}

		// Generate chart.
		chart = new Chart( $element.find( 'canvas' ).get( 0 ), {
			type: chartType,
			data: chartData,
			options: chartOptions
		} );

		// Generate legend if needed.
		if ( 'off' !== legendPosition ) {
			$element.find( '.fusion-chart-legend-wrap' ).html( chart.generateLegend() );
		}
	};

	jQuery( window ).on( 'load', function() {
		jQuery.each( jQuery( '.fusion-chart' ), function() {
			jQuery( this ).fusionChartElement();
		} );
	} );
	jQuery( window ).on( 'fusion-element-render-fusion_chart', function( event, cid ) {
		var $element = jQuery( 'div[data-cid="' + cid + '"]' ).find( '.fusion-chart' );
		$element.fusionChartElement();
	} );
}( jQuery ) );
