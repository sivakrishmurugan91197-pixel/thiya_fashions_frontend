import * as cookie from 'cookie';
// import { ClinicData, Coverage, SelectedCoverage } from '../types';
// import { LAPTOP_MAX_COVERAGE_VALUE, MAX_AUDITOR_FEE_PERCENTAGE, MOBILE_MAX_COVERAGE_VALUE, PROTECTION_AND_LIABILITY_COVERAGE } from '../app/app_constants';
// import { CoverageResData } from '../hooks/use_sessionstorage';
// import { percentageResult } from './calculation';

export function getAuthTokenFromCookie(cookies) {
    const authToken = cookie.parse(cookies ?? '')['authToken'];
    return authToken ?? '';
}

export function setAuthToken(token) {
    document.cookie = cookie.serialize('authToken', token);
}


// const validateEmail = (email: string) => {
//     return email.match(
//         /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
//     ) != null;
// };

// export const getNumberFromString = (text: string, isInt: boolean = false) => {
//     var regex = /[+-]?\d+(\.\d+)?/g;
//     let value: RegExpMatchArray | null | number = text.match(regex);
//     if(value && value.length > 0) {
//         let temp = '';
//         value.forEach(e => temp += e);
//         if(isInt) return parseInt(temp);
//         return parseFloat(temp);
//     } else {
//         return null;
//     }
// }

// export const getNumberStringFromString = (text: string) => {
//     var regex = /[+-]?\d+(\.\d+)?/g;
//     let value: RegExpMatchArray | null | string = text.match(regex);
//     if (value && value.length > 0) {
//         let temp = '';
//         value.forEach(e => temp += e);
//         return temp;
//     } else {
//         return '';
//     }
// }
// export const isPasswordValid = (password: string): boolean => {
//     const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#^])[A-Za-z\d@$!%*?&#^]{8,}$/;
//     return passwordRegex.test(password);
// };

// export const removeTrailingZeros = (number: number | string) => {
//     return number.toString().replace(/\.00$/, '');;
// }

// // checks if the string contians special characters other than space, & and ,(comma)
// const isContainsSpecialCharactersUsingASCIIValue = (value: string) => {
//     const charCodeForAtSymbol = '@'.charCodeAt(0);
//     const charCodeForAndSymbol = '&'.charCodeAt(0);
//     const charCodeForComma = ','.charCodeAt(0);
//     const charCodeForSpace = ' '.charCodeAt(0);
//     const charCodeForSlash = '/'.charCodeAt(0);
//     const charCodeForaToz = [65, 90];
//     const charCodeForAToZ = [97, 122];
//     const charCodeFor0To9 = [48, 57];
//     const result = { isContain: false, modified: value }
//     let newModified = result.modified;
//     const tobeRepalcedText = 'TO_BE_REMOVED';
//     for (let i = 0; i < result.modified.length; i++) {
//         const char = result.modified[i];
//         const charCode = char.charCodeAt(0);
//         const isAlphabet = (charCode >= charCodeForaToz[0] && charCode <= charCodeForaToz[1]) || (charCode >= charCodeForAToZ[0] && charCode <= charCodeForAToZ[1])
//         const isNumber = (charCode >= charCodeFor0To9[0] && charCode <= charCodeFor0To9[1])
//         const isExcludedSpecialCharacters = [charCodeForAtSymbol, charCodeForAndSymbol, charCodeForComma, charCodeForSpace, charCodeForSlash].includes(charCode)
//         if (isAlphabet == false && isNumber == false && isExcludedSpecialCharacters == false) {
//             result.isContain = true;
//             const countOccurrences = (inputString: string, targetWord: string) => (inputString.match(new RegExp(targetWord, 'gi')) || []).length;
//             const occuranceCount = countOccurrences(newModified, tobeRepalcedText);
//             newModified = newModified.includes(tobeRepalcedText) ?
//                 newModified.substring(0, i + (occuranceCount * tobeRepalcedText.length) - occuranceCount) + tobeRepalcedText + newModified.substring(i + (occuranceCount * tobeRepalcedText.length) - occuranceCount + 1) :
//                 newModified.substring(0, i) + tobeRepalcedText + newModified.substring(i + 1);
//         }
//     }
//     result.modified = newModified.replaceAll(tobeRepalcedText, '');
//     return result;
// }

