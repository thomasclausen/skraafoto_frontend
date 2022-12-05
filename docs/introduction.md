# Documentation

These are the documentation pages for `skraafoto_frontend` **(Skraafoto)** aimed at frontend developers and people who are interested in Skraafoto's architecture. 
We hope that the documentation will make you enjoy developing Skraafoto and help you to keep the codebase in great shape.

## Overview

[Start reading the system overview](https://sdfidk.github.io/skraafoto_frontend/tutorials-overview.html) to get a high level introduction to the inner workings of Skraafoto.

## Building the system

Refer to the [install and build instuctions](https://sdfidk.github.io/skraafoto_frontend/tutorials-installing.html) for details on building Skraafoto, or running a development server.

## Folder structure

Here is a quick overview of the most important folders in this project:

`src/` - Javascript and CSS source

`public/` - HTML and images. HTML files may reference files in `dist` folder.

`dist/` - When running `npm run build`, a `dist` folder will be created with the built Javascript and CSS. 

`docs/` - Anything related to documentation.

`test/` - Anything related to test. (Not much at the time of writing.)

Most folders will have a `README.md` file with details of its contents.