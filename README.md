# Calango

_This is a highly experimental, rapidly-changing project. The APIs might change overnight._

**Calango** brings a subset of HTML5 APIs to Node.js. Presently the main focus is on low-level graphics and audio (for example, `Canvas` and `AudioContext`), but other higher-level APIs are welcome. (HTML/CSS layout engine, anyone?)

Calango is written in JavaScript on top of [Node-Qt](http://github.com/arturadib/node-qt).




#### Hello world

This example illustrates a minimal use of the HTML5 Canvas API:

![Screenshot](https://github.com/arturadib/calango/raw/master/screenshot.png)

```javascript
var calango = require('path-to-calango-dir'),
    window = new calango.Window(300, 150),
    canvas = new calango.Canvas(window),
    ctx = canvas.getContext('2d');

ctx.fillStyle = 'black';
ctx.fillText('hello node, hello qt', 20, 20);
```

For other examples see the [demos/](calango/tree/master/demos) directory.





# Getting started

Since the project is under heavy development, no npm packages are available at the moment. To start, clone the latest development version and install the necessary dependencies:

```
$ git clone git://github.com/arturadib/calango.git
$ cd calango
$ npm install
```

If everything went well you should be able to run the demos, for example:

```
$ node demos/03-game-goblins
```

To run the unit tests:

```
$ node make test
```

(Since different platforms generate different images based on several factors, it's likely the image-based regression tests will fail on your setup. Ignore those errors).







<!-- *****************************************************************

  THE SECTION BELOW IS AUTOMATICALLY GENERATED - DO NOT MODIFY! 

********************************************************************** -->




# API reference


## calango

Main object. Typical usage is:

```
var calango = require('path-to-calango-dir');
```

#### useInterval()
Add event handler to Node's event loop via setTimeout(). This is the default event loop integration.

#### useTick()
Add event handler to Node's event loop via `process.nextTick()`.
This should used in applications that require more instant responsiveness (CPU-intensive!).

#### stop()
Stop calango's event loop. Applications never exit without a call to this method.

## calango.Window(width, height)

Native window constructor with the given `height` and `width`.

#### width = 640
Gets/sets window width in pixels

#### height = 480
Gets/sets window height in pixels

#### close()
Closes window. It can't be reopened.

#### addEventListener(event, callback)
Binds `event` to `callback`. Supported events are listed below.

#### removeEventListener(event, callback)
Removes callback from `event` handler.

#### Supported events for `addEventListener()`

+ `mousedown`:
Callback will be passed `{ clientX, clientY, button }`. `button` values correspond
to the convenience constants `calango.LeftButton`, `calango.RightButton`, etc. 
See http://developer.qt.nokia.com/doc/qt-4.8/qt.html#MouseButton-enum
for a list of supported button codes

+ `mouseup`:
Callback will be passed `{ clientX, clientY, button }` as in `mousedown`.

+ `mousemove`:
Callback will be passed `{ clientX, clientY }`.

+ `keydown`:
Callback will be passed `{ key, char }`.
Key values correspond to the convenience constants `calango.Key_Esc`, `calango.Key_Left`, etc.
See http://developer.qt.nokia.com/doc/qt-4.8/qt.html#Key-enum for the list of supported keys.
`char` is the corresponding Unicode character, if available.

+ `keyup`:
Callback will be passed `{ key, char }`. Details as in `keydown`.

## calango.Canvas(window)

Class/constructor for Canvas objects, either off-screen (no `window` argument) or inside an existing `window`.

#### width = 300

#### height = 150

#### viewWidth = width
(Non-standard) Width of the canvas view. Will crop canvas and create 
scroll bars if smaller than the canvas `width`.

#### viewHeight = height
(Non-standard) Height of the canvas view. Will crop canvas and create scroll bars if smaller 
than the canvas `height`.

#### scrollTop = 0
Vertical scroll position. To be used when `height > viewHeight`.
Maximum value is `height - viewHeight`.

#### scrollLeft = 0
Horizontal scroll position. To be used when `width > viewWidth`.
Maximum value is `width - viewWidth`.

#### top = 0
(Non-standard) Top position of the canvas with respect to parent window (if any), in pixels.
Only absolute positioning is available.

#### left = 0
(Non-standard) Left position of the canvas with respect to parent window (if any), in pixels.
Only absolute positioning is available.

#### getContext(type)
Presently only supports `type == '2d'`.

#### toDataURL()

## calango.Canvas.getContext('2d')

The documentation below is for exposed methods after a `ctx = canvas.getContext('2d')` 
call, which returns a `CanvasRenderingContext2D` object.

#### ctx.fillStyle = 'color'
Currently only supports color types (e.g. `'rgb()'`, `'rgba()'`, `'blue'`, `'#aabbcc'`, etc)

#### ctx.strokeStyle = 'color'
Currently only supports color types (e.g. `'rgb()'`, `'rgba()'`, `'blue'`, `'#aabbcc'`, etc)

#### ctx.font = '10px family'
Currently only supports the format above

#### ctx.fillRect(x, y, w, h)

#### ctx.fillText(text, x, y)

#### ctx.translate(x, y)

#### ctx.scale(x, y)

#### ctx.beginPath()

#### ctx.closePath()

#### ctx.moveTo(x, y)

#### ctx.lineTo(x, y)

#### ctx.stroke()

#### ctx.drawImage(image, x, y)
Presently only supports images created via `calango.Image()`

## calango.Image()

Constructor for image objects. Intended to mirror `Image()` constructor from browsers.

#### src = 'file_name'
Presently only supports local paths, e.g. `./images/file.png`

#### complete

#### onload = callback

## calango.AudioContext

Class/constructor for AudioContext objects.

#### destination
Currently returns null

#### createBufferSource()
Returns a new AudioBufferSourceNode object

## calango.AudioContext.createBufferSource()

The documentation below is for exposed methods after a `source = context.createBufferSource()`
call, which returns an `AudioBufferSourceNode` object.

#### source.buffer = 'filename'
Non-compliant. Presently must specify local filename.

#### source.connect(dest)
`dest` is currently a dummy variable. The destination will always
be the default audio device

#### source.loop = `true/false`

#### source.noteOn(when)
Currently `when = 0`, i.e. immediately
