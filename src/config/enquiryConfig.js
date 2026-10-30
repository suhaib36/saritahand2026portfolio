/**
 * Sarita Handa - Enquiry & Concierge Service Configuration
 * Destination Email: suhaib.ishrat36@gmail.com
 * 
 * You can enable instant live email delivery by obtaining a free access key from:
 * 1. Web3Forms: https://web3forms.com (takes 10 seconds, no password needed, free tier sends to suhaib.ishrat36@gmail.com)
 *    Put your key in .env as: VITE_WEB3FORMS_ACCESS_KEY=your_key_here
 * OR
 * 2. Formspree: https://formspree.io
 *    Put your endpoint in .env as: VITE_FORMSPREE_ENDPOINT=https://formspree.io/f/your_form_id
 */

export const ENQUIRY_CONFIG = {
  // Official destination email for all product and showroom inquiries
  destinationEmail: "suhaib.ishrat36@gmail.com",
  
  // Brand Concierge Details
  brandName: "Sarita Handa",
  conciergePhone: "+91 11 4052 4750",
  conciergeWhatsApp: "+91 98112 34567",
  conciergeHours: "Mon – Sat, 10:00 AM – 7:30 PM IST",

  // Service Provider: 'web3forms' | 'formspree'
  provider: import.meta.env.VITE_ENQUIRY_PROVIDER || "web3forms",

  // Web3Forms configuration
  // Generate a key at https://web3forms.com with email: suhaib.ishrat36@gmail.com
  web3formsKey: import.meta.env.VITE_WEB3FORMS_ACCESS_KEY || "3626f012-c711-47d5-8382-aff3f8b9414c",

  // Formspree endpoint URL (e.g., https://formspree.io/f/xyzabc)
  formspreeEndpoint: import.meta.env.VITE_FORMSPREE_ENDPOINT || "",

  // Flag indicating if live email transmission is configured
  isLiveConfigured: true,
};