// const isContainsSpecialCharactersUsingASCIIValueClinic = (value: string) => {
//     const charCodeForSpace = ' '.charCodeAt(0);
//     const charCodeForaToz = [65, 90];
//     const charCodeForAToZ = [97, 122];
//     const charCodeFor0To9 = [48, 57];

//     // Allowed characters including: & . , ' ’ - /
//     const allowedCharCodes = [
//         '&'.charCodeAt(0),   // 38
//         '.'.charCodeAt(0),   // 46
//         ','.charCodeAt(0),   // 44
//         "'".charCodeAt(0),   // 39
//         '’'.charCodeAt(0),   // 8217 – curly apostrophe
//         '-'.charCodeAt(0),   // 45
//         '/'.charCodeAt(0),   // 47
//         charCodeForSpace     // 32
//     ];

//     const result = { isContain: false, modified: '' };

//     for (let i = 0; i < value.length; i++) {
//         const char = value[i];
//         const charCode = char.charCodeAt(0);

//         const isAlphabet =
//             (charCode >= charCodeForaToz[0] && charCode <= charCodeForaToz[1]) ||
//             (charCode >= charCodeForAToZ[0] && charCode <= charCodeForAToZ[1]);

//         const isNumber = charCode >= charCodeFor0To9[0] && charCode <= charCodeFor0To9[1];

//         const isAllowedSpecial = allowedCharCodes.includes(charCode);

//         if (isAlphabet || isNumber || isAllowedSpecial) {
//             result.modified += char;
//         } else {
//             result.isContain = true;
//         }
//     }

//     return result;
// };

// // checks if the string contians special characters other than space, & and ,(comma)
// export const isContainsSpecialCharacters = (value: string) => {
//     const regEx = /[`!#$%^@*()_+\-=\[\]{};':"“”\\|.<>?~]|[\u20AC\u20A6\u20B9\u20A8\$\£\¥\₹]/;
//     const result = { isContain: regEx.test(value), modified: value.replaceAll(new RegExp(regEx, 'g'), '') };
//     const resultUsingASCII = isContainsSpecialCharactersUsingASCIIValue(result.modified);
//     result.modified = resultUsingASCII.modified;
//     result.isContain = result.isContain || resultUsingASCII.isContain;
//     return result;
// }

// export const isContainsSpecialCharactersClinicName = (value: string) => {
//     const regEx = /[`!#^*()_+\=\[\]{};:"“”\\|<>?~]|[\u20AC\u20A6\u20B9\u20A8£¥₹$]/g;
//     const result = { isContain: regEx.test(value), modified: value.replaceAll(new RegExp(regEx, 'g'), '') };
//     const resultUsingASCII = isContainsSpecialCharactersUsingASCIIValueClinic(result.modified);
//     result.modified = resultUsingASCII.modified;
//     result.isContain = result.isContain || resultUsingASCII.isContain;
//     return result;
// };


// export const isContainsAlphabets = (value: string) => {
//     const regEx = /[a-zA-Z]/;
//     return { isContain: regEx.test(value), modified: value.replaceAll(new RegExp(regEx, 'g'), '') }
// }

// export const isContainsNumericCharacters = (value: string) => {
//     const regEx = /[`0-9]/;
//     return { isContain: regEx.test(value), modified: value.replaceAll(new RegExp(regEx, 'g'), '') };
// }

