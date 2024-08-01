import { LocationGeocodedAddress } from "expo-location";

/**
 * Formats a LocationGeocodedAddress object into a simplified string for display.
 * @param {LocationGeocodedAddress} address - The address object to format.
 * @returns {string} - The formatted address.
 */
export function formatAddress(address: LocationGeocodedAddress) {
  if (!address) return "";

  const { streetNumber, street, city, region, postalCode } = address;

  // Construct the simplified address parts
  let addressParts: string[] = [];

  if (streetNumber || street) {
    addressParts.push([streetNumber, street].filter(Boolean).join(" "));
  }
  if (city) addressParts.push(city);
  if (region) addressParts.push(region);
  if (postalCode) addressParts.push(postalCode);

  return addressParts.filter(Boolean).join(", ");
}

/**
 * Formats an array of AddressComponent objects into a simplified string for display.
 * @param {AddressComponent[]} components - The address components array.
 * @returns {string} - The formatted address.
 */
export function formatAddressFromComponents(components) {
  if (!components || components.length === 0) return "";

  const addressParts = {
    streetNumber: "",
    street: "",
    locality: "",
    administrativeAreaLevel1: "",
    postalCode: "",
  };

  components.forEach((component) => {
    if (component.types.includes("street_number")) {
      addressParts.streetNumber = component.long_name;
    } else if (component.types.includes("route")) {
      addressParts.street = component.long_name;
    } else if (component.types.includes("locality")) {
      addressParts.locality = component.long_name;
    } else if (component.types.includes("administrative_area_level_1")) {
      addressParts.administrativeAreaLevel1 = component.short_name;
    } else if (component.types.includes("postal_code")) {
      addressParts.postalCode = component.long_name;
    }
  });

  let formattedAddress = [
    addressParts.streetNumber,
    addressParts.street,
    addressParts.locality,
    addressParts.administrativeAreaLevel1,
    addressParts.postalCode,
  ]
    .filter(Boolean)
    .join(", ");

  return formattedAddress;
}
