import { PAYMENT_CONTENT } from "@/app/membership/content/membership-content";
import {
  createEmailTransporter,
  escapeHtml,
  getEmailConfig,
} from "@/app/utils/email";
import type { MembershipApplicationRecord } from "@/lib/membership/types";

function createTableRow(label: string, value: string | undefined | null) {
  return `
    <tr>
      <td style="padding: 10px; border: 1px solid #ddd; width: 30%; background-color: #f9f9f9;">${escapeHtml(label)}</td>
      <td style="padding: 10px; border: 1px solid #ddd;">${escapeHtml(value ?? "")}</td>
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

function formatQuotedAmount(application: MembershipApplicationRecord): string {
  if (application.quoted_price_label) {
    return application.quoted_price_label;
  }

  if (application.quoted_amount != null) {
    return `K${application.quoted_amount}`;
  }

  return "As quoted on your application";
}

export async function sendMembershipApprovalEmail(
  application: MembershipApplicationRecord
) {
  const applicantName = `${application.first_name} ${application.surname}`;
  const quotedAmount = formatQuotedAmount(application);
  const bankDetailRows = PAYMENT_CONTENT.bankDetails
    .map((detail) => createTableRow(detail.label, detail.value))
    .join("");

  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto;">
      <p style="color: #1f5e5b; font-size: 16px; line-height: 1.5;">
        Dear ${escapeHtml(applicantName)},
      </p>
      <p style="color: #333; font-size: 15px; line-height: 1.6;">
        We are pleased to let you know that your Port Moresby Racquets Club membership application has been approved.
      </p>
      <p style="color: #333; font-size: 15px; line-height: 1.6;">
        Please complete your membership payment of <strong>${escapeHtml(quotedAmount)}</strong> using one of the options below.
      </p>
      <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
        ${createSectionHeader(PAYMENT_CONTENT.bankTransferHeading)}
        ${createTableRow("Instructions", PAYMENT_CONTENT.bankTransferIntro)}
        ${bankDetailRows}
      </table>
      <p style="color: #333; font-size: 15px; line-height: 1.6;">
        ${escapeHtml(PAYMENT_CONTENT.inPerson)}
      </p>
      <p style="color: #333; font-size: 15px; line-height: 1.6;">
        If you have any questions, please contact the club.
      </p>
      <p style="color: #1f5e5b; font-size: 15px; line-height: 1.6;">
        Port Moresby Racquets Club
      </p>
    </div>
  `;

  const emailConfig = getEmailConfig();
  const transporter = createEmailTransporter(emailConfig);

  await transporter.sendMail({
    from: emailConfig.from,
    to: application.email.trim(),
    subject: `POMRC Membership Approved - ${application.first_name} ${application.surname}`,
    html: htmlContent,
  });
}