// export const convertToPriceFormat = (value: number | string | null | undefined, acceptZero: boolean = false, removeTrailingZero: boolean = false) => {
//     const numberValue = Number(value);
//     const regex = /\d(?=(\d{3})+\.)/g;
//     if (acceptZero && (numberValue == 0 || value == undefined)) return removeTrailingZero ? '0' : '0.00';
//     return numberValue == 0 || value == undefined ? '' : removeTrailingZero ? numberValue.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') : numberValue.toFixed(2).replace(regex, '$&,');
// }

// export const convertToPriceFormatValue = (value: number | string | null | undefined, acceptZero: boolean = false, removeTrailingZero: boolean = false) => {
//     const numberValue = Number(value);
//     const validFormat = /^\d{1,7}(\.\d{1,2})?$/.test(String(value));
//     const regex = /\d(?=(\d{3})+\.)/g;

//     if (!validFormat) return '2000.00'; // or throw error, or fallback

//     if (acceptZero && (numberValue === 0 || value === undefined))
//         return removeTrailingZero ? '0' : '0.00';

//     if (numberValue === 0 || value === undefined) return '';

//     return removeTrailingZero
//         ? numberValue.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
//         : numberValue.toFixed(2).replace(regex, '$&,');
// }

// export const getRecentYears = (count: number = 3, ignoreCurrentYear: boolean = false) => {
//     const currentYear = new Date().getFullYear();
//     const recentYears = [...Array(count).keys()].reverse().map(e => ignoreCurrentYear ? currentYear - e - 1 : currentYear - e).map(String);
//     return recentYears;
// }

// export const convertDateToString = (date: Date) => {
//     return formatDateToYyyyMmDd(date);
// }

// export const convertStringToDate = (dateString: string) => {
//     if (dateString == null || dateString == '') return;
//     // Parse the input date string into a Date object
//     const parts = dateString.split("-");
//     const day = parseInt(parts[2], 10);
//     const month = parseInt(parts[1], 10) - 1; // Month is zero-based
//     const year = parseInt(parts[0], 10);

//     const givenDate = new Date(year, month, day);
//     return givenDate;
// }

// export const formatDateToYyyyMmDd = (date: Date) => {
//     const year = date.getFullYear();
//     const month = String(date.getMonth() + 1).padStart(2, '0'); // Month is zero-based
//     const day = String(date.getDate()).padStart(2, '0');

//     return `${year}-${month}-${day}`;
// }

// export const getDateAfter365Days = (fromDate: string) => {
//     if (fromDate == null || fromDate == '') return '';
//     // Parse the input date string into a Date object
//     const parts = fromDate.split("-");
//     const day = parseInt(parts[2], 10);
//     const month = parseInt(parts[1], 10) - 1; // Month is zero-based
//     const year = parseInt(parts[0], 10);

//     const givenDate = new Date(year, month, day);

//     // Add 365 days to the given date
//     givenDate.setDate(givenDate.getDate() + 365);

//     // Return the date after 365 days
//     return formatDateToYyyyMmDd(givenDate);
// }

// export type FieldValidationType = 'TEXT_ONLY' | 'TEXT_WITH_ALLOWED_SPECIAL' | 'EMAIL' | 'NUMBER' | 'NUMBER_WITH_LIMIT' | 'PRICE' | 'PRICE_WITH_LIMIT' | 'NONE' | 'PASSWORD' | null

// export const formatValidate = (input: any): FieldValidationType => {
//     const validation = ['TEXT_ONLY', 'TEXT_WITH_ALLOWED_SPECIAL', 'EMAIL', 'NUMBER', 'NUMBER_WITH_LIMIT', 'PRICE', 'PRICE_WITH_LIMIT', 'NONE', null]

//     if (validation.includes(input)) return input

