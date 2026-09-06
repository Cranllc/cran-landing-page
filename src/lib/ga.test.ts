import { afterEach, describe, expect, it, vi } from "vitest";
import {
  analyticsDeniedConsent,
  analyticsGrantedConsent,
  COOKIE_CONSENT_KEY,
  denyConsent,
  GA_ID,
  GOOGLE_ANALYTICS_SCRIPT_ID,
  grantConsent,
  hasGlobalPrivacyControl,
  readStoredConsent,
  shouldGrantAnalytics,
} from "./ga";

function installBrowserMocks(input: { gpc?: boolean; stored?: string | null } = {}) {
  const store = new Map<string, string>();
  if (input.stored) store.set(COOKIE_CONSENT_KEY, input.stored);

  const appendedScripts: HTMLScriptElement[] = [];
  const documentMock = {
    cookie: "_ga=abc; _gid=def; unrelated=keep",
    createElement: vi.fn((tag: string) => ({ tagName: tag.toUpperCase() })),
    getElementById: vi.fn(() => null),
    head: {
      appendChild: vi.fn((script: HTMLScriptElement) => {
        appendedScripts.push(script);
        return script;
      }),
    },
  };

  const windowMock = {
    dataLayer: [] as unknown[],
    localStorage: {
      getItem: vi.fn((key: string) => store.get(key) ?? null),
      setItem: vi.fn((key: string, value: string) => store.set(key, value)),
    },
    location: { hostname: "www.getcran.ai" },
  };

  Object.defineProperty(globalThis, "window", {
    configurable: true,
    value: windowMock,
  });
  Object.defineProperty(globalThis, "document", {
    configurable: true,
    value: documentMock,
  });
  Object.defineProperty(globalThis, "navigator", {
    configurable: true,
    value: { globalPrivacyControl: input.gpc },
  });

  return { appendedScripts, documentMock, store, windowMock };
}

afterEach(() => {
  vi.restoreAllMocks();
  Reflect.deleteProperty(globalThis, "window");
  Reflect.deleteProperty(globalThis, "document");
  Reflect.deleteProperty(globalThis, "navigator");
});

describe("GA consent helpers", () => {
  it("grants only analytics storage", () => {
    expect(analyticsGrantedConsent()).toEqual({
      analytics_storage: "granted",
      ad_storage: "denied",
      ad_user_data: "denied",
      ad_personalization: "denied",
    });
  });

  it("keeps every signal denied when consent is denied", () => {
    expect(analyticsDeniedConsent()).toEqual({
      analytics_storage: "denied",
      ad_storage: "denied",
      ad_user_data: "denied",
      ad_personalization: "denied",
    });
  });

  it("grants analytics only for stored acceptance without GPC", () => {
    expect(shouldGrantAnalytics({ stored: "accepted", globalPrivacyControl: false })).toBe(true);
    expect(shouldGrantAnalytics({ stored: "accepted", globalPrivacyControl: true })).toBe(false);
    expect(shouldGrantAnalytics({ stored: "denied", globalPrivacyControl: false })).toBe(false);
    expect(shouldGrantAnalytics({ stored: null, globalPrivacyControl: false })).toBe(false);
  });

  it("reads only known stored consent values", () => {
    installBrowserMocks({ stored: "accepted" });
    expect(readStoredConsent()).toBe("accepted");

    window.localStorage.setItem(COOKIE_CONSENT_KEY, "maybe");
    expect(readStoredConsent()).toBeNull();
  });

  it("detects Global Privacy Control", () => {
    installBrowserMocks({ gpc: true });
    expect(hasGlobalPrivacyControl()).toBe(true);
  });

  it("loads Google Analytics only after grant", () => {
    const { appendedScripts, store, windowMock } = installBrowserMocks();

    grantConsent();

    expect(store.get(COOKIE_CONSENT_KEY)).toBe("accepted");
    expect(appendedScripts).toHaveLength(1);
    expect(appendedScripts[0]).toMatchObject({
      id: GOOGLE_ANALYTICS_SCRIPT_ID,
      async: true,
      src: `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`,
    });
    expect(windowMock.dataLayer).toEqual([
      ["consent", "default", analyticsGrantedConsent()],
      ["js", expect.any(Date)],
      ["config", GA_ID],
      ["consent", "update", analyticsGrantedConsent()],
      ["event", "page_view"],
    ]);
  });

  it("forces denied consent when GPC is enabled", () => {
    const { appendedScripts, store, windowMock } = installBrowserMocks({ gpc: true });

    grantConsent();

    expect(store.get(COOKIE_CONSENT_KEY)).toBe("denied");
    expect(appendedScripts).toHaveLength(0);
    expect(windowMock.dataLayer).toEqual([]);
  });

  it("revokes same-session consent", () => {
    const { store, windowMock } = installBrowserMocks();
    windowMock.gtag = vi.fn();

    denyConsent();

    expect(store.get(COOKIE_CONSENT_KEY)).toBe("denied");
    expect(windowMock.gtag).toHaveBeenCalledWith("consent", "update", analyticsDeniedConsent());
  });
});
