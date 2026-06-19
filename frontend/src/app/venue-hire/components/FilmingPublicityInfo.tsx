export default function FilmingPublicityInfo() {
  return (
    <section className="bg-white p-6 rounded-lg shadow-md space-y-6">
      <h2 className="text-2xl font-semibold text-dark-teal">
        Filming, Photography & Publicity at POMRC
      </h2>

      <p className="text-dark-teal">
        Port Moresby Racquets Club premises are available for filming,
        photography, and promotional content for media and commercial or
        publicity purposes — including newspaper, television, social media, and
        other promotional use.
      </p>

      <div className="p-4 bg-light-teal rounded-lg space-y-2">
        <p className="text-dark-teal">
          <span className="font-semibold">Prior approval required:</span> All
          requests to film, take photos, or conduct publicity events at POMRC
          must gain prior approval. Applications are submitted to the
          Tennis/Squash Director for final approval by the{" "}
          <span className="font-semibold">POMRC Committee Executive</span>.
        </p>
        <p className="text-sm text-dark-teal">
          Email:{" "}
          <a
            href="mailto:pomrcsquashdirector@gmail.com"
            className="text-deep-red hover:text-muted-teal underline"
          >
            pomrcsquashdirector@gmail.com
          </a>
          ,{" "}
          <a
            href="mailto:pomracquetsclub@gmail.com"
            className="text-deep-red hover:text-muted-teal underline"
          >
            pomracquetsclub@gmail.com
          </a>
        </p>
      </div>

      <div className="bg-light-teal p-4 rounded-lg">
        <h3 className="font-semibold text-dark-teal mb-2">Application Fees</h3>
        <ul className="space-y-1 text-dark-teal">
          <li>
            <span className="font-medium">Half Day:</span> K500
          </li>
          <li>
            <span className="font-medium">Full Day:</span> K1,000
          </li>
          <li>
            <span className="font-medium">Damages Liability Bond:</span> 50%
            incorporated in the application fee
          </li>
        </ul>
      </div>

      <div>
        <h3 className="font-semibold text-dark-teal mb-2">Requirements</h3>
        <ul className="list-disc list-inside space-y-2 text-dark-teal">
          <li>
            Applicant is responsible for leaving the area in a clean and tidy
            manner
          </li>
          <li>
            If the location is changed or damaged, the applicant is responsible
            for restoration and paying for any repairs
          </li>
          <li>
            A valid public liability insurance certificate is required before
            approval is granted
          </li>
        </ul>
      </div>
    </section>
  );
}