//     return 'NONE';
// }
// export const isContainsSpecialOrNumber = (value: string) => {
//     const charCodeForaToz = [65, 90];
//     const charCodeForAToZ = [97, 122];
//     const charCodeForSpecial = [40, 41];
//     const charCodeForSlahSpecial = [44, 47];
//     const charCodeForAmp = [38, 38];
//     const result = { isContain: false, modified: value }
//     let newModified = result.modified;
//     const tobeRepalcedText = 'TO_BE_REMOVED';
//     for (let i = 0; i < result.modified.length; i++) {
//         const char = result.modified[i];
//         const charCode = char.charCodeAt(0);
//         const isAlphabet = (charCode >= charCodeForaToz[0] && charCode <= charCodeForaToz[1]) || (charCode >= charCodeForAToZ[0] && charCode <= charCodeForAToZ[1]) || (charCode >= charCodeForSpecial[0] && charCode <= charCodeForSpecial[1]) || (charCode >= charCodeForSlahSpecial[0] && charCode <= charCodeForSlahSpecial[1]) || (charCode >= charCodeForAmp[0] && charCode <= charCodeForAmp[1])
//         if (isAlphabet == false) {
//             result.isContain = true;
//             const countOccurrences = (inputString: string, targetWord: string) => (inputString.match(new RegExp(targetWord, 'gi')) || []).length;
//             const occuranceCount = countOccurrences(newModified, tobeRepalcedText);
//             newModified = newModified.includes(tobeRepalcedText) ?
//                 newModified.substring(0, i + (occuranceCount * tobeRepalcedText.length) - occuranceCount) + tobeRepalcedText + newModified.substring(i + (occuranceCount * tobeRepalcedText.length) - occuranceCount + 1) :
//                 newModified.substring(0, i) + tobeRepalcedText + newModified.substring(i + 1);
//         }
//     }
//     result.modified = newModified.replaceAll(tobeRepalcedText, '');
//     return result;
// }
// export const isContainsUpperCase = (value: string) => {
//     const regEx = /[A-Z]/;
//     return { isContain: regEx.test(value), modified: value.replaceAll(new RegExp(regEx, 'g'), '') }
// }

// export const isContainsSpace = (value: string) => {
//     const regEx = /\s/;
//     return { isContain: regEx.test(value), modified: value.replaceAll(new RegExp(regEx, 'g'), '') }
// }
// export const isContainsSpecialCharactersIncludingAtAndAmpersand = (value: string) => {
//     const regEx = /[`!#$%^&*()_+\-=\[\]{};':"“”\\|.<>?~@]|[\u20AC\u20A6\u20B9\u20A8\$\£\¥\₹]/;
//     const result = { isContain: regEx.test(value), modified: value.replaceAll(new RegExp(regEx, 'g'), '') };
//     const resultUsingASCII = isContainsSpecialCharactersUsingASCIIValue(result.modified);
//     result.modified = resultUsingASCII.modified;
//     result.isContain = result.isContain || resultUsingASCII.isContain;
//     return result;
// }
// export const validateFields = (value: string, field: FieldValidationType, limit: string = '0') => {
//     const minMax = limit.split('-');
//     const isMinMax = minMax.length > 1;
//     const min = isMinMax ? Number(minMax[0]) : 0;
//     const max = isMinMax ? Number(minMax[1]) : Number(minMax[0]);
//     switch (field) {
//         case 'TEXT_ONLY': {
//             return {
//                 isEmpty: value == '',
//                 isContainsFormatError: value.length > 200 || isContainsSpecialOrNumber(value.replaceAll(" ", "")).isContain || isContainsNumericCharacters(value).isContain
//             }
//         }
//         case 'TEXT_WITH_ALLOWED_SPECIAL': {
//             return {
//                 isEmpty: value == '',
//                 isContainsFormatError: value.length > 200 || isContainsSpecialCharacters(value).isContain || isContainsNumericCharacters(value).isContain
//             }
//         }
//         case 'EMAIL': {
//             return {
//                 isEmpty: value == '',
//                 isContainsFormatError: value.length > 200 || validateEmail(value) == false
//             }
//         }
//         case 'PRICE': {
//             return {
//                 isEmpty: Number(value) < 1,
//                 isContainsFormatError: isContainsSpecialCharacters(value).isContain || isContainsAlphabets(value).isContain
//             }
//         }

