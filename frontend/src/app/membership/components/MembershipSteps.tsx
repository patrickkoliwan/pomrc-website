import { FaWpforms, FaCheckCircle, FaMoneyBillWave } from "react-icons/fa";

export default function MembershipSteps() {
  return (
    <section className="rounded-lg bg-white p-4 shadow-md sm:p-6">
      <h2 className="mb-6 text-2xl font-semibold text-dark-teal sm:text-3xl">
        How to Join
      </h2>

      <div className="grid gap-4 md:grid-cols-3 md:gap-8">
        <div className="flex flex-col items-center rounded-lg bg-light-teal p-6 text-center transition-transform hover:scale-[1.02]">
          <div className="mb-4 text-dark-teal">
            <FaWpforms size={40} />
          </div>
          <h3 className="mb-2 text-lg font-semibold text-dark-teal">
            1. Submit Application
          </h3>
          <p className="text-sm text-dark-teal">
            Complete the online membership application with your details and
            preferred membership type.
          </p>
        </div>

        <div className="flex flex-col items-center rounded-lg bg-light-teal p-6 text-center transition-transform hover:scale-[1.02]">
          <div className="mb-4 text-dark-teal">
            <FaCheckCircle size={40} />
          </div>
          <h3 className="mb-2 text-lg font-semibold text-dark-teal">
            2. Await Approval
          </h3>
          <p className="text-sm text-dark-teal">
            The Club Committee will review and approve your membership
            application.
          </p>
        </div>

        <div className="flex flex-col items-center rounded-lg bg-light-teal p-6 text-center transition-transform hover:scale-[1.02]">
          <div className="mb-4 text-dark-teal">
            <FaMoneyBillWave size={40} />
          </div>
          <h3 className="mb-2 text-lg font-semibold text-dark-teal">
            3. Complete Payment
          </h3>
          <p className="text-sm text-dark-teal">
            Pay your annual membership fee via BSP transfer, EFTPOS, or cash at
            the bar.
          </p>
        </div>
      </div>

      <div className="mt-6 rounded-lg border border-muted-teal bg-light-cream p-4">
        <p className="text-center text-sm text-dark-teal">
          <span className="font-semibold">Note:</span> Membership is confirmed
          only after committee approval and receipt of payment.
        </p>
      </div>
    </section>
  );
}
