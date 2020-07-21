import path from 'path';
import babel from 'rollup-plugin-babel';
import external from 'rollup-plugin-peer-deps-external';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import size from 'rollup-plugin-bundle-size';
import { terser } from 'rollup-plugin-terser';
import url from '@rollup/plugin-url';

// TODO: Add dev build to keep jsdoc comments
export default {
  input: path.resolve(__dirname, './src/index.js'),
  output: [
    {
      file: path.resolve(__dirname, './dist/remote-core.umd.js'),
      format: 'umd',
      name: 'remoteCore',
      globals: {
        react: 'React',
        'react-dom': 'ReactDOM',
      },
    },
    {
      file: path.resolve(__dirname, './dist/remote-core.cjs.js'),
      format: 'cjs',
    },
    {
      file: path.resolve(__dirname, './dist/remote-core.esm.js'),
      format: 'es',
    },
  ],
  plugins: [
    external({
      packageJsonPath: path.resolve(__dirname, './package.json'),
    }),
    babel({
      exclude: 'node_modules/**',
      plugins: [
        'babel-plugin-transform-async-to-promises',
        '@babel/plugin-proposal-optional-chaining',
      ],
      presets: [
        [
          '@babel/env',
          {
            targets: {
              ie: '11',
            },
          },
        ],
        '@babel/preset-react',
      ],
    }),
    resolve(),
    commonjs(),
    url({
      include: ['**/*.worker.js'],
    }),
    process.env.NODE_ENV === 'production' && terser(),
    size(),
  ],
};