//         case 'NUMBER': {
//             return {
//                 isEmpty: Number(value) < 1,
//                 isContainsFormatError: value.length < 7 || value.length > 14 || isContainsSpecialCharacters(value).isContain || isContainsAlphabets(value).isContain
//             }
//         }

//         case 'NUMBER_WITH_LIMIT': {
//             if (isMinMax) {
//                 return {
//                     isEmpty: Number(value) < 1,
//                     isContainsFormatError: value.length < min || value.length > max || isContainsSpecialCharacters(value).isContain || isContainsAlphabets(value).isContain
//                 }
//             }
//             return {
//                 isEmpty: Number(value) < 1,
//                 isContainsFormatError: value.length > max || isContainsSpecialCharacters(value).isContain || isContainsAlphabets(value).isContain
//             }
//         }


//         case 'PRICE_WITH_LIMIT': {
//             if (isMinMax) {
//                 return {
//                     isEmpty: Number(value) < 1,
//                     isContainsFormatError: Number(value) < min || Number(value) > max || isContainsSpecialCharacters(value).isContain || isContainsAlphabets(value).isContain
//                 }
//             }
//             return {
//                 isEmpty: Number(value) < 1,
//                 isContainsFormatError: Number(value) > max || isContainsSpecialCharacters(value).isContain || isContainsAlphabets(value).isContain
//             }
//         }

//         case 'PASSWORD': {
//             return {
//                 isEmpty: value == '',
//                 isContainsFormatError: isContainsSpace(value).isContain ? true :
//                     value.length < 8 ||
//                     value.length > 20 ||
//                     !isContainsAlphabets(value).isContain ||
//                     !isContainsUpperCase(value).isContain ||
//                     !isContainsNumericCharacters(value).isContain ||
//                     !isContainsSpecialCharactersIncludingAtAndAmpersand(value).isContain
//             }
//         }

//         case 'NONE': {
//             return {
//                 isEmpty: value == '',
//                 isContainsFormatError: value.length > 200
//             }
//         }

//         case null: {
//             return {
//                 isEmpty: value == '',
//                 isContainsFormatError: value.length > 200
//             }
//         }
//     }
// }

