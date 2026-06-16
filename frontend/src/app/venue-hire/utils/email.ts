import {
  createEmailTransporter,
  escapeHtml,
  getEmailConfig,
} from '@/app/utils/email';
import { FormData } from '../page';

function createTableRow(label: string, value: string | number | boolean | undefined) {
  return `
    <tr>
      <td style="padding: 10px; border: 1px solid #ddd; width: 30%; background-color: #f9f9f9;">${escapeHtml(label)}</td>
      <td style="padding: 10px; border: 1px solid #ddd;">${escapeHtml(value)}</td>
    </tr>
  `;
}

function createSectionHeader(title: string) {
  return `
    <tr>
      <th colspan="2" style="padding: 15px; text-align: left; background-color: #1f5e5b; color: white; border: 1px solid #ddd;">
        ${escapeHtml(title)}
      </th>
    </tr>
  `;
}

export async function sendVenueHireEmail(data: FormData) {
  // Start building the HTML email content
  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto;">
      <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
        ${createSectionHeader('Personal Information')}
        ${createTableRow('Name', data.personalInfo.name)}
        ${createTableRow('Phone', data.personalInfo.phone)}
        ${createTableRow('Email', data.personalInfo.email)}

        ${createSectionHeader('Event Details')}
        ${createTableRow('Event Type', data.eventDetails.eventType)}
        ${createTableRow('Expected Number of Guests', data.eventDetails.expectedGuests)}

        ${createSectionHeader('Venue Selection')}
        ${createTableRow('Selected Venue', data.venueSelection.selectedVenue === 'events-lawn' ? 'Events Lawn' : 'Squash Courtyard')}
        ${createTableRow('Venue Capacity', data.venueSelection.selectedVenue === 'events-lawn' ? 'Up to 200 guests' : 'Up to 50 guests')}

        ${createSectionHeader('Terms & Conditions')}
        ${createTableRow('Terms Accepted', data.termsAccepted ? 'Yes' : 'No')}
      </table>
    </div>
  `;

  // Send the email
  const emailConfig = getEmailConfig();
  const transporter = createEmailTransporter(emailConfig);
  const mailOptions = {
    from: emailConfig.user,
    to: emailConfig.to,
    subject: `VENUE HIRE REQUEST - ${escapeHtml(data.personalInfo.name)}`,
    html: htmlContent,
  };

  try {
    await transporter.sendMail(mailOptions);
    return { success: true };
  } catch (error) {
    console.error('Error sending email:', error);
    throw new Error('Failed to send venue hire email');
  }
} 
