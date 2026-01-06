export declare class PaymentItemDto {
    itemType: string;
    itemId: string;
    itemName: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
    discount?: number;
    tax?: number;
}
export declare class CreatePaymentDto {
    clientId: string;
    appointmentId?: string;
    bookingId?: string;
    paymentReference: string;
    items: PaymentItemDto[];
    subtotal: number;
    totalDiscount?: number;
    totalTax?: number;
    serviceCharge?: number;
    totalAmount: number;
    paymentMethod: string;
    status?: string;
    transactionId?: string;
    processedBy?: string;
    notes?: string;
}
