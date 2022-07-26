export interface Campaign {
    // Basic information
    _id: Number; // unique campaignid, from 0,1,2...
    name: String; // campaign's generic name,
    titleLan: [{ lan: String, text: String }]; // Campaign name in languages
    subtitleLan: [{ lan: String, text: String }];
    domain: String; // this campaign's website
    sloganLan: [{ lan: String, text: String }]; // this campaign's slogan in languages
    subsloganLan: [{ lan: String, text: String }]; // this campaign's subslogan in languages
    avatarUrl: String;
    imageUrl: String;
    descLan: [{ lan: String, text: String }]; // Description of the campaign in different languages
    logoUrl: String; // Campaign's logo
    ownerMemberId: String; // owner of the campaign
    cat: String; // Category of this campaign
    typ: String; // Type of this campaign

    startDate: Date;
    endDate: Date;
    startBlock: Number;
    endBlock: Number;
    status: Number; // 0-waiting to start, 1-in progress, 2-ended.

    // About member:
    grade: [{ name: String, medalImgUrl: String, qualification: String, rewardRule: String }]; // Such as Platinum, Gold, Silver ...

    baseCoin: String; // such as: EXG
    paymentCoin: String; //such as: USDT
    officalPaymentCoinAddress: String; // for example: offical USDT address to receive payment.
    rewardCoin: String; // rewards in EXG or USDT
    levelRewardRate: [Number]; // reward rate for each level, start from 0 but level0 is yourself.

    fixedAmount: Boolean; // If fixedAmount is true, take the minPay as the amount to pay.
    minPay: Number; // paticipant minimum payment required
    maxPay: Number; // paticipant maximum payment limited
    softCap: Number;
    hardCap: Number;

    levelsLimit: Number; // how many levels to calculate levelRewards.
    investorGrade: Number; // how many grades for investors, such as 3: Gold, Silver, Bronze
    lockDays: Number; // How many days to lock token.
    baseRewardInPercent: Boolean;
    levelRewardInPercent: Boolean;
    groupRewardInPercent: Boolean;

    rules: []; // Define campaign rules, will decide later.

    // Different grade hase different investment requirement, and each level has different reward amount.
    //investorGrades: [{ name: String, nameLan: [TextLan], investAmountRequired: Number, reward: { baseFixReward: Number, levelRewards: [{ fixReward: Number, percentReward: Number }] } }],

    groupGrade: Number; // exg: 3 - A, B, C
    //groups: [{name: String, nameLan: [TextLan], amountRequired: Number, rewardAmount: Number}],

    // startReleaseDay: after how many days of the investor invested to start release; periodReleaseDays: how many days for each release; period ReleasePercent: percent to release in each period. 
    baseImvestmentRelease: { startReleaseDays: Number, periodReleaseDays: Number, periodReleasePercent: Number };
    levelRewardRelease: { startReleaseDays: Number, periodReleaseDays: Number, periodReleasePercent: Number };
    groupRewardRelease: { startReleaseDays: Number, periodReleaseDays: Number, periodReleasePercent: Number };

    jurisdictions: [String];
    desc: String;
    active: Boolean;
    seq: Number;
    lastUpdated: Date;
    dateCreated: Date;
}