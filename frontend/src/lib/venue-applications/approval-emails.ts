import {
  createEmailTransporter,
  escapeHtml,
  getEmailConfig,
} from "@/app/utils/email";
import { getHireVenueLabel } from "@/data/hireVenues";
import { getPremisesAreaLabel } from "@/data/premisesAreas";
import type {
  FilmingApplicationRecord,
  VenueHireApplicationRecord,
} from "./types";
import { durationTypeLabels, locationTypeLabels } from "./types";

function createTableRow(label: string, value: string | undefined | null) {
  return `
    <tr>
      <td style="padding: 10px; border: 1px solid #ddd; width: 30%; background-color: #f9f9f9;">${escapeHtml(label)}</td>
      <td style="padding: 10px; border: 1px solid #ddd;">${escapeHtml(value ?? "")}</td>
    </tr>
  `;
}

function formatFilmingLocation(application: FilmingApplicationRecord): string {
  const data = application.submitted_data;
  const base =
    locationTypeLabels[data.locationSelection.locationType] ??
    data.locationSelection.locationType;

  if (data.locationSelection.locationType === "other-area") {
    if (data.locationSelection.specificArea === "other") {
      return `${base}: ${data.locationSelection.specificAreaOther ?? ""}`;
    }
    if (data.locationSelection.specificArea) {
      return `${base}: ${getPremisesAreaLabel(data.locationSelection.specificArea)}`;
    }
  }

  return base;
}

export async function sendVenueHireApprovalEmail(
  application: VenueHireApplicationRecord
) {
  const data = application.submitted_data;
  const venueLabel = getHireVenueLabel(data.venueSelection.selectedVenue);

  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto;">
      <p style="color: #1f5e5b; font-size: 16px; line-height: 1.5;">
        Dear ${escapeHtml(application.name)},
      </p>
      <p style="color: #333; font-size: 15px; line-height: 1.6;">
        We are pleased to let you know that your Port Moresby Racquets Club venue hire request has been approved.
      </p>
      <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
        ${createTableRow("Event type", data.eventDetails.eventType)}
        ${createTableRow("Expected guests", String(data.eventDetails.expectedGuests))}
        ${createTableRow("Venue", venueLabel)}
      </table>
      <p style="color: #333; font-size: 15px; line-height: 1.6;">
        To confirm your booking, please complete payment of:
      </p>
      <ul style="color: #333; font-size: 15px; line-height: 1.6;">
        <li><strong>Venue hire fee:</strong> K1,300.00 (booking is confirmed when payment is made in full)</li>
        <li><strong>Bond fee:</strong> K500.00 payable prior to the day of your event</li>
      </ul>
      <p style="color: #333; font-size: 15px; line-height: 1.6;">
        Please contact the club to arrange payment. If you have any questions, reply to this email or call the POMRC office.
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
    to: application.email,
    subject: "POMRC Venue Hire Request Approved",
    html: htmlContent,
  });
}

export async function sendFilmingApprovalEmail(
  application: FilmingApplicationRecord
) {
  const data = application.submitted_data;
  const feeLabel =
    durationTypeLabels[data.durationType] ?? data.durationType;
  const locationLabel = formatFilmingLocation(application);

  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto;">
      <p style="color: #1f5e5b; font-size: 16px; line-height: 1.5;">
        Dear ${escapeHtml(application.name)},
      </p>
      <p style="color: #333; font-size: 15px; line-height: 1.6;">
        We are pleased to let you know that your Port Moresby Racquets Club filming and publicity application has received initial approval.
      </p>
      <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
        ${createTableRow("Organization", data.organization)}
        ${createTableRow("Activity date", data.activityDate)}
        ${createTableRow("Time", `${data.activityStartTime} – ${data.activityEndTime}`)}
        ${createTableRow("Duration / fee", feeLabel)}
        ${createTableRow("Location", locationLabel)}
      </table>
      <p style="color: #333; font-size: 15px; line-height: 1.6;">
        Please complete payment of the applicable application fee. A damages liability bond of 50% is incorporated in the application fee.
      </p>
      <p style="color: #333; font-size: 15px; line-height: 1.6;">
        <strong>Important:</strong> Do not proceed with filming, photography, or publicity activity until you receive written confirmation of final committee approval from the club.
      </p>
      <p style="color: #333; font-size: 15px; line-height: 1.6;">
        If you have any questions, please contact the Tennis/Squash Director or the club office.
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
    to: application.email,
    subject: "POMRC Filming & Publicity Application Approved",
    html: htmlContent,
  });
}
