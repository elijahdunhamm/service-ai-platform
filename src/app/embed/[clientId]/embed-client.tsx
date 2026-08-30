// src/app/embed/[clientId]/embed-client.tsx
// Client-side interactive wrapper for the embed route. Because the estimator
// and booking modal hold local state (selected service, price, modal open,
// booked slots), they must run in a client component — this thin wrapper is
// the client boundary, rendered by the server page with the resolved preset.
import { useState } from "react";
import {
  PriceCalculator,
  BookingModal,
} from "../../../components/booking";
import type { IndustryConfig } from "../../../config/types";

interface ServiceDetails {
  serviceType: string;
  bedrooms: number;
  bathrooms: number;
  frequency: string;
}

export function EmbedClient({ config }: { config: IndustryConfig }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [activeEstimate, setActiveEstimate] = useState<{
    details: ServiceDetails;
    price: number;
  }>(() => ({
    details: {
      serviceType: config.estimator.serviceTypes[0]?.id ?? "",
      bedrooms: config.estimator.defaultBedrooms,
      bathrooms: config.estimator.defaultBathrooms,
      frequency: config.estimator.defaultFrequency,
    },
    price: 0,
  }));

  const handleOpenBooking = (details: ServiceDetails, price: number) => {
    setActiveEstimate({ details, price });
    setModalOpen(true);
  };

  return (
    <>
      <PriceCalculator config={config} onOpenBooking={handleOpenBooking} />
      <BookingModal
        config={config}
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        estimatedPrice={activeEstimate.price}
        serviceDetails={activeEstimate.details}
        onBookingConfirmed={() => {}}
      />
    </>
  );
}
