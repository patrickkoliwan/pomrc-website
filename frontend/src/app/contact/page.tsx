"use client";

import { useState, useCallback, useEffect } from "react";
import { useForm } from "react-hook-form";
import dynamic from "next/dynamic";
import { isValidPhoneOrEmail } from "@/app/utils/contactValidation";
import {
  addressLine1,
  addressLine2,
  clubName,
  googleMapsEmbedUrl,
} from "@/lib/site";

interface GoogleMapProps extends React.IframeHTMLAttributes<HTMLIFrameElement> {
  className?: string;
}

// Lazy load the map component
const GoogleMap = dynamic(
  () =>
    Promise.resolve(({ className, ...props }: GoogleMapProps) => (
      <div className={`aspect-w-16 aspect-h-12 ${className}`}>
        <iframe {...props} className="rounded-md" />
      </div>
    )),
  {
    ssr: false,
    loading: () => (
      <div className="aspect-w-16 aspect-h-12 bg-light-teal animate-pulse rounded-md" />
    ),
  }
);

type FormData = {
  name: string;
  contact: string;
  enquiryType: string;
  enquiry: string;
  honeypot: string; // Spam prevention
};

type EnquiryOption = {
  value: string;
  label: string;
};

const fallbackEnquiryOptions: EnquiryOption[] = [
  { value: "general", label: "General enquiry" },
  { value: "membership", label: "Membership" },
  { value: "venue-hire", label: "Venue hire" },
  { value: "junior-programs", label: "Junior programs" },
];

