
// /* Coverage api data - starts */
// export interface Coverage {
//     CoverageID: string | number,
//     CoverageName: string,
//     ImageName: string,
//     Includes: {
//         "Coverage includes": string[]
//     },
//     Excludes: {
//         "Coverage excludes": string[]
//     },
//     CoverageFields: {
//         field_1: {
//             label: string,
//             note: string,
//         },
//         field_2?: {
//             label: string | null,
//             note: string,
//         }
//     }
//     Fireinsurance: number | null,
//     FirePerlis: number | null,
//     InsPercent: number,
//     IsABR: 0 | 1,
//     PageOrder: string,
//     isOptional: 0 | 1
// }

// /* Coverage api data - ends */

// export interface NecessaryBasicInfo {
//     quote_id: string,
//     company_name: string,
//     registration_number: string,
//     username: string,
//     address_one: string,
//     address_two: string,
//     city: string,
//     postal_code: number,
//     email: string,
//     password: string,
//     phone_number: number,
//     remarks: string,
//     multiemail: string,
//     company_logo: string,
//     company_logo_data: string,
//     admin_profile_image: string,
//     admin_profile_image_data: string,
//     status: number,
//     company_logo_edit: string,
//     company_logo_edit_data: string,
//     admin_profile_edit: string,
//     admin_profile_edit_data: string,
//     access: {
//         download_quote: string,
//         download_form: string,
//         own_approval: string,
//         download_breakdown: string,
//         download_insurer_breakdown: string,
//     }
// }

// export interface NecessaryReInsurerBasicInfo {
//     quote_id: string,
//     company_name: string,
//     registration_number: string,
//     username: string,
//     address_one: string,
//     address_two: string,
//     city: string,
//     postal_code: number,
//     email: string,
//     password: string,
//     phone_number: number,
//     remarks: string,
//     multiemail: string,
//     company_logo: string,
//     company_logo_data: string,
//     admin_profile_image: string,
//     admin_profile_image_data: string,
//     status: number,
//     company_logo_edit: string,
//     company_logo_edit_data: string,
//     admin_profile_edit: string,
//     admin_profile_edit_data: string,
//     country: CountryMap,
//     access: {
//         download_quote: string,
//         download_form: string,
//         own_approval: string,
//         download_breakdown: string,
//         download_insurer_breakdown: string,
//     }
// }

// type CountryMap = {
//     [key: string]: "0" | "1";
// };

// export type Country = {
//     id: string,
//     name_en: string
// }

// export interface BasicInfo {
//     email: string,
//     password: string,
//     country: string,
// }

// export interface Quotation {
//     quote_id: string;
//     company_name: string;
//     email_id: string;
//     contact_number: string;
//     Industryname: string;
//     net_premium: number;
//     tax: number;
//     stamp_duty: number;
//     final_premium: number;
// };

// export interface Quotationdata {
//     is_edit_premium_amount_status: any
//     download_s3_pdf_path: string;
//     download_s3_pdf_path_admin: string;
//     quote_id: string;
//     company_name: string;
//     email_id: string;
//     contact_number: string;
//     Industryname: string;
//     industry_image_path: string;
//     net_premium: number;
//     tax: number;
//     stamp_duty: number;
//     final_premium: number;
//     transit_condition: {
//         staff: number;
//         armed_guard: number;
//         amoured_vehicle: number;
//         transit_amount_start: number;
//         transit_amount_end: number;
//         transit_combined_amount: string;
//     }[];
//     transit_value: number;
// };

// export interface Quote {
//     transit_condition: TransitRowAPI[];
//     transit_value: number;
// }

// export interface TransitRowAPI {
//     staff: number;
//     armed_guard: number;
//     amoured_vehicle: number;
//     transit_amount_start: number;
//     transit_amount_end: number;
//     transit_combined_amount: string;
// }

// export interface TransitRow {
//     key: string;
//     from: string;
//     to: string;
//     employees: string;
//     armed_guard: string;
//     amoured_vehicle: string;
//     error?: string;
// }

// export interface Profiledata {
//     label: any;
//     id: any;
//     business_details: {
//         label: string;
//         value: any;
//         image_path: string;
//     }[];
//     image_path: string;
// };

// export interface SelectedCoverage {
//     id: number | string,
//     field_1?: number,
//     field_2?: number,
// }

// export interface ClaimDeclarationAdditionalData {
//     type: string,
//     year: string,
//     amount: number,
//     description: string
// }

// export type InsuranceType = null | 'FIRE' | 'FIRE_PERILS';

// // Data for final submit
// export interface ClinicData {
//     quoteId: string,
//     basic: NecessaryBasicInfo,
//     basicInsurer: NecessaryReInsurerBasicInfo,
//     basics: BasicInfo,
//     basicValue: CategoryBasicInfo,
//     faqValue: FaqBasicInfo,
//     selectedCoverages: SelectedCoverage[],
//     selectedInsType: null | 'FIRE' | 'FIRE_PERILS',
//     selectedOptionalCoverages: SelectedCoverage[],
//     promoCode: string,
//     promoCodePercentage: null | number,
//     insStartDate: string,
//     PICName: string,
//     PICID: string,
//     isPaid: boolean,
//     paymentApproved: boolean,
//     claimDeclaration: {
//         previouslyClaimed: boolean | null,
//         addtionalInfo: ClaimDeclarationAdditionalData[]
//     }
// }

// export interface CategoryBasicInfo {
//     category_id: string,
//     category_name: string,
//     remarks: string,
//     status: number,
//     category_logo: string,
//     category_logo_data: string,
//     category_logo_edit: string,
//     category_logo_edit_data: string,
// }


// export interface FaqBasicInfo {
//     faq_id: string,
//     category_id: string,
//     faq_question: string,
//     faq_answer: string,
//     remarks: string,
//     status: number,
// }
