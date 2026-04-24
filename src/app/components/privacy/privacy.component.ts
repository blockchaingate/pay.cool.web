import { Component } from '@angular/core';
import { Location } from '@angular/common';

type LanguageKey = 'en' | 'sc' | 'tc';

interface PrivacyFact {
  label: string;
  value: string;
}

interface PrivacySection {
  title: string;
  paragraphs: string[];
  bullets?: string[];
  note?: string;
}

interface PrivacyContent {
  badge: string;
  title: string;
  intro: string;
  updatedLabel: string;
  updatedDate: string;
  highlights: string[];
  summaryTitle: string;
  summaryBody: string;
  factsTitle: string;
  facts: PrivacyFact[];
  controlsTitle: string;
  controls: string[];
  contactLabel: string;
  contactTitle: string;
  contactText: string;
  sections: PrivacySection[];
}

const PRIVACY_CONTENT: Record<LanguageKey, PrivacyContent> = {
  en: {
    badge: 'Privacy, made readable',
    title: 'Privacy Policy',
    intro: 'Pay.cool is built so core wallet activity happens on your device, not in a centralized account system. This page explains what stays local, what may become public on-chain, and where limited operational data can still exist.',
    updatedLabel: 'Last updated',
    updatedDate: 'April 23, 2026',
    highlights: [
      'Non-custodial by default',
      'Private keys stay local',
      'On-chain actions are public'
    ],
    summaryTitle: 'What this means in practice',
    summaryBody: 'You can use core decentralized features without creating a traditional account. If you transact or publish data on a public blockchain, those records remain visible on that network and cannot be deleted by Pay.cool.',
    factsTitle: 'At a glance',
    facts: [
      { label: 'Seed phrases', value: 'Never collected' },
      { label: 'Wallet custody', value: 'User-controlled' },
      { label: 'Chat privacy', value: 'End-to-end encrypted' }
    ],
    controlsTitle: 'Your controls',
    controls: [
      'Keep your seed phrase and private key only on devices you trust.',
      'Disconnect wallets, stop using a Dapp, or uninstall the app at any time.',
      'Request deletion of off-chain support emails or messages where legally permitted.',
      'Choose which networks, assets, and third-party services you interact with.'
    ],
    contactLabel: 'Need help?',
    contactTitle: 'Privacy contact',
    contactText: 'For questions about this policy or any off-chain information you shared with us, contact the Pay.cool support team.',
    sections: [
      {
        title: 'Data we do not collect',
        paragraphs: [
          'For core wallet and blockchain features, Pay.cool is designed so your most sensitive credentials do not pass through our servers.'
        ],
        bullets: [
          'Private keys and seed phrases: generated and stored on your device.',
          'Traditional signup details: name, physical address, and government ID are not required for standard decentralized use.',
          'Private transaction ledgers: blockchain activity lives on public networks rather than in a private Pay.cool history database.'
        ]
      },
      {
        title: 'Data we may process to operate the service',
        paragraphs: [
          'Some limited data is still necessary to make the app usable, reliable, and secure.'
        ],
        bullets: [
          'Public wallet addresses and on-chain transaction details, which are needed to display balances and submit blockchain actions.',
          'Minimal device or diagnostic metadata, such as app version or operating system information, for stability, fraud prevention, and troubleshooting.',
          'Support communications or other information you intentionally send to us off-chain.',
          'Some integrated services or compliance-driven Dapps may ask for additional information under their own terms.'
        ]
      },
      {
        title: 'Encrypted communication and blockchain transparency',
        paragraphs: [
          'Where Pay.cool offers private messaging, message content is intended to be encrypted so only the participants can read it.',
          'When you mint, transfer, swap, or list assets, the resulting transaction is recorded on a public blockchain.'
        ],
        note: 'Blockchain records are immutable by design. Pay.cool cannot edit or erase data once it is written on-chain.'
      },
      {
        title: 'Third-party infrastructure',
        paragraphs: [
          'Pay.cool may rely on blockchain RPC providers, app distribution platforms, analytics tooling, or other technical partners to deliver the product.',
          'We aim to minimize the data shared with those providers and use them only for legitimate operational purposes.'
        ]
      },
      {
        title: 'Your choices and retention',
        paragraphs: [
          'You decide whether to connect a wallet, which networks to use, and which features to access.',
          'If we hold limited off-chain information such as support emails, we keep it only as long as reasonably necessary for service, compliance, or security.'
        ],
        bullets: [
          'You can stop future off-chain collection by closing the app, disconnecting integrations, or uninstalling it.',
          'You may ask us to delete off-chain information where the law and our operational obligations allow.',
          'On-chain records cannot be deleted by Pay.cool because they are not stored in a private editable database.'
        ]
      },
      {
        title: 'Security approach',
        paragraphs: [
          'We use technical and organizational safeguards intended to reduce risk, while the non-custodial design keeps the most sensitive wallet secrets outside our direct control.'
        ],
        bullets: [
          'Local encryption and OS-level secure storage where available.',
          'Secure transport for network requests and administrative access controls for off-chain systems.',
          'A product design that reduces centralized storage of high-risk wallet secrets.'
        ]
      }
    ]
  },
  sc: {
    badge: '隐私政策，一目了然',
    title: '隐私政策',
    intro: 'Pay.cool 的核心钱包功能尽量在您的设备本地完成，而不是依赖中心化账户系统。本页说明哪些数据留在本地、哪些链上行为天然公开，以及哪些有限的运营数据可能仍会存在。',
    updatedLabel: '最后更新',
    updatedDate: '2026年4月23日',
    highlights: [
      '默认非托管',
      '私钥仅保留在本地',
      '链上操作天然公开'
    ],
    summaryTitle: '实际含义',
    summaryBody: '您无需创建传统账户即可使用核心去中心化功能。如果您在公链上发起交易或发布数据，这些记录会保留在对应网络上，Pay.cool 无法将其删除。',
    factsTitle: '快速了解',
    facts: [
      { label: '助记词', value: '不会收集' },
      { label: '钱包控制权', value: '由用户掌握' },
      { label: '聊天隐私', value: '端到端加密' }
    ],
    controlsTitle: '您可自行控制',
    controls: [
      '请仅在您信任的设备上保存助记词和私钥。',
      '您可以随时断开钱包、停止使用某个 Dapp，或卸载应用。',
      '在法律允许的范围内，您可以请求删除离线保存的支持邮件或消息。',
      '您可以自行决定使用哪些网络、资产和第三方服务。'
    ],
    contactLabel: '需要帮助？',
    contactTitle: '隐私联系',
    contactText: '如果您对本政策或您离线提交给我们的信息有疑问，请联系 Pay.cool 支持团队。',
    sections: [
      {
        title: '我们不会收集的数据',
        paragraphs: [
          '对于核心钱包和区块链功能，Pay.cool 的设计目标是让最敏感的凭证不经过我们的服务器。'
        ],
        bullets: [
          '私钥和助记词：在您的设备上生成并保存。',
          '传统注册信息：对于标准去中心化使用场景，不要求提供姓名、住址或政府证件。',
          '私有交易台账：交易活动记录在公链上，而不是保存在 Pay.cool 私有历史数据库中。'
        ]
      },
      {
        title: '为提供服务可能处理的数据',
        paragraphs: [
          '为了让应用可用、稳定并具备基本安全性，仍可能需要少量数据。'
        ],
        bullets: [
          '公开钱包地址和链上交易信息，用于显示余额以及提交区块链操作。',
          '最少量的设备或诊断元数据，例如应用版本、操作系统信息，用于稳定性、安全和排障。',
          '您主动离线发送给我们的客服沟通内容或其他信息。',
          '某些集成服务或合规型 Dapp 可能会依据其自身条款要求额外信息。'
        ]
      },
      {
        title: '加密通信与链上公开性',
        paragraphs: [
          '如果 Pay.cool 提供私密消息功能，消息内容的目标是进行加密，仅通信双方可以读取。',
          '当您铸造、转账、兑换或上架资产时，相关交易会记录在公开区块链上。'
        ],
        note: '区块链记录天然不可篡改。一旦写入链上，Pay.cool 无法编辑或删除。'
      },
      {
        title: '第三方基础设施',
        paragraphs: [
          'Pay.cool 可能依赖区块链 RPC、应用分发平台、分析工具或其他技术合作方来提供服务。',
          '我们会尽量减少向这些服务商共享的数据，并仅将其用于必要的运营用途。'
        ]
      },
      {
        title: '您的选择与数据保留',
        paragraphs: [
          '是否连接钱包、使用哪些网络以及启用哪些功能，由您自行决定。',
          '如果我们持有少量离线信息，例如客服邮件，我们只会在服务、合规或安全所合理需要的期限内保留。'
        ],
        bullets: [
          '您可以通过关闭应用、断开集成服务或卸载应用，停止未来的离线数据收集。',
          '在法律和运营义务允许的范围内，您可以要求删除离线信息。',
          '链上记录不在可编辑的私有数据库中，因此 Pay.cool 无法删除。'
        ]
      },
      {
        title: '安全措施',
        paragraphs: [
          '我们采用技术和组织层面的安全措施来降低风险，而非托管架构也让最高敏感度的钱包密钥不由我们直接掌控。'
        ],
        bullets: [
          '在可用情况下使用本地加密和系统级安全存储。',
          '对网络请求采用安全传输，并对离线系统实施访问控制。',
          '通过产品设计尽量减少高风险钱包密钥的中心化存储。'
        ]
      }
    ]
  },
  tc: {
    badge: '隱私政策，一目了然',
    title: '隱私政策',
    intro: 'Pay.cool 的核心錢包功能盡量在您的裝置本地完成，而不是依賴中心化帳戶系統。本頁說明哪些資料留在本地、哪些鏈上行為天然公開，以及哪些有限的營運資料可能仍會存在。',
    updatedLabel: '最後更新',
    updatedDate: '2026年4月23日',
    highlights: [
      '預設非託管',
      '私鑰只保留在本地',
      '鏈上操作天然公開'
    ],
    summaryTitle: '實際含義',
    summaryBody: '您無需建立傳統帳戶即可使用核心去中心化功能。如果您在公鏈上發起交易或發布資料，這些紀錄會保留在對應網路上，Pay.cool 無法將其刪除。',
    factsTitle: '快速了解',
    facts: [
      { label: '助記詞', value: '不會收集' },
      { label: '錢包控制權', value: '由用戶掌握' },
      { label: '聊天隱私', value: '端對端加密' }
    ],
    controlsTitle: '您可自行控制',
    controls: [
      '請只在您信任的裝置上保存助記詞和私鑰。',
      '您可以隨時斷開錢包、停止使用某個 Dapp，或解除安裝應用。',
      '在法律允許的範圍內，您可以要求刪除離線保存的支援郵件或訊息。',
      '您可以自行決定使用哪些網路、資產和第三方服務。'
    ],
    contactLabel: '需要協助？',
    contactTitle: '隱私聯絡',
    contactText: '如果您對本政策或您離線提交給我們的資料有疑問，請聯絡 Pay.cool 支援團隊。',
    sections: [
      {
        title: '我們不會收集的資料',
        paragraphs: [
          '對於核心錢包和區塊鏈功能，Pay.cool 的設計目標是讓最敏感的憑證不經過我們的伺服器。'
        ],
        bullets: [
          '私鑰和助記詞：在您的裝置上產生並保存。',
          '傳統註冊資料：對於標準去中心化使用情境，不要求提供姓名、住址或政府證件。',
          '私有交易台帳：交易活動記錄在公鏈上，而不是保存在 Pay.cool 私有歷史資料庫中。'
        ]
      },
      {
        title: '為提供服務可能處理的資料',
        paragraphs: [
          '為了讓應用可用、穩定並具備基本安全性，仍可能需要少量資料。'
        ],
        bullets: [
          '公開錢包地址和鏈上交易資訊，用於顯示餘額以及提交區塊鏈操作。',
          '最少量的裝置或診斷中繼資料，例如應用版本、作業系統資訊，用於穩定性、安全和排障。',
          '您主動離線發送給我們的客服溝通內容或其他資訊。',
          '某些整合服務或合規型 Dapp 可能會依據其自身條款要求額外資訊。'
        ]
      },
      {
        title: '加密通訊與鏈上公開性',
        paragraphs: [
          '如果 Pay.cool 提供私密訊息功能，訊息內容的目標是進行加密，僅通訊雙方可以讀取。',
          '當您鑄造、轉帳、兌換或上架資產時，相關交易會記錄在公開區塊鏈上。'
        ],
        note: '區塊鏈紀錄天然不可竄改。一旦寫入鏈上，Pay.cool 無法編輯或刪除。'
      },
      {
        title: '第三方基礎設施',
        paragraphs: [
          'Pay.cool 可能依賴區塊鏈 RPC、應用分發平台、分析工具或其他技術合作方來提供服務。',
          '我們會盡量減少向這些服務商共享的資料，並只將其用於必要的營運用途。'
        ]
      },
      {
        title: '您的選擇與資料保留',
        paragraphs: [
          '是否連接錢包、使用哪些網路以及啟用哪些功能，由您自行決定。',
          '如果我們持有少量離線資訊，例如客服郵件，我們只會在服務、合規或安全所合理需要的期限內保留。'
        ],
        bullets: [
          '您可以透過關閉應用、斷開整合服務或解除安裝應用，停止未來的離線資料收集。',
          '在法律和營運義務允許的範圍內，您可以要求刪除離線資訊。',
          '鏈上紀錄不在可編輯的私有資料庫中，因此 Pay.cool 無法刪除。'
        ]
      },
      {
        title: '安全措施',
        paragraphs: [
          '我們採用技術和組織層面的安全措施來降低風險，而非託管架構也讓最高敏感度的錢包密鑰不由我們直接掌控。'
        ],
        bullets: [
          '在可用情況下使用本地加密和系統級安全儲存。',
          '對網路請求採用安全傳輸，並對離線系統實施存取控制。',
          '透過產品設計盡量減少高風險錢包密鑰的中心化儲存。'
        ]
      }
    ]
  }
};

function isLanguageKey(value: string | null | undefined): value is LanguageKey {
  return value === 'en' || value === 'sc' || value === 'tc';
}

@Component({
  selector: 'app-privacy',
  templateUrl: './privacy.component.html',
  styleUrls: ['./privacy.component.scss']
})
export class PrivacyComponent {
  lan: LanguageKey = 'en';
  public href = '';
  public langFromUrl = '';
  public readonly contactEmail = 'support@pay.cool';
  public pageContent: PrivacyContent = PRIVACY_CONTENT.en;

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

    this.pageContent = PRIVACY_CONTENT[this.lan];
  }
}