// export const validateField = (value: string, field: 'name' | 'password' | 'number' | 'question' | 'answer' | 'mobile' | 'address' | 'PICName' | 'PICID' | 'email' | 'multiemail' | 'mobile' | 'remarks' | 'username' | 'postalcode') => {
//     switch (field) {
//         case 'name': {
//             return {
//                 isEmpty: value == '',
//                 isContainsFormatError: value.length > 200 || isContainsSpecialCharactersClinicName(value).isContain || isContainsNumericCharacters(value).isContain
//             }
//         }
//         case 'password': {
//             return {
//                 isEmpty: value == '',
//                 isContainsFormatError: value.length > 200 || isPasswordValid(value) == false
//             }
//         }
//         case 'number': {
//             return {
//                 isEmpty: value == '',
//                 isContainsFormatError: value.length > 200 || isContainsSpecialCharacters(value).isContain
//             }
//         }
//         case 'address': {
//             return {
//                 isEmpty: value == '',
//                 isContainsFormatError: value.length > 300
//             }
//         }
//         case 'PICName': {
//             return {
//                 isEmpty: value == '',
//                 isContainsFormatError: value.length > 200 || isContainsSpecialCharacters(value).isContain || isContainsNumericCharacters(value).isContain
//             }
//         }
//         case 'PICID': {
//             return {
//                 isEmpty: value == '',
//                 isContainsFormatError: value.length > 200 || isContainsSpecialCharacters(value).isContain
//             }
//         }
//         case 'email': {
//             return {
//                 isEmpty: value == '',
//                 isContainsFormatError: value.length > 200 || validateEmail(value) == false
//             }
//         }
//         case 'username': {
//             return {
//                 isEmpty: value == '',
//                 isContainsFormatError: value.length > 200 || isContainsSpecialCharacters(value).isContain || isContainsNumericCharacters(value).isContain
//             }
//         }
//         case 'mobile': {
//             return {
//                 isEmpty: Number(value) < 1,
//                 isContainsFormatError: value.length < 7 || value.length > 11 || isContainsSpecialCharacters(value).isContain || isContainsAlphabets(value).isContain
//             }
//         }
//         case 'postalcode': {
//             return {
//                 isEmpty: Number(value) < 1,
//                 isContainsFormatError: value.length < 4 || value.length > 7 || isContainsSpecialCharacters(value).isContain || isContainsAlphabets(value).isContain
//             }
//         }
//         case 'remarks': {
//             return {
//                 isEmpty: value == '',
//                 isContainsFormatError: value.length > 1500
//             }
//         }
//         case 'multiemail': {
//             return {
//                 isEmpty: value == '',
//                 isContainsFormatError: value.length > 5000
//             }
//         }
//          case 'question': {
//             return {
//                 isEmpty: value == '',
//                 isContainsFormatError: value.length > 4000
//             }
//         }
//          case 'answer': {
//             return {
//                 isEmpty: value == '',
//                 isContainsFormatError: value.length > 5000
//             }
//         }
//     }
// }

// export const validateOptionalCoverageFields = (selectedCoverage: SelectedCoverage) => {
//     if (selectedCoverage.field_1 == null) return { field_1: null, field_2: null };
//     const field_1_value = selectedCoverage.field_1 ?? 0;
//     const field_2_value = selectedCoverage?.field_2 ?? 0;
//     switch (selectedCoverage.id) {
//         case 2001:
//         case '2001': {
//             let field_1_error: string | null = null;
//             let field_2_error: string | null = null;
//             if (field_1_value < 1) field_1_error = "Required!";

//             const field2MaxValue = Math.round(Number(percentageResult(MAX_AUDITOR_FEE_PERCENTAGE, field_1_value)));
//             if (field_2_value > field2MaxValue) field_2_error = `Coverage cannot be more than RM ${convertToPriceFormat(field2MaxValue, true, true)}`;

//             return {
//                 field_1: field_1_error,
//                 field_2: field_2_error
//             }
//         }
//         case 2002:
//         case '2002': {
//             let field_1_error: string | null = null;
//             let field_2_error: string | null = null;
//             if (field_1_value < 1) field_1_error = "Required!";
//             if (field_1_value > MOBILE_MAX_COVERAGE_VALUE) field_1_error = `Mobile phones coverage cannot more than RM ${convertToPriceFormat(MOBILE_MAX_COVERAGE_VALUE, true, true)}`;
//             if (field_2_value > LAPTOP_MAX_COVERAGE_VALUE) field_2_error = `Laptop coverage cannot more than RM ${convertToPriceFormat(LAPTOP_MAX_COVERAGE_VALUE, true, true)}`;

//             return {
//                 field_1: field_1_error,
//                 field_2: field_2_error
//             }
//         }
//     }

//     return { field_1: null, field_2: null };
// }

// export const convertCoveragesResDataToLocalStateData = (apiRes: any): CoverageResData => {
//     return {
//         coverages: apiRes.filter((e: Coverage) => e.isOptional != 1),
//         optionalCoverages: apiRes.filter((e: Coverage) => e.isOptional == 1),
//     }
// }

// export const getRedirectRouteBasedOnQuote = (quote: ClinicData) => {
//     if (quote == null) return '/';

//     if (quote.isPaid) return '/';

//     if (quote.paymentApproved) return '/pay'

//     return '/summary'
// }