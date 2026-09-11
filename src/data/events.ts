import type { InvestigationEvent } from "@/types";

export const events: InvestigationEvent[] = [
  { id: "EVT-1001", type: "Communication", timestamp: "2026-01-12T09:20:00", entities: ["PERSON-1042", "PERSON-1088"], location: "Loc North Complex", description: "Arjun Mehta and Rahul Sharma observed in conversation; both numbers later become active in CDR analysis." },
  { id: "EVT-1002", type: "Communication", timestamp: "2026-01-18T21:04:00", entities: ["PERSON-1042", "PERSON-1123"], location: "Tower Sector", description: "Call between Arjun Mehta and Priya Nair lasting 14 minutes." },
  { id: "EVT-1003", type: "Location", timestamp: "2026-01-25T10:00:00", entities: ["PERSON-1088"], location: "Loc North Complex", description: "Rahul Sharma tracked via CDR to cell tower near Loc North Complex." },
  { id: "EVT-1004", type: "Organization", timestamp: "2026-02-03T14:30:00", entities: ["PERSON-1056", "PERSON-1063", "PERSON-1077"], location: "Loc Central Tower", description: "Three subjects observed entering Organization Alpha office together." },
  { id: "EVT-1005", type: "Communication", timestamp: "2026-02-06T22:14:00", entities: ["PHONE-8821", "PHONE-8856"], location: "Tower Sector", description: "Cross-cluster call between Bridge PHONE-8821 and PHONE-8856." },
  { id: "EVT-1006", type: "Vehicle", timestamp: "2026-02-09T15:45:00", entities: ["VEHICLE-5001", "PERSON-1042"], location: "Loc North Complex", description: "DL-1C-AB-1290 captured near Location North with registered owner Arjun Mehta." },
  { id: "EVT-1007", type: "Organization", timestamp: "2026-02-13T10:30:00", entities: ["PERSON-1088", "PERSON-1056"], location: "Loc Central Tower", description: "Rahul Sharma and Neha Verma meet; handoff of paperwork observed." },
  { id: "EVT-1008", type: "Communication", timestamp: "2026-02-22T09:48:00", entities: ["PERSON-1123", "PERSON-1134"], location: "Unknown", description: "Priya Nair calls Vikram Rao from PHONE-8845." },
  { id: "EVT-1009", type: "Financial", timestamp: "2026-02-24T10:08:00", entities: ["PERSON-1056"], location: "Mumbai", description: "Transfer into ACCT-9012 flagged by AML system." },
  { id: "EVT-1010", type: "Location", timestamp: "2026-02-27T06:30:00", entities: ["PERSON-1134", "VEHICLE-5001"], location: "Loc West Junction", description: "Vikram Rao filmed driving the Silver Dzire at Loc West Junction." },
  { id: "EVT-1011", type: "Vehicle", timestamp: "2026-03-02T11:22:00", entities: ["PERSON-1042"], location: "New Delhi", description: "Arjun Mehta linked to vehicle sighting en route to financial transfer." },
  { id: "EVT-1012", type: "Communication", timestamp: "2026-03-10T23:05:00", entities: ["PERSON-1088", "PERSON-1056"], location: "Unknown", description: "Late-night call between Bridge entities." },
  { id: "EVT-1013", type: "AI Alert", timestamp: "2026-03-15T20:10:00", entities: ["PERSON-1078"], location: "Loc East Depot", description: "AI pattern: repeated presence of Deepak Joshi at Loc East Depot." },
  { id: "EVT-1014", type: "Location", timestamp: "2026-03-20T10:15:00", entities: ["PERSON-1123"], location: "Loc West Junction", description: "Priya Nair near West Junction during financial activity hour." },
  { id: "EVT-1015", type: "Communication", timestamp: "2026-03-22T21:12:00", entities: ["PERSON-1056", "PERSON-1078"], location: "Unknown", description: "Neha Verma calls Deepak Joshi — an anomaly from baseline behavior." },
  { id: "EVT-1016", type: "Organization", timestamp: "2026-03-28T10:44:00", entities: ["PERSON-1056", "ORG-334"], location: "Loc East Depot", description: "Neha Verma contacts Organization Gamma; documents shared." },
  { id: "EVT-1017", type: "Financial", timestamp: "2026-04-02T12:35:00", entities: ["ACCOUNT-9012", "ACCOUNT-9034"], location: "Mumbai", description: "Cross-cluster transfer of significant amount ACCT-9012 → ACCT-9034." },
  { id: "EVT-1018", type: "Location", timestamp: "2026-04-05T19:15:00", entities: ["PERSON-1088", "LOCATION-105"], location: "Loc East Depot", description: "Rahul Sharma observed at Loc East Depot — outside usual clusters." },
  { id: "EVT-1019", type: "Vehicle", timestamp: "2026-04-09T06:15:00", entities: ["VEHICLE-5001", "LOCATION-105"], location: "Loc East Depot", description: "Vehicle DL-1C-AB-1290 at Depot before sunrise." },
  { id: "EVT-1020", type: "Communication", timestamp: "2026-04-18T18:04:00", entities: ["PHONE-8821", "PHONE-8870"], location: "Unknown", description: "Bridge phone calls PHONE-8870." },
  { id: "EVT-1021", type: "AI Alert", timestamp: "2026-04-20T12:30:00", entities: ["PERSON-1042", "PERSON-1078"], location: "Loc Central Tower", description: "AI pattern: Arjun Mehta and Deepak Joshi co-located at Hub location." },
  { id: "EVT-1022", type: "Financial", timestamp: "2026-04-22T14:12:00", entities: ["ACCOUNT-9023", "ACCOUNT-9001"], location: "Mumbai", description: "Transfer ACCT-9023 → ACCT-9001; unusual for Cluster B account." },
  { id: "EVT-1023", type: "Organization", timestamp: "2026-05-29T16:20:00", entities: ["PERSON-1042", "ORG-221"], location: "Loc Central Tower", description: "Arjun Mehta contacts Organization Alpha — new cross-cluster edge." },
  { id: "EVT-1024", type: "Reports", timestamp: "2026-06-11T15:06:00", entities: ["PERSON-1123", "ORG-334"], location: "Loc East Depot", description: "Priya Nair referenced in an intelligence report about Organization Gamma." },
  { id: "EVT-1025", type: "AI Alert", timestamp: "2026-08-16T07:27:00", entities: ["VEHICLE-5031"], location: "Loc North Complex", description: "AI pattern: vehicle TN-10-CY-9088 reappears near Cluster A territory." },
  { id: "EVT-1026", type: "Reports", timestamp: "2026-09-05T18:36:00", entities: ["PHONE-8834", "PHONE-8870"], location: "Unknown", description: "Consolidated CDR: persistent link between Cluster A and Cluster C phones." },
];

export const eventCount = events.length;

export const TIMELINE_GROUPS = [
  "Call",
  "Location",
  "Vehicle",
  "Organization",
  "Financial",
  "Reports",
  "AI Alert",
] as const;