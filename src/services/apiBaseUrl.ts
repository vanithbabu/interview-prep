const PRODUCTION_API_URL = 'https://interview-prep-hpqr.onrender.com';

export function getApiBaseUrl(): string {
  const configured = process.env.EXPO_PUBLIC_AI_PROXY_URL;
  if (configured) return configured;

  return PRODUCTION_API_URL;
}
