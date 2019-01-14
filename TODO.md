TODO
====

This list is in a rough order of priority.

List
----

* Reddit support
    * youtube-dl does it
    * mpv can stream it but it takes ages
* Vimeo support
    * youtube-dl does it
    * mpv can stream it
* Silent looping Video overlay
    * Then rename image/pic variables to overlay everywhere
    * These need making consistent anyway
* Gifv support
* Allow admins to remove anything before it gets played
* Allow downloading of content
    * Must give a legal warning at the user's first attempt, which prompts the user to confirm their intent
    * Only allow downloading of the currently playing content. I hate seeing people waste their time looking ahead. It ruins the fun.
* Put development diagrams in repo

---

* Make internal errors that aren't user errors get put in the terminal
* Only attach user ids to items belonging to the user the queue is sent to
* Check picture for duplicate again before playing it
* Account for possibility of CDN being down
    * `<script>window.jQuery || document.write('<script src="js/vendor/jquery-1.11.2.min.js"><\/script>')</script>`
* Add all npm scripts like unit-test and ban
* Replace utils.valList with Object.values
* Remove debug file and commands
* Split up `static/handlers.js`
* Replace array.forEach with something better
* Use more modern JS features on the back end
    * things have changed a lot in nodejs since the birth of this project
* Separate the 3 upload types into separate functions use "type system"
    * There's a lot of checking `isUrl` and `stream` which wildly change the behaviour of a function
* Modernise front end code
    * I wanted to use old JS on the front end for old browsers
    * But I'm using templates which I now know aren't available on old browsers
    * Could use babel or typescript to compile to compatible JS
* Prevent Firefox getting urls that are POST only
    * use 405 Method Not Allowed responses
* Split up HttpService into sub files based on common middleware
* Use consistent "id", "cid", "contentId" / "uid", "userId" properties
* "use strict"
* Split ContentManager into more modules
    * One for playing and one for queuing
* Split up `main.css`
* Remove duplicate code in `static/handlers.js`
* Make play queue DOM update more efficiently
* Only try to delete empty files once
* Use a map of content id to item instead of a user queue
* Allow videos to be uploaded by URL that references a file
* Tests should execute in a random order
* Add JSDoc to all functions
* Do something to account for the fact that default options could update after you've got an options.js file
    * could use json which makes merging easy, so long as comments can go in the file
* Remove null from codebase
* Truncate file names before sending the files to the server
* Use exponential form for numbers in default_options
* Add unit tests
    * Worth doing before refactors
* Add integration tests
    * Worth doing before refactors
* Check what method is used for each HTTP endpoint, is there a better one?

---

* Windows 2000 cursors (http://telcontar.net/Misc/screeniecursors/)
* Play the Windows 2000 start up sound when visiting the page
* Drag windows by their outline, which is more authentic
* Find a unicode remover only for problematic characters
* Admins can toggle a user's ban state from a list of all users
* Continue downloading after the server is suspended
* Use a consistent unit for differet time lengths in options
* Move queueUpdateMaxFreq from consts to options
* Simulate upload time delay for during manual testing
* Include upload type in error (file, yt, stream)
* In WebSocketService take a userId instead of a soc in methods
* Make start and end time boxes adjacent
* Replace utils.spread with modern JS
* Language pack framework for localisation
* Build all error messages on the front end
* Tell the user how long until something is no longer blocked due to the uniqueness constraint
* Use a consistent method for checking for an empty string
* Add a unicode play/pause icon to the play/pause button on the admin panel
* Make quotes consistent around numbers
* Make it so progress items can be passed around the system rather than re-searched for frequently
* Put Clippy in his own window
    * harder than it looks
* Grey bar at the top of unfocused windows
* Nickname uniqueness
* Move timer from ContentManager into a stopwatch class
* Check it uses the minimum required JQuery UI
* Change the options at run time from the admin panel
* Reconnect websockets when attempting to perform a websocket action
* use valid http response codes, things such as payload too large
* Factor initial youtube-dl info request factor into total upload percentage
* Factor image url download into total upload percentage
    * can factor in the vid duration to the ratio between the two
* Accidental missile test Easter egg
* Safe Increment i.e. ids start at min safe integer and loop back round if they reach max safe integer
* Command line overrides for options
* Can stream content to the browser for users to watch
* Convert to TypeScript
* Works without JavaScript
* Use CSS Preprocessor