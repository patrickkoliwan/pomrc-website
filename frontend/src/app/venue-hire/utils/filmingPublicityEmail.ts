import {
  createEmailTransporter,
  escapeHtml,
  getEmailConfig,
} from "@/app/utils/email";
import { getHireVenueLabel } from "@/data/hireVenues";
import { getPremisesAreaLabel } from "@/data/premisesAreas";
import { FilmingPublicityFormData } from "./filmingPublicitySchema";

const DIRECTOR_CC = [
  "pomrcsquashdirector@gmail.com",
  "pomracquetsclub@gmail.com",
];

function createTableRow(
  label: string,
  value: string | number | boolean | undefined
) {
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

function formatLocation(data: FilmingPublicityFormData): string {
  const { locationType, specificArea, specificAreaOther } =
    data.locationSelection;

  if (locationType === "events-lawn" || locationType === "squash-courtyard") {
    return getHireVenueLabel(locationType);
  }

  if (specificArea === "other" && specificAreaOther?.trim()) {
    return specificAreaOther.trim();
  }

  return specificArea ? getPremisesAreaLabel(specificArea) : "Not specified";
}

function formatDuration(durationType: string): string {
  return durationType === "half-day"
    ? "Half Day (K500)"
    : "Full Day (K1,000)";
}

export async function sendFilmingPublicityEmail(data: FilmingPublicityFormData) {
  const peopleRows = data.peopleOnGrounds
    .map(
      (person, index) =>
        createTableRow(
          `Person ${index + 1}`,
          `${person.name} — ${person.position}`
        )
    )
    .join("");

  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto;">
      <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
        ${createSectionHeader("Applicant Information")}
        ${createTableRow("Applicant Name", data.applicantInfo.name)}
        ${createTableRow("Phone", data.applicantInfo.phone)}
        ${createTableRow("Email", data.applicantInfo.email)}

        ${createSectionHeader("Production Details")}
        ${createTableRow("Purpose of Production", data.productionPurpose)}
        ${createTableRow("Area Requested", formatLocation(data))}
        ${createTableRow("Date", data.activityDate)}
        ${createTableRow("Start Time", data.activityStartTime)}
        ${createTableRow("End Time", data.activityEndTime)}
        ${createTableRow("Duration / Fee", formatDuration(data.durationType))}
        ${createTableRow("Organization", data.organization)}
        ${createTableRow("Contact Details", data.contactDetails)}
        ${createTableRow(
          "POMRC Member Involved",
          data.pomrcMemberInvolved || "N/A"
        )}

        ${createSectionHeader("People on POMRC Grounds")}
        ${peopleRows}

        ${createSectionHeader("Acknowledgements")}
        ${createTableRow("Fees Acknowledged", data.acknowledgements.feesAcknowledged ? "Yes" : "No")}
        ${createTableRow("Damages & Tidiness Acknowledged", data.acknowledgements.damagesAndTidyAcknowledged ? "Yes" : "No")}
        ${createTableRow("Insurance Certificate Acknowledged", data.acknowledgements.insuranceAcknowledged ? "Yes" : "No")}
        ${createTableRow("Committee Approval Acknowledged", data.acknowledgements.committeeApprovalAcknowledged ? "Yes" : "No")}
      </table>
    </div>
  `;

  const emailConfig = getEmailConfig();
  const transporter = createEmailTransporter(emailConfig);
  const mailOptions = {
    from: emailConfig.user,
    to: emailConfig.to,
    cc: DIRECTOR_CC.join(", "),
    subject: `POMRC FILMING/PUBLICITY APPLICATION - ${escapeHtml(data.applicantInfo.name)}`,
    html: htmlContent,
  };

  try {
    await transporter.sendMail(mailOptions);
    return { success: true };
  } catch (error) {
    console.error("Error sending filming/publicity email:", error);
    throw new Error("Failed to send filming and publicity application email");
  }
}
