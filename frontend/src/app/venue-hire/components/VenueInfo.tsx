import LoadingSpinner from "./LoadingSpinner";

interface VenueInfoProps {
  isLoading?: boolean;
}

export default function VenueInfo({ isLoading = false }: VenueInfoProps) {
  if (isLoading) return <LoadingSpinner />;

  return (
    <section className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold text-dark-teal mb-4">
        Venue Information
      </h2>
      <div className="space-y-6">
        <div className="bg-light-teal p-4 rounded-lg">
          <h3 className="font-semibold text-dark-teal mb-2">Fees</h3>
          <ul className="space-y-2 text-dark-teal">
            <li>
              <span className="font-medium">Venue Hire:</span> K1300.00 payable
              <p className="text-sm italic ml-4">
                (venue booking is confirmed when payment is made in full)
              </p>
            </li>
            <li>
              <span className="font-medium">Bond Fee:</span> K500.00 payable
              prior to the day
            </li>
          </ul>
        </div>

        <div>
          <h3 className="font-semibold text-dark-teal mb-2">Inclusions</h3>
          <ul className="list-disc list-inside space-y-2 text-dark-teal">
            <li>1x portable BBQ set with full gas cylinder</li>
            <li>Club security provided (minimum 4 Guards)</li>
          </ul>
        </div>
      </div>
    </section>
  );
}
