const { src, dest, series, watch } = require( 'gulp' );

// browswerSync
const browserSync = require( 'browser-sync' ).create();

browserSync.init({
  server: './dist'
});


// styles 
const sass = require( 'gulp-sass' )( require( 'sass'));
const autoPrefixer = require( 'gulp-autoprefixer' );
const minifyCSS = require( 'gulp-clean-css' );

function styles() {
  return src( './src/sass/**/*.scss' )
    .pipe( sourcemaps.init() )
    .pipe( sass().on( 'error', sass.logError ) )
    .pipe( autoPrefixer( 'last 2 versions') )
    .pipe( minifyCSS() )
    .pipe( sourcemaps.write('') )
    .pipe( dest( './dist/assets/css') )
    .pipe( browserSync.stream() )
}

// scripts
const babel = require( 'gulp-babel' );
const sourcemaps = require( 'gulp-sourcemaps' );
const concat = require( 'gulp-concat' );
const plumber = require('gulp-plumber');


function scripts() {
  return src( './src/js/**/*.js' )
    .pipe( sourcemaps.init() )
    .pipe( plumber() )
    .pipe( babel({
      presets: [['@babel/env']]
    }))
    .pipe( concat('script.all.js'))
    .pipe( sourcemaps.write('.'))
    .pipe( dest('./dist/assets/js'))
    .pipe( browserSync.stream() )
}

// image optimisation
const imageMin = require( 'gulp-imagemin' );
const webP = require( 'gulp-webp' );

function images() {
  return src( './dist/assets/img/original/**/*' )
    .pipe( imageMin( [
      imageMin.gifsicle( { interlaced: true } ),
      imageMin.mozjpeg( { quality: 75, progressive: true } ),
      imageMin.optipng( { optimizationLevel: 5 } ),
      imageMin.svgo( { 
        plugins: [
          { removeViewBox: true },
          { cleanupIDs: false }
        ]
       } )
    ] ) )
    .pipe( webP() )
    .pipe( dest( './dist/assets/img' ) ) 
}

// watch
function watchTask() {
  watch(
    [
      './src/sass/**/*.scss',
      './src/js/**/*.js',
      './src/img/**/*'
    ],
    series( styles, scripts, images )
  )
  watch(
    ['./dist/**/*.html'], browserSync.reload()
  )
}

exports.default = series( styles, scripts, images, watchTask )