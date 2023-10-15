[中文](README_zh_CN.md)

# siyuan-plugin-local-service

A plugin connecting siyuan-note with local services

## Features

It enables the following functionalities:

1. **Automated startup with siyuan-note:** Automatically initiates Node applications using Electron integrated Node upon siyuan-note's startup; the Node service shuts down when siyuan-note is closed. Prerequisites: None.

   Use case: next.js
2. **NPM Package Installation:** Prerequisites: Local system with Node >= 18 installed and environment variables correctly configured.

   Available npm package paths:

   ```bash
   Available zhi node_modules path1 => [Workspace]/node_modules
   Available zhi node_modules path2 => [zhiNpmPath]/node_modules 
   Available zhi node_modules path3 => [zhiAppNpmPath]/node_modules 

   Note: On Mac, [zhiAppNpmPath]=/Users/[MacUsername]/Library/Application Support/siyuancommunity
   On Windows, [zhiAppNpmPath]=[UserDirectory]/siyuancommunity
   On Linux, [zhiAppNpmPath]=[UserDirectory]/siyuancommunity
   ```

   The npm located in the above paths can be directly required in the siyuan-note console. It can even be automatically installed on-demand during require.

   ```js
   // Assuming vue package exists in the above directory
    require("vue")
    // If vue package doesn't exist, install it first before requiring. Installation directory is [zhiAppNpmPath]
    requireInstall("vue")
   ```

3. **Shell Commands Execution:** Prerequisites: Local system with Node >= 18 installed and environment variables correctly configured.

    1. Starts local Node applications automatically upon siyuan-note's startup and shuts down the Node service when siyuan-note is closed.

       Use cases: Nuxt, nocodb
    2. Invokes the `java` command to start Java services upon siyuan-note's startup and shuts down the Java service when siyuan-note is closed.

       Use case: Halo
    3. Calls the `docker` command to start Docker services upon siyuan-note's startup and shuts down the Docker service when siyuan-note is closed.

       Use cases: nocodb, memos, WordPress, Halo