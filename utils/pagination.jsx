// import { Button, Flex } from "@chakra-ui/react";

// export interface PaginationProps {
//   totalPages: number;
//   currentPage: number;
//   setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
// }

// export default function Pagination({
//   totalPages,
//   currentPage,
//   setCurrentPage,
// }: PaginationProps) {
//   const handlePrevious = () => {
//     setCurrentPage((prev) => Math.max(prev - 1, 1));
//   };

//   const handleNext = () => {
//     setCurrentPage((prev) => Math.min(prev + 1, totalPages));
//   };

//   return (
//     <Flex mt={2} justify="center" align="center">
//       <Button
//         size="sm"
//         onClick={handlePrevious}
//         isDisabled={currentPage === 1}
//         mr={2}
//       >
//         Previous
//       </Button>

//       {Array.from({ length: totalPages }, (_, index) => {
//         const page = index + 1;
//         return (
//           <Button
//             key={page}
//             size="sm"
//             mx={1}
//             height="35px"
//             variant={page === currentPage ? "solid" : "outline"}
//             colorScheme={page === currentPage ? "green" : "gray"}
//             onClick={() => setCurrentPage(page)}
//           >
//             {page}
//           </Button>
//         );
//       })}

//       <Button
//         size="sm"
//         onClick={handleNext}
//         isDisabled={currentPage === totalPages}
//         ml={2}
//       >
//         Next
//       </Button>
//     </Flex>
//   );
// }
