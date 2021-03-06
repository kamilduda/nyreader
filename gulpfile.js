"use strict";

var gulp = require("gulp"),
    concat = require("gulp-concat"),
    sass = require("gulp-sass"),
    ts = require("gulp-typescript"),
    tsProject = ts.createProject("tsconfig.json",
        {typescript: require("typescript")}),
    sourcemaps = require("gulp-sourcemaps"),
    del = require("del");

var paths = {
    workingDir: "src/main/webapp/",
    staticResources: "src/main/resources/static/",
    angular2: [
        "./node_modules/@angular/**/*",

        // required dependencies
        "./node_modules/rxjs/**/*",
        "./node_modules/angular2-jwt/**/*"
    ],
    otherLibs: [
        "./node_modules/es6-shim/es6-shim.min.js",
        "./node_modules/zone.js/dist/zone.js",
        "./node_modules/reflect-metadata/Reflect.js",
        "./node_modules/systemjs/dist/system.src.js",
        "./node_modules/ng2-translate/bundles/ng2-translate.js"
    ],
    systemjsConfig: ["src/main/webapp/systemjs.config.js"],
    bootstrapCss: ["./node_modules/bootstrap/dist/css/bootstrap.css"],
    bootstrapJs: [
        "./node_modules/bootstrap/dist/js/bootstrap.min.js",
        "./node_modules/jquery/dist/jquery.min.js"]
};

gulp.task("libs", () => {
    // clean libs directory
    del.sync([paths.staticResources + "libs/**"], {force: true});

    // copy Angular 2 and its dependencies
    gulp.src(paths.angular2, {base: "./node_modules"})
        .pipe(gulp.dest(paths.staticResources + "libs/js"));

    // copy other libraries
    gulp.src(paths.otherLibs)
        .pipe(gulp.dest(paths.staticResources + "libs/js"));

    // copy Bootstrap JS
    gulp.src(paths.bootstrapJs)
        .pipe(gulp.dest(paths.staticResources + "libs/js"));

    // copy Bootstrap CSS
    gulp.src(paths.bootstrapCss)
        .pipe(gulp.dest(paths.staticResources + "libs/css"));

    // copy SystemJS Configuration (javascript file)
    gulp.src(paths.systemjsConfig)
        .pipe(gulp.dest(paths.staticResources));

    // copy fonts
    gulp.src(paths.workingDir + "**/*.ttf")
        .pipe(gulp.dest(paths.staticResources));

    // copy favicon
    gulp.src(paths.workingDir + "**/*.ico")
        .pipe(gulp.dest(paths.staticResources));

    // copy images
    gulp.src(paths.workingDir + "**/*.png")
        .pipe(gulp.dest(paths.staticResources));
});

gulp.task("html", () => {
    // clean html files
    del.sync([paths.staticResources + "**/*.html"], {force: true});

    // copy html files
    gulp.src(paths.workingDir + "**/*.html")
        .pipe(gulp.dest(paths.staticResources));
});

gulp.task("sass", () => {
    // clean css files
    del.sync([paths.staticResources + "app/**/*.css",
        paths.staticResources + "app/*.css"], {force: true});

    // compile sass and copy css
    return gulp.src(paths.workingDir + "**/*.scss")
               .pipe(sass.sync().on('error', sass.logError))
               .pipe(gulp.dest(paths.staticResources));
});

gulp.task("tsc", () => {
    // clean js files
    del.sync([paths.staticResources + "app/**/*.js"], {force: true});

    // clean map files
    del.sync([paths.staticResources + "app/**/*.map"], {force: true});

    // generate maps and compile typescript
    var tsResult = gulp.src(paths.workingDir + "**/*.ts")
                       .pipe(sourcemaps.init())
                       .pipe(ts(tsProject));

    // write maps and copy files
    return tsResult.js
                   .pipe(sourcemaps.write(""))
                   .pipe(gulp.dest(paths.staticResources));

});

gulp.task("json", () => {
    // clean json files
    del.sync([paths.staticResources + "**/*.json"], {force: true});

    // copy json files
    gulp.src(paths.workingDir + "**/*.json")
        .pipe(gulp.dest(paths.staticResources));
});

gulp.task("html:w", () => {
    gulp.watch("**/*.html", {cwd: paths.workingDir}, ["html"]);
});

gulp.task("sass:w", () => {
    gulp.watch("**/*.scss", {cwd: paths.workingDir}, ['sass']);
});

gulp.task("tsc:w", () => {
    gulp.watch("**/*.ts", {cwd: paths.workingDir}, ["tsc"]);
});

gulp.task("json:w", () => {
    gulp.watch("**/*.json", {cwd: paths.workingDir}, ["json"]);
});

gulp.task("default", ["build"]);

gulp.task("build", ["libs", "html", "sass", "tsc", "json"]);

gulp.task("watch", ["sass:w", "html:w", "tsc:w", "json:w"]);