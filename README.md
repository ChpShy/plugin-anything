# Inroduction

Make pluginable applications.

# Usage

```js
const { runPluginAnything } = require('plugin-anything');

runPluginAnything(
    {
        // search plugin list
        searchList: [
            // String: absolute folder path
        ],

        plugins: [
            // String | FunctionContructor | Array<String | FunctionContructor, object>
        ],
    }, 
    {
        // regist hooks
        async hooks({ hooks, Events }) {
            hooks.done = new Events();
        },

        // run bootstrap
        async bootstrap({ hooks, Events }) {
            // flush hooks
            await hooks.done.flush('waterfall');

            // do something
            // ...
        }
    }
);
```

# LICENSE

MIT