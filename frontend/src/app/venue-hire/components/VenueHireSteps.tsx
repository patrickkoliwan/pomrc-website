import { FaWpforms, FaCheckCircle, FaMoneyBillWave } from "react-icons/fa";

export default function VenueHireSteps() {
  return (
    <section className="bg-white p-6 rounded-lg shadow-md mb-8">
      <h2 className="text-2xl font-semibold text-dark-teal mb-6">
        How to Book the Venue
      </h2>

      <div className="grid md:grid-cols-3 gap-8">
        {/* Step 1 */}
        <div className="flex flex-col items-center text-center p-6 bg-light-teal rounded-lg transition-transform hover:scale-105">
          <div className="text-dark-teal mb-4">
            <FaWpforms size={40} />
          </div>
          <h3 className="text-lg font-semibold text-dark-teal mb-2">
            1. Submit Form
          </h3>
          <p className="text-sm text-dark-teal">
            Fill out this venue hire form with your event details and
            requirements
          </p>
        </div>

        {/* Step 2 */}
        <div className="flex flex-col items-center text-center p-6 bg-light-teal rounded-lg transition-transform hover:scale-105">
          <div className="text-dark-teal mb-4">
            <FaCheckCircle size={40} />
          </div>
          <h3 className="text-lg font-semibold text-dark-teal mb-2">
            2. Await Approval
          </h3>
          <p className="text-sm text-dark-teal">
            The Social Director and Club Committee will review and approve your
            request
          </p>
        </div>

        {/* Step 3 */}
        <div className="flex flex-col items-center text-center p-6 bg-light-teal rounded-lg transition-transform hover:scale-105">
          <div className="text-dark-teal mb-4">
            <FaMoneyBillWave size={40} />
          </div>
          <h3 className="text-lg font-semibold text-dark-teal mb-2">
            3. Complete Payment
          </h3>
          <p className="text-sm text-dark-teal">
            Pay the venue hire fee (K1,300.00) and refundable bond (K500.00) to
            secure your booking
          </p>
        </div>
      </div>

      <div className="mt-6 p-4 bg-light-cream border border-muted-teal rounded-lg">
        <p className="text-sm text-dark-teal text-center">
          <span className="font-semibold">Note:</span> Your booking is only
          confirmed after approval and receipt of full payment. We recommend
          submitting your request well in advance of your event date.
        </p>
      </div>
    </section>
  );
}
