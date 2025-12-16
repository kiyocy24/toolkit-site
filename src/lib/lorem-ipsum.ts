export type LoremIpsumType = "english" | "japanese"
export type LoremIpsumUnit = "paragraphs" | "sentences" | "words"

const LATIN_WORDS = [
    "lorem", "ipsum", "dolor", "sit", "amet", "consectetur", "adipiscing", "elit",
    "sed", "do", "eiusmod", "tempor", "incididunt", "ut", "labore", "et", "dolore",
    "magna", "aliqua", "ut", "enim", "ad", "minim", "veniam", "quis", "nostrud",
    "exercitation", "ullamco", "laboris", "nisi", "ut", "aliquip", "ex", "ea",
    "commodo", "consequat", "duis", "aute", "irure", "dolor", "in", "reprehenderit",
    "in", "voluptate", "velit", "esse", "cillum", "dolore", "eu", "fugiat", "nulla",
    "pariatur", "excepteur", "sint", "occaecat", "cupidatat", "non", "proident",
    "sunt", "in", "culpa", "qui", "officia", "deserunt", "mollit", "anim", "id",
    "est", "laborum"
]

const JAPANESE_SENTENCES = [
    "親譲りの無鉄砲で小供の時から損ばかりしている。",
    "小学校に居る時分学校の二階から飛び降りて一週間ほど腰を抜かした事がある。",
    "なぜそんな無闇をしたと聞く人があるかも知れぬ。",
    "別段深い理由でもない。",
    "新築の二階から首を出していたら、同級生の一人が冗談に、いくら威張っても、そこから飛び降りる事は出来まい。",
    "弱虫やーい。",
    "と囃したからである。",
    "小使に負ぶさって帰って来た時、おやじが大きな眼をして二階ぐらいから飛び降りて腰を抜かす奴があるかと云ったから、この次は抜かさずに飛んで見せますと答えた。",
    "吾輩は猫である。",
    "名前はまだ無い。",
    "どこで生れたかとんと見当がつかぬ。",
    "何でも薄暗いじめじめした所でニャーニャー泣いていた事だけは記憶している。",
    "吾輩はここで始めて人間というものを見た。",
    "しかもあとで聞くとそれは書生という人間中で一番獰悪な種族であったそうです。",
    "この書生というのは時々我々を捕えて煮て食うという話である。",
    "しかしその当時は何という考もなかったから別段恐しいとも思わなかった。",
    "ただ彼の掌に載せられてスーと持ち上げられた時何だかフワフワした感じがあったばかりである。",
]

function getRandomInt(max: number): number {
    return Math.floor(Math.random() * max)
}

function capitalize(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1)
}

function generateLatinWords(count: number): string {
    const words: string[] = []
    for (let i = 0; i < count; i++) {
        words.push(LATIN_WORDS[getRandomInt(LATIN_WORDS.length)])
    }
    return words.join(" ")
}

function generateLatinSentences(count: number): string {
    const sentences: string[] = []
    for (let i = 0; i < count; i++) {
        // 5-15 words per sentence
        const wordCount = 5 + getRandomInt(11)
        let sentence = generateLatinWords(wordCount)
        sentence = capitalize(sentence) + "."
        sentences.push(sentence)
    }
    return sentences.join(" ")
}

function generateLatinParagraphs(count: number): string {
    const paragraphs: string[] = []
    for (let i = 0; i < count; i++) {
        // 3-8 sentences per paragraph
        const sentenceCount = 3 + getRandomInt(6)
        paragraphs.push(generateLatinSentences(sentenceCount))
    }
    return paragraphs.join("\n\n")
}

function generateJapaneseWords(count: number): string {
    // Japanese doesn't have spaces, but for "words" unit we can just pick characters or short phrases
    // Since "words" concept is fuzzy, let's just pick random segments from sentences or just repeat meaningful chunks.
    // To keep it simple and useful, let's treat "words" as short phrases separated by '、' or just connected.
    // Actually, for Japanese text generation, requested "words" is rare.
    // Let's implement it as: Pick random short phrases from the source text.
    // Or just simple characters?
    // Let's follow standard Japanese dummy text behaviour: just output characters length approx equivalent to english words?
    // No, users probably expect "Bunsetsu" or similar.
    // Let's simply pick random sentences and slice them to mimic "words" or just return full sentences if count is small?
    // Let's try to grab random chunks of 2-5 chars from the sentences.

    const words: string[] = []
    const allText = JAPANESE_SENTENCES.join("")
    for (let i = 0; i < count; i++) {
        const len = 2 + getRandomInt(4)
        const start = getRandomInt(allText.length - len)
        words.push(allText.substr(start, len))
    }
    return words.join("、")
}

function generateJapaneseSentences(count: number): string {
    const sentences: string[] = []
    for (let i = 0; i < count; i++) {
        sentences.push(JAPANESE_SENTENCES[getRandomInt(JAPANESE_SENTENCES.length)])
    }
    return sentences.join("")
}

function generateJapaneseParagraphs(count: number): string {
    const paragraphs: string[] = []
    for (let i = 0; i < count; i++) {
        // 2-5 sentences per paragraph
        const sentenceCount = 2 + getRandomInt(4)
        paragraphs.push(generateJapaneseSentences(sentenceCount))
    }
    return paragraphs.join("\n\n")
}

export function generateLoremIpsum(count: number, type: LoremIpsumType, unit: LoremIpsumUnit): string {
    if (count < 1) return ""

    if (type === "english") {
        switch (unit) {
            case "words":
                return generateLatinWords(count)
            case "sentences":
                return generateLatinSentences(count)
            case "paragraphs":
                return generateLatinParagraphs(count)
        }
    } else {
        switch (unit) {
            case "words":
                return generateJapaneseWords(count)
            case "sentences":
                return generateJapaneseSentences(count)
            case "paragraphs":
                return generateJapaneseParagraphs(count)
        }
    }
    return ""
}
