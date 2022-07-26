export interface StarOrder {
    _id?: string;
    walletAdd: String; // wallet FAB/EXG address
    amount: Number;
    currency: String;
    campaignId: Number,
    status: Number; //0: waiting for payment, 1: payment made, 3: payment confirmed 4: completed - coins sent, 5: cancelled, 6: suspended
    lastUpdated?: Date;
    dateCreated?: Date;
}
