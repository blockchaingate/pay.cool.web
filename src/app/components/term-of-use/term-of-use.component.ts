import { Component } from '@angular/core';
import { Location } from '@angular/common';

type LanguageKey = 'en' | 'sc' | 'tc';

interface TermOfUseFact {
  label: string;
  value: string;
}

interface TermOfUseSection {
  title: string;
  paragraphs: string[];
  bullets?: string[];
  note?: string;
}

interface TermOfUseContent {
  badge: string;
  title: string;
  intro: string;
  updatedLabel: string;
  updatedDate: string;
  highlights: string[];
  summaryTitle: string;
  summaryBody: string;
  factsTitle: string;
  facts: TermOfUseFact[];
  obligationsTitle: string;
  obligations: string[];
  contactLabel: string;
  contactTitle: string;
  contactText: string;
  sections: TermOfUseSection[];
}

const TERMS_CONTENT: Record<LanguageKey, TermOfUseContent> = {
  en: {
    badge: 'Ground rules, clearly stated',
    title: 'Terms of Service',
    intro: 'These Terms govern your access to the Pay.cool app and its decentralized features. By using the product, you accept the responsibilities that come with non-custodial wallets, on-chain execution, and community participation.',
    updatedLabel: 'Last updated',
    updatedDate: 'April 23, 2026',
    highlights: [
      'Non-custodial platform',
      'On-chain actions are final',
      'No investment advice'
    ],
    summaryTitle: 'What you are agreeing to',
    summaryBody: 'Pay.cool provides tools to interact with blockchains, mint assets, list them, and communicate with other users. You remain responsible for wallet security, lawful use of content, and compliance with local laws.',
    factsTitle: 'At a glance',
    facts: [
      { label: 'Wallet custody', value: 'Always user-controlled' },
      { label: 'Trade reversals', value: 'Generally not possible' },
      { label: 'Recovery phrases', value: 'Cannot be restored by Pay.cool' }
    ],
    obligationsTitle: 'Before you use Pay.cool',
    obligations: [
      'Only mint, upload, or list assets you have the legal right to use.',
      'Review smart contract calls, recipient addresses, gas fees, and prices before confirming any transaction.',
      'Do not post abusive, illegal, fraudulent, or infringing content through community features.',
      'Confirm that your local jurisdiction permits the type of digital asset activity you are engaging in.'
    ],
    contactLabel: 'Questions on terms?',
    contactTitle: 'Terms contact',
    contactText: 'If you need clarification on these Terms or want to report a policy issue, contact the Pay.cool support team.',
    sections: [
      {
        title: 'Scope of services',
        paragraphs: [
          'Pay.cool is a Web3 multi-functional platform that gives you interfaces for interacting with decentralized networks and digital assets.'
        ],
        bullets: [
          'Non-custodial wallet support for multi-chain storage and blockchain interaction.',
          'Asset minting tools for creating and deploying tokens or NFTs.',
          'DEX features for listing and trading digital assets peer-to-peer.',
          'Community features such as user-generated content, encrypted messaging, and OTC coordination.'
        ]
      },
      {
        title: 'Digital asset minting and intellectual property',
        paragraphs: [
          'If you mint content through Pay.cool, you represent and warrant that you own the necessary rights or have valid permission to digitize, upload, and distribute that content.'
        ],
        bullets: [
          'You must not mint or distribute content that infringes copyrights, trademarks, or other third-party rights.',
          'Illegal, objectionable, harmful, or app-store-prohibited material is not allowed.',
          'Pay.cool may limit the visibility of content in its interface, but it cannot erase public blockchain records.'
        ],
        note: 'Minting is an on-chain action. Once data is written to a public blockchain, it may remain visible and immutable.'
      },
      {
        title: 'Listing and trading on the DEX',
        paragraphs: [
          'Pay.cool provides the interface for smart contract interaction, but it does not act as your broker, custodian, market maker, or financial advisor.'
        ],
        bullets: [
          'You are solely responsible for the assets you list, advertise, or trade.',
          'You agree not to list assets that are prohibited or treated as unregulated securities in your jurisdiction.',
          'Listings and trades are generally final and irreversible because blockchain execution cannot be rolled back by Pay.cool.'
        ]
      },
      {
        title: 'User-generated content and conduct',
        paragraphs: [
          'Community features are subject to safety rules designed to protect users and comply with app-store standards.'
        ],
        bullets: [
          'Defamatory, obscene, abusive, harassing, or otherwise objectionable content is prohibited.',
          'The app may include tools that let users report or block accounts and content.',
          'Pay.cool may remove content or suspend access when conduct violates these rules or creates risk for others.'
        ]
      },
      {
        title: 'Financial disclosures and risk',
        paragraphs: [
          'Digital asset activity involves market, technical, and execution risk, including the possibility of permanent loss.'
        ],
        bullets: [
          'Nothing in the app constitutes financial, investment, legal, or tax advice.',
          'Digital assets can be highly volatile and may lose all value.',
          'Gas fees and similar network costs are charged by blockchain infrastructure, are outside Pay.cool’s control, and are typically non-refundable.'
        ]
      },
      {
        title: 'Non-custodial security model',
        paragraphs: [
          'Pay.cool does not store or control your private keys or recovery phrases.'
        ],
        bullets: [
          'You are exclusively responsible for protecting credentials, devices, backups, and signing activity.',
          'If a recovery phrase is lost, Pay.cool cannot recover the wallet or any assets associated with it.',
          'You should verify every transaction carefully before approving it from your wallet.'
        ]
      },
      {
        title: 'Compliance with platform policies',
        paragraphs: [
          'The app is intended to comply with Apple and Google platform rules as they apply to digital assets and mobile distribution.'
        ],
        bullets: [
          'Digital assets or DEX activity may not be used to bypass Apple or Google in-app purchase systems for app-only functionality.',
          'On-device cryptocurrency mining is prohibited within the app.'
        ]
      },
      {
        title: 'Limitation of liability',
        paragraphs: [
          'To the maximum extent permitted by law, Pay.cool is not liable for indirect, incidental, special, or consequential damages arising from your use of the app or underlying blockchain systems.'
        ],
        bullets: [
          'This includes losses related to smart contract vulnerabilities or exploits.',
          'This includes user error, such as sending assets to the wrong address or approving the wrong transaction.',
          'This includes fluctuations in the value, liquidity, or availability of digital assets.'
        ],
        note: 'Decentralized networks and third-party protocols can fail, fork, or behave unexpectedly. Pay.cool does not guarantee uninterrupted or risk-free operation.'
      },
      {
        title: 'Suspension, termination, and governing law',
        paragraphs: [
          'Pay.cool may suspend or terminate access to its interface when conduct appears harmful to the platform, other users, or compliance obligations.',
          'These Terms are governed by the laws of the jurisdiction where the Company is incorporated, without regard to conflict-of-law principles.'
        ]
      }
    ]
  },
  sc: {
    badge: '使用规则，清晰说明',
    title: '服务条款',
    intro: '本条款约束您对 Pay.cool 应用及其去中心化功能的访问和使用。使用本产品，即表示您接受非托管钱包、链上执行和社区互动所附带的责任。',
    updatedLabel: '最后更新',
    updatedDate: '2026年4月23日',
    highlights: [
      '非托管平台',
      '链上操作通常不可撤销',
      '不构成投资建议'
    ],
    summaryTitle: '您同意的核心内容',
    summaryBody: 'Pay.cool 提供与区块链交互、铸造资产、挂牌交易以及与其他用户沟通的工具。钱包安全、内容合法性以及当地合规要求由您自行负责。',
    factsTitle: '快速了解',
    facts: [
      { label: '钱包控制权', value: '始终由用户掌握' },
      { label: '交易撤销', value: '通常无法撤回' },
      { label: '助记词恢复', value: 'Pay.cool 无法帮您找回' }
    ],
    obligationsTitle: '使用 Pay.cool 前请确认',
    obligations: [
      '仅铸造、上传或挂牌您有合法权利使用的资产或内容。',
      '确认交易前，请仔细检查合约调用、收款地址、Gas 费用和价格。',
      '请勿通过社区功能发布辱骂、违法、欺诈或侵权内容。',
      '请确认您所在司法辖区允许您从事相关数字资产活动。'
    ],
    contactLabel: '条款问题？',
    contactTitle: '条款联系',
    contactText: '如果您需要解释这些条款，或希望报告政策问题，请联系 Pay.cool 支持团队。',
    sections: [
      {
        title: '服务范围',
        paragraphs: [
          'Pay.cool 是一个 Web3 多功能平台，为您提供与去中心化网络和数字资产交互的产品界面。'
        ],
        bullets: [
          '支持多链存储和链上交互的非托管钱包功能。',
          '用于创建和部署代币或 NFT 的资产铸造工具。',
          '用于点对点挂牌和交易数字资产的 DEX 功能。',
          '包括用户生成内容、加密消息和 OTC 协调在内的社区功能。'
        ]
      },
      {
        title: '数字资产铸造与知识产权',
        paragraphs: [
          '如果您通过 Pay.cool 铸造内容，即表示您声明并保证自己拥有相关权利，或已取得合法授权，可对该内容进行数字化、上传和分发。'
        ],
        bullets: [
          '您不得铸造或分发侵犯版权、商标或其他第三方权利的内容。',
          '违法、令人反感、有害或被应用商店禁止的材料不得发布。',
          'Pay.cool 可以限制某些内容在界面中的展示，但无法抹除公链上的公开记录。'
        ],
        note: '铸造属于链上操作。一旦数据写入公链，通常会持续公开且不可更改。'
      },
      {
        title: 'DEX 挂牌与交易',
        paragraphs: [
          'Pay.cool 提供的是与智能合约交互的界面，不是您的经纪商、托管方、做市商，也不提供财务顾问服务。'
        ],
        bullets: [
          '您对自己挂牌、宣传或交易的资产承担全部责任。',
          '您同意不挂牌在您所在地区被禁止，或被视为未受监管证券的资产。',
          '由于区块链执行无法由 Pay.cool 回滚，挂牌和交易通常是最终且不可撤销的。'
        ]
      },
      {
        title: '用户生成内容与行为规范',
        paragraphs: [
          '社区功能受安全规范约束，以保护用户并满足应用商店的要求。'
        ],
        bullets: [
          '诽谤、淫秽、辱骂、骚扰或其他令人反感的内容均被禁止。',
          '应用内可能提供举报或屏蔽用户及内容的工具。',
          '如果相关行为违反规则或给他人带来风险，Pay.cool 可删除内容或暂停访问。'
        ]
      },
      {
        title: '金融披露与风险',
        paragraphs: [
          '数字资产活动具有市场、技术和执行风险，可能导致永久性损失。'
        ],
        bullets: [
          '应用中的任何内容均不构成财务、投资、法律或税务建议。',
          '数字资产可能高度波动，甚至完全失去价值。',
          'Gas 费用及类似网络成本由区块链基础设施收取，不受 Pay.cool 控制，通常不可退款。'
        ]
      },
      {
        title: '非托管安全模式',
        paragraphs: [
          'Pay.cool 不存储，也不控制您的私钥或助记词。'
        ],
        bullets: [
          '保护凭证、设备、备份和签名操作完全由您自行负责。',
          '如果助记词丢失，Pay.cool 无法找回钱包或相关资产。',
          '请在钱包批准前仔细核对每一笔交易。'
        ]
      },
      {
        title: '平台政策合规',
        paragraphs: [
          '应用旨在遵守 Apple 和 Google 针对数字资产及移动分发场景的相关平台政策。'
        ],
        bullets: [
          '不得利用数字资产或 DEX 绕过 Apple 或 Google 对应用内专属功能的内购规则。',
          '应用内严禁设备端加密货币挖矿。'
        ]
      },
      {
        title: '责任限制',
        paragraphs: [
          '在法律允许的最大范围内，对于您使用本应用或底层区块链系统所产生的间接、附带、特殊或后果性损失，Pay.cool 不承担责任。'
        ],
        bullets: [
          '这包括与智能合约漏洞或攻击有关的损失。',
          '这包括用户错误造成的损失，例如转错地址或批准错误交易。',
          '这包括数字资产价值、流动性或可用性波动带来的损失。'
        ],
        note: '去中心化网络和第三方协议可能出现故障、分叉或异常行为。Pay.cool 不保证服务持续不中断，也不保证绝对无风险。'
      },
      {
        title: '暂停、终止与适用法律',
        paragraphs: [
          '如果某些行为被认为对平台、其他用户或合规义务有害，Pay.cool 可暂停或终止对其界面的访问。',
          '本条款受公司注册地法律管辖，并依其解释，不适用冲突法原则。'
        ]
      }
    ]
  },
  tc: {
    badge: '使用規則，清楚說明',
    title: '服務條款',
    intro: '本條款約束您對 Pay.cool 應用及其去中心化功能的存取與使用。使用本產品，即表示您接受非託管錢包、鏈上執行與社群互動所附帶的責任。',
    updatedLabel: '最後更新',
    updatedDate: '2026年4月23日',
    highlights: [
      '非託管平台',
      '鏈上操作通常不可撤銷',
      '不構成投資建議'
    ],
    summaryTitle: '您同意的核心內容',
    summaryBody: 'Pay.cool 提供與區塊鏈互動、鑄造資產、掛牌交易以及與其他用戶溝通的工具。錢包安全、內容合法性以及當地合規要求由您自行負責。',
    factsTitle: '快速了解',
    facts: [
      { label: '錢包控制權', value: '始終由用戶掌握' },
      { label: '交易撤銷', value: '通常無法撤回' },
      { label: '助記詞恢復', value: 'Pay.cool 無法協助找回' }
    ],
    obligationsTitle: '使用 Pay.cool 前請確認',
    obligations: [
      '僅鑄造、上傳或掛牌您有合法權利使用的資產或內容。',
      '確認交易前，請仔細檢查合約呼叫、收款地址、Gas 費用與價格。',
      '請勿透過社群功能發布辱罵、違法、詐欺或侵權內容。',
      '請確認您所在司法轄區允許您從事相關數位資產活動。'
    ],
    contactLabel: '條款問題？',
    contactTitle: '條款聯絡',
    contactText: '如果您需要說明這些條款，或希望回報政策問題，請聯絡 Pay.cool 支援團隊。',
    sections: [
      {
        title: '服務範圍',
        paragraphs: [
          'Pay.cool 是一個 Web3 多功能平台，為您提供與去中心化網路與數位資產互動的產品介面。'
        ],
        bullets: [
          '支援多鏈儲存與鏈上互動的非託管錢包功能。',
          '用於建立與部署代幣或 NFT 的資產鑄造工具。',
          '用於點對點掛牌與交易數位資產的 DEX 功能。',
          '包括用戶生成內容、加密訊息與 OTC 協調在內的社群功能。'
        ]
      },
      {
        title: '數位資產鑄造與智慧財產權',
        paragraphs: [
          '如果您透過 Pay.cool 鑄造內容，即表示您聲明並保證自己擁有相關權利，或已取得合法授權，可對該內容進行數位化、上傳與分發。'
        ],
        bullets: [
          '您不得鑄造或分發侵犯版權、商標或其他第三方權利的內容。',
          '違法、令人反感、有害或被應用商店禁止的材料不得發布。',
          'Pay.cool 可以限制某些內容在介面中的顯示，但無法抹除公鏈上的公開紀錄。'
        ],
        note: '鑄造屬於鏈上操作。一旦資料寫入公鏈，通常會持續公開且不可更改。'
      },
      {
        title: 'DEX 掛牌與交易',
        paragraphs: [
          'Pay.cool 提供的是與智慧合約互動的介面，不是您的經紀商、託管方、做市商，也不提供財務顧問服務。'
        ],
        bullets: [
          '您對自己掛牌、宣傳或交易的資產承擔全部責任。',
          '您同意不掛牌在您所在地區被禁止，或被視為未受監管證券的資產。',
          '由於區塊鏈執行無法由 Pay.cool 回滾，掛牌與交易通常是最終且不可撤銷的。'
        ]
      },
      {
        title: '用戶生成內容與行為規範',
        paragraphs: [
          '社群功能受安全規範約束，以保護用戶並符合應用商店要求。'
        ],
        bullets: [
          '誹謗、淫穢、辱罵、騷擾或其他令人反感的內容均被禁止。',
          '應用內可能提供檢舉或封鎖用戶及內容的工具。',
          '如果相關行為違反規則或給他人帶來風險，Pay.cool 可刪除內容或暫停存取。'
        ]
      },
      {
        title: '金融揭露與風險',
        paragraphs: [
          '數位資產活動具有市場、技術與執行風險，可能導致永久性損失。'
        ],
        bullets: [
          '應用中的任何內容均不構成財務、投資、法律或稅務建議。',
          '數位資產可能高度波動，甚至完全失去價值。',
          'Gas 費用及類似網路成本由區塊鏈基礎設施收取，不受 Pay.cool 控制，通常不可退款。'
        ]
      },
      {
        title: '非託管安全模式',
        paragraphs: [
          'Pay.cool 不儲存，也不控制您的私鑰或助記詞。'
        ],
        bullets: [
          '保護憑證、裝置、備份與簽章操作完全由您自行負責。',
          '如果助記詞遺失，Pay.cool 無法找回錢包或相關資產。',
          '請在錢包核准前仔細確認每一筆交易。'
        ]
      },
      {
        title: '平台政策合規',
        paragraphs: [
          '應用旨在遵守 Apple 與 Google 針對數位資產及行動分發場景的相關平台政策。'
        ],
        bullets: [
          '不得利用數位資產或 DEX 繞過 Apple 或 Google 對應用專屬功能的內購規則。',
          '應用內嚴禁裝置端加密貨幣挖礦。'
        ]
      },
      {
        title: '責任限制',
        paragraphs: [
          '在法律允許的最大範圍內，對於您使用本應用或底層區塊鏈系統所產生的間接、附帶、特殊或後果性損失，Pay.cool 不承擔責任。'
        ],
        bullets: [
          '這包括與智慧合約漏洞或攻擊有關的損失。',
          '這包括用戶錯誤造成的損失，例如轉錯地址或核准錯誤交易。',
          '這包括數位資產價值、流動性或可用性波動帶來的損失。'
        ],
        note: '去中心化網路和第三方協議可能故障、分叉或出現異常行為。Pay.cool 不保證服務持續不中斷，也不保證絕對無風險。'
      },
      {
        title: '暫停、終止與適用法律',
        paragraphs: [
          '如果某些行為被認為對平台、其他用戶或合規義務有害，Pay.cool 可暫停或終止對其介面的存取。',
          '本條款受公司註冊地法律管轄，並依其解釋，不適用衝突法原則。'
        ]
      }
    ]
  }
};

function isLanguageKey(value: string | null | undefined): value is LanguageKey {
  return value === 'en' || value === 'sc' || value === 'tc';
}

@Component({
  selector: 'app-term-of-use',
  templateUrl: './term-of-use.component.html',
  styleUrls: ['./term-of-use.component.scss']
})
export class TermOfUseComponent {
  lan: LanguageKey = 'en';
  public href = '';
  public langFromUrl = '';
  public readonly contactEmail = 'support@pay.cool';
  public pageContent: TermOfUseContent = TERMS_CONTENT.en;

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

    this.pageContent = TERMS_CONTENT[this.lan];
  }
}
