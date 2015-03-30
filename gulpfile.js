var gulp = require('gulp'),
	livereload = require('gulp-livereload'),
    stylus = require('gulp-stylus'),
    nib = require('nib')

var path = {
    stylus: ['public/stylus/*.styl'],
    css: 'public/css/',
    templates : ['public/templates/*/*.html']
};

gulp.task('stylus', function () {
    return gulp.src(path.stylus)
        .pipe(stylus({
        	use: [nib()],
        	import: ['nib'],        	
            compress: true
        })
        .on('error', handleError))
        .pipe(gulp.dest(path.css))
        .pipe(livereload());
});

gulp.task('html', function() {
	gulp.src(path.templates)
		.pipe(livereload());
})

gulp.task('watch', function () {
	livereload.listen();
    gulp.watch(path.stylus, ['stylus']);
    gulp.watch(path.templates, ['html']);
});

function handleError(err)
{
	console.log(err)
}