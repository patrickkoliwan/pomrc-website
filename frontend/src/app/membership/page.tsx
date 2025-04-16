"use client";

import { useState } from "react";
import MembershipPerks from "./components/MembershipPerks";
import MembershipFormModal from "./components/MembershipFormModal"; // Adjusted path

export default function Membership() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <main className="min-h-screen bg-light-cream text-dark-teal">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Render Membership Perks */}
        <MembershipPerks />

        {/* Call to Action Button */}
        <div className="text-center mb-12">
          <button
            onClick={openModal}
            className="px-8 py-4 bg-dark-teal text-white text-lg font-semibold rounded-lg shadow-md hover:bg-muted-teal focus:outline-none focus:ring-2 focus:ring-dark-teal focus:ring-offset-2 transition duration-300"
          >
            Apply for Membership
          </button>
        </div>

        {/* Conditionally render the Modal */}
        {isModalOpen && <MembershipFormModal onClose={closeModal} />}
      </div>
    </main>
  );
}
