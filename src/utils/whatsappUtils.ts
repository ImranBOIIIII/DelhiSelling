interface FormData {
  [key: string]: string | number | boolean | undefined;
}

/**
 * Redirects to WhatsApp with form data
 * @param data - Form data to include in the message
 * @param formName - Name of the form (e.g., 'Contact Form', 'Bulk Order')
 * 
 * IMPORTANT: Replace the whatsappNumber below with your actual WhatsApp business number
 * in the format: COUNTRY_CODE + PHONE_NUMBER (no + or spaces)
 * Example: For US number (123) 456-7890, use '11234567890'
 */
export const redirectToWhatsApp = (data: FormData, formName: string) => {
  // Format the message with form data
  let message = `*New ${formName} Submission*\n\n`;
  
  // Add each form field to the message
  Object.entries(data).forEach(([key, value]) => {
    if (value !== undefined && value !== '') {
      // Format the key to be more readable (e.g., 'firstName' -> 'First Name')
      const formattedKey = key
        .replace(/([A-Z])/g, ' $1')
        .replace(/^./, str => str.toUpperCase())
        .trim();
      
      message += `*${formattedKey}:* ${value}\n`;
    }
  });

  // Encode the message for URL
  const encodedMessage = encodeURIComponent(message);
  const whatsappNumber = '  919205250069';
  
  // Open WhatsApp with the message
  window.open(`https://wa.me/${whatsappNumber}?text=${encodedMessage}`, '_blank');
};
