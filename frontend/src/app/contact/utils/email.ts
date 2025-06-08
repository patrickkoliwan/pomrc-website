import nodemailer from 'nodemailer';

interface ContactFormData {
  name: string;
  contact: string;
  enquiry: string;
}

// Create reusable transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'pngtennis.raffle2025@gmail.com',
    pass: process.env.EMAIL_PASSWORD // App-specific password from Gmail
  }
});

function createTableRow(label: string, value: string | undefined) {
  return `
    <tr>
      <td style="padding: 10px; border: 1px solid #ddd; width: 30%; background-color: #f9f9f9;">${label}</td>
      <td style="padding: 10px; border: 1px solid #ddd;">${value || ''}</td>
    </tr>
  `;
}

function createSectionHeader(title: string) {
  return `
    <tr>
      <th colspan="2" style="padding: 15px; text-align: left; background-color: #1f5e5b; color: white; border: 1px solid #ddd;">
        ${title}
      </th>
    </tr>
  `;
}

export async function sendContactEmail(data: ContactFormData) {
  // Start building the HTML email content
  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto;">
      <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
        ${createSectionHeader('Contact Information')}
        ${createTableRow('Name', data.name)}
        ${createTableRow('Contact (Phone/Email)', data.contact)}

        ${createSectionHeader('Enquiry Details')}
        ${createTableRow('Message', data.enquiry)}
      </table>
    </div>
  `;

  // Send the email
  const mailOptions = {
    from: 'pngtennis.raffle2025@gmail.com',
    to: 'pngtennis.raffle2025@gmail.com',
    subject: `ENQUIRY - ${data.name}`,
    html: htmlContent,
  };

  try {
    await transporter.sendMail(mailOptions);
    return { success: true };
  } catch (error) {
    console.error('Error sending email:', error);
    throw new Error('Failed to send contact email');
  }
} 