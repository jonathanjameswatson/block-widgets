import { Module } from '@nuxt/types'
import fse from 'fs-extra'

const rawEmojiRulesRegExp = /rawEmojiRules = (?<!\\)`\n([\s\S]+?)\n(?<!\\)`/m
const rawEmojiRuleRegExp = /(.+?) -> (.+?)$/gm

const goStringToTsString = (goFile: string) => {
  const rawEmojiRulesMatch = goFile.match(rawEmojiRulesRegExp)
  if (rawEmojiRulesMatch === null) {
    throw new Error('This parser is no longer valid.')
  }
  const rawEmojiRules = rawEmojiRulesMatch[1]
  const ruleMatches = [...rawEmojiRules.matchAll(rawEmojiRuleRegExp)]
  const rules: { [key: string]: string } = {}
  ruleMatches.forEach((ruleMatch: RegExpMatchArray) => {
    rules[ruleMatch[1]] = ruleMatch[2]
  })
  return `const wordToEmoji: { [Key: string]: string } = {
${Object.entries(rules)
  .map(([key, value]) => `  '${key}': '${value}'`)
  .join(',\n')},
}

export default wordToEmoji
`
}

const module: Module<{}> = async (_moduleOptions) => {
  const goString = (await fse.readFile(
    './modules/generateWordToFoodEmojis/example.go',
    'utf8'
  )) as string
  const tsString = goStringToTsString(goString)
  await fse.writeFile('./ts/wordToFoodEmoji.ts', tsString)
}

export default module