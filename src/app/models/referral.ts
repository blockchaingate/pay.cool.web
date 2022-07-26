export interface StarReferral {
    _id: string;  // wallet FAB/EXG address as _id, unique.
    parentId: String;  // Referral wallet FAB/EXG address
    referralCode: String; // not used so far.
    campaignId: Number,
    lastUpdated?: Date;
    dateCreated?: Date;
}
