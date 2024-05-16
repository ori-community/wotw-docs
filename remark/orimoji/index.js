import { findAndReplace } from 'mdast-util-find-and-replace'

const RE_EMOJI = /:\w+:/g

export default function plugin() {
  function replaceEmoji(match) {
    const name = match.slice(1, -1)
    // https://github.com/syntax-tree/mdast#nodes
    return {
      type: 'image',
      url: `/emoji/${name}.png`,
      title: name,
      alt: match,
      data: {
        hProperties: {
          class: 'emoji',
        },
      },
    }
  }

  function transformer(tree) {
    findAndReplace(tree, [[RE_EMOJI, replaceEmoji]])
  }

  return transformer
}
