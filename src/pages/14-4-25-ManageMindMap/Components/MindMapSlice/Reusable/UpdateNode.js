const getUpdatedNodes = ({ nodes, deleteNode, edges, addNode, setNodes, setEdges, onLabelChange, handleFileUpload }) => {
  if (!Array.isArray(nodes)) return [];

  return nodes.map((node) => ({
    ...node,
    type: "editableNode",
    draggable: node.id !== "67f7fc3e00ba7c378353ec6f",
    data: {
      ...node,
      image: node.imageUrl || null,
      onDelete: deleteNode,
      onAdd: addNode,
      setNodes,
      setEdges,
      nodes,
      edges,
      onLabelChange,
      handleFileUpload: (file, type, id) =>
        handleFileUpload(file, type, id, setNodes, setEdges, nodes, edges),
    },
  }));
};

export default getUpdatedNodes;










// import { useMemo } from "react";

// const UpdatedNodes = ({ nodes, deleteNode, edges, addNode, setNodes, setEdges, onLabelChange, handleFileUpload }) => {

//   return useMemo(
//     () =>(
//       nodes.map((node) => {
//         return {
//           ...node,
//           type: "editableNode", 
//           draggable: node.id !== "67f7fc3e00ba7c378353ec6f",
//           data: {
//             ...node,
//             image: node.imageUrl || null,
//             onDelete: deleteNode,
//             onAdd: addNode,
//             setNodes,
//             setEdges,
//             nodes,
//             edges,
//             onLabelChange,
//             handleFileUpload: (file, type, id) =>
//               handleFileUpload(file, type, id, setNodes, setEdges, nodes, edges),
//           },
//         };
        
//       })),
//     [nodes, deleteNode, addNode, onLabelChange, handleFileUpload, setNodes, setEdges]
//   );
// };

// export default UpdatedNodes;