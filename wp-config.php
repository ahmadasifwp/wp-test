<?php
/**
 * The base configuration for WordPress
 *
 * The wp-config.php creation script uses this file during the installation.
 * You don't have to use the web site, you can copy this file to "wp-config.php"
 * and fill in the values.
 *
 * This file contains the following configurations:
 *
 * * Database settings
 * * Secret keys
 * * Database table prefix
 * * Localized language
 * * ABSPATH
 *
 * @link https://wordpress.org/support/article/editing-wp-config-php/
 *
 * @package WordPress
 */

// ** Database settings - You can get this info from your web host ** //
/** The name of the database for WordPress */
define( 'DB_NAME', 'local' );

/** Database username */
define( 'DB_USER', 'root' );

/** Database password */
define( 'DB_PASSWORD', 'root' );

/** Database hostname */
define( 'DB_HOST', 'localhost' );

/** Database charset to use in creating database tables. */
define( 'DB_CHARSET', 'utf8' );

/** The database collate type. Don't change this if in doubt. */
define( 'DB_COLLATE', '' );
define( 'WP_MEMORY_LIMIT', '1024M' );
set_time_limit(360);


define( 'WP_DEBUG', true );
define( 'WP_DEBUG_LOG', true );
define( 'WP_DEBUG_DISPLAY', true );



/**#@+
 * Authentication unique keys and salts.
 *
 * Change these to different unique phrases! You can generate these using
 * the {@link https://api.wordpress.org/secret-key/1.1/salt/ WordPress.org secret-key service}.
 *
 * You can change these at any point in time to invalidate all existing cookies.
 * This will force all users to have to log in again.
 *
 * @since 2.6.0
 */
define( 'AUTH_KEY',          '`;u= .W5b zBBLj <MyUcX8Jt)e~ @1H|#)wc3,ia<_d|Rvq.0][`vx_7sO){`Nb' );
define( 'SECURE_AUTH_KEY',   'e~xaOXNuHG&fs44%TOI[>WO<AYkEZmG8%SnN,e8}gyWTwDD^*h0l56pP!GF2A:C%' );
define( 'LOGGED_IN_KEY',     'YWkUqcSA/=tM1S/}#3wEZ?CAC67/-%,BN*>Gj~-:u=tYf|mDnYI(Gdx7@]:[%H>9' );
define( 'NONCE_KEY',         'day>ADrw)wd#GWl}%Y03gCOHdwZ_viWHPN5{q,H#$7f[:cW9vxx]Gz>[+_;Y$vwk' );
define( 'AUTH_SALT',         'kFx^]Tn$o+RrB:h#UVhf]+~{g>F%&F?q`%R?[H7{%MI}3RrQx.y@yBHDCK]y8G0%' );
define( 'SECURE_AUTH_SALT',  '7*jpNvy*U8?pG;:TU,qMiQu{3~oLW#kFXhT]eC5otU<5)cmf-[^9w~BNDtaxq;`}' );
define( 'LOGGED_IN_SALT',    '#:dJ<Q[F,+>5_tS`6piPVz/y-dFsdSs2L ^^@!7DnK=0+1B-[S S_nP`=}bp&|*r' );
define( 'NONCE_SALT',        '9v7O9GV`,BOKHor@Opm+0svAKfi${3n@1o<dVpe/FP8%L/Ti6W}H!yN+mGP#fJL]' );
define( 'WP_CACHE_KEY_SALT', 'lf:n^HP/ZXN)f^.2EiyQdA$Dxi:]F3NvO&trKowxkhN?V(Vr,Mq i8~i3o^|<O]S' );


/**#@-*/

/**
 * WordPress database table prefix.
 *
 * You can have multiple installations in one database if you give each
 * a unique prefix. Only numbers, letters, and underscores please!
 */
$table_prefix = 'wp_';


/* Add any custom values between this line and the "stop editing" line. */



/**
 * For developers: WordPress debugging mode.
 *
 * Change this to true to enable the display of notices during development.
 * It is strongly recommended that plugin and theme developers use WP_DEBUG
 * in their development environments.
 *
 * For information on other constants that can be used for debugging,
 * visit the documentation.
 *
 * @link https://wordpress.org/support/article/debugging-in-wordpress/
 */
if ( ! defined( 'WP_DEBUG' ) ) {
	define( 'WP_DEBUG', false );
}

define( 'WP_ENVIRONMENT_TYPE', 'local' );
/* That's all, stop editing! Happy publishing. */

/** Absolute path to the WordPress directory. */
if ( ! defined( 'ABSPATH' ) ) {
	define( 'ABSPATH', __DIR__ . '/' );
}

/** Sets up WordPress vars and included files. */
require_once ABSPATH . 'wp-settings.php';
