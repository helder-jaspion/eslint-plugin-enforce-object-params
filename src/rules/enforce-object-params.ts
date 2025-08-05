import { AST_NODE_TYPES, TSESLint, TSESTree } from '@typescript-eslint/utils';

type MessageIds = 'preferObjectParam';
type Options = [{ maxParams?: number }];

const rule: TSESLint.RuleModule<MessageIds, Options> = {
  meta: {
    type: 'suggestion',
    docs: {
      description:
        'Enforce using a single object parameter if optional params or too many params are present',
    },
    messages: {
      preferObjectParam:
        'Use a single object parameter when optional parameters or too many parameters exist.',
    },
    schema: [
      {
        type: 'object',
        properties: {
          maxParams: { type: 'number' },
        },
        additionalProperties: false,
      },
    ],
  },
  defaultOptions: [{}],
  create(context) {
    const options = context.options?.[0] ?? {};
    const maxParams = options.maxParams ?? Infinity;

    function checkParams(
      node:
        | TSESTree.FunctionDeclaration
        | TSESTree.ArrowFunctionExpression
        | TSESTree.FunctionExpression,
    ) {
      const params = node.params;

      if (params.length <= 1) return;

      const hasOptional = params.some((p) => p.type === AST_NODE_TYPES.Identifier && p.optional);

      if (hasOptional || params.length > maxParams) {
        context.report({
          node,
          messageId: 'preferObjectParam',
        });
      }
    }

    return {
      FunctionDeclaration: checkParams,
      ArrowFunctionExpression: checkParams,
      FunctionExpression: checkParams,
    };
  },
};

export default rule;
