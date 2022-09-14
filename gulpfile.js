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
    .pipe( sass().on( 'error', sass.logError ) )
    .pipe( autoPrefixer( 'last 2 versions') )
    .pipe( minifyCSS() )
    .pipe( dest( './dist/assets/css') )
}

// scripts
const babel = require( 'gulp-babel' );
const sourcemaps = require( 'gulp-sourcemaps' );
const concat = require( 'gulp-concat' );
const gulpPlumber = require('gulp-plumber');

function scripts() {
  return src( './src/js/**/*.js' )
    .pipe( sourcemaps.init() )
    .pipe( babel({
      presets: ['@babel/env']
    }))
    .pipe( concat('script.all.js'))
    .pipe( sourcemaps.write('.'))
    .pipe( dest('./dist/assets/js'))
}

// watch
function watchTask() {
  watch(
    [
      './src/sass/**/*.scss',
      './src/js/**/*.js'
    ],
    series( styles, scripts )
  )
  watch(
    ['./dist/**/*/html'], browserSync.reload
  )
}

exports.default = series( styles, scripts, watchTask )