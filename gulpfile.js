var gulp = require('gulp'),
    sass = require('gulp-sass'),
    jshint = require('gulp-jshint'),
    concat = require('gulp-concat'),
    cleanCss = require('gulp-clean-css'),
    watch = require('gulp-watch');
    imagemin = require('gulp-imagemin');

 
gulp.task('default', function(){
    console.log('default gulp task...')
});

gulp.task('sass', function () {
  gulp.src('theme/css/src/*.scss')
    	.pipe(sass())
      .pipe(concat('global.css'))
      .pipe(cleanCss({
        aggressiveMerging: false
      }))
    	.pipe(gulp.dest('theme/css'));
});

gulp.task('js', function () {
	gulp.src('theme/js/src/*.js')
		.pipe(jshint())
		.pipe(concat('global.js'))
		.pipe(gulp.dest('theme/js'));
});

gulp.task('img', function() {
  	gulp.src('theme/img/src/*.{png,jpg,gif}')
    	.pipe(imagemin({
      		optimizationLevel: 7,
      		progressive: true
    	}))
    	.pipe(gulp.dest('theme/img'))
});

gulp.task('default', ['sass', 'js', 'img'],function(){
    gulp.watch('theme/css/src/*.scss', ['sass']);
    gulp.watch('theme/js/src/*.js', ['js']);
    gulp.watch('theme/img/src/*.{png,jpg,gif}', ['img']);
});