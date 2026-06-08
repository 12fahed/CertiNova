const MS_PER_DAY = 24 * 60 * 60 * 1000;
const EXPIRATION_WARNING_WINDOW_DAYS = 30;
const EXPIRATION_WARNING_WINDOW_MS = EXPIRATION_WARNING_WINDOW_DAYS * MS_PER_DAY;

export const getCertificateExpirationStatus = (certificate, now = new Date()) => {
  if (!certificate?.expiresAt) {
    return {
      expiresAt: null,
      isExpired: false,
      expiresSoon: false,
      daysUntilExpiration: null,
    };
  }

  const expiresAt = new Date(certificate.expiresAt);
  if (Number.isNaN(expiresAt.getTime())) {
    return {
      expiresAt: null,
      isExpired: true,
      expiresSoon: false,
      daysUntilExpiration: null,
      invalidExpiration: true,
    };
  }

  const remainingMs = expiresAt.getTime() - now.getTime();

  return {
    expiresAt,
    isExpired: remainingMs <= 0,
    expiresSoon: remainingMs > 0 && remainingMs <= EXPIRATION_WARNING_WINDOW_MS,
    daysUntilExpiration: remainingMs > 0 ? Math.ceil(remainingMs / MS_PER_DAY) : 0,
  };
};

export const normalizeExpirationDate = (expiresAt) => {
  if (!expiresAt) {
    return null;
  }

  const parsedDate = new Date(expiresAt);
  if (Number.isNaN(parsedDate.getTime())) {
    return null;
  }

  return parsedDate;
};
