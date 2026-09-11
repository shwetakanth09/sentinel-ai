import type { DataSourceStatus } from "@/types";

export const dataSources: DataSourceStatus[] = [
  { id: "SRC-01", name: "FIR / Police Reports", icon: "FileText", records: 184, processed: true, lastIngested: "2026-09-02T08:12:00", format: "PDF/TXT", description: "First information reports and structured police records." },
  { id: "SRC-02", name: "Call Detail Records", icon: "Phone", records: 412, processed: true, lastIngested: "2026-09-02T08:14:00", format: "CSV", description: "CDR subscriber and call metadata." },
  { id: "SRC-03", name: "Financial Transactions", icon: "Banknote", records: 196, processed: true, lastIngested: "2026-09-02T08:16:00", format: "CSV", description: "Account flow and transfer records." },
  { id: "SRC-04", name: "Surveillance Reports", icon: "Video", records: 88, processed: true, lastIngested: "2026-09-02T08:18:00", format: "JSON", description: "Observation logs and field reports." },
  { id: "SRC-05", name: "Social Intelligence", icon: "Share2", records: 127, processed: true, lastIngested: "2026-09-02T08:20:00", format: "JSON", description: "Public social media intelligence (anonymized)." },
  { id: "SRC-06", name: "Criminal History", icon: "ShieldAlert", records: 43, processed: true, lastIngested: "2026-09-02T08:22:00", format: "CSV", description: "Prior case records and history summaries." },
  { id: "SRC-07", name: "Intelligence Reports", icon: "Radar", records: 91, processed: true, lastIngested: "2026-09-02T08:24:00", format: "TXT", description: "Agency intelligence briefs and leads." },
  { id: "SRC-08", name: "Vehicle Records", icon: "Car", records: 76, processed: true, lastIngested: "2026-09-02T08:26:00", format: "CSV", description: "Registration and movement records." },
  { id: "SRC-09", name: "Location Data", icon: "MapPin", records: 67, processed: true, lastIngested: "2026-09-02T08:28:00", format: "JSON", description: "Geolocation and sensor enrichment data." },
];

export const demoProcessingTotals = {
  entities: 1284,
  relationships: 3892,
  patterns: 27,
  highPriority: 8,
};