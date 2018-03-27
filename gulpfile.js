var gulp = require('gulp');
var runSequence = require('run-sequence');
var del = require('del');
var sass = require('gulp-sass');
var concat = require('gulp-concat');
var cssnano = require('gulp-cssnano');
var uglify = require('gulp-uglify');
var sourcemaps = require('gulp-sourcemaps');
var templateCache = require('gulp-angular-templatecache');
var nodemon = require('gulp-nodemon');
var browserSync = require('browser-sync').create();

//Build ./public
gulp.task('build', function(done) {
  return runSequence('clean','buildJS','buildCSS',['fonts','images'], done);
});

//Build ./public/javascripts
gulp.task('buildJS', function(done) {
  return runSequence('angularjs','angularApp','angularAppTemplate','javasriptsConcat', 'cleanJSTemp', done);
});

//Build ./public/stylesheets
gulp.task('buildCSS', function(done) {
  return runSequence('main-sass', 'pages-sass', done);
});

//Setup nodemon and browserSync for development so we don't have to
//restart the server or reload the browser (as much)
gulp.task('dev', ['nodemon', 'browserSync'], function (){
  gulp.watch('./client/stylesheets/**/*.scss', ['buildCSS']);
  gulp.watch('./client/javascripts/**/*.*', ['buildJS', 'buildCSS']);
  gulp.watch('./client/fonts/**/*.*', ['fonts']);
  gulp.watch('./client/images/**/*.*', ['images']);
});

/* ========================================================================== */

//Delete everything in the ./public directory
gulp.task('clean', function() {
  return del.sync('public');
});

//Copy angularjs framework from node_modules to ./public
gulp.task('angularjs', function() {
  return gulp.src([
      './node_modules/angular/angular.min.js',
      './node_modules/angular/angular.min.js.map'
    ])
    .pipe(gulp.dest('./public/javascripts/temp'));
});

//Concatenate and minify Hackathon Registration AngularJS App
gulp.task('angularApp', function(){
  return gulp.src([
      './client/javascripts/app/hackathon-registration-app.js',
      './client/javascripts/app/factories/*.js',
      './client/javascripts/app/modules/**/*.js'
    ])
    .pipe(sourcemaps.init())
      .pipe(concat('hackathonScripts.min.js'))
      .pipe(uglify())
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('./public/javascripts/temp'))
    .pipe(browserSync.reload({stream: true}));
});

//Add Hackathon Registration AngularJS App templates to $templateCache
//service and minify
gulp.task('angularAppTemplate', function(){
  return gulp.src('./client/javascripts/app/modules/**/*.html')
    .pipe(templateCache({
      filename: 'hackathonScriptsTemplates.min.js',
      module: 'hackathonRegistrationApp',
    }))
    .pipe(sourcemaps.init())
      .pipe(uglify())
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('./public/javascripts/temp'))
    .pipe(browserSync.reload({stream: true}));
});

//Concatenate all javascript files into a single file
gulp.task('javasriptsConcat', function(){
  return gulp.src([
      './public/javascripts/temp/angular.min.js',
      './public/javascripts/temp/hackathonScripts.min.js',
      './public/javascripts/temp/hackathonScriptsTemplates.min.js'
    ])
    .pipe(sourcemaps.init({loadMaps: true}))
      .pipe(concat('hackathonAngularApp.min.js'))
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('./public/javascripts/'))
    .pipe(browserSync.reload({stream: true}));
});

gulp.task('cleanJSTemp', function() {
  return del.sync('public/javascripts/temp');
});

//Process, concatenate, and minify Main Sass
gulp.task('main-sass', function(){
  return gulp.src([
      './client/stylesheets/normalize.scss',
      './client/stylesheets/main.scss',
      './client/javascripts/app/modules/**/*.scss'
    ])
    .pipe(sourcemaps.init())
      .pipe(sass())
      .pipe(concat('styles.min.css'))
      .pipe(cssnano())
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('./public/stylesheets'))
    .pipe(browserSync.reload({stream: true}));
});

//Process and minify Pages Sass
gulp.task('pages-sass', function(){
  return gulp.src([
      './client/stylesheets/pages/*.scss'
    ])
    .pipe(sourcemaps.init())
      .pipe(sass())
      .pipe(cssnano())
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('./public/stylesheets/pages'))
    .pipe(browserSync.reload({stream: true}));
});

//Copy fonts from ./client to ./public
gulp.task('fonts', function() {
  return gulp.src('./client/fonts/**/*')
  .pipe(gulp.dest('./public/fonts'))
});

//Copy images from ./client to ./public
gulp.task('images', function() {
  return gulp.src('./client/images/**/*')
  .pipe(gulp.dest('./public/images'))
});

/* ========================================================================== */

//Setup browserSync
gulp.task('browserSync', function() {
  setTimeout(function () {
    browserSync.init({
      proxy: 'https://localhost:3443',
      files: ['client/**/*.*', 'server/**/*.*'],
      port: 3000,
    });
  }, 1500);
});

//Setup nodemon
gulp.task('nodemon', function (cb) {
	var started = false;
	return nodemon({
		script: 'server.js'
	}).on('start', function () {
		//To avoid nodemon being started multiple times
		if (!started) {
			cb();
			started = true;
		}
	});
});
