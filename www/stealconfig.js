System.config({
    // XXX HACK - because build
    baseURL: typeof window === "undefined" ? "www/js" : "/js",
    "map": {
        "jquery/jquery": "jquery"
    },
    paths: {
        jquery: "bower_components/jquery/dist/jquery.js"
    },
    ext: {
        js: "js",
        css: "css"
    },
    meta: {
        jquery: { exports: "jQuery" }
    },

});
