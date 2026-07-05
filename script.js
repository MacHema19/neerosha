const siteData = window.NEEROSHA_SITE_DATA || {};
const business = siteData.business || {};
const services = siteData.services || [];

const escapeHtml = (value) =>
  String(value || "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");

const allServices = services.flatMap((group) =>
  (group.items || []).map((item) => ({
    ...item,
    category: group.category,
  }))
);

const serviceMenu = document.querySelector("[data-service-menu]");
if (serviceMenu && services.length) {
  serviceMenu.innerHTML = services
    .map(
      (group) => `
        <section class="service-category">
          <h3>${escapeHtml(group.category)}</h3>
          <ul class="service-list">
            ${(group.items || [])
              .map(
                (item) => `
                  <li>
                    <div>
                      <h4>${escapeHtml(item.name)}</h4>
                      <p>${escapeHtml(item.description)}</p>
                    </div>
                    <strong>${escapeHtml(item.price)}</strong>
                  </li>
                `
              )
              .join("")}
          </ul>
        </section>
      `
    )
    .join("");
}

const serviceCount = document.querySelector("[data-service-count]");
if (serviceCount && allServices.length) {
  serviceCount.textContent = `${allServices.length} Signature Treatments`;
}

const serviceSelect = document.querySelector("[data-service-select]");
if (serviceSelect && allServices.length) {
  serviceSelect.innerHTML = allServices
    .map(
      (item) =>
        `<option>${escapeHtml(item.name)} - ${escapeHtml(item.price)}</option>`
    )
    .join("");
}

document.querySelectorAll("[data-booking-whatsapp]").forEach((link) => {
  link.href = `https://wa.me/${business.bookingPhoneWa}`;
});

document.querySelectorAll("[data-footer-whatsapp]").forEach((link) => {
  link.href = `https://wa.me/${business.footerPhoneWa}`;
});

document.querySelectorAll("[data-booking-phone-display]").forEach((element) => {
  element.textContent = business.bookingPhoneDisplay || element.textContent;
});

document.querySelectorAll("[data-footer-phone-display]").forEach((element) => {
  element.textContent = business.footerPhoneDisplay || element.textContent;
});

const mapEmbed = document.querySelector("[data-map-embed]");
if (mapEmbed && business.googleMapsEmbed) {
  mapEmbed.src = business.googleMapsEmbed;
}

document.querySelectorAll("[data-google-maps-link]").forEach((link) => {
  link.href = business.googleMapsUrl || link.href;
});

const schema = document.querySelector("#business-schema");
if (schema && services.length) {
  const serviceOffers = allServices.map((item) => ({
    "@type": "Offer",
    itemOffered: {
      "@type": "Service",
      name: item.name,
      description: item.description,
      serviceType: item.category,
    },
    priceCurrency: "MYR",
    price: item.price.replace(/[^0-9/]/g, ""),
  }));

  schema.textContent = JSON.stringify(
    {
      "@context": "https://schema.org",
      "@type": "BeautySalon",
      name: "Nerooshaa Beauty Saloon - Setapak Kuala Lumpur",
      alternateName: business.displayName || "Neerosha Beauty",
      description:
        "Indian bridal makeup, mehendi, threading, facial, waxing, hair, nails and beauty services in Setapak, Kuala Lumpur.",
      telephone: business.bookingPhoneDisplay,
      image: "assets/hero-neerosha.jpg",
      address: {
        "@type": "PostalAddress",
        streetAddress: "G 03, Residensi Platinum Teratai, Taman Setapak",
        addressLocality: "Kuala Lumpur",
        postalCode: "53300",
        addressRegion: "Wilayah Persekutuan Kuala Lumpur",
        addressCountry: "MY",
      },
      areaServed: ["Setapak", "Kuala Lumpur", "Taman Setapak"],
      openingHoursSpecification: [
        {
          "@type": "OpeningHoursSpecification",
          dayOfWeek: [
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday",
            "Sunday",
          ],
          opens: "10:00",
          closes: "22:30",
        },
      ],
      hasMap: business.googleMapsUrl,
      sameAs: [business.tiktokUrl, business.instagramUrl].filter(Boolean),
      makesOffer: serviceOffers,
    },
    null,
    2
  );
}

const bookingForm = document.querySelector("#booking-form");
const dateInput = bookingForm?.querySelector('input[name="date"]');

if (dateInput) {
  const today = new Date();
  const offset = today.getTimezoneOffset();
  const localToday = new Date(today.getTime() - offset * 60 * 1000);
  dateInput.min = localToday.toISOString().slice(0, 10);
}

bookingForm?.addEventListener("submit", (event) => {
  event.preventDefault();

  const data = new FormData(bookingForm);
  const name = data.get("name")?.toString().trim();
  const phone = data.get("phone")?.toString().trim();
  const service = data.get("service")?.toString();
  const date = data.get("date")?.toString();
  const time = data.get("time")?.toString();

  const message = [
    "Hi Nerooshaa Beauty Saloon, I would like to book an appointment.",
    "",
    `Name: ${name}`,
    `Phone: ${phone}`,
    `Service: ${service}`,
    `Date: ${date}`,
    `Time: ${time}`,
  ].join("\n");

  const url = `https://wa.me/${business.bookingPhoneWa}?text=${encodeURIComponent(
    message
  )}`;
  window.open(url, "_blank", "noopener,noreferrer");
});
