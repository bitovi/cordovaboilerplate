# Cordova Mobile App

## Setup

Before you can run/build the application, you'll need to take a few steps yourself.

### Installing Dependencies

You need to [install the latest node.js](http://nodejs.org/download/), which we
use for server-side devops tools.

Once node (and, by extension, `npm`) is installed, go into the application
directory and run:

```bash
npm install;
sudo npm install -g bower grunt-cli ios-sim;
bower install;
```

You will also need to make sure to have the latest JRE and JDK for Java.

### Platforms

If you want to be able to build the mobile app, you will also need the
[Android SDK](https://developer.android.com/sdk/index.html) and
[iOS SDK](https://developer.apple.com/) installed.

Assuming you have `brew` in your system, the easiest way to go about this is to
make sure you have XCode installed, and:

```bash
brew install android-sdk ant
```

You need to make sure `ANDROID_HOME` is set appropriately. If you installed
using brew, something like this in your `~/.bash_profile` or `~/.zshrc` (or
wherever you manage things) should be good enough:

```bash
# ~/.bash_profile
export ANDROID_HOME=/usr/local/opt/android-sdk
```

Once that's done, you need to launch `$ android` and install the SDK for
`Android 4.4 (API 21)` through that interface, then run `$ android avd` and
create a single virtual device for emulation.

See the
[Cordova Platform Guides](http://cordova.apache.org/docs/en/3.5.0/guide_platforms_index.md.html#Platform%20Guides)
and the respective SDK platform docs for more details.

### Running the App in a browser for development

To start the server:

```bash
grunt serve
```
### Working with the mobile app

Before any building, emulating, or releasing can happen, you must do one-time
setup of the cordova directory:

```bash
grunt init
```

You should only even have to do this once, or after the `build/` directory has
been cleaned (and occasionally to recover from strange states). Occasionally, if
you get errors from bower, like `Cannot find http://path/to/some/file` you may
also need to update your bower, by doing:

```bash
bower up
```

### Builds

To build a release the compiled versions of the application:

```bash
grunt build [{android,ios,web}]
```

This will build the webapp and both mobile applications. The following files
will be available under `dist/` in the project root:

* `myCordova-PLATFORM-(un)signed.{app,apk}` - Signed or unsigned mobile packages.
* `myCordova.tgz` - A compressed version of the built webapp.

Additionally, the following will be available under `build/` in the root:

* `cordova/` - The cordova working directory with its entire structure and the
  built webapp in `www/`.
* `release/` - An uncompressed, browsable version of the webapp.

Both of the above are accessible through a symlink in `www/build`, so you can go
to http://localhost:8125/build/release/production.html to try out the built
application.

### Running on a device or emulator

Once a build is complete, you can run the mobile app through the command line on
your desired platform with the following:

```bash
grunt {android|ios} [--force-emulator]
```

The `android` command will try to run on a device connected for USB debugging,
and if no device is found, will run the application in the android emulator
instead. Use `--force-emulator` to skip the device checking step and go straight
to running an emulator.

#### Debugging in the Android browser

You can use
[Remote Debugging on Chrome](https://developer.chrome.com/devtools/docs/remote-debugging)
to debug the app on both the android emulator and your phone.

To access the remote debugger, simply visit [`chrome://inspect`](chrome://inspect)
in your Chrome browser. If you want to access your phone, you'll also need to
tick the USB checkmark, and make sure your phone has USB debugging turned
on. See the link above for instructions on how to do all this.

You can also use adb to see console messages from the mobile app, whether running
through the emulator or on a phone:

```bash
adb logcat -s chromium
```
