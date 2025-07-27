export type ComplianceResult = {
    pactman_org_url: string;
  organization_info_last_modified: string;
  ein: string;
  organization_name: string;
  organization_name_aka: string | null;
  address_line1: string;
  address_line2: string | null;
  city: string;
  state: string;
  state_name: string;
  zip: string;
  filing_req_code: string;
  pub78_church_message: string | null;
  pub78_organization_name: string;
  pub78_ein: string;
  pub78_verified: boolean;
  pub78_city: string;
  pub78_state: string;
  pub78_indicator: string;
  organization_types: OrganizationType[];
  most_recent_pub78: string;
  bmf_church_message: string | null;
  bmf_organization_name: string;
  bmf_ein: string;
  bmf_status: boolean;
  most_recent_bmf: string;
  bmf_subsection: string;
  subsection_description: string;
  foundation_code: string;
  foundation_code_description: string | null;
  ruling_month: string;
  ruling_year: string;
  group_exemption: string;
  exempt_status_code: string;
  ofac_status: string;
  revocation_code: string | null;
  revocation_date: string | null;
  reinstatement_date: string | null;
  irs_bmf_pub78_conflict: boolean;
  foundation_509a_status: string;
  report_date: string;
  foundation_type_code: string;
  foundation_type_description: string;
  isCompliant: boolean;
}

export type OrganizationType = {
  organization_type: string;
  deductibility_limitation: string;
  deductibility_status_description: string;
}