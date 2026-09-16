import { UBVERSE_API_BASE_URL } from "./constants";

export interface BackendCompanySummary {
  id: string;
  name: string;
  image?: string;
  fundingRoundStage?: string;
  totalAmountPlaning?: string;
  valueTotalAmountPlaning?: string;
  maximumAmountToRaise?: string;
  valueMaximumAmountToRaise?: string;
  minimuminvestmentAmount?: string;
  securitiesFiling?: string;
}

export interface BackendDashboardCategory {
  id: string;
  category: string;
  numberOfColumns: number;
  numberOfRows: number;
  companyIds: string[];
  companies: BackendCompanySummary[];
}

export interface BackendIssuerDetailData {
  companyInformation?: {
    _id?: string;
    companyLegalName?: string;
    companyDescription?: string;
    securityFilling?: string;
    image?: {
      path?: string | null;
      url?: string;
    };
    videoThumbnail?: {
      path?: string | null;
      url?: string;
    };
    videoUrl?: {
      path?: string | null;
      url?: string;
    };
  };
  aboutUs?: {
    categories?: string[];
    legalOfferor?: string;
    valueLegalOfferor?: string;
    legalFirm?: string;
    valueLegalFirm?: string;
    website?: string;
    aboutUs?: string;
    aboutUsImage?: {
      path?: string | null;
      url?: string;
    };
  };
  funding_target_progress?: {
    fundingRoundStage?: string;
    totalAmountPlaning?: string;
    valueTotalAmountPlaning?: string;
    maximumAmountToRaise?: string;
    valueMaximumAmountToRaise?: string;
    minimuminvestmentAmount?: string;
    capitalIndicated?: string;
    valueCapitalIndicated?: string;
    capitalLegallyBinded?: string;
    valueCapitalLegallyBinded?: string;
    indicated?: string | null;
    funded?: string | null;
    committed?: string | null;
    oversubscriptionTarget?: string;
  };
  offering_structure_deal?: {
    securityTypes?: string;
    valueSecurityTypes?: string;
    valuationCap?: string;
    valuationCapType?: string;
    discountRate?: string;
    preMoneyValuation?: string;
    pricePerShare?: string;
    numberOfShareIssue?: string;
    couponRate?: string;
    maturityDate?: string;
  };
  investor_information?: {
    uniqueInvestors?: string;
    valueUniqueInvestors?: string;
    leadInvestor?: string;
    valueLeadInvestor?: string;
    fundingRoundStage?: string[];
  };
  company_headquater?: {
    country?: string;
    residentialAddress?: string;
    city?: string;
    state?: string;
    postal_code?: string;
  };
}

const DEFAULT_HEADERS = {
  "api-version": "v1",
  "x-custom-lang": "en",
  "Content-Type": "application/json",
  accept: "application/json",
};

/**
 * Fetches the public dashboard categories and companies without authentication.
 */
export async function fetchDashboardCompanies(): Promise<BackendCompanySummary[]> {
  try {
    const url = `${UBVERSE_API_BASE_URL}/ubverse-service/investor-dashboard/dashboard-without-auth`;
    const res = await fetch(url, {
      headers: DEFAULT_HEADERS,
      next: { revalidate: 60 },
    });

    if (!res.ok) {
      console.warn(`[UBverse API] dashboard-without-auth returned status ${res.status}`);
      return [];
    }

    const json = await res.json();
    const categories: BackendDashboardCategory[] = json?.data || [];
    const companies: BackendCompanySummary[] = [];

    for (const cat of categories) {
      if (Array.isArray(cat.companies)) {
        companies.push(...cat.companies);
      }
    }

    return companies;
  } catch (err) {
    console.error("[UBverse API] Failed to fetch dashboard companies:", err);
    return [];
  }
}

/**
 * Fetches issuer details for a specific company by company ID.
 */
export async function fetchIssuerDetail(companyId: string): Promise<BackendIssuerDetailData | null> {
  if (!companyId) return null;

  try {
    const url = `${UBVERSE_API_BASE_URL}/ubverse-service/general/get-issuer-detail/${companyId}`;
    const res = await fetch(url, {
      headers: DEFAULT_HEADERS,
      next: { revalidate: 60 },
    });

    if (!res.ok) {
      return null;
    }

    const json = await res.json();
    return json?.data || null;
  } catch (err) {
    console.error(`[UBverse API] Failed to fetch issuer detail for ${companyId}:`, err);
    return null;
  }
}

/**
 * Subscribes user email to backend newsletter service.
 */
export async function subscribeBackendNewsletter(
  email: string,
  name: string = ""
): Promise<{ success: boolean; message: string }> {
  const base = `${UBVERSE_API_BASE_URL}/ubverse-service/newsletter`;

  try {
    // 1. Save user email
    await fetch(`${base}/save-user-email`, {
      method: "POST",
      headers: DEFAULT_HEADERS,
      body: JSON.stringify({ email, name }),
    }).catch(() => {});

    // 2. Subscribe newsletter
    const res = await fetch(`${base}/subscribe-news-letter`, {
      method: "POST",
      headers: DEFAULT_HEADERS,
      body: JSON.stringify({ email }),
    });

    if (res.ok) {
      const json = await res.json().catch(() => ({}));
      return {
        success: true,
        message: json.message || "Subscribed successfully.",
      };
    }

    const errJson = await res.json().catch(() => ({}));
    return {
      success: false,
      message: errJson.message || "Failed to subscribe.",
    };
  } catch (err) {
    return {
      success: false,
      message: err instanceof Error ? err.message : "Network error.",
    };
  }
}

/**
 * Authenticates user through backend user-service.
 */
export async function loginBackendUser(credentials: {
  email: string;
  password: string;
}): Promise<{ success: boolean; data?: unknown; error?: string; status: number }> {
  const url = `${UBVERSE_API_BASE_URL}/user-service/user/login`;

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: DEFAULT_HEADERS,
      body: JSON.stringify(credentials),
    });

    const json = await res.json().catch(() => ({}));

    if (res.ok) {
      return { success: true, data: json?.data || json, status: res.status };
    }

    return {
      success: false,
      error: json?.message || "Invalid credentials.",
      status: res.status,
    };
  } catch {
    return {
      success: false,
      error: "Unable to reach authentication server.",
      status: 503,
    };
  }
}

/**
 * Initiates support chat session.
 */
export async function initiateSupportChat(options?: {
  token?: string;
  threadId?: string;
}): Promise<{ success: boolean; data?: unknown; error?: string }> {
  const url = `${UBVERSE_API_BASE_URL}/zenithv2/support-chat/initiate_chat`;
  const headers: Record<string, string> = { ...DEFAULT_HEADERS };

  if (options?.token) {
    headers.Authorization = `Bearer ${options.token}`;
  }

  const payload: Record<string, unknown> = {
    tenant_id: "ubverse",
  };

  if (options?.threadId) {
    payload.thread_id = options.threadId;
  }

  try {
    const res = await fetch(url, {
      method: "POST",
      headers,
      body: JSON.stringify(payload),
    });

    const json = await res.json().catch(() => ({}));

    if (res.ok) {
      return { success: true, data: json };
    }

    return {
      success: false,
      error: json?.detail || json?.message || "Failed to initiate chat session.",
    };
  } catch {
    return {
      success: false,
      error: "Support chat service temporarily unavailable.",
    };
  }
}
