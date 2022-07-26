export interface StarPayment {
    _id?: string;
    orderId: String;
    amount: Number;
    currency: String;
    paymentMethod: String;
    transactionId: String;
    status: Number; // 0-failed, 1-marked as paid, 2-confirm received, 3-pending, 4-on held, 5-refunded
    lastUpdated?: Date;
    dateCreated?: Date;
}
