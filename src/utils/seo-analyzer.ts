// SEO分析工具 - 自动分析文章内容并生成SEO优化建议

export interface SEOAnalysis {
  keywords: string[];
  focusKeyword: string;
  keywordDensity: number;
  seoTitle: string;
  seoDescription: string;
  seoScore: number;
  suggestions: string[];
  readabilityScore: number;
  wordCount: number;
  readingTime: number;
}

export interface SEOConfig {
  brandName: string;
  industry: string[];
  targetKeywords: string[];
  maxTitleLength: number;
  maxDescriptionLength: number;
  optimalKeywordDensity: { min: number; max: number };
}

// 默认SEO配置 - 针对手机维修行业
const DEFAULT_SEO_CONFIG: SEOConfig = {
  brandName: 'PRSPARES',
  industry: [
    'mobile phone repair', 'phone parts', 'screen replacement', 'battery replacement',
    'repair tools', 'OEM parts', 'wholesale', 'iPhone repair', 'Samsung repair',
    'Android repair', 'mobile parts', 'repair guide', 'troubleshooting'
  ],
  targetKeywords: [
    'mobile phone', 'repair', 'parts', 'replacement', 'screen', 'battery',
    'tools', 'guide', 'tutorial', 'fix', 'troubleshoot', 'OEM', 'wholesale'
  ],
  maxTitleLength: 60,
  maxDescriptionLength: 160,
  optimalKeywordDensity: { min: 1, max: 3 }
};

/**
 * 提取文本中的关键词
 */
export function extractKeywords(text: string, config: SEOConfig = DEFAULT_SEO_CONFIG): string[] {
  // 清理文本
  const cleanText = text.toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  // 停用词列表
  const stopWords = new Set([
    'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with',
    'by', 'is', 'are', 'was', 'were', 'be', 'been', 'have', 'has', 'had', 'do', 'does',
    'did', 'will', 'would', 'could', 'should', 'may', 'might', 'must', 'can', 'this',
    'that', 'these', 'those', 'i', 'you', 'he', 'she', 'it', 'we', 'they', 'me', 'him',
    'her', 'us', 'them', 'my', 'your', 'his', 'her', 'its', 'our', 'their'
  ]);

  // 分词并计算频率
  const words = cleanText.split(' ').filter(word => 
    word.length > 2 && !stopWords.has(word)
  );

  const wordFreq: { [key: string]: number } = {};
  words.forEach(word => {
    wordFreq[word] = (wordFreq[word] || 0) + 1;
  });

  // 计算TF-IDF权重（简化版）
  const totalWords = words.length;
  const keywordScores: { [key: string]: number } = {};

  Object.entries(wordFreq).forEach(([word, freq]) => {
    const tf = freq / totalWords;
    // 行业相关词汇加权
    const industryBoost = config.industry.some(term => 
      term.toLowerCase().includes(word) || word.includes(term.toLowerCase())
    ) ? 2 : 1;
    
    const targetBoost = config.targetKeywords.some(keyword => 
      keyword.toLowerCase().includes(word) || word.includes(keyword.toLowerCase())
    ) ? 1.5 : 1;

    keywordScores[word] = tf * industryBoost * targetBoost;
  });

  // 提取短语（2-3个词的组合）
  const phrases: { [key: string]: number } = {};
  for (let i = 0; i < words.length - 1; i++) {
    const twoWordPhrase = `${words[i]} ${words[i + 1]}`;
    phrases[twoWordPhrase] = (phrases[twoWordPhrase] || 0) + 1;
    
    if (i < words.length - 2) {
      const threeWordPhrase = `${words[i]} ${words[i + 1]} ${words[i + 2]}`;
      phrases[threeWordPhrase] = (phrases[threeWordPhrase] || 0) + 1;
    }
  }

  // 合并单词和短语，按分数排序
  const allKeywords = [
    ...Object.entries(keywordScores).map(([word, score]) => ({ keyword: word, score })),
    ...Object.entries(phrases)
      .filter(([phrase, freq]) => freq > 1)
      .map(([phrase, freq]) => ({ 
        keyword: phrase, 
        score: (freq / totalWords) * (
          config.industry.some(term => phrase.includes(term.toLowerCase())) ? 3 : 1
        )
      }))
  ];

  return allKeywords
    .sort((a, b) => b.score - a.score)
    .slice(0, 15)
    .map(item => item.keyword);
}

/**
 * 生成SEO优化的标题
 */
export function generateSEOTitle(
  originalTitle: string, 
  keywords: string[], 
  config: SEOConfig = DEFAULT_SEO_CONFIG
): string {
  const focusKeyword = keywords[0] || '';
  const brandName = config.brandName;
  
  // 如果原标题已经包含关键词且长度合适，稍作优化
  if (originalTitle.toLowerCase().includes(focusKeyword) && 
      originalTitle.length <= config.maxTitleLength) {
    const withBrand = `${originalTitle} - ${brandName}`;
    return withBrand.length <= config.maxTitleLength ? withBrand : originalTitle;
  }

  // 生成新标题
  let seoTitle = originalTitle;
  
  // 如果标题不包含主要关键词，尝试添加
  if (!originalTitle.toLowerCase().includes(focusKeyword) && focusKeyword) {
    seoTitle = `${focusKeyword} - ${originalTitle}`;
  }

  // 添加品牌名（如果空间允许）
  const withBrand = `${seoTitle} | ${brandName}`;
  if (withBrand.length <= config.maxTitleLength) {
    seoTitle = withBrand;
  }

  // 如果仍然太长，截断并添加省略号
  if (seoTitle.length > config.maxTitleLength) {
    seoTitle = seoTitle.substring(0, config.maxTitleLength - 3) + '...';
  }

  return seoTitle;
}

