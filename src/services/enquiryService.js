import { ENQUIRY_CONFIG } from '../config/enquiryConfig';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

/**
 * Validates enquiry input fields
 * @param {Object} formData
 * @returns {{ isValid: boolean, errors: Object }}
 */
export function validateEnquiryForm(formData) {
  const errors = {};

  // Honeypot spam test - bots typically fill this hidden field
  if (formData.botField && formData.botField.trim() !== '') {
    errors.botField = 'Automated submission detected.';
    return { isValid: false, errors };
  }

  // Full Name validation
  if (!formData.fullName || formData.fullName.trim().length < 2) {
    errors.fullName = 'Please enter your full name (at least 2 characters).';
  }

  // Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!formData.email || !emailRegex.test(formData.email.trim())) {
    errors.email = 'Please provide a valid email address.';
  }

  // Phone validation (optional, but if present must be reasonable)
  if (formData.phone && formData.phone.trim().length > 0) {
    const cleanPhone = formData.phone.replace(/[\s\-\+\(\)]/g, '');
    if (cleanPhone.length < 7 || cleanPhone.length > 15 || !/^\d+$/.test(cleanPhone)) {
      errors.phone = 'Please enter a valid phone number (7-15 digits).';
    }
  }

  // Message validation
  if (!formData.message || formData.message.trim().length < 5) {
    errors.message = 'Please provide details regarding your enquiry (at least 5 characters).';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

/**
 * Submits enquiry to the designated email (suhaib.ishrat36@gmail.com)
 * via Web3Forms or Formspree
 * @param {Object} data
 * @returns {Promise<{ success: boolean, message?: string, simulated?: boolean, error?: string }>}
 */
export async function submitEnquiry(data) {
  // Step 1: Client-side validation
  const validation = validateEnquiryForm(data);
  if (!validation.isValid) {
    return {
      success: false,
      error: Object.values(validation.errors)[0] || 'Validation failed. Please check form entries.',
      validationErrors: validation.errors,
    };
  }

  const payload = {
    destination: ENQUIRY_CONFIG.destinationEmail,
    fullName: data.fullName.trim(),
    email: data.email.trim(),
    phone: data.phone ? data.phone.trim() : 'Not provided',
    productName: data.productName ? data.productName.trim() : 'General Portfolio / Design Consultation',
    category: data.category || 'N/A',
    enquiryType: data.enquiryType || 'Product Availability & Bespoke Enquiry',
    quantity: data.quantity || '1',
    message: data.message.trim(),
    shortlist: data.shortlist || null,
    submittedAt: new Date().toISOString(),
  };

  // Step 2A: Store enquiry into Supabase database if configured
  if (isSupabaseConfigured && supabase) {
    try {
      const { error: dbError } = await supabase
        .from('enquiries')
        .insert([
          {
            customer_name: payload.fullName,
            full_name: payload.fullName,
            customer_email: payload.email,
            email: payload.email,
            customer_phone: payload.phone,
            phone: payload.phone,
            product_id: data.productId || null,
            product_name: payload.productName,
            product_image: data.productImage || null,
            category: payload.category,
            enquiry_type: payload.enquiryType,
            quantity: payload.quantity,
            message: payload.message,
            shortlist: payload.shortlist,
            status: 'new',
            updated_at: payload.submittedAt,
          },
        ]);
      if (dbError) {
        console.warn('Supabase enquiry record warning:', dbError.message);
      } else {
        console.info('Enquiry persisted into Supabase enquiries table.');
      }
    } catch (dbErr) {
      console.warn('Supabase service error:', dbErr.message);
    }
  }

  // Step 2B: Live email dispatch if Web3Forms is provided
  if (ENQUIRY_CONFIG.web3formsKey) {
    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          access_key: ENQUIRY_CONFIG.web3formsKey,
          subject: `Sarita Handa Enquiry: ${payload.productName} from ${payload.fullName}`,
          from_name: `${payload.fullName} via Sarita Handa Portfolio`,
          replyto: payload.email,
          to: ENQUIRY_CONFIG.destinationEmail,
          name: payload.fullName,
          email: payload.email,
          phone: payload.phone,
          product_name: payload.productName,
          category: payload.category,
          enquiry_type: payload.enquiryType,
          quantity: payload.quantity,
          message: payload.message,
          timestamp: payload.submittedAt,
        }),
      });

      let result;
      try {
        result = await response.json();
      } catch (jsonErr) {
        result = { success: false, message: 'Unexpected response format from submission service.' };
      }

      if (response.ok && result.success) {
        return {
          success: true,
          simulated: false,
          destination: ENQUIRY_CONFIG.destinationEmail,
          message: `Your enquiry has been successfully delivered to our concierge team at ${ENQUIRY_CONFIG.destinationEmail}. A senior textile consultant will reach out to you within 24 hours.`,
        };
      } else {
        return {
          success: false,
          error: result.message || 'Transmission failed. Please verify your details or reach out directly to our showroom.',
        };
      }
    } catch (err) {
      return {
        success: false,
        error: `Network error: ${err.message}. Please check your connection.`,
      };
    }
  }

  if (ENQUIRY_CONFIG.formspreeEndpoint) {
    try {
      const response = await fetch(ENQUIRY_CONFIG.formspreeEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          name: payload.fullName,
          email: payload.email,
          phone: payload.phone,
          product: payload.productName,
          message: payload.message,
          destination: ENQUIRY_CONFIG.destinationEmail,
        }),
      });

      if (response.ok) {
        return {
          success: true,
          simulated: false,
          destination: ENQUIRY_CONFIG.destinationEmail,
          message: `Your enquiry has been delivered via Formspree to ${ENQUIRY_CONFIG.destinationEmail}. We will be in touch shortly.`,
        };
      } else {
        return {
          success: false,
          error: 'Formspree rejected the submission. Please verify your Formspree endpoint.',
        };
      }
    } catch (err) {
      return {
        success: false,
        error: `Network error: ${err.message}`,
      };
    }
  }

  // Step 3: Clear configuration guidance when no key is entered yet.
  // We do not fake delivery: we clearly indicate validation succeeded and highlight the exact setup.
  await new Promise((resolve) => setTimeout(resolve, 800));

  console.info('Sarita Handa Enquiry Processed (Config Pending):', payload);

  return {
    success: true,
    simulated: true,
    destination: ENQUIRY_CONFIG.destinationEmail,
    payload,
    message: `Enquiry successfully prepared for ${ENQUIRY_CONFIG.destinationEmail}. (To activate instant live email dispatch to your inbox, set VITE_WEB3FORMS_ACCESS_KEY in .env).`,
  };
}
