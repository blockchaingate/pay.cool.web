import { Component } from '@angular/core';
import { Location } from '@angular/common';

type LanguageKey = 'en' | 'sc' | 'tc';

interface CommunityGuidelinesFact {
  label: string;
  value: string;
}

interface CommunityGuidelinesSection {
  title: string;
  paragraphs: string[];
  bullets?: string[];
  note?: string;
}

interface CommunityGuidelinesContent {
  badge: string;
  title: string;
  intro: string;
  updatedLabel: string;
  updatedDate: string;
  highlights: string[];
  summaryTitle: string;
  summaryBody: string;
  factsTitle: string;
  facts: CommunityGuidelinesFact[];
  expectationsTitle: string;
  expectations: string[];
  contactLabel: string;
  contactTitle: string;
  contactText: string;
  sections: CommunityGuidelinesSection[];
}

const COMMUNITY_GUIDELINES_CONTENT: Record<LanguageKey, CommunityGuidelinesContent> = {
  en: {
    badge: 'Standards for a safer Web3 space',
    title: 'Community Guidelines',
    intro: 'Pay.cool is built for wallet activity, digital assets, and community interaction. These guidelines explain the behavior and content standards required to keep the platform respectful, safer for users, and aligned with app-store and legal expectations.',
    updatedLabel: 'Last updated',
    updatedDate: 'April 23, 2026',
    highlights: [
      'Respect is mandatory',
      'Fraud and impersonation are banned',
      'Reports can lead to enforcement'
    ],
    summaryTitle: 'What these guidelines mean',
    summaryBody: 'You can create, share, list, and communicate on Pay.cool, but you must do so lawfully and responsibly. Harmful conduct, abusive content, scams, and malicious activity may lead to content removal, de-listing, or suspension from platform features.',
    factsTitle: 'At a glance',
    facts: [
      { label: 'Harassment policy', value: 'Zero tolerance' },
      { label: 'Scam listings', value: 'Not allowed' },
      { label: 'Moderation tools', value: 'Report, block, filter' }
    ],
    expectationsTitle: 'How to stay in good standing',
    expectations: [
      'Treat other users respectfully in chat, listings, and profile content.',
      'Only mint, post, or promote assets and materials you have the right to use.',
      'Do not mislead users about identity, value, investment returns, or platform affiliation.',
      'Report harmful behavior instead of escalating it inside the community.'
    ],
    contactLabel: 'Need to report?',
    contactTitle: 'Safety contact',
    contactText: 'If you need help with abusive content, suspicious activity, or a moderation issue, contact the Pay.cool support team.',
    sections: [
      {
        title: 'Safety and respect',
        paragraphs: [
          'Pay.cool requires users to engage with others in a respectful and non-threatening way across social, messaging, and trading features.'
        ],
        bullets: [
          'Bullying, stalking, harassment, intimidation, or threats of violence are prohibited.',
          'Hate speech or content promoting violence, hatred, or discrimination based on protected characteristics is prohibited.',
          'Sexually explicit content, pornographic material, or NSFW imagery is not allowed on the platform.'
        ]
      },
      {
        title: 'Integrity in minting and trading',
        paragraphs: [
          'Users are responsible for the honesty and legality of the assets, listings, and claims they publish on Pay.cool.'
        ],
        bullets: [
          'Only mint assets you own or are legally authorized to use.',
          'Do not impersonate brands, artists, public figures, Pay.cool staff, or other trusted entities.',
          'Scams, rug pulls, pump-and-dump schemes, deceptive promotions, and fake investment opportunities are prohibited.'
        ],
        note: 'If an asset or listing is misleading or fraudulent, Pay.cool may restrict or remove its visibility from the app interface.'
      },
      {
        title: 'Prohibited user-generated content',
        paragraphs: [
          'To protect users and comply with mobile platform requirements, certain categories of content are banned even if shared through decentralized tools.'
        ],
        bullets: [
          'Content promoting illegal drugs, human trafficking, organized crime, or other illegal activity.',
          'Content exploiting or showing a lack of sensitivity toward disasters, atrocities, or public health emergencies.',
          'Links, files, or messages designed to steal funds, compromise wallets, harvest credentials, or expose private keys.'
        ]
      },
      {
        title: 'Safety tools and moderation workflow',
        paragraphs: [
          'Pay.cool provides moderation features intended to help users reduce harm and flag problematic activity for review.'
        ],
        bullets: [
          'Report tools may appear on messages, user profiles, and listed assets.',
          'Block tools let you stop direct interaction and hide content from specific users.',
          'Metadata filtering and review processes may be used to flag potentially harmful content before it reaches broader visibility.'
        ]
      },
      {
        title: 'Enforcement and consequences',
        paragraphs: [
          'Because Pay.cool acts as an interface to blockchain activity, platform enforcement usually affects visibility and access to product features rather than changing blockchain data itself.'
        ],
        bullets: [
          'Pay.cool may remove or limit the visibility of infringing, abusive, or unsafe content inside the app.',
          'Users may lose access to social, OTC, or other community-facing features if they violate these rules.',
          'Pay.cool may cooperate with law enforcement when illegal activity is detected or credibly reported.'
        ],
        note: 'Blockchain records may remain public even when content is de-listed from the Pay.cool interface.'
      }
    ]
  },
  sc: {
    badge: '打造更安全的 Web3 社区标准',
    title: '社区准则',
    intro: 'Pay.cool 用于钱包操作、数字资产活动以及社区互动。本页说明在平台上允许与禁止的行为和内容标准，以帮助维持尊重、安全，并符合应用商店及法律要求的使用环境。',
    updatedLabel: '最后更新',
    updatedDate: '2026年4月23日',
    highlights: [
      '尊重他人是基本要求',
      '欺诈与冒充被禁止',
      '举报可能触发处理措施'
    ],
    summaryTitle: '这些准则意味着什么',
    summaryBody: '您可以在 Pay.cool 上创建、分享、挂牌和交流，但必须合法、负责地使用这些功能。有害行为、辱骂内容、诈骗和恶意活动可能导致内容移除、资产下架或功能暂停。',
    factsTitle: '快速了解',
    facts: [
      { label: '骚扰政策', value: '零容忍' },
      { label: '诈骗挂牌', value: '禁止' },
      { label: '审核工具', value: '举报、屏蔽、过滤' }
    ],
    expectationsTitle: '保持良好使用状态',
    expectations: [
      '请在聊天、挂牌和个人资料内容中尊重其他用户。',
      '仅铸造、发布或推广您有权使用的资产和材料。',
      '不得就身份、价值、收益或平台关系误导其他用户。',
      '遇到有害行为时，请使用举报功能，而不是在社区内升级冲突。'
    ],
    contactLabel: '需要举报？',
    contactTitle: '安全联系',
    contactText: '如果您需要处理辱骂内容、可疑活动或审核问题，请联系 Pay.cool 支持团队。',
    sections: [
      {
        title: '安全与尊重',
        paragraphs: [
          'Pay.cool 要求所有用户在社交、消息和交易功能中以尊重且不具威胁性的方式互动。'
        ],
        bullets: [
          '禁止霸凌、跟踪、骚扰、恐吓或暴力威胁。',
          '禁止宣扬暴力、仇恨，或基于受保护特征进行歧视的仇恨言论。',
          '平台不允许色情、露骨性内容或 NSFW 图像。'
        ]
      },
      {
        title: '铸造与交易诚信',
        paragraphs: [
          '用户需对其在 Pay.cool 上发布的资产、挂牌信息和宣传内容的真实性与合法性负责。'
        ],
        bullets: [
          '仅可铸造您拥有或依法获授权使用的资产。',
          '不得冒充品牌、艺术家、公众人物、Pay.cool 团队成员或其他可信主体。',
          '禁止诈骗、卷款跑路、拉高出货、虚假宣传或欺骗性投资机会。'
        ],
        note: '如果资产或挂牌具有误导性或欺诈性，Pay.cool 可限制或移除其在应用内的展示。'
      },
      {
        title: '被禁止的用户生成内容',
        paragraphs: [
          '为了保护用户并遵守移动平台要求，即使通过去中心化工具传播，某些内容类别仍然被禁止。'
        ],
        bullets: [
          '宣扬非法毒品、人口贩卖、有组织犯罪或其他违法活动的内容。',
          '利用、消费或对灾难、暴行或公共卫生事件缺乏基本尊重的内容。',
          '用于盗取资金、攻击钱包、收集凭证或暴露私钥的链接、文件或消息。'
        ]
      },
      {
        title: '安全工具与审核流程',
        paragraphs: [
          'Pay.cool 提供审核相关功能，帮助用户降低风险并将可疑内容提交审查。'
        ],
        bullets: [
          '聊天消息、用户资料和挂牌资产上可能提供举报入口。',
          '屏蔽功能可帮助您停止互动并隐藏特定用户的内容。',
          '平台可能使用元数据过滤和人工审查流程，在内容大范围展示前识别潜在风险。'
        ]
      },
      {
        title: '处理措施与后果',
        paragraphs: [
          '由于 Pay.cool 是区块链活动的界面入口，平台处理通常针对可见性和功能访问，而不是直接修改链上数据。'
        ],
        bullets: [
          'Pay.cool 可在应用内移除或限制侵权、辱骂或不安全内容的可见性。',
          '违反规则的用户可能失去社交、OTC 或其他面向社区的功能访问权限。',
          '如果发现或收到可信举报的违法活动，Pay.cool 可与执法机构合作。'
        ],
        note: '即使内容已从 Pay.cool 界面下架，相关区块链记录仍可能继续公开存在。'
      }
    ]
  },
  tc: {
    badge: '打造更安全的 Web3 社群標準',
    title: '社群準則',
    intro: 'Pay.cool 用於錢包操作、數位資產活動以及社群互動。本頁說明在平台上允許與禁止的行為和內容標準，以協助維持尊重、安全，並符合應用商店及法律要求的使用環境。',
    updatedLabel: '最後更新',
    updatedDate: '2026年4月23日',
    highlights: [
      '尊重他人是基本要求',
      '詐騙與冒充被禁止',
      '檢舉可能觸發處理措施'
    ],
    summaryTitle: '這些準則代表什麼',
    summaryBody: '您可以在 Pay.cool 上建立、分享、掛牌與交流，但必須合法且負責地使用這些功能。有害行為、辱罵內容、詐騙與惡意活動可能導致內容移除、資產下架或功能暫停。',
    factsTitle: '快速了解',
    facts: [
      { label: '騷擾政策', value: '零容忍' },
      { label: '詐騙掛牌', value: '禁止' },
      { label: '審核工具', value: '檢舉、封鎖、過濾' }
    ],
    expectationsTitle: '保持良好使用狀態',
    expectations: [
      '請在聊天、掛牌與個人資料內容中尊重其他用戶。',
      '僅鑄造、發布或推廣您有權使用的資產與材料。',
      '不得就身份、價值、收益或平台關係誤導其他用戶。',
      '遇到有害行為時，請使用檢舉功能，而不是在社群內升高衝突。'
    ],
    contactLabel: '需要檢舉？',
    contactTitle: '安全聯絡',
    contactText: '如果您需要處理辱罵內容、可疑活動或審核問題，請聯絡 Pay.cool 支援團隊。',
    sections: [
      {
        title: '安全與尊重',
        paragraphs: [
          'Pay.cool 要求所有用戶在社交、訊息與交易功能中以尊重且不具威脅性的方式互動。'
        ],
        bullets: [
          '禁止霸凌、跟蹤、騷擾、恐嚇或暴力威脅。',
          '禁止宣揚暴力、仇恨，或基於受保護特徵進行歧視的仇恨言論。',
          '平台不允許色情、露骨性內容或 NSFW 圖像。'
        ]
      },
      {
        title: '鑄造與交易誠信',
        paragraphs: [
          '用戶需對其在 Pay.cool 上發布的資產、掛牌資訊與宣傳內容的真實性及合法性負責。'
        ],
        bullets: [
          '僅可鑄造您擁有或依法獲授權使用的資產。',
          '不得冒充品牌、藝術家、公眾人物、Pay.cool 團隊成員或其他可信主體。',
          '禁止詐騙、捲款跑路、拉高出貨、虛假宣傳或欺騙性投資機會。'
        ],
        note: '如果資產或掛牌具有誤導性或欺詐性，Pay.cool 可限制或移除其在應用內的顯示。'
      },
      {
        title: '被禁止的用戶生成內容',
        paragraphs: [
          '為了保護用戶並遵守行動平台要求，即使透過去中心化工具傳播，某些內容類別仍然被禁止。'
        ],
        bullets: [
          '宣揚非法毒品、人口販運、有組織犯罪或其他違法活動的內容。',
          '利用、消費或對災難、暴行或公共衛生事件缺乏基本尊重的內容。',
          '用於盜取資金、攻擊錢包、收集憑證或暴露私鑰的連結、檔案或訊息。'
        ]
      },
      {
        title: '安全工具與審核流程',
        paragraphs: [
          'Pay.cool 提供與審核相關的功能，協助用戶降低風險，並將可疑內容提交審查。'
        ],
        bullets: [
          '聊天訊息、用戶資料與掛牌資產上可能提供檢舉入口。',
          '封鎖功能可幫助您停止互動並隱藏特定用戶的內容。',
          '平台可能使用中繼資料過濾與人工審查流程，在內容大範圍顯示前識別潛在風險。'
        ]
      },
      {
        title: '處理措施與後果',
        paragraphs: [
          '由於 Pay.cool 是區塊鏈活動的介面入口，平台處理通常針對可見性與功能存取，而不是直接修改鏈上資料。'
        ],
        bullets: [
          'Pay.cool 可在應用內移除或限制侵權、辱罵或不安全內容的可見性。',
          '違反規則的用戶可能失去社交、OTC 或其他面向社群的功能存取權限。',
          '如果發現或收到可信檢舉的違法活動，Pay.cool 可與執法機構合作。'
        ],
        note: '即使內容已從 Pay.cool 介面下架，相關區塊鏈紀錄仍可能繼續公開存在。'
      }
    ]
  }
};

function isLanguageKey(value: string | null | undefined): value is LanguageKey {
  return value === 'en' || value === 'sc' || value === 'tc';
}

@Component({
  selector: 'app-community-guidelines',
  templateUrl: './community-guidelines.component.html',
  styleUrls: ['./community-guidelines.component.scss']
})
export class CommunityGuidelinesComponent {
  lan: LanguageKey = 'en';
  public href = '';
  public langFromUrl = '';
  public readonly contactEmail = 'support@pay.cool';
  public pageContent: CommunityGuidelinesContent = COMMUNITY_GUIDELINES_CONTENT.en;

  constructor(private location: Location) {
    this.href = this.location.path();
    this.langFromUrl = this.href.split('/')[1] || '';

    if (isLanguageKey(this.langFromUrl)) {
      this.lan = this.langFromUrl;
    } else {
      const storedLanguage = localStorage.getItem('_lan');
      if (isLanguageKey(storedLanguage)) {
        this.lan = storedLanguage;
      }
    }

    this.pageContent = COMMUNITY_GUIDELINES_CONTENT[this.lan];
  }
}
