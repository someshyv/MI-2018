var gulp = require('gulp');
const noop = require('gulp-noop');
const htmlmin = require('gulp-htmlmin');
let cleanCSS = require('gulp-clean-css');
var concat = require('gulp-concat');
var nunjucksRender = require('gulp-nunjucks-render');
var compiler = require('webpack');
var webpack = require('webpack-stream');
var webpack_config = require('./webpack.config.js');
var webpack_config_prod = require('./webpack.config.prod.js');
var browserSync = require('browser-sync').create();
var sitemap = require('gulp-sitemap');
var save = require('gulp-save');
const isProd = process.env.NODE_ENV === 'production';

gulp.task('webpack', function() {
    return gulp.src('src/script/main.js')
    .pipe(webpack(isProd ? webpack_config_prod : webpack_config, compiler, function(err, stats) {}))
    .pipe(gulp.dest('build/'));
});

gulp.task('webpack-watch', ['webpack'], function (done) { browserSync.reload(); done(); });

gulp.task('assets', function() {
    gulp.src(['src/images/**/*']).pipe(gulp.dest('build/images/'));
    gulp.src(['src/assets/**/*']).pipe(gulp.dest('build/assets/'));
    gulp.src(['src/favicon.ico']).pipe(gulp.dest('build/'));
});

gulp.task('styles', function() {
   gulp.src(['src/styles/*.css'])
   .pipe(concat('styles.css'))
   .pipe(cleanCSS())
   .pipe(gulp.dest('build/'));
});
gulp.task('css-watch', ['styles'], function (done) { browserSync.reload(); done(); });

gulp.task('nunjucks', function() {
    return gulp.src('src/pages/*.+(html|nunjucks)')

    .pipe(save('before-sitemap'))
    .pipe(sitemap({ siteUrl: 'https://moodi.org' }))
    .pipe(gulp.dest('build/'))
    .pipe(save.restore('before-sitemap'))

    .pipe(nunjucksRender({
        path: ['src/templates']
    }))
    .pipe(isProd ? htmlmin({
        collapseWhitespace: true,
        minifyCSS: true,
        minifyJS: true,
        removeComments: true,
    }) : noop())
    .pipe(gulp.dest('build/'))
});
gulp.task('nunjucks-watch', ['nunjucks'], function (done) { browserSync.reload(); done(); });

gulp.task('build', ['webpack', 'styles', 'nunjucks', 'assets'], function(){});

gulp.task('serve', ['build'], function () {
    browserSync.init({
        server: {
            baseDir: "./build/",
            serveStaticOptions: {
                extensions: ['html']
            }
        }
    });
    gulp.watch("src/**/*.nunjucks", ['nunjucks-watch']);
    gulp.watch("src/**/*.html", ['nunjucks-watch']);
    gulp.watch("src/**/*.js", ['webpack-watch']);
    gulp.watch("src/**/*.css", ['css-watch']);
});
