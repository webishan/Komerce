export interface Translation {
  [key: string]: string | Translation;
}

export const translations = {
  en: {
    nav: {
      dashboard: "Dashboard",
      merchants: "Merchants",
      customers: "Customers",
      analytics: "Analytics",
      rewards: "Rewards",
      withdrawals: "Withdrawals",
      coFounders: "Co-Founders",
      settings: "Settings",
    },
    common: {
      loading: "Loading...",
      error: "Error",
      success: "Success",
      save: "Save",
      cancel: "Cancel",
      delete: "Delete",
      edit: "Edit",
      view: "View",
      add: "Add",
      search: "Search",
      filter: "Filter",
      export: "Export",
      import: "Import",
      total: "Total",
      active: "Active",
      inactive: "Inactive",
      pending: "Pending",
      approved: "Approved",
      rejected: "Rejected",
    },
    dashboard: {
      title: "KOMARCE Admin Dashboard",
      subtitle: "Unified Loyalty Platform Management",
      globalAdmin: "Global Admin",
      localAdmin: "Local Admin",
      globalMerchants: "Global Merchants",
      globalCustomers: "Global Customers",
      totalMerchants: "Total Merchants",
      totalCustomers: "Total Customers",
      totalRewards: "Total Rewards",
      totalWithdrawals: "Total Withdrawals",
      rewardPoints: "Reward Points",
      withdrawals: "Withdrawals",
      countryPerformance: "Country Performance",
      merchantTiers: "Merchant Tiers",
      topCustomers: "Top Customers",
      topReferrers: "Top Referrers",
      recentActivities: "Recent Activities",
      vatServiceCharge: "VAT & Service Charges",
      rewardSystemTiers: "Reward System Tiers",
      quickActions: "Quick Actions",
      serialNumbers: "Serial Numbers",
      merchants: {
        regular: "Regular",
        star: "Star Merchant",
        doubleStar: "Double Star",
        tripleStar: "Triple Star",
        executive: "Executive",
        seniorExecutive: "Senior Executive",
        manager: "Manager",
        coFounder: "Co-Founder",
        merchant: "Merchant",
        eMerchant: "E-Merchant",
      },
      customers: {
        topBySerialNumbers: "Top by Serial Numbers",
        topByReferrals: "Top by Referrals",
        leaderboard: "Customer Leaderboard",
      },
    },
    merchants: {
      title: "Merchant Management",
      addMerchant: "Add Merchant",
      regular: "Regular",
      star: "Star Merchant",
      doubleStar: "Double Star",
      tripleStar: "Triple Star",
      executive: "Executive",
      merchant: "Merchant",
      eMerchant: "E-Merchant",
    },
    customers: {
      title: "Customer Management",
      serialNumbers: "Serial Numbers",
      referrals: "Referrals",
      rewardPoints: "Reward Points",
      balance: "Balance",
    },
    countries: {
      global: "Global",
      bangladesh: "Bangladesh",
      malaysia: "Malaysia",
      uae: "UAE",
      philippines: "Philippines",
    },
  },
  bn: {
    common: {
      dashboard: "ড্যাশবোর্ড",
      merchants: "মার্চেন্ট",
      customers: "গ্রাহক",
      analytics: "বিশ্লেষণ",
      settings: "সেটিংস",
      loading: "লোড হচ্ছে...",
      error: "ত্রুটি",
      success: "সফল",
      save: "সংরক্ষণ",
      cancel: "বাতিল",
      delete: "মুছুন",
      edit: "সম্পাদনা",
      view: "দেখুন",
      add: "যোগ করুন",
      search: "অনুসন্ধান",
      filter: "ফিল্টার",
      export: "রপ্তানি",
      import: "আমদানি",
      total: "মোট",
      active: "সক্রিয়",
      inactive: "নিষ্ক্রিয়",
      pending: "অপেক্ষমান",
      approved: "অনুমোদিত",
      rejected: "প্রত্যাখ্যাত",
    },
    dashboard: {
      title: "প্রশাসনিক ড্যাশবোর্ড",
      subtitle: "ইউনিফাইড লয়্যালটি প্ল্যাটফর্ম ব্যবস্থাপনা",
      globalMerchants: "গ্লোবাল মার্চেন্ট",
      globalCustomers: "গ্লোবাল গ্রাহক",
      rewardPoints: "পুরস্কার পয়েন্ট",
      withdrawals: "উত্তোলন",
      countryPerformance: "দেশভিত্তিক কর্মক্ষমতা",
      merchantTiers: "মার্চেন্ট স্তর",
      topCustomers: "শীর্ষ গ্রাহক",
      topReferrers: "শীর্ষ রেফারকারী",
      recentActivities: "সাম্প্রতিক কার্যক্রম",
      vatServiceCharge: "ভ্যাট ও সেবা চার্জ",
      rewardSystemTiers: "পুরস্কার সিস্টেম স্তর",
      quickActions: "দ্রুত কার্যক্রম",
    },
    merchants: {
      title: "মার্চেন্ট ব্যবস্থাপনা",
      addMerchant: "মার্চেন্ট যোগ করুন",
      regular: "নিয়মিত",
      star: "স্টার মার্চেন্ট",
      doubleStar: "ডাবল স্টার",
      tripleStar: "ট্রিপল স্টার",
      executive: "এক্সিকিউটিভ",
      merchant: "মার্চেন্ট",
      eMerchant: "ই-মার্চেন্ট",
    },
    customers: {
      title: "গ্রাহক ব্যবস্থাপনা",
      serialNumbers: "ক্রমিক নম্বর",
      referrals: "রেফারেল",
      rewardPoints: "পুরস্কার পয়েন্ট",
      balance: "ব্যালেন্স",
    },
    countries: {
      global: "গ্লোবাল",
      bangladesh: "বাংলাদেশ",
      malaysia: "মালয়েশিয়া",
      uae: "সংযুক্ত আরব আমিরাত",
      philippines: "ফিলিপাইন্স",
    },
  },
};

export type Language = keyof typeof translations;

export function getNestedTranslation(obj: Translation, key: string): string {
  const keys = key.split('.');
  let result: any = obj;
  
  for (const k of keys) {
    if (result && typeof result === 'object' && k in result) {
      result = result[k];
    } else {
      return key; // Return key if translation not found
    }
  }
  
  return typeof result === 'string' ? result : key;
}

export function useTranslation(language: Language = 'en') {
  const t = (key: string): string => {
    return getNestedTranslation(translations[language], key);
  };

  return { t };
}
