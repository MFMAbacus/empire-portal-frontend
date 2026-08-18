// import * as React from "react";

// import { ListInput } from "@/components/base/list-input";
// import { Map } from "@/components/base/map";
// import { CachierRequestAssignmentBy } from "@/types/user";

// type RequestAssignmentByInputProps = {
//   label?: string;
//   value?: CachierRequestAssignmentBy;
//   feedback?: string;
//   isDisabled?: boolean;
//   hasError?: boolean;
//   isRequired?: boolean;
//   className?: string;
//   onChange: (value: CachierRequestAssignmentBy) => void;
// };

// export const RequestAssignmentByInput = (
//   props: RequestAssignmentByInputProps
// ): JSX.Element => {
//   const {
//     label = "Assigned By",
//     value,
//     feedback,
//     isDisabled = false,
//     hasError = false,
//     isRequired = false,
//     className,
//     onChange,
//   } = props;

//   return (
//     <ListInput
//       className={className}
//       label={label}
//       value={value}
//       feedback={feedback}
//       placeholder="Request assigned by"
//       isRequired={isRequired}
//       hasError={hasError}
//       isDisabled={isDisabled}
//     >
//       {(onClose) => {
//         return (
//           <React.Fragment>
//             <Map
//               items={Object.entries(labels)}
//               renderItem={(item) => {
//                 return (
//                   <ListInput.Item
//                     label={item[1]}
//                     onClick={() => {
//                       onChange(item[1] as CachierRequestAssignmentBy);
//                       onClose();
//                     }}
//                     isActive={value === item[1]}
//                   />
//                 );
//               }}
//             />
//           </React.Fragment>
//         );
//       }}
//     </ListInput>
//   );
// };

// const labels: { [value: string]: string } = {
//   SERVICE: CachierRequestAssignmentBy.SERVICE,
//   PROJECT: CachierRequestAssignmentBy.PROJECT,
// };
