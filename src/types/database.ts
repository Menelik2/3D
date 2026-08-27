export type UserRole = "SUPER_ADMIN" | "ADMIN" | "PRODUCER" | "EDITOR" | "CLIENT";

export type LeadStatus =
  | "NEW"
  | "CONTACTED"
  | "CONSULTATION_SCHEDULED"
  | "PROPOSAL_SENT"
  | "NEGOTIATION"
  | "CONFIRMED"
  | "IN_PRODUCTION"
  | "COMPLETED"
  | "CANCELLED"
  | "ARCHIVED";

export type ProjectStatus =
  | "IDEA"
  | "PRE_PRODUCTION"
  | "PRODUCTION"
  | "EDITING"
  | "COLOR_GRADING"
  | "CLIENT_REVIEW"
  | "FINAL_DELIVERY"
  | "COMPLETED"
  | "ON_HOLD"
  | "CANCELLED";

export interface LeadInsert {
  full_name: string;
  company?: string | null;
  email: string;
  phone?: string | null;
  whatsapp?: string | null;
  preferred_contact?: string | null;
  project_types?: string[];
  project_title?: string | null;
  project_description?: string | null;
  creative_idea?: string | null;
  references_text?: string | null;
  visual_style?: string | null;
  preferred_date?: string | null;
  alternative_date?: string | null;
  city?: string | null;
  location?: string | null;
  indoor_outdoor?: string | null;
  expected_duration?: string | null;
  budget_range?: string | null;
  source?: string;
}

export interface ConsultationInsert {
  consultation_type: string;
  full_name: string;
  email: string;
  phone?: string | null;
  preferred_date?: string | null;
  preferred_time?: string | null;
  notes?: string | null;
}
