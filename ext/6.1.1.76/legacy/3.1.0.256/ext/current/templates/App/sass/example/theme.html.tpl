<!DOCTYPE html>
<!--
   Copyright (c) 2012-2013. Sencha Inc.
-->
<html>
<head>
    <title>Ext JS Theme Harness</title>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">

    <!--
    Load all required links and scripts
    -->
    <link rel="stylesheet" type="text/css" href="example.css" />
    <script type="text/javascript" src="../../{frameworkPath}/ext-dev.js"></script>
    <script type="text/javascript" src="bootstrap.js"></script>

    <!--
    Load the Slicer core scripts
    -->
    <script type="text/javascript" src="render.js"></script>

    <!--
    Load all manifests and shortcuts
    -->
    <script type="text/javascript" src="../../{packagesRelPath}/ext-theme-base/sass/example/manifest.js"></script>
    <script type="text/javascript" src="../../{packagesRelPath}/ext-theme-base/sass/example/shortcuts.js"></script>
    <script type="text/javascript" src="custom.js"></script>

    <style>
        .ext-generator {
            width: 3000px;
        }

        .widget-container {
            margin: 10px;
            width: 400px;
            position: relative;
            overflow: visible;
        }
    </style>
</head>
    <body class="ext-generator"></body>
</html>
