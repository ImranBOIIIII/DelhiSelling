/**
 * Generates a unique order number using timestamp and random components
 * Format: ORD-YYYYMMDD-XXXXX (e.g., ORD-20251030-A3B9F)
 * 
 * @returns A unique order number string
 */
export function generateOrderNumber(): string {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  
  // Generate a random 5-character alphanumeric string
  const randomPart = Math.random().toString(36).substring(2, 7).toUpperCase();
  
  return `ORD-${year}${month}${day}-${randomPart}`;
}

/**
 * Validates if a string is a valid order number format
 * 
 * @param orderNumber - The order number to validate
 * @returns True if valid, false otherwise
 */
export function isValidOrderNumber(orderNumber: string): boolean {
  const orderNumberPattern = /^ORD-\d{8}-[A-Z0-9]{5}$/;
  return orderNumberPattern.test(orderNumber);
}

/**
 * Extracts the date from an order number
 * 
 * @param orderNumber - The order number to extract date from
 * @returns Date object or null if invalid
 */
export function getOrderDate(orderNumber: string): Date | null {
  if (!isValidOrderNumber(orderNumber)) {
    return null;
  }
  
  const datePart = orderNumber.split('-')[1];
  const year = parseInt(datePart.substring(0, 4));
  const month = parseInt(datePart.substring(4, 6)) - 1;
  const day = parseInt(datePart.substring(6, 8));
  
  return new Date(year, month, day);
}
