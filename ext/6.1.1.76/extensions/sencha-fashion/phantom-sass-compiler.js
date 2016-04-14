/*
 * Copyright (c) 2012-2016. Sencha Inc.
 */

var system = require('system'),
    fs = require('fs');

var args = system.args,
    script = system.args[0].replace(/\\/g, '/'),
    fashionDir = script.substring(0, script.lastIndexOf('/')),
    scssFile = args[1].replace(/\\/g, '/'),
    output = args[2].replace(/\\/g, '/'),
    split = (args[3] && parseInt(args[3])) || 0xFFFFFFFF,
    compress = args[4] && args[4] === 'true',
    saveFile = args[5],
    exit = function(code, err){
        if (err) {
            console.error((err.stack || err) + '');
        }
        phantom.exit(code || 0);
    };

try {
    var Fashion = require(fashionDir + '/fashion/fashion-phantomjs.js'),
        variables;

    Fashion.Env.isBrowser = false;
    Fashion.Env.isRhino = true;
    Fashion.Env.readFileRhino = function(file) {
        return fs.read(file);
    };

    Fashion.Env.loadFileRhino = function(file, success, error) {
        var content, exception;
        try {
            content = Fashion.Env.readFile(file);
        } catch (err) {
            exception = err;
        }
        if (exception) {
            error(exception);
        } else {
            success(content);
        }
    };

    if (saveFile) {
        var content = fs.read(saveFile);
        if (/\.json$/.test(saveFile)) {
            variables = JSON.parse(content);
        }
        else {
            variables = {};
            var regex = /(.*?):(.*?);?$/gim,
                matches;

            while((matches = regex.exec(content))) {
                variables[matches[1]] = matches[2];
            }
        }
    }
    else {
        variables = {};
    }

    function build() {
        var builder = new Fashion.Builder({
                context: {
                    libraries: {
                        compass: fashionDir + '/lib/compass/stylesheets/',
                        blueprint: fashionDir + '/lib/blueprint/stylesheets/'
                    }
                }
            });

        try {
            builder.build({
                path: scssFile,
                compress: compress,
                split: split,
                outputPath: output,
                variables: variables
            }, function(generated, err) {

                if (err) {
                    exit(3, err);
                }

                try {
                    if (!Array.isArray(generated) || generated.length === 1) {
                        if (Array.isArray(generated)) {
                            generated = generated[0];
                        }
                        fs.write(output, generated);
                    }
                    else {
                        var idx = output.lastIndexOf('/'),
                            baseName = output.substring(0, idx),
                            fileName = output.substring(idx + 1),
                            newContent = '';
                        for (var i = 0; i < generated.length; i++) {
                            var content = generated[i],
                                newName = fileName.replace(/\.css$/g, '_' + (i + 1) + '.css');
                            fs.write(baseName + '/' + newName, content);
                            newContent += "@import '" + newName + "';\n";
                        }
                        fs.write(output, newContent);
                    }
                    exit(0);
                } catch (err) {
                    exit(4, err);
                }
            });
        } catch (err) {
            exit(2, err);
        }
    }

    build();
} catch (err) {
    exit(1, err);
}
