// import { useRef } from "react";

// export default function DoubleTapComponent() {
//   const pointers = useRef(new Set());

//   const handlePointerDown = (e) => {
//     pointers.current.add(e.pointerId);
//     console.log("Current pointers:", Array.from(pointers.current));

//     if (pointers.current.size === 2) {
//       console.log("Two finger gesture detected");
//     }
//   };

//   const handlePointerUp = (e) => {
//     pointers.current.delete(e.pointerId);
//   };

//   return (
//     <div
//       onPointerDown={handlePointerDown}
//       onPointerUp={handlePointerUp}
//       style={{
//         width: 300,
//         height: 300,
//         background: "black",
//         color: "white",
//         touchAction: "none"
//       }}
//     >
//       Try two finger tap
//     </div>
//   );
// }