import svelte from 'rollup-plugin-svelte';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import { terser } from 'rollup-plugin-terser';
import postcss from 'rollup-plugin-postcss';
import pkg from './package.json';

const production = !process.env.ROLLUP_WATCH;

export default [
  { file: pkg.module, format: 'es' },
  { file: pkg.main, format: 'iife', name: 'mywrePlayer' },
  { file: 'public/bundle.js', format: 'iife', name: 'mywrePlayer' },
].map(output => ({
  input: 'src/Player.html',
  output,
  plugins: [
    svelte({
      cascade: false,
      // opt in to v3 behaviour today
      skipIntroByDefault: true,
      nestedTransitions: true,

      // enable run-time checks when not in production
      dev: !production,
      // we'll extract any component CSS out into
      // a separate file — better for performance
      css: css => {
        css.write('dist/style.css');
        css.write('public/bundle.css');
      },
    }),

    // If you have external dependencies installed from
    // npm, you'll most likely need these plugins. In
    // some cases you'll need additional configuration —
    // consult the documentation for details:
    // https://github.com/rollup/rollup-plugin-commonjs
    resolve(),
    commonjs(),

    postcss(),

    // If we're building for production (npm run build
    // instead of npm run dev), minify
    production && terser(),
  ],
}));