/**
 * 生成SEO描述
 */
export function generateSEODescription(
  content: string,
  keywords: string[],
  config: SEOConfig = DEFAULT_SEO_CONFIG
): string {
  const focusKeyword = keywords[0] || '';
  const secondaryKeywords = keywords.slice(1, 4);
  
  // 提取文章开头的句子作为基础
  const sentences = content
    .replace(/[#*`]/g, '')
    .split(/[.!?]+/)
    .map(s => s.trim())
    .filter(s => s.length > 20);

  let description = '';
  
  // 寻找包含关键词的句子
  const keywordSentences = sentences.filter(sentence => 
    keywords.some(keyword => sentence.toLowerCase().includes(keyword.toLowerCase()))
  );

  if (keywordSentences.length > 0) {
    description = keywordSentences[0];
  } else {
    description = sentences[0] || content.substring(0, 100);
  }

  // 确保包含主要关键词
  if (!description.toLowerCase().includes(focusKeyword.toLowerCase()) && focusKeyword) {
    description = `${focusKeyword}: ${description}`;
  }

  // 添加行动召唤
  const cta = 'Learn more from PRSPARES experts.';
  const withCTA = `${description} ${cta}`;
  
  if (withCTA.length <= config.maxDescriptionLength) {
    description = withCTA;
  }

  // 截断到合适长度
  if (description.length > config.maxDescriptionLength) {
    description = description.substring(0, config.maxDescriptionLength - 3) + '...';
  }

  return description;
}

/**
 * 计算关键词密度
 */
export function calculateKeywordDensity(content: string, keyword: string): number {
  const cleanContent = content.toLowerCase().replace(/[^\w\s]/g, ' ');
  const words = cleanContent.split(/\s+/).filter(word => word.length > 0);
  const keywordOccurrences = cleanContent.split(keyword.toLowerCase()).length - 1;
  
  return words.length > 0 ? (keywordOccurrences / words.length) * 100 : 0;
}

/**
 * 计算可读性分数（简化版Flesch Reading Ease）
 */
export function calculateReadabilityScore(content: string): number {
  const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 0);
  const words = content.split(/\s+/).filter(w => w.length > 0);
  const syllables = words.reduce((count, word) => {
    return count + countSyllables(word);
  }, 0);

  if (sentences.length === 0 || words.length === 0) return 0;

  const avgWordsPerSentence = words.length / sentences.length;
  const avgSyllablesPerWord = syllables / words.length;

  // Flesch Reading Ease公式
  const score = 206.835 - (1.015 * avgWordsPerSentence) - (84.6 * avgSyllablesPerWord);
  
  return Math.max(0, Math.min(100, score));
}

/**
 * 计算单词音节数（简化版）
 */
function countSyllables(word: string): number {
  word = word.toLowerCase();
  if (word.length <= 3) return 1;
  
  const vowels = 'aeiouy';
  let syllableCount = 0;
  let previousWasVowel = false;

  for (let i = 0; i < word.length; i++) {
    const isVowel = vowels.includes(word[i]);
    if (isVowel && !previousWasVowel) {
      syllableCount++;
    }
    previousWasVowel = isVowel;
  }

  // 调整规则
  if (word.endsWith('e')) syllableCount--;
  if (syllableCount === 0) syllableCount = 1;

  return syllableCount;
}

/**
 * 综合SEO分析
 */
export function analyzeSEO(
  title: string,
  content: string,
  config: SEOConfig = DEFAULT_SEO_CONFIG
): SEOAnalysis {
  const fullText = `${title} ${content}`;
  const keywords = extractKeywords(fullText, config);
  const focusKeyword = keywords[0] || '';

  const seoTitle = generateSEOTitle(title, keywords, config);
  const seoDescription = generateSEODescription(content, keywords, config);

  const keywordDensity = calculateKeywordDensity(content, focusKeyword);
  const readabilityScore = calculateReadabilityScore(content);
  const wordCount = content.split(/\s+/).filter(w => w.length > 0).length;
  const readingTime = Math.ceil(wordCount / 200);

  // 计算SEO分数
  let seoScore = 0;
  const suggestions: string[] = [];

  // 标题长度检查
  if (seoTitle.length >= 30 && seoTitle.length <= config.maxTitleLength) {
    seoScore += 20;
  } else {
    suggestions.push(`标题长度应在30-${config.maxTitleLength}字符之间`);
  }

  // 描述长度检查
  if (seoDescription.length >= 120 && seoDescription.length <= config.maxDescriptionLength) {
    seoScore += 20;
  } else {
    suggestions.push(`描述长度应在120-${config.maxDescriptionLength}字符之间`);
  }

  // 关键词密度检查
  if (keywordDensity >= config.optimalKeywordDensity.min &&
      keywordDensity <= config.optimalKeywordDensity.max) {
    seoScore += 20;
  } else {
    suggestions.push(`关键词密度应在${config.optimalKeywordDensity.min}-${config.optimalKeywordDensity.max}%之间`);
  }

  // 内容长度检查
  if (wordCount >= 300) {
    seoScore += 20;
  } else {
    suggestions.push('文章内容应至少300字');
  }

  // 可读性检查
  if (readabilityScore >= 60) {
    seoScore += 20;
  } else {
    suggestions.push('提高文章可读性，使用更简单的句子结构');
  }

  return {
    keywords,
    focusKeyword,
    keywordDensity,
    seoTitle,
    seoDescription,
    seoScore,
    suggestions,
    readabilityScore,
    wordCount,
    readingTime
  };
}

/**
 * 基于自定义SEO数据重新评分
 */
export function reanalyzeSEOWithCustomData(
  title: string,
  content: string,
  customSEO: {
    title: string;
    description: string;
    focusKeyword: string;
    keywords: string[];
  },
  config: SEOConfig = DEFAULT_SEO_CONFIG
): SEOAnalysis {
  const keywordDensity = calculateKeywordDensity(content, customSEO.focusKeyword);
  const readabilityScore = calculateReadabilityScore(content);
  const wordCount = content.split(/\s+/).filter(w => w.length > 0).length;
  const readingTime = Math.ceil(wordCount / 200);

  // 重新计算SEO分数
  let seoScore = 0;
  const suggestions: string[] = [];

  // 标题长度检查
  if (customSEO.title.length >= 30 && customSEO.title.length <= config.maxTitleLength) {
    seoScore += 20;
  } else if (customSEO.title.length < 30) {
    suggestions.push('SEO标题过短，建议至少30个字符');
  } else {
    suggestions.push(`SEO标题过长，建议控制在${config.maxTitleLength}字符以内`);
  }

  // 描述长度检查
  if (customSEO.description.length >= 120 && customSEO.description.length <= config.maxDescriptionLength) {
    seoScore += 20;
  } else if (customSEO.description.length < 120) {
    suggestions.push('SEO描述过短，建议至少120个字符');
  } else {
    suggestions.push(`SEO描述过长，建议控制在${config.maxDescriptionLength}字符以内`);
  }

  // 关键词密度检查
  if (keywordDensity >= config.optimalKeywordDensity.min &&
      keywordDensity <= config.optimalKeywordDensity.max) {
    seoScore += 20;
  } else if (keywordDensity < config.optimalKeywordDensity.min) {
    suggestions.push(`主要关键词"${customSEO.focusKeyword}"在内容中出现频率过低`);
  } else {
    suggestions.push(`主要关键词"${customSEO.focusKeyword}"在内容中出现频率过高，避免关键词堆砌`);
  }

  // 内容长度检查
  if (wordCount >= 300) {
    seoScore += 20;
  } else {
    suggestions.push('文章内容应至少300字');
  }

  // 可读性检查
  if (readabilityScore >= 60) {
    seoScore += 20;
  } else {
    suggestions.push('提高文章可读性，使用更简单的句子结构');
  }

  // 额外的自定义SEO检查
  // 检查标题是否包含主要关键词
  if (customSEO.focusKeyword && !customSEO.title.toLowerCase().includes(customSEO.focusKeyword.toLowerCase())) {
    suggestions.push(`建议在SEO标题中包含主要关键词"${customSEO.focusKeyword}"`);
  } else if (customSEO.focusKeyword && customSEO.title.toLowerCase().includes(customSEO.focusKeyword.toLowerCase())) {
    seoScore += 5; // 额外加分
  }

  // 检查描述是否包含主要关键词
  if (customSEO.focusKeyword && !customSEO.description.toLowerCase().includes(customSEO.focusKeyword.toLowerCase())) {
    suggestions.push(`建议在SEO描述中包含主要关键词"${customSEO.focusKeyword}"`);
  } else if (customSEO.focusKeyword && customSEO.description.toLowerCase().includes(customSEO.focusKeyword.toLowerCase())) {
    seoScore += 5; // 额外加分
  }

  // 检查关键词数量
  if (customSEO.keywords.length < 3) {
    suggestions.push('建议添加更多相关关键词（至少3个）');
  } else if (customSEO.keywords.length > 10) {
    suggestions.push('关键词过多，建议控制在10个以内');
  } else {
    seoScore += 5; // 关键词数量合适
  }

  // 确保分数不超过100
  seoScore = Math.min(seoScore, 100);

  return {
    keywords: customSEO.keywords,
    focusKeyword: customSEO.focusKeyword,
    keywordDensity,
    seoTitle: customSEO.title,
    seoDescription: customSEO.description,
    seoScore,
    suggestions,
    readabilityScore,
    wordCount,
    readingTime
  };
}
