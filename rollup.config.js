import typescript from 'rollup-plugin-ts';
import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import replace from '@rollup/plugin-replace';
import pkg from './package.json';

const prod = process.env.NODE_ENV === 'production';

export default {
  input: './src/index.ts',
  external: ['uvu', 'uvu/assert', 'uvu-expect'],
  output: [
    {
      file: pkg.main,
      format: 'cjs',
      exports: 'default',
      sourcemap: prod,
    },
    {
      file: pkg.module,
      format: 'esm',
      sourcemap: prod,
      exports: 'default',
    },
  ],
  plugins: [
    replace({
      'process.env.NODE_ENV': JSON.stringify(
        prod ? 'production' : 'development'
      ),
      preventAssignment: true,
    }),
    resolve({ browser: true }),
    commonjs(),
    typescript({ browserslist: false }),
  ],
};
