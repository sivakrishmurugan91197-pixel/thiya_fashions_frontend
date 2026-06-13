// import React, { useState, useEffect, ChangeEvent } from 'react';
// import {
//     Menu,
//     MenuButton,
//     MenuList,
//     MenuItem,
//     Button,
//     Box,
//     Text,
//     Input,
//     InputGroup,
//     InputRightElement,
//     CloseButton
// } from '@chakra-ui/react';
// import { ChevronDownIcon } from '@chakra-ui/icons';

// interface OptionType {
//     id: string;
//     value: string;
//     classification_id?: {
//         cl_id: string[];
//     };
// }

// interface CustomSelectMenuProps {
//     options: OptionType[];
//     placeholder?: string;
//     selectedValue?: string | number | null;
//     onChange?: (selected: OptionType) => void;
//     disabled?: boolean;
//     isInvalid?: boolean;
// }

// const CustomSelectMenu = ({
//     options,
//     placeholder = 'Select an option',
//     selectedValue = null,
//     onChange,
//     disabled,
//     isInvalid
// }: CustomSelectMenuProps) => {
//     const [selected, setSelected] = useState<OptionType | null>(null);
//     const [searchTerm, setSearchTerm] = useState('');
//     const [filteredOptions, setFilteredOptions] = useState<OptionType[]>(options);

//     useEffect(() => {
//         if (selectedValue !== null) {
//             const matched = options.find((opt) => opt.id === selectedValue) || null;
//             setSelected(matched);
//         }
//     }, [selectedValue, options]);

//     useEffect(() => {
//         const filtered = options.filter((option) =>
//             option.value.toLowerCase().includes(searchTerm.toLowerCase())
//         );
//         setFilteredOptions(filtered);
//     }, [searchTerm, options]);

//     const handleSelect = (option: OptionType) => {
//         setSelected(option);
//         onChange?.(option);
//         setSearchTerm('');
//     };

//     const ChangeSearch = (event: ChangeEvent<HTMLInputElement>) => {
//         setSearchTerm(event.target.value);
//     };

//     const handleClearInput = () => {
//         setSearchTerm('');
//         setFilteredOptions(options);
//     };

//     return (
//         <Menu matchWidth>
//             <MenuButton
//                 as={Button}
//                 rightIcon={<ChevronDownIcon />}
//                 width="100%"
//                 textAlign="left"
//                 colorScheme="white"
//                 color="black"
//                 border='1px solid #dbdbdb'
//                 fontWeight='400'
//                 fontSize='15px'
//                 isDisabled={disabled}
//                 borderColor={isInvalid ? 'red.500' : 'gray.300'}
//                 _hover={{ borderColor: isInvalid ? 'red.500' : 'gray.400' }}
//                 _focus={{ borderColor: isInvalid ? 'red.500' : 'blue.500' }}
//             >
//                 <Text overflow="hidden" textOverflow="ellipsis" whiteSpace="nowrap">
//                     {selected?.value || placeholder}
//                 </Text>
//             </MenuButton>

//             <MenuList maxW="600px" overflowY="auto" maxH="300px">
//                 <Box px={3} py={2} borderBottom="1px solid #e2e8f0" bg="white" position="sticky" top="-8px" zIndex="1">
//                     <InputGroup size="sm">
//                         <Input
//                             placeholder="Search..."
//                             value={searchTerm}
//                             onChange={ChangeSearch}
//                             onKeyDown={(e) => e.stopPropagation()}
//                         />
//                         {searchTerm && (
//                             <InputRightElement>
//                                 <CloseButton size="sm" onClick={handleClearInput} />
//                             </InputRightElement>
//                         )}
//                     </InputGroup>
//                 </Box>

//                 {filteredOptions.length > 0 ? (
//                     filteredOptions.map((option) => (
//                         <MenuItem key={option.id} onClick={() => handleSelect(option)}>
//                             {option.value}
//                         </MenuItem>
//                     ))
//                 ) : (
//                     <Box px={3} py={2} color="gray.500">
//                         No results found
//                     </Box>
//                 )}
//             </MenuList>
//         </Menu>
//     );
// };

// export default CustomSelectMenu;











// // import React, { useState, useEffect } from 'react';
// // import { Menu, MenuButton, MenuList, MenuItem, Button, Box, Text } from '@chakra-ui/react';
// // import { ChevronDownIcon } from '@chakra-ui/icons';

// // interface OptionType {
// //     id: string;
// //     value: string;
// //     classification_id?: {
// //         cl_id: string[];
// //     };
// // }

// // interface CustomSelectMenuProps {
// //     options: OptionType[];
// //     placeholder?: string;
// //     selectedValue?: string | number | null;
// //     onChange?: (selected: OptionType) => void;
// //     disabled?: boolean;
// //     isInvalid?: boolean;
// // }

// // const CustomSelectMenu = ({
// //     options,
// //     placeholder = 'Select an option',
// //     selectedValue = null,
// //     onChange, disabled, isInvalid
// // }: CustomSelectMenuProps) => {
// //     const [selected, setSelected] = useState<OptionType | null>(null);

// //     useEffect(() => {
// //         if (selectedValue !== null) {
// //             const matched = options.find((opt) => opt.id === selectedValue) || null;
// //             setSelected(matched);
// //         }
// //     }, [selectedValue, options]);

// //     const handleSelect = (option: OptionType) => {
// //         setSelected(option);
// //         onChange?.(option);
// //     };

// //     return (
// //         <Menu matchWidth >
// //             <MenuButton
// //                 as={Button}
// //                 rightIcon={<ChevronDownIcon />}
// //                 width="100%"
// //                 textAlign="left"
// //                 colorScheme="white"
// //                 color="black"
// //                 border='1px solid #dbdbdb'
// //                 fontWeight={'400'}
// //                 fontSize={'15px'}
// //                 isDisabled={disabled}
// //                 borderColor={isInvalid ? 'red.500' : 'gray.300'} // 👈 Red border on error
// //                 _hover={{ borderColor: isInvalid ? 'red.500' : 'gray.400' }}
// //                 _focus={{ borderColor: isInvalid ? 'red.500' : 'blue.500' }}
// //             >
// //                 <Text overflow={'hidden'} textOverflow={'ellipsis'} whiteSpace={'nowrap'}>{selected?.value || placeholder}</Text>
// //             </MenuButton>

// //             <MenuList maxW="600px" overflowY={'auto'} h={'300px'}
// //             >
// //                 {options.map((e) => (
// //                     <MenuItem key={e.id} onClick={() => handleSelect(e)}>
// //                         {e.value}
// //                         {/* {e.value.length > 50 ? (
// //                             <>
// //                                 {e.value.slice(0, 55)}
// //                                 <br />
// //                                 {e.value.slice(55, 1000)}
// //                             </>
// //                         ) : (
// //                             e.value
// //                         )} */}
// //                     </MenuItem>
// //                 ))}
// //             </MenuList>
// //         </Menu>
// //     );
// // };

// // export default CustomSelectMenu;
