var gulp = require('gulp'),
    concat = require('gulp-concat'),
    sass = require('gulp-sass'),
    cleanCss = require('gulp-clean-css'),
    autoprefixer = require('gulp-autoprefixer'),
    jshint = require('gulp-jshint'),
    watch = require('gulp-watch'),
    gutil = require( 'gulp-util' ),
    ftp = require( 'vinyl-ftp' );

var sass_paths = [
  'theme/css/src/reset.sass',
  'theme/css/src/variables.sass',
  'theme/css/src/general.sass',
  'theme/css/src/mediaqueries.sass'
];

gulp.task('sass', function () {
  gulp.src(less_paths)
    	.pipe(sass())
      .pipe(autoprefixer({
        browsers: ['last 6 versions'],
        cascade: false
      }))
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

var user = ''; 
var password = '';
var host = '';  
var port = 21;  
var localFilesGlob = ['./**/*'];
var remoteFolder = '/wp-content/themes/theme/'
function getFtpConnection() {  
    return ftp.create({
        host: host,
        port: port,
        user: user,
        password: password,
        parallel: 10,
        log: gutil.log
    });
}

gulp.task('ftp-deploy', function() {
    var conn = getFtpConnection();
    return gulp.src(localFilesGlob, { base: '.', buffer: false })
        .pipe( conn.newer( remoteFolder ) ) // only upload newer files 
        .pipe( conn.dest( remoteFolder ) )
    ;
});

gulp.task('ftp-deploy-watch', function() {
    var conn = getFtpConnection();
    gulp.watch(localFilesGlob)
    .on('change', function(event) {
      console.log('Changes detected! Uploading file "' + event.path + '", ' + event.type);
      return gulp.src( [event.path], { base: '.', buffer: false } )
        .pipe( conn.newer( remoteFolder ) ) // only upload newer files 
        .pipe( conn.dest( remoteFolder ) )
      ;
    });
});

gulp.task('default', ['sass', 'js'],function(){
    gulp.watch('theme/css/src/*.scss', ['sass']);
    gulp.watch('theme/js/src/*.js', ['js']);
});