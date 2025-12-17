export type LoremIpsumLanguage = "english" | "japanese"
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
    "est", "laborum", "accumsan", "tortor", "posuere", "ac", "ut", "consequat",
    "semper", "viverra", "nam", "libero", "justo", "laoreet", "sit", "amet",
    "cursus", "sit", "amet", "dictum", "sit", "amet", "justo", "donec", "enim",
    "diam", "vulputate", "ut", "pharetra", "sit", "amet", "aliquam", "id", "diam",
    "maecenas", "ultricies", "mi", "eget", "mauris", "pharetra", "et", "ultrices",
    "neque", "ornare", "aenean", "euismod", "elementum", "nisi", "quis", "eleifend",
    "quam", "adipiscing", "vitae", "proin", "sagittis", "nisl", "rhoncus", "mattis",
    "rhoncus", "urna", "neque", "viverra", "justo", "nec", "ultrices", "dui",
    "sapien", "eget", "mi", "proin", "sed", "libero", "enim", "sed", "faucibus",
    "turpis", "in", "eu", "mi", "bibendum", "neque", "egestas", "congue", "quisque",
    "egestas", "diam", "in", "arcu", "cursus", "euismod", "quis", "viverra", "nibh",
    "cras", "pulvinar", "mattis", "nunc", "sed", "blandit", "libero", "volutpat",
    "sed", "cras", "ornare", "arcu", "dui", "vivamus", "arcu", "felis", "bibendum",
    "ut", "tristique", "et", "egestas", "quis", "ipsum", "suspendisse", "ultrices",
    "gravida", "dictum", "fusce", "ut", "placerat", "orci", "nulla", "pellentesque",
    "dignissim", "enim", "sit"
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
    "雨ニモマケズ、風ニモマケズ、雪ニモ夏ノ暑サニモマケヌ丈夫ナカラダヲモチ。",
    "慾ハナク決シテ怒ラズ、イツモシヅカニワラッテヰル。",
    "一日ニ玄米四合ト味噌ト少シノ野菜ヲタベ。",
    "アラユルコトヲジブンヲカンジョウニ入レズニ。",
    "ヨクミキキシワカリ、ソシテワスレズ。",
    "野原ノ松ノ林ノ蔭ノ小サナ萱ブキノ小屋ニヰテ。",
    "東ニ病気ノコドモアレバ行ッテ看病シテヤリ、西ニツカレタ母アレバ行ッテソノ稲ノ束ヲ負ヒ。",
    "南ニ死ニサウナ人アレバ行ッテコハガラナクテモイヽトイヒ、北ニケンクヮヤソショウガアレバツマラナイカラヤメロトイヒ。",
    "ヒデリノトキハナミダヲナガシ、サムサノナツハオロオロアルキ。",
    "ミンナニデクノボートヨバレ、ホメラレモセズ、クニモサレズ。",
    "サウイフモノニワタシハナリタイ。",
    "ジョバンニは、学校の門を出ると、同じ組の七、八人と一緒に、校庭の隅の桜の木のところへ集まりました。",
    "それから、みんなは、それぞれ家の方へ帰って行きました。",
    "ジョバンニは、町の方へ曲がりました。",
    "ジョバンニが学校の門を出てやって来ると、もう夕方で、町は店に明かりがつき始めていました。",
    "時計屋の店には、大きな時計が掛かっていて、その下には、いろいろな時計が並んでいました。",
    "一番星見つけた。",
    "青白い火花を散らして、銀河の停車場に、列車が着きました。",
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
    // Remove punctuation to prevent split/join issues and keep "words" clean
    const allText = JAPANESE_SENTENCES.join("").replace(/[、。]/g, "")
    for (let i = 0; i < count; i++) {
        const len = 2 + getRandomInt(4)
        const start = getRandomInt(allText.length - len)
        words.push(allText.slice(start, start + len))
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

const GENERATORS: Record<LoremIpsumLanguage, Record<LoremIpsumUnit, (count: number) => string>> = {
    english: {
        words: generateLatinWords,
        sentences: generateLatinSentences,
        paragraphs: generateLatinParagraphs,
    },
    japanese: {
        words: generateJapaneseWords,
        sentences: generateJapaneseSentences,
        paragraphs: generateJapaneseParagraphs,
    }
}

export function generateLoremIpsum(count: number, language: LoremIpsumLanguage, unit: LoremIpsumUnit): string {
    if (count < 1) return ""

    const generator = GENERATORS[language]?.[unit]
    return generator ? generator(count) : ""
}