export default function Contact() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"success" | "error" | null>(
    null
  );
  const [submitCount, setSubmitCount] = useState(0);
  const [lastSubmitTime, setLastSubmitTime] = useState(0);
  const [enquiryOptions, setEnquiryOptions] = useState(fallbackEnquiryOptions);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>();

  useEffect(() => {
    fetch("/api/contact-routing")
      .then((response) => (response.ok ? response.json() : null))
      .then((result) => {
        if (result?.data?.length) {
          setEnquiryOptions(result.data);
        }
      })
      .catch(() => {
        setEnquiryOptions(fallbackEnquiryOptions);
      });
  }, []);

  // Rate limiting function
  const checkRateLimit = useCallback(() => {
    const now = Date.now();
    const timeSinceLastSubmit = now - lastSubmitTime;
    const RATE_LIMIT_WINDOW = 60000; // 1 minute
    const MAX_SUBMISSIONS = 3; // Max 3 submissions per minute

    if (
      submitCount >= MAX_SUBMISSIONS &&
      timeSinceLastSubmit < RATE_LIMIT_WINDOW
    ) {
      return false;
    }

    if (timeSinceLastSubmit >= RATE_LIMIT_WINDOW) {
      setSubmitCount(1);
    } else {
      setSubmitCount((prev) => prev + 1);
    }
    setLastSubmitTime(now);
    return true;
  }, [submitCount, lastSubmitTime]);

  const onSubmit = async (data: FormData) => {
    try {
      // Check for honeypot
      if (data.honeypot) {
        return;
      }

      // Check rate limiting
      if (!checkRateLimit()) {
        setSubmitStatus("error");
        return;
      }

      setIsSubmitting(true);
      setSubmitStatus(null);

      // Sanitize data
      const sanitizedData = {
        name: data.name.trim(),
        contact: data.contact.trim(),
        enquiryType: data.enquiryType,
        enquiry: data.enquiry.trim(),
      };

      // Here you would typically send the data to your backend
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(sanitizedData),
      });

      if (!response.ok) {
        throw new Error("Failed to submit form");
      }

      setSubmitStatus("success");
      reset();
    } catch (error) {
      setSubmitStatus("error");
      console.error("Form submission error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-light-cream">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-bold text-dark-teal mb-8">Contact Us</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Contact Form */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Honeypot field - hidden from users */}
              <input
                type="text"
                {...register("honeypot")}
                className="hidden"
                tabIndex={-1}
                aria-hidden="true"
              />

              <div>
                <label
                  htmlFor="name"
                  className="block text-dark-teal font-medium mb-2"
                >
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  {...register("name", {
                    required: "Name is required",
                    maxLength: {
                      value: 100,
                      message: "Name is too long",
                    },
                  })}
                  className="w-full px-4 py-2 border border-muted-teal rounded-md focus:outline-none focus:ring-2 focus:ring-dark-teal"
                  aria-describedby={errors.name ? "name-error" : undefined}
                />
                {errors.name && (
                  <p
                    id="name-error"
                    className="mt-1 text-deep-red text-sm"
                    role="alert"
                  >
                    {errors.name.message}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="contact"
                  className="block text-dark-teal font-medium mb-2"
                >
                  Phone or Email <span className="text-deep-red">*</span>
                </label>
                <input
                  type="text"
                  id="contact"
                  {...register("contact", {
                    required: "Phone or Email is required",
                    validate: (value) =>
                      isValidPhoneOrEmail(value) ||
                      "Please enter a valid phone number or email address",
                    maxLength: {
                      value: 100,
                      message: "Contact information is too long",
                    },
                  })}
                  className="w-full px-4 py-2 border border-muted-teal rounded-md focus:outline-none focus:ring-2 focus:ring-dark-teal"
                  aria-describedby={
                    errors.contact ? "contact-error" : undefined
                  }
                />
                {errors.contact && (
                  <p
                    id="contact-error"
                    className="mt-1 text-deep-red text-sm"
                    role="alert"
                  >
                    {errors.contact.message}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="enquiryType"
                  className="block text-dark-teal font-medium mb-2"
                >
                  Enquiry Type <span className="text-deep-red">*</span>
                </label>
                <select
                  id="enquiryType"
                  defaultValue="general"
                  {...register("enquiryType", {
                    required: "Enquiry type is required",
                  })}
                  className="w-full px-4 py-2 border border-muted-teal rounded-md focus:outline-none focus:ring-2 focus:ring-dark-teal"
                >
                  {enquiryOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                {errors.enquiryType && (
                  <p className="mt-1 text-deep-red text-sm" role="alert">
                    {errors.enquiryType.message}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="enquiry"
                  className="block text-dark-teal font-medium mb-2"
                >
                  Enquiry
                </label>
                <textarea
                  id="enquiry"
                  rows={4}
                  {...register("enquiry", {
                    required: "Enquiry is required",
                    maxLength: {
                      value: 1000,
                      message: "Enquiry is too long",
                    },
                  })}
                  className="w-full px-4 py-2 border border-muted-teal rounded-md focus:outline-none focus:ring-2 focus:ring-dark-teal resize-none"
                  aria-describedby={
                    errors.enquiry ? "enquiry-error" : undefined
                  }
                />
                {errors.enquiry && (
                  <p
                    id="enquiry-error"
                    className="mt-1 text-deep-red text-sm"
                    role="alert"
                  >
                    {errors.enquiry.message}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full py-3 px-4 rounded-md text-white font-medium transition-colors
                  ${
                    isSubmitting
                      ? "bg-muted-teal cursor-not-allowed"
                      : "bg-dark-teal hover:bg-muted-teal"
                  }`}
                aria-busy={isSubmitting}
              >
                {isSubmitting ? "Sending..." : "Send Message"}
              </button>

              {submitStatus === "success" && (
                <p className="text-green-600 text-center" role="status">
                  Message sent successfully!
                </p>
              )}
              {submitStatus === "error" && (
                <p className="text-deep-red text-center" role="alert">
                  Failed to send message. Please try again later.
                </p>
              )}
            </form>
          </div>

          {/* Google Maps */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <GoogleMap
              src={googleMapsEmbedUrl}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
            <div className="mt-4">
              <h3 className="text-lg font-medium text-dark-teal mb-2">
                Visit Us
              </h3>
              <p className="text-muted-teal">{clubName}</p>
              <p className="text-muted-teal">{addressLine1}</p>
              <p className="text-muted-teal">{addressLine2}</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
