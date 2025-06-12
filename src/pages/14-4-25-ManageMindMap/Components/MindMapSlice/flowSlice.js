import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const API_BASE_URL = "http://localhost:5000/mindmap";
const API_URL_EDGE = "http://localhost:5000/mindmapedge";

console.log('API_BASE_URL :>> ', API_BASE_URL);
const initialState = {
  nodes: [],
  edges: [],
  loading: false,
  error: null
};



const flowSlice = createSlice({
  name: "flow",
  initialState,
  reducers: {
    setNodes: (state, action) => {
      state.nodes = action.payload;
    },
    setEdges: (state, action) => {
      state.edges = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
  }
});





export const createNodeInDB = async (nodePayload) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/createnode`, nodePayload);
    return response.data;
  } catch (err) {
    console.error("Error creating node:", err);
    throw err;
  }
};

export const createEdgeInDB = async (edgePayload) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/createedge`, edgePayload);
    return response.data;
  } catch (err) {
    console.error("Error creating edge:", err);
    throw err;
  }
};






// Get all Node
export const fetchDefaultMindMap = () => async (dispatch) => {
  dispatch(setLoading(true));
  dispatch(setError(null));
  try {
    const response = await axios.get(`${API_BASE_URL}/nodes`);
    if (response.status === 200) {
      const { nodes, edges } = response.data;
      dispatch(setNodes(nodes));
      dispatch(setEdges(edges));
    } else {
      dispatch(setError("Unexpected response format"));
    }
  } catch (error) {
    dispatch(setError("Failed to load default mind map data."));
  } finally {
    dispatch(setLoading(false));
  }
};




// Update api
export const updateNodeData = async (_id, updatedFields) => {
  try {
    console.log('updatedFields :>> ', updatedFields);
    const response = await axios.put(`${API_BASE_URL}/nodes/${_id}`, {
      data: {
        label: updatedFields.label,
        link: updatedFields.link,
        bold: updatedFields.bold,
        italic: updatedFields.italic,
      }
    });
    return response.data;
  } catch (error) {
    console.error("Error updating node data:", error);
    throw error;
  }
};




export const {
  setNodes,
  setEdges,
  setLoading,
  setError,
} = flowSlice.actions;

export default flowSlice.reducer;











// import { createSlice } from "@reduxjs/toolkit";
// import axios from "axios";

// // Initial State
// const initialState = {
//   nodes: [],
//   edges: [],
//   loading: false,
//   error: null
// };

// const flowSlice = createSlice({
//   name: "flow",
//   initialState,
//   reducers: {
//     setNodes: (state, action) => {
//       state.nodes = action.payload;
//     },
//     setEdges: (state, action) => {
//       state.edges = action.payload;
//     },
//     setLoading: (state, action) => {
//       state.loading = action.payload;
//     },
//     setError: (state, action) => {
//       state.error = action.payload;
//     },
//     updateNodeLabel: (state, action) => {
//       const { id, label, textStyles } = action.payload;
//       const node = state.nodes.find(n => n.id === id);
//       if (node) {
//         node.data.label = label;
//         if (textStyles) {
//           node.data.textStyles = textStyles;
//         }
//       }
//     }
//   }
// });

// // -------------------------------
// // ✅ Async Thunks and API Helpers
// // -------------------------------

// // Fetch all nodes & edges from DB
// export const fetchDefaultMindMap = () => async (dispatch) => {
//   dispatch(setLoading(true));
//   dispatch(setError(null));
//   try {
//     const response = await axios.get("http://localhost:5000/mindmap/nodes");
//     if (response.status === 200) {
//       const { nodes, edges } = response.data;
//       dispatch(setNodes(nodes));
//       dispatch(setEdges(edges));
//     } else {
//       dispatch(setError("Unexpected response format"));
//     }
//   } catch (error) {
//     dispatch(setError("Failed to load default mind map data."));
//   } finally {
//     dispatch(setLoading(false));
//   }
// };

// // Update node label and text styles
// export const updateNodeLabelAndStyles = async ({ nodeId, label, isBold, isItalic, link }) => {
//   try {

//     console.log('nodeId :>> ', nodeId);
//     const response = await axios.put(`http://localhost:5000/mindmap/nodes/${nodeId}`, {
//       label,
//       textStyles: {
//         bold: isBold,
//         italic: isItalic,
//         link
//       }
//     });
//     return response.data;
//   } catch (error) {
//     console.error("Error updating node label and styles:", error);
//     throw error;
//   }
// };

// // Optional: Update label only (if needed separately)
// export const updateLabelOnly = async (nodeId, newLabel) => {
//   try {
//     const response = await axios.put(`http://localhost:5000/mindmap/nodes/${nodeId}/label`, {
//       label: newLabel
//     });
//     return response.data;
//   } catch (error) {
//     console.error("Error updating label only:", error);
//     throw error;
//   }
// };

// // -------------------------------
// // Export Reducers & Actions
// // -------------------------------

// export const {
//   setNodes,
//   setEdges,
//   setLoading,
//   setError,
//   updateNodeLabel
// } = flowSlice.actions;

// export default flowSlice.reducer;
