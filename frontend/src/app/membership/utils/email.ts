import {
  createEmailTransporter,
  escapeHtml,
  getEmailConfig,
} from '@/app/utils/email';
import { MembershipFormData } from './types';

function createTableRow(label: string, value: string | undefined | boolean) {
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

function formatPlayingLevel(level: string) {
  return level.replace(/_/g, ' ');
}

export async function sendMembershipEmail(data: MembershipFormData) {
  // Start building the HTML email content
  let htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto;">
      <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
        ${createSectionHeader('Personal Information')}
        ${createTableRow('First Name', data.personalInfo.firstName)}
        ${createTableRow('Surname', data.personalInfo.surname)}
        ${createTableRow('Phone', data.personalInfo.phone)}
        ${createTableRow('Email', data.personalInfo.email)}
        ${createTableRow('Address', data.personalInfo.address)}

        ${createSectionHeader('Membership Details')}
        ${createTableRow('Membership Status', data.membershipStatus.toUpperCase())}
        ${createTableRow('Membership Type', data.membershipType.replace(/_/g, ' '))}
  `;

  // Add family details if present
  if (data.familyDetails) {
    if (data.familyDetails.spouse) {
      htmlContent += `
        ${createSectionHeader('Spouse Details')}
        ${createTableRow('Name', data.familyDetails.spouse.name)}
        ${createTableRow('Gender', data.familyDetails.spouse.gender)}
        ${createTableRow('Playing Level', formatPlayingLevel(data.familyDetails.spouse.playingLevel))}
      `;
    }

    if (data.familyDetails.children && data.familyDetails.children.length > 0) {
      htmlContent += createSectionHeader('Children Details');
      data.familyDetails.children.forEach((child, index) => {
        htmlContent += `
          ${createTableRow(`Child ${index + 1} Name`, child.name)}
          ${createTableRow(`Child ${index + 1} Gender`, child.gender)}
          ${createTableRow(`Child ${index + 1} Date of Birth`, child.dateOfBirth)}
          ${createTableRow(`Child ${index + 1} Playing Level`, formatPlayingLevel(child.playingLevel))}
        `;
      });
    }
  }

  // Add endorsements if present for new members
  if (data.endorsements) {
    htmlContent += `
      ${createSectionHeader('Endorsements')}
      ${createTableRow('First Endorser Name', data.endorsements.firstEndorser.name)}
      ${createTableRow('First Endorser Contact', data.endorsements.firstEndorser.contact)}
      ${createTableRow('Second Endorser Name', data.endorsements.secondEndorser.name)}
      ${createTableRow('Second Endorser Contact', data.endorsements.secondEndorser.contact)}
    `;
  }

  // Add club involvement
  htmlContent += `
    ${createSectionHeader('Club Involvement')}
    ${createTableRow('Interested in Club Officer Role', data.clubInvolvement.interestedInClubOfficer)}
    ${createTableRow('Skills', data.clubInvolvement.skills)}

    ${createSectionHeader('Declaration')}
    ${createTableRow('Agreed to Terms', data.declaration)}
  `;

  // Close the table and div
  htmlContent += `
      </table>
    </div>
  `;

  // Send the email
  const emailConfig = getEmailConfig();
  const transporter = createEmailTransporter(emailConfig);
  const mailOptions = {
    from: emailConfig.user,
    to: emailConfig.to,
    subject: `MEMBERSHIP REQUEST - ${escapeHtml(data.personalInfo.firstName)} ${escapeHtml(data.personalInfo.surname)}`,
    html: htmlContent,
  };

  try {
    await transporter.sendMail(mailOptions);
    return { success: true };
  } catch (error) {
    console.error('Error sending email:', error);
    throw new Error('Failed to send membership email');
  }
} 
