'use strict';


function base64(str) {
    return 'data:image/png;base64,' + str.toString('base64');
}


module.exports = function content(grunt) {

    var src = 'dist/all.js',
        tokens = {
            logo: '$LOGO$',
            primary: '$WORDMARK_PRIMARY$',
            secondary: '$WORDMARK_SECONDARY$'
        };

    function processContent(str) {
        var bundles = grunt.file.expand('locales/**/*.properties'),
            content = {},
            props, locale;

        bundles.forEach(function (bundle) {
            locale = bundle.split(/locales\/([A-Z]{2})\/([a-z]{2})\//);
            locale = locale[2] + '_' + locale[1];

            content[locale] = {};

            props = grunt.file.read(bundle);
            props = props.split(/\n/);

            props.forEach(function (line) {
                var pair = line.split(/=(.+)/);

                if (pair[0]) {
                    content[locale][pair[0]] = pair[1];
                }
            });
        });

        str = str.replace('\'$STRINGS$\'', JSON.stringify(content));

        return str;
    }

    grunt.registerTask('content', 'Grabs localized content and injects it into the JavaScript', function () {
        var out = grunt.file.read(src);

        out = processContent(out);

        grunt.file.write(src, out);
    });

};
