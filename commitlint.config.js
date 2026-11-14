export default {
  extends: ['@commitlint/config-conventional'],
  plugins: [
    {
      rules: {
        'no-emoji': ({ raw }) => {
          const emojiRegex = /(\p{Extended_Pictographic}|:[a-z0-9_+-]+:)/u
          const hasEmoji = emojiRegex.test(raw)
          return [
            !hasEmoji,
            'Emojis are not allowed in commit messages.'
          ]
        }
      }
    }
  ],
  rules: {
    'type-enum': [
      2,
      'always',
      [
        'feat',
        'fix',
        'docs',
        'style',
        'refactor',
        'perf',
        'test',
        'build',
        'ci',
        'chore',
        'revert'
      ]
    ],
    'scope-enum': [
      2,
      'always',
      [
        'tokens',
        'react',
        'vue',
        'site',
        'docs',
        'ci',
        'deps'
      ]
    ],
    'scope-empty': [0],
    'no-emoji': [2, 'always']
  }
}
