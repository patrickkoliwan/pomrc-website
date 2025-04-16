"use client";

import { useState } from "react";
import Modal from "./Modal";
import TermsContent from "./TermsContent";

export default function TermsDisplay() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleClose = () => {
    setIsModalOpen(false);
  };

  return (
    <section className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold text-dark-teal mb-4">
        Key Terms and Conditions
      </h2>
      <div className="space-y-6">
        <div className="text-dark-teal">
          <div className="bg-light-teal p-4 rounded-lg space-y-4">
            <h3 className="font-semibold text-dark-teal">Important Points:</h3>
            <ul className="list-disc list-inside space-y-2">
              <li>
                Bond Fee (K500.00) is refundable subject to compliance with
                terms
              </li>
              <li>All drinks must be purchased at the POMRC Club Bar</li>
              <li>Maximum capacity is 200 guests</li>
              <li>Venue must be vacated by designated ending time</li>
              <li>No outside food or drinks allowed</li>
            </ul>
          </div>

          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="mt-4 text-deep-red hover:text-muted-teal transition-colors text-sm underline"
          >
            Read Full Terms and Conditions
          </button>
        </div>

        <p className="text-dark-teal">
          The hirer agrees to &ldquo;make good&rdquo; any damage caused to the
          facility during the hire period.
        </p>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={handleClose}
        title="Full Terms and Conditions"
      >
        <TermsContent />
      </Modal>
    </section>
  );
}
