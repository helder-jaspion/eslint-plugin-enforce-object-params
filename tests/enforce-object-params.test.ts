import { RuleTester } from '@typescript-eslint/rule-tester';

import rule from '../src/rules/enforce-object-params';

const ruleTester = new RuleTester();

ruleTester.run('enforce-object-params', rule, {
  valid: [
    `function test({ a, b }: { a: string; b: number }) {}`,
    `const fn = ({ x, y = 1 }: { x: number; y?: number }) => {}`,
    `function fn(a: string) {}`,
    {
      code: `function fn(a: string, b: string) {}`,
      options: [{ maxParams: 3 }],
    },
  ],
  invalid: [
    {
      code: `function test(a: string, b?: number) {}`,
      errors: [{ messageId: 'preferObjectParam' }],
    },
    {
      code: `const fn = (a: number, b: number, c: number, d: number) => {}`,
      options: [{ maxParams: 3 }],
      errors: [{ messageId: 'preferObjectParam' }],
    },
  ],
});
