import React from "react";

const MembershipPerks: React.FC = () => {
  return (
    <section className="bg-white p-6 rounded-lg shadow-md mb-8">
      <h2 className="text-3xl font-bold text-dark-teal mb-6 text-center">
        Join the Port Moresby Racquets Club!
      </h2>
      <p className="text-lg text-gray-700 mb-6 text-center">
        Become a part of our vibrant community and enjoy access to top-notch
        facilities and events.
      </p>

      <div className="border-t border-gray-200 pt-6">
        <h3 className="text-2xl font-semibold text-dark-teal mb-4">
          2025 Court Fees & Members Access Policy
        </h3>

        <div className="mb-6">
          <h4 className="text-xl font-semibold text-muted-teal mb-3">
            Membership Categories
          </h4>
          <ul className="space-y-2 list-disc list-inside text-gray-700">
            <li>
              <span className="font-semibold text-dark-teal">
                Family Membership – K600.00/year:
              </span>{" "}
              Includes two adults and children aged 18 and under, or up to 21
              years if in full-time study.
            </li>
            <li>
              <span className="font-semibold text-dark-teal">
                Single Adult Membership – K360.00/year:
              </span>{" "}
              For individuals aged 19 years and above.
            </li>
            <li>
              <span className="font-semibold text-dark-teal">
                Junior Membership – K70.00/year:
              </span>{" "}
              For those aged 18 and under, or up to 21 years if enrolled in
              full-time study.
            </li>
            <li>
              <span className="font-semibold text-dark-teal">
                Social Membership – K180.00/year:
              </span>{" "}
              Enjoys all club benefits and access to amenities; however,
              standard{" "}
              <span className="italic font-medium">non-member court fees</span>{" "}
              apply for court use.
            </li>
          </ul>
        </div>

        <div className="mb-6">
          <h4 className="text-xl font-semibold text-muted-teal mb-3">
            Court Use Fees
          </h4>
          <ul className="space-y-2 list-disc list-inside text-gray-700">
            <li>
              <span className="font-semibold text-dark-teal">Non-Members:</span>
              <ul className="list-disc list-inside ml-4 space-y-1">
                <li>
                  K40 per person, per hour – applies to all courts, including
                  squash.
                </li>
                <li>
                  When receiving private coaching, the full court fee is payable{" "}
                  <span className="font-semibold">in addition</span> to coaching
                  fees.
                </li>
              </ul>
            </li>
            <li>
              <span className="font-semibold text-dark-teal">Members:</span> K10
              per person, per hour – applies to all courts, including squash.
            </li>
            <li>
              <span className="font-semibold text-dark-teal">
                Junior Members:
              </span>
              <ul className="list-disc list-inside ml-4 space-y-1">
                <li>No court fees apply.</li>
                <li>Lighting fees apply if using courts after dark.</li>
              </ul>
            </li>
          </ul>
        </div>

        <div className="mb-6">
          <h4 className="text-xl font-semibold text-muted-teal mb-3">
            Lighting Fees (Night Sessions)
          </h4>
          <ul className="space-y-2 list-disc list-inside text-gray-700">
            <li>
              <span className="font-semibold text-dark-teal">
                All Users (Members and Non-Members):
              </span>{" "}
              K20 per person, per hour – applies to all courts, including
              squash.
            </li>
          </ul>
        </div>

        <div>
          <h4 className="text-xl font-semibold text-muted-teal mb-3">
            Club Access
          </h4>
          <ul className="space-y-2 list-disc list-inside text-gray-700">
            <li>
              <span className="font-semibold text-dark-teal">Members:</span>
              <ul className="list-disc list-inside ml-4 space-y-1">
                <li>Issued a personal key card for entry.</li>
                <li>
                  Grants access to the club and amenities during opening hours.
                </li>
              </ul>
            </li>
            <li>
              <span className="font-semibold text-dark-teal">Non-Members:</span>
              <ul className="list-disc list-inside ml-4 space-y-1">
                <li>Must be signed in or carded in by a financial member.</li>
                <li>Access is limited to guest facilities.</li>
              </ul>
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
};

export default MembershipPerks;
