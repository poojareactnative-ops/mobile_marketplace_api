"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildWhatsAppUrl = buildWhatsAppUrl;
/**
 * Formats phone number and message into a wa.me URL
 */
function buildWhatsAppUrl(phone, shopName, productName, productId, customerMessage) {
    // Strip non-digits from phone number
    let sanitizedPhone = phone.replace(/\D/g, '');
    // Default to India country code 91 if 10 digits
    if (sanitizedPhone.length === 10) {
        sanitizedPhone = `91${sanitizedPhone}`;
    }
    let text = `Hi ${shopName}`;
    if (productName) {
        text += `, I am interested in ${productName}`;
        if (productId) {
            text += ` (Ref: ${productId})`;
        }
        text += `.`;
    }
    if (customerMessage) {
        text += ` Message: ${customerMessage}`;
    }
    const encodedText = encodeURIComponent(text);
    const whatsappUrl = `https://wa.me/${sanitizedPhone}?text=${encodedText}`;
    return {
        whatsappNumber: sanitizedPhone,
        whatsappUrl,
    };
}
