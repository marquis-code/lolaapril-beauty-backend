export declare class SaleItemDto {
    itemType: string;
    itemId: string;
    itemName: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
    discount?: number;
    tax?: number;
    staffId?: string;
    staffName?: string;
    commission?: number;
}
export declare class CreateSaleDto {
    saleNumber: string;
    clientId: string;
    appointmentId?: string;
    bookingId?: string;
    items: SaleItemDto[];
    subtotal: number;
    totalDiscount?: number;
    totalTax?: number;
    serviceCharge?: number;
    totalAmount: number;
    amountPaid: number;
    amountDue?: number;
    paymentStatus?: string;
    status?: string;
    createdBy: string;
    notes?: string;
}
