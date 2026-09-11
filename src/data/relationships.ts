import type { Relationship } from "@/types";

export const relationships: Relationship[] = [
  // ═══════════════ CLUSTER A INTERNAL ═══════════════
  // Arjun Mehta — hub
  { id: "REL-1001", source: "PERSON-1042", target: "PERSON-1088", type: "MET", timestamp: "2026-01-12T09:20:00", confidence: 0.91, sourceReference: "FIR-2026-014/3" },
  { id: "REL-1002", source: "PERSON-1042", target: "PERSON-1123", type: "CALLED", timestamp: "2026-01-18T21:04:00", confidence: 0.93, sourceReference: "CDR-66821" },
  { id: "REL-1003", source: "PERSON-1042", target: "PERSON-1134", type: "CALLED", timestamp: "2026-02-02T19:35:00", confidence: 0.90, sourceReference: "CDR-66852" },
  { id: "REL-1004", source: "PERSON-1042", target: "PHONE-8821", type: "ASSOCIATED_WITH", timestamp: "2026-01-30T12:00:00", confidence: 0.88, sourceReference: "CDR-66821" },
  { id: "REL-1005", source: "PERSON-1042", target: "VEHICLE-5001", type: "USED", timestamp: "2026-02-08T07:12:00", confidence: 0.87, sourceReference: "TRAFFIC-CAM-412" },
  { id: "REL-1006", source: "PERSON-1042", target: "LOCATION-101", type: "OBSERVED_AT", timestamp: "2026-02-11T16:40:00", confidence: 0.85, sourceReference: "SURV-2241" },
  { id: "REL-1007", source: "PERSON-1042", target: "ACCOUNT-9001", type: "TRANSFERRED_TO", timestamp: "2026-03-02T11:22:00", confidence: 0.89, sourceReference: "FIN-STR-8211" },
  { id: "REL-1008", source: "PERSON-1042", target: "PERSON-1063", type: "CALLED", timestamp: "2026-03-14T22:18:00", confidence: 0.84, sourceReference: "CDR-69100" },
  // Rahul Sharma (bridge A-B)
  { id: "REL-1009", source: "PERSON-1088", target: "PHONE-8834", type: "ASSOCIATED_WITH", timestamp: "2026-01-25T10:00:00", confidence: 0.86, sourceReference: "CDR-67001" },
  { id: "REL-1010", source: "PERSON-1088", target: "PERSON-1123", type: "MET", timestamp: "2026-01-28T14:15:00", confidence: 0.88, sourceReference: "FIR-2026-014/3" },
  { id: "REL-1011", source: "PERSON-1088", target: "PHONE-8821", type: "CALLED", timestamp: "2026-02-06T20:41:00", confidence: 0.92, sourceReference: "CDR-67033" },
  { id: "REL-1012", source: "PERSON-1088", target: "VEHICLE-5012", type: "USED", timestamp: "2026-02-19T18:03:00", confidence: 0.83, sourceReference: "TRAFFIC-CAM-501" },
  { id: "REL-1013", source: "PERSON-1088", target: "ORG-225", type: "WORKS_FOR", timestamp: "2026-01-15T09:00:00", confidence: 0.85, sourceReference: "EMPLOYEE-REC-201" },
  { id: "REL-1014", source: "PERSON-1088", target: "PERSON-1056", type: "CALLED", timestamp: "2026-03-10T23:05:00", confidence: 0.87, sourceReference: "CDR-69101" },
  // Priya Nair
  { id: "REL-1015", source: "PERSON-1123", target: "PHONE-8845", type: "ASSOCIATED_WITH", timestamp: "2026-02-01T11:30:00", confidence: 0.85, sourceReference: "CDR-67710" },
  { id: "REL-1016", source: "PERSON-1123", target: "PERSON-1134", type: "CALLED", timestamp: "2026-02-22T09:48:00", confidence: 0.89, sourceReference: "CDR-67730" },
  { id: "REL-1017", source: "PERSON-1123", target: "LOCATION-102", type: "OBSERVED_AT", timestamp: "2026-03-04T13:20:00", confidence: 0.82, sourceReference: "SURV-2274" },
  { id: "REL-1018", source: "PERSON-1123", target: "ACCOUNT-9001", type: "TRANSFERRED_TO", timestamp: "2026-03-20T10:15:00", confidence: 0.83, sourceReference: "FIN-STR-8310" },
  // Vikram Rao
  { id: "REL-1019", source: "PERSON-1134", target: "PHONE-8834", type: "CALLED", timestamp: "2026-02-14T17:55:00", confidence: 0.88, sourceReference: "CDR-68100" },
  { id: "REL-1020", source: "PERSON-1134", target: "VEHICLE-5001", type: "USED", timestamp: "2026-02-27T06:30:00", confidence: 0.84, sourceReference: "TRAFFIC-CAM-402" },
  { id: "REL-1021", source: "PERSON-1134", target: "LOCATION-101", type: "OBSERVED_AT", timestamp: "2026-03-08T21:10:00", confidence: 0.81, sourceReference: "SURV-2299" },
  // Phones ↔ locations
  { id: "REL-1022", source: "PHONE-8821", target: "PHONE-8856", type: "CALLED", timestamp: "2026-01-22T15:33:00", confidence: 0.94, sourceReference: "CDR-67100" },
  { id: "REL-1023", source: "PHONE-8834", target: "PHONE-8845", type: "CALLED", timestamp: "2026-02-12T04:12:00", confidence: 0.90, sourceReference: "CDR-68200" },
  { id: "REL-1024", source: "VEHICLE-5001", target: "LOCATION-101", type: "OBSERVED_AT", timestamp: "2026-02-09T15:45:00", confidence: 0.86, sourceReference: "TRAFFIC-CAM-412" },
  { id: "REL-1025", source: "VEHICLE-5001", target: "LOCATION-102", type: "OBSERVED_AT", timestamp: "2026-03-11T08:20:00", confidence: 0.83, sourceReference: "TRAFFIC-CAM-477" },
  { id: "REL-1026", source: "VEHICLE-5012", target: "LOCATION-102", type: "OBSERVED_AT", timestamp: "2026-02-21T18:50:00", confidence: 0.82, sourceReference: "TRAFFIC-CAM-477" },

  // ═══════════════ BRIDGE A ↔ B ═══════════════
  { id: "REL-2001", source: "PHONE-8821", target: "PHONE-8856", type: "CALLED", timestamp: "2026-02-06T22:14:00", confidence: 0.95, sourceReference: "CDR-67211" },
  { id: "REL-2002", source: "PERSON-1088", target: "PERSON-1056", type: "MET", timestamp: "2026-02-13T10:30:00", confidence: 0.86, sourceReference: "SURV-2291" },
  { id: "REL-2003", source: "PERSON-1088", target: "ORG-221", type: "CONTACTED", timestamp: "2026-02-26T16:22:00", confidence: 0.80, sourceReference: "INTEL-301" },
  { id: "REL-2004", source: "PERSON-1042", target: "PERSON-1063", type: "CALLED", timestamp: "2026-03-05T20:40:00", confidence: 0.85, sourceReference: "CDR-69100" },
  { id: "REL-2005", source: "PERSON-1123", target: "ORG-225", type: "CONTACTED", timestamp: "2026-03-18T09:14:00", confidence: 0.74, sourceReference: "INTEL-312" },
  { id: "REL-2006", source: "PHONE-8834", target: "PERSON-1077", type: "CALLED", timestamp: "2026-02-15T07:58:00", confidence: 0.88, sourceReference: "CDR-68210" },

  // ═══════════════ CLUSTER B INTERNAL ═══════════════
  // Neha Verma — hub (bridge B-C)
  { id: "REL-2101", source: "PERSON-1056", target: "ORG-221", type: "WORKS_FOR", timestamp: "2026-01-10T09:00:00", confidence: 0.87, sourceReference: "EMPLOYEE-REC-114" },
  { id: "REL-2102", source: "PERSON-1056", target: "PERSON-1063", type: "MET", timestamp: "2026-01-20T14:00:00", confidence: 0.90, sourceReference: "FIR-2026-014/5" },
  { id: "REL-2103", source: "PERSON-1056", target: "PHONE-8856", type: "ASSOCIATED_WITH", timestamp: "2026-02-04T12:00:00", confidence: 0.86, sourceReference: "CDR-67001" },
  { id: "REL-2104", source: "PERSON-1056", target: "ACCOUNT-9012", type: "TRANSFERRED_TO", timestamp: "2026-02-24T10:08:00", confidence: 0.88, sourceReference: "FIN-STR-8331" },
  { id: "REL-2105", source: "PERSON-1056", target: "LOCATION-103", type: "OBSERVED_AT", timestamp: "2026-03-03T18:26:00", confidence: 0.84, sourceReference: "SURV-2288" },
  { id: "REL-2106", source: "PERSON-1056", target: "PERSON-1078", type: "CALLED", timestamp: "2026-03-22T21:12:00", confidence: 0.85, sourceReference: "CDR-69910" },
  // Sanjay Gupta
  { id: "REL-2107", source: "PERSON-1063", target: "ORG-221", type: "WORKS_FOR", timestamp: "2026-01-12T09:00:00", confidence: 0.86, sourceReference: "EMPLOYEE-REC-115" },
  { id: "REL-2108", source: "PERSON-1063", target: "ACCOUNT-9023", type: "TRANSFERRED_TO", timestamp: "2026-02-17T13:44:00", confidence: 0.85, sourceReference: "FIN-STR-8340" },
  { id: "REL-2109", source: "PERSON-1063", target: "LOCATION-104", type: "OBSERVED_AT", timestamp: "2026-03-01T11:05:00", confidence: 0.83, sourceReference: "SURV-2300" },
  // Aisha Khan
  { id: "REL-2110", source: "PERSON-1077", target: "ORG-225", type: "WORKS_FOR", timestamp: "2026-01-16T09:00:00", confidence: 0.85, sourceReference: "EMPLOYEE-REC-216" },
  { id: "REL-2111", source: "PERSON-1077", target: "ACCOUNT-9012", type: "TRANSFERRED_TO", timestamp: "2026-02-09T15:30:00", confidence: 0.84, sourceReference: "FIN-STR-8361" },
  // Ravi Menon
  { id: "REL-2112", source: "PERSON-1102", target: "ORG-225", type: "WORKS_FOR", timestamp: "2026-01-08T09:00:00", confidence: 0.84, sourceReference: "EMPLOYEE-REC-217" },
  { id: "REL-2113", source: "PERSON-1102", target: "VEHICLE-5020", type: "USED", timestamp: "2026-02-26T07:20:00", confidence: 0.82, sourceReference: "TRAFFIC-CAM-600" },
  { id: "REL-2114", source: "PERSON-1102", target: "LOCATION-103", type: "OBSERVED_AT", timestamp: "2026-03-12T17:02:00", confidence: 0.80, sourceReference: "SURV-2304" },
  // Org structure
  { id: "REL-2115", source: "ORG-221", target: "ACCOUNT-9012", type: "CONNECTED_TO", timestamp: "2026-01-19T12:00:00", confidence: 0.82, sourceReference: "FIN-STR-8345" },
  { id: "REL-2116", source: "ORG-225", target: "ACCOUNT-9023", type: "CONNECTED_TO", timestamp: "2026-02-11T12:00:00", confidence: 0.81, sourceReference: "FIN-STR-8352" },
  { id: "REL-2117", source: "ORG-221", target: "LOCATION-103", type: "LOCATED_AT", timestamp: "2026-01-22T12:00:00", confidence: 0.87, sourceReference: "REGISTRY-118" },
  { id: "REL-2118", source: "ORG-225", target: "LOCATION-104", type: "LOCATED_AT", timestamp: "2026-02-03T12:00:00", confidence: 0.86, sourceReference: "REGISTRY-134" },
  { id: "REL-2119", source: "PERSON-1056", target: "EVENT-2015", type: "ATTENDED", timestamp: "2026-02-03T14:30:00", confidence: 0.83, sourceReference: "SURV-2291" },
  { id: "REL-2120", source: "PERSON-1063", target: "EVENT-2015", type: "ATTENDED", timestamp: "2026-02-03T14:30:00", confidence: 0.83, sourceReference: "SURV-2291" },
  { id: "REL-2121", source: "PERSON-1077", target: "EVENT-2015", type: "ATTENDED", timestamp: "2026-02-03T14:30:00", confidence: 0.82, sourceReference: "SURV-2291" },

  // ═══════════════ BRIDGE B ↔ C ═══════════════
  { id: "REL-2201", source: "PERSON-1056", target: "PERSON-1078", type: "CALLED", timestamp: "2026-03-22T21:12:00", confidence: 0.85, sourceReference: "CDR-69910" },
  { id: "REL-2202", source: "PERSON-1056", target: "ORG-334", type: "CONTACTED", timestamp: "2026-03-28T10:44:00", confidence: 0.76, sourceReference: "INTEL-340" },
  { id: "REL-2203", source: "ACCOUNT-9012", target: "ACCOUNT-9034", type: "TRANSFERRED_TO", timestamp: "2026-04-02T12:35:00", confidence: 0.88, sourceReference: "FIN-STR-8410" },
  { id: "REL-2204", source: "PERSON-1088", target: "LOCATION-105", type: "OBSERVED_AT", timestamp: "2026-04-05T19:15:00", confidence: 0.79, sourceReference: "SURV-2311" },
  { id: "REL-2205", source: "LOCATION-103", target: "LOCATION-105", type: "CONNECTED_TO", timestamp: "2026-04-08T12:00:00", confidence: 0.77, sourceReference: "GEOLOC-4502" },

  // ═══════════════ CLUSTER C INTERNAL ═══════════════
  // Deepak Joshi — hub
  { id: "REL-3101", source: "PERSON-1078", target: "ORG-334", type: "WORKS_FOR", timestamp: "2026-01-14T09:00:00", confidence: 0.87, sourceReference: "EMPLOYEE-REC-318" },
  { id: "REL-3102", source: "PERSON-1078", target: "PERSON-1091", type: "MET", timestamp: "2026-01-27T16:45:00", confidence: 0.88, sourceReference: "FIR-2026-014/7" },
  { id: "REL-3103", source: "PERSON-1078", target: "PERSON-1105", type: "CALLED", timestamp: "2026-02-16T08:33:00", confidence: 0.87, sourceReference: "CDR-69021" },
  { id: "REL-3104", source: "PERSON-1078", target: "PHONE-8870", type: "ASSOCIATED_WITH", timestamp: "2026-02-20T12:00:00", confidence: 0.86, sourceReference: "CDR-69021" },
  { id: "REL-3105", source: "PERSON-1078", target: "VEHICLE-5031", type: "USED", timestamp: "2026-03-09T05:55:00", confidence: 0.85, sourceReference: "TRAFFIC-CAM-720" },
  { id: "REL-3106", source: "PERSON-1078", target: "LOCATION-105", type: "OBSERVED_AT", timestamp: "2026-03-15T20:10:00", confidence: 0.84, sourceReference: "SURV-2308" },
  { id: "REL-3107", source: "PERSON-1078", target: "ACCOUNT-9034", type: "TRANSFERRED_TO", timestamp: "2026-03-25T15:41:00", confidence: 0.87, sourceReference: "FIN-STR-8421" },
  // Meera Iyer
  { id: "REL-3108", source: "PERSON-1091", target: "ORG-334", type: "WORKS_FOR", timestamp: "2026-01-18T09:00:00", confidence: 0.85, sourceReference: "EMPLOYEE-REC-319" },
  { id: "REL-3109", source: "PERSON-1091", target: "VEHICLE-5042", type: "USED", timestamp: "2026-02-24T07:45:00", confidence: 0.82, sourceReference: "TRAFFIC-CAM-733" },
  { id: "REL-3110", source: "PERSON-1091", target: "LOCATION-106", type: "OBSERVED_AT", timestamp: "2026-03-06T22:35:00", confidence: 0.81, sourceReference: "SURV-2312" },
  // Kunal Desai
  { id: "REL-3111", source: "PERSON-1105", target: "ORG-338", type: "WORKS_FOR", timestamp: "2026-01-22T09:00:00", confidence: 0.85, sourceReference: "EMPLOYEE-REC-402" },
  { id: "REL-3112", source: "PERSON-1105", target: "PERSON-1112", type: "MET", timestamp: "2026-02-18T13:30:00", confidence: 0.84, sourceReference: "FIR-2026-014/7" },
  { id: "REL-3113", source: "PERSON-1105", target: "LOCATION-105", type: "OBSERVED_AT", timestamp: "2026-03-16T17:48:00", confidence: 0.82, sourceReference: "SURV-2314" },
  // Pooja Sinha
  { id: "REL-3114", source: "PERSON-1112", target: "ORG-338", type: "WORKS_FOR", timestamp: "2026-02-01T09:00:00", confidence: 0.84, sourceReference: "EMPLOYEE-REC-403" },
  { id: "REL-3115", source: "PERSON-1112", target: "ACCOUNT-9034", type: "TRANSFERRED_TO", timestamp: "2026-03-11T14:05:00", confidence: 0.83, sourceReference: "FIN-STR-8450" },
  // Org / location / vehicle
  { id: "REL-3116", source: "ORG-334", target: "LOCATION-105", type: "LOCATED_AT", timestamp: "2026-02-05T12:00:00", confidence: 0.87, sourceReference: "REGISTRY-201" },
  { id: "REL-3117", source: "ORG-338", target: "LOCATION-106", type: "LOCATED_AT", timestamp: "2026-02-19T12:00:00", confidence: 0.85, sourceReference: "REGISTRY-214" },
  { id: "REL-3118", source: "ORG-334", target: "ACCOUNT-9034", type: "CONNECTED_TO", timestamp: "2026-02-28T12:00:00", confidence: 0.83, sourceReference: "FIN-STR-8455" },
  { id: "REL-3119", source: "VEHICLE-5031", target: "LOCATION-105", type: "OBSERVED_AT", timestamp: "2026-03-09T06:02:00", confidence: 0.85, sourceReference: "TRAFFIC-CAM-720" },
  { id: "REL-3120", source: "VEHICLE-5042", target: "LOCATION-106", type: "OBSERVED_AT", timestamp: "2026-03-18T08:11:00", confidence: 0.84, sourceReference: "TRAFFIC-CAM-744" },
  { id: "REL-3121", source: "PHONE-8870", target: "PERSON-1105", type: "CALLED", timestamp: "2026-03-20T21:47:00", confidence: 0.86, sourceReference: "CDR-69821" },
  { id: "REL-3122", source: "VEHICLE-5020", target: "LOCATION-105", type: "OBSERVED_AT", timestamp: "2026-04-06T19:22:00", confidence: 0.78, sourceReference: "TRAFFIC-CAM-750" },

  // ═══════════════ CROSS WORD (A–C indirect) ═══════════════
  { id: "REL-4101", source: "ACCOUNT-9001", target: "ACCOUNT-9012", type: "TRANSFERRED_TO", timestamp: "2026-03-30T11:05:00", confidence: 0.87, sourceReference: "FIN-STR-8460" },
  { id: "REL-4102", source: "PHONE-8845", target: "PHONE-8870", type: "CALLED", timestamp: "2026-04-01T23:33:00", confidence: 0.83, sourceReference: "CDR-69700" },
  { id: "REL-4103", source: "PERSON-1134", target: "PERSON-1091", type: "CALLED", timestamp: "2026-04-03T20:22:00", confidence: 0.78, sourceReference: "CDR-69720" },
  { id: "REL-4104", source: "VEHICLE-5001", target: "LOCATION-105", type: "OBSERVED_AT", timestamp: "2026-04-09T06:15:00", confidence: 0.75, sourceReference: "TRAFFIC-CAM-412" },
  { id: "REL-4105", source: "LOCATION-102", target: "LOCATION-104", type: "CONNECTED_TO", timestamp: "2026-04-12T12:00:00", confidence: 0.72, sourceReference: "GEOLOC-4612" },
  { id: "REL-4106", source: "PERSON-1123", target: "PERSON-1105", type: "CALLED", timestamp: "2026-04-15T19:40:00", confidence: 0.74, sourceReference: "CDR-69800" },

  // ═══════════════ EXTENDED WEB (comms + financing) ═══════════════
  { id: "REL-5101", source: "PHONE-8821", target: "PHONE-8870", type: "CALLED", timestamp: "2026-04-18T18:04:00", confidence: 0.86, sourceReference: "CDR-69930" },
  { id: "REL-5104", source: "ORG-221", target: "ORG-334", type: "CONNECTED_TO", timestamp: "2026-04-25T11:00:00", confidence: 0.74, sourceReference: "INTEL-361" },
  { id: "REL-5105", source: "PERSON-1063", target: "PERSON-1088", type: "CALLED", timestamp: "2026-04-27T21:26:00", confidence: 0.80, sourceReference: "CDR-70010" },
  { id: "REL-5106", source: "PERSON-1077", target: "PERSON-1078", type: "CALLED", timestamp: "2026-04-29T09:36:00", confidence: 0.79, sourceReference: "CDR-70022" },
  { id: "REL-5107", source: "PHONE-8834", target: "PHONE-8856", type: "CALLED", timestamp: "2026-05-02T16:58:00", confidence: 0.85, sourceReference: "CDR-70080" },
  { id: "REL-5108", source: "PERSON-1102", target: "PERSON-1134", type: "CALLED", timestamp: "2026-05-05T20:02:00", confidence: 0.78, sourceReference: "CDR-70110" },
  { id: "REL-5114", source: "ACCOUNT-9034", target: "ACCOUNT-9012", type: "TRANSFERRED_TO", timestamp: "2026-05-24T10:55:00", confidence: 0.82, sourceReference: "FIN-STR-8610" },
  { id: "REL-5116", source: "PERSON-1042", target: "ORG-221", type: "CONTACTED", timestamp: "2026-05-29T16:20:00", confidence: 0.75, sourceReference: "INTEL-388" },
];

export const relationshipCount = relationships.length;

export const RELATIONSHIP_TYPES: Relationship["type"][] = [
  "CALLED",
  "MET",
  "ASSOCIATED_WITH",
  "WORKS_FOR",
  "LOCATED_AT",
  "USED",
  "TRANSFERRED_TO",
  "ATTENDED",
  "CONNECTED_TO",
  "CONTACTED",
  "OBSERVED_AT",
  "REGISTERED_TO",
];