
import { runPluginAnything } from '../core/index';

interface BaseCompilerType {
    readonly Hooks: FunctionConstructor;
    hooks: {
        [name: string]: {
            tap: Function;
            untap: Function;
            flush: Function;
        }
    };
    // ... for customs
    [ name: string ]: any
}

interface FinalCompilerType extends BaseCompilerType {
    utils: {
        [ name: string ]: any
    }
}

class MyPlugin__A {
    constructor(options) {
        console.log('my plugin A options', options);
    }

    apply(finalCompiler: FinalCompilerType) {
        const { hooks, utils, Hooks } = finalCompiler;

        hooks.done.tap('my plugin A', async (data) => {
            console.log('my plugin A hook run', data);

            return 'a';
        });
    }
}

class MyPlugin__B {
    constructor(options) {
        console.log('my plugin B options', options);
    }

    apply(finalCompiler: FinalCompilerType) {
        const { hooks, utils, Hooks } = finalCompiler;

        hooks.done.tap('my plugin B', async (data) => {
            console.log('my plugin B hook run', data);
        });
    }
}

runPluginAnything(
    {

        // Array< string | FunctionContructor | Array<string | FunctionContructor, object> >
        plugins: [
            MyPlugin__A,

            [MyPlugin__B, { name: 'bbb' }]
        ],

        // Array< string >
        // search plugins when plugin name is string
        // Array item should be absolute folder path
        searchList: [],

        // init hooks and customs
        async onInit(baseCompiler: BaseCompilerType) {
            const { hooks, Hooks } = baseCompiler;

            Object.assign(hooks, {
                start: new Hooks(),
                done: new Hooks()
            });

            // add utils in compiler for lifecycle and plugins using
            Object.assign(baseCompiler, {
                utils: {
                    aaa: 1
                }
            });
        },

        // init lifecycle
        async onLifecycle(finalCompiler: FinalCompilerType) {
            // compiler.utils was added in `onInit` callback.
            const { hooks, utils, Hooks } = finalCompiler;

            // await hooks.start.flush();

            // hook done won't run if it was untapped
            await hooks.done.flush('waterfall');
        }
    }
);