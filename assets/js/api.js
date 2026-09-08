import { API_CONFIG } from './config.js';

function unavailable(value) {
  return value || 'Unavailable';
}

async function requestJson(url, createErrorMessage) {
  let response;

  try {
    response = await fetch(url);
  } catch {
    throw new Error(
      'Network connection failed. Check your internet connection and try again.'
    );
  }

  if (!response.ok) {
    throw new Error(createErrorMessage(response));
  }

  return response.json();
}

function normalizeIpInfo(ip, data) {
  const locationParts = (data.loc || '').split(',');

  const latitude = locationParts[0] || '';
  const longitude = locationParts[1] || '';

  const asnInfo =
    typeof data.asn === 'object' && data.asn
      ? data.asn
      : {};

  const asnMatch = (data.org || '').match(/^(AS\d+)/i);

  return {
    ip,
    version: ip.includes(':') ? 'IPv6' : 'IPv4',
    organization: unavailable(asnInfo.name || data.org),
    asn: unavailable(
      asnInfo.asn || (asnMatch ? asnMatch[1] : '')
    ),
    hostname: unavailable(data.hostname),
    country: unavailable(data.country_name || data.country),
    countryCode: unavailable(data.country),
    region: unavailable(data.region),
    city: unavailable(data.city),
    postal: unavailable(data.postal),
    timezone: unavailable(data.timezone),
    latitude: unavailable(latitude),
    longitude: unavailable(longitude),
    coordinates: unavailable(data.loc),
    fetchedAt: new Date().toISOString(),
  };
}

function normalizeIpApi(ip, data) {
  const latitude = data.latitude || '';
  const longitude = data.longitude || '';

  return {
    ip,
    version: ip.includes(':') ? 'IPv6' : 'IPv4',
    organization: unavailable(data.org),
    asn: unavailable(data.asn || data.as),
    hostname: unavailable(data.hostname),
    country: unavailable(data.country_name),
    countryCode: unavailable(data.country_code),
    region: unavailable(data.region),
    city: unavailable(data.city),
    postal: unavailable(data.postal),
    timezone: unavailable(data.timezone),
    latitude: unavailable(latitude),
    longitude: unavailable(longitude),
    coordinates:
      latitude && longitude
        ? `${latitude},${longitude}`
        : 'Unavailable',
    fetchedAt: new Date().toISOString(),
  };
}

export async function fetchPublicIp() {
  const data = await requestJson(
    API_CONFIG.ipifyUrl,
    () => 'Unable to detect the current public IP address.'
  );

  if (!data.ip) {
    throw new Error('The public IP service returned an invalid response.');
  }

  return data.ip;
}

async function lookupWithIpInfo(ip) {
  const token = API_CONFIG.ipInfoToken.trim();

  const tokenQuery = token
    ? `?token=${encodeURIComponent(token)}`
    : '';

  const url =
    `${API_CONFIG.ipInfoBaseUrl}/` +
    `${encodeURIComponent(ip)}/json${tokenQuery}`;

  const data = await requestJson(url, (response) => {
    if (response.status === 429) {
      return 'IPinfo lookup limit reached.';
    }

    return 'IPinfo lookup failed.';
  });

  if (data.bogon) {
    throw new Error(
      'Private, reserved, and non-routable IP addresses do not have public geolocation records.'
    );
  }

  if (data.error) {
    throw new Error(
      data.error.title || 'The IP address could not be found.'
    );
  }

  return normalizeIpInfo(ip, data);
}

async function lookupWithFallback(ip) {
  const fallbackUrl =
    `https://ipapi.co/${encodeURIComponent(ip)}/json/`;

  const data = await requestJson(
    fallbackUrl,
    () =>
      'Both IP lookup services are unavailable. Check your internet connection, VPN, ad blocker, or network restrictions.'
  );

  if (data.error || data.reserved) {
    throw new Error(
      data.reason ||
        'This IP address cannot be looked up as a public address.'
    );
  }

  return normalizeIpApi(ip, data);
}

export async function lookupIp(ip) {
  try {
    return await lookupWithIpInfo(ip);
  } catch {
    return lookupWithFallback(ip);
  }
}