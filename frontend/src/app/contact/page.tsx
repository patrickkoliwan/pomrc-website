"use client";

import { useState, useCallback } from "react";
import { useForm } from "react-hook-form";
import dynamic from "next/dynamic";

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
  enquiry: string;
  honeypot: string; // Spam prevention
};

export default function Contact() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"success" | "error" | null>(
    null
  );
  const [submitCount, setSubmitCount] = useState(0);
  const [lastSubmitTime, setLastSubmitTime] = useState(0);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>();

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
        console.log("Spam detected");
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
                    pattern: {
                      value: /^(\+?[\d\s-]+|\w+@\w+\.\w{2,3})$/,
                      message:
                        "Please enter a valid phone number or email address",
                    },
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
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3935.3743960284323!2d147.20059828293876!3d-9.4761270751332!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x690236b85f5f7729%3A0xd6ae37f22b23fbb5!2sPort%20Moresby%20Raquets%20Club%20Bava%20St%2C%20Boroko!5e0!3m2!1sen!2spg!4v1743198276873!5m2!1sen!2spg"
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
              <p className="text-muted-teal">Port Moresby Raquets Club</p>
              <p className="text-muted-teal">Bava Street, Boroko</p>
              <p className="text-muted-teal">Port Moresby, Papua New Guinea</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
