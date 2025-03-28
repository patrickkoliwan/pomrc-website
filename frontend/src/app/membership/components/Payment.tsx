import LoadingSpinner from "./LoadingSpinner";

interface PaymentProps {
  isLoading?: boolean;
}

export default function Payment({ isLoading = false }: PaymentProps) {
  if (isLoading) return <LoadingSpinner />;

  return (
    <section className="bg-deep-red p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold text-light-cream mb-4">
        Payment Information
      </h2>
      <div className="bg-light-cream p-4 rounded-lg space-y-3">
        <p className="text-dark-teal font-medium">
          Please make payment direct to BSP Waigani Banking Centre
        </p>
        <div className="bg-light-teal p-3 rounded-md">
          <p className="text-dark-teal font-bold">
            Account Name:{" "}
            <span className="font-mono">Port Moresby Tennis Club</span>
            <br />
            BSB: <span className="font-mono">8202</span>
            <br />
            Account Number: <span className="font-mono">1000583581</span>
          </p>
          <p className="text-dark-teal mt-1 italic">
            Please include your name as reference
          </p>
        </div>
        <p className="text-dark-teal font-medium">
          Or EFTPOS or cash payment at the bar. A receipt will be issued upon
          payment.
        </p>
      </div>
    </section>
  );
}
