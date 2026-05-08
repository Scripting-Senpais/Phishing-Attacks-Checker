export const checkURL = async (req, res) => {
  const url = req.body.url;
  if (!url) {
    return res.status(400).json({ message: "URL is required" });
  }

  try {
    let parsedUrl;
    try {
      // Validate that the input is a properly formatted URL
      parsedUrl = new URL(url);
    } catch (e) {
      return res.status(400).json({ message: "Invalid URL format" });
    }

    const hostname = parsedUrl.hostname.toLowerCase();

    // Check for common Typo-squatting (Fake Domains)
    const knownFakeDomains = [
      'paypa1', // [cite: 55]
      'arnazon', // [cite: 55]
      'netflix-billing-update', // 
      'faceb00k',
      'app1e',
      'apple-security-verify',
      'chase-online-update',
      'dhl-tracking-notice',
      'fedex-delivery-alert',
      'micros0ft',
      'g00gle',
      'wellsfargo-secure',
      'bankofamerica-alert'
    ];
    const hasFakeDomain = knownFakeDomains.some(domain => hostname.includes(domain));

    if (hasFakeDomain) {
      return res.status(200).json({
        safe: false,
        message: "Danger: Detected known fake or misspelled domain (typo-squatting)."
      });
    }

    // Check for IP Address usage instead of a Domain Name
    const isIPAddress = /^(\d{1,3}\.){3}\d{1,3}$/.test(hostname);
    if (isIPAddress) {
      return res.status(200).json({
        safe: false,
        message: "Suspicious: URL uses an IP address instead of a domain name."
      });
    }

    // Check for Suspicious Keywords in the path or subdomains
    const suspiciousKeywords = [
      'login',
      'verify',
      'update',
      'secure',
      'account',
      'signin',
      'auth',
      'password-reset',
      'confirm',
      'wallet',
      'unlock',
      'recover'
    ];
    const hasSuspiciousKeyword = suspiciousKeywords.some(keyword => url.toLowerCase().includes(keyword));

    if (hasSuspiciousKeyword && parsedUrl.protocol !== 'https:') {
      return res.status(200).json({
        safe: false,
        message: "Suspicious: Unsecure HTTP connection asking for sensitive actions."
      });
    }

    return res.status(200).json({ safe: true, message: "URL heuristics appear safe." });

  } catch (err) {
    console.error("URL Check Error:", err);
    return res.status(500).json({ message: "Checking URL failed" });
  }
};


export const checkEmail = async (req, res) => {
  const email = req.body.email;
  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }

  try {
    // 1. Basic Format Validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    const [prefix, domain] = email.split('@').map(str => str.toLowerCase());

    // Check for Free Email Providers impersonating Official Services
    const freeEmailProviders = [
      'gmail.com',
      'yahoo.com',
      'hotmail.com',
      'outlook.com',
      'aol.com',
      'protonmail.com',
      'mail.com',
      'yandex.com',
      'zoho.com',
      'icloud.com'
    ];
    const officialPrefixes = [
      'support',
      'security',
      'billing',
      'admin',
      'update',
      'service',
      'no-reply',
      'noreply',
      'alert',
      'info',
      'compliance',
      'system'
    ];

    const isFreeEmail = freeEmailProviders.includes(domain);
    const masqueradingAsOfficial = officialPrefixes.some(p => prefix.includes(p));

    if (isFreeEmail && masqueradingAsOfficial) {
      return res.status(200).json({
        safe: false,
        message: "Suspicious: Official-sounding email using a free, public provider."
      });
    }

    // Cheap or poorly regulated Top Level Domains (TLDs) often abused by scammers
    const highRiskTlds = ['.ru', '.xyz', '.top', '.info', '.tk', '.ml', '.ga', '.cf', '.gq'];

    // Check for High-Risk Top Level Domains (TLDs)
    if (highRiskTlds.some(tld => domain.endsWith(tld))) {
      return res.status(200).json({
        safe: false,
        message: "Suspicious: Email originates from a historically high-risk Top Level Domain."
      });
    }

    // Domains designed to look like official service notifications
    const suspiciousDomains = [
      'paypal-security-alert', // 
      'apple-icloud-verify',
      'amazon-support-team',
      'google-recovery-service',
      'microsoft-auth-team'
    ];
    const isSuspiciousDomain = suspiciousDomains.some(d => domain.includes(d));

    if (isSuspiciousDomain) {
      return res.status(200).json({
        safe: false,
        message: "Danger: Sender domain mimics a legitimate service but is unofficial."
      });
    }

    return res.status(200).json({ safe: true, message: "Email format and domain heuristics appear standard." });

  } catch (err) {
    console.error("Email Check Error:", err);
    return res.status(500).json({ message: "Checking email failed" });
  }
};