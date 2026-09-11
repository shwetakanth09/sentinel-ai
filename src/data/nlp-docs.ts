export interface ExtractedEntity {
  name: string;
  type: string;
  id: string;
  confidence: number;
  span: [number, number];
}

export interface ExtractedRelationship {
  source: string;
  target: string;
  type: string;
  confidence: number;
  span: [number, number];
}

export interface NlpDocument {
  id: string;
  title: string;
  source: string;
  content: string;
  extractedEntities: ExtractedEntity[];
  extractedRelationships: ExtractedRelationship[];
}

export const nlpDocuments: NlpDocument[] = [
  {
    id: "DOC-001",
    title: "Field Intelligence Report · FR-2026-231",
    source: "Intelligence Reports",
    content:
      "On 12 August, Arjun Mehta met Rahul Sharma at Hotel Alpha. Rahul later contacted Organization X. A vehicle associated with Arjun was observed near Location Y. The meeting lasted approximately forty five minutes. Two unknown persons arrived in a white sedan and left together. Multiple calls were made from Phone 88121 during the meeting window.",
    extractedEntities: [
      { name: "Arjun Mehta", type: "PERSON", id: "PERSON-1042", confidence: 0.95, span: [7, 18] },
      { name: "Rahul Sharma", type: "PERSON", id: "PERSON-1088", confidence: 0.94, span: [24, 36] },
      { name: "Hotel Alpha", type: "LOCATION", id: "LOCATION-103", confidence: 0.86, span: [41, 52] },
      { name: "Organization X", type: "ORGANIZATION", id: "ORG-334", confidence: 0.83, span: [72, 86] },
      { name: "Location Y", type: "LOCATION", id: "LOCATION-105", confidence: 0.81, span: [119, 129] },
      { name: "Vehicle (white sedan)", type: "VEHICLE", id: "VEHICLE-5001", confidence: 0.72, span: [160, 182] },
      { name: "Phone 88121", type: "PHONE", id: "PHONE-8821", confidence: 0.89, span: [229, 240] },
    ],
    extractedRelationships: [
      { source: "Arjun Mehta", target: "Rahul Sharma", type: "MET", confidence: 0.92, span: [14, 36] },
      { source: "Rahul Sharma", target: "Organization X", type: "CONTACTED", confidence: 0.80, span: [55, 86] },
      { source: "Arjun Mehta", target: "Vehicle (white sedan)", type: "ASSOCIATED_WITH", confidence: 0.75, span: [108, 129] },
      { source: "Vehicle (white sedan)", target: "Location Y", type: "OBSERVED_AT", confidence: 0.74, span: [142, 155] },
      { source: "Arjun Mehta", target: "Hotel Alpha", type: "ATTENDED", confidence: 0.84, span: [11, 52] },
      { source: "Phone 88121", target: "Location Y", type: "CONNECTED_TO", confidence: 0.70, span: [225, 245] },
    ],
  },
  {
    id: "DOC-002",
    title: "Surveillance Log · SURV-2291",
    source: "Surveillance Reports",
    content:
      "Subject Neha Verma arrived at Loc Central Tower at 14:20 accompanied by Sanjay Gupta. The pair met Rahul Sharma and exited after thirty minutes. A dark sedan hired by Organization Gamma arrived and collected documents from LOCATION East Depot earlier that morning.",
    extractedEntities: [
      { name: "Neha Verma", type: "PERSON", id: "PERSON-1056", confidence: 0.94, span: [8, 19] },
      { name: "Sanjay Gupta", type: "PERSON", id: "PERSON-1063", confidence: 0.92, span: [48, 61] },
      { name: "Rahul Sharma", type: "PERSON", id: "PERSON-1088", confidence: 0.91, span: [83, 96] },
      { name: "Loc Central Tower", type: "LOCATION", id: "LOCATION-103", confidence: 0.88, span: [30, 47] },
      { name: "Organization Gamma", type: "ORGANIZATION", id: "ORG-334", confidence: 0.82, span: [145, 162] },
      { name: "LOCATION East Depot", type: "LOCATION", id: "LOCATION-105", confidence: 0.80, span: [190, 207] },
    ],
    extractedRelationships: [
      { source: "Neha Verma", target: "Sanjay Gupta", type: "MET", confidence: 0.90, span: [25, 61] },
      { source: "Neha Verma", target: "Rahul Sharma", type: "MET", confidence: 0.88, span: [78, 96] },
      { source: "Organization Gamma", target: "LOCATION East Depot", type: "CONNECTED_TO", confidence: 0.72, span: [175, 207] },
    ],
  },
];

export const DEFAULT_NLP_DOC_ID = "DOC-001";