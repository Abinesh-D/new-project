import { createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
  // patentNumber: '',
  // url: '',
  // country: '',
  // title: '',
  // inventors: '',
  // assignee: '',
  // abstract: [],
  // claims: '',
  // description: '',
  // publicationDate: '',
  // applicationDate: '',
  // priorityDate: '',
  // ipc: '',
  // cpc: '',
  // simple_family: [],
  // extended_family: [],
  // sequence_listing: '',
  // publication_type: '',
  // legal_status: '',
  // usClassification: '',
  espaceApiData: [],
  googleApiData: [],
  lensOrgApiData: [],
  lensPageUrl: '',
  freePatentApiData: [],
  patentLoading: null,
  fetchESPData: [],
  espData: [],
  fetchLegalStatus: [],
  classifyData: [],
  chatBoxData: [],

};


const patentSlice = createSlice({
  name: 'patent',
  initialState,
  reducers: {
    setPatentData: (state, action) => {
      return {
        ...state,
        ...action.payload,
      };
    },
    setEspaceApiData : (state, action) => {
      state.espaceApiData = action.payload;
    },
    setGoogleApiData : (state, action) => {
      state.googleApiData = action.payload;
    },
    setLensOrgApiData : (state, action) => {
      state.lensOrgApiData = action.payload;
    },
    setLensPageUrl : (state, action) => {
      state.lensPageUrl = action.payload;
    },
    setFreePatentApiData : (state, action) => {
      state.freePatentApiData = action.payload;
    },
    setPatentLoading : (state, action) => {
      state.patentLoading = action.payload;
    },
    setFetchESPData : (state, action) => {
      state.fetchESPData = action.payload;
    },
    setFetchLegalStatus: (state, action) => {
      state.fetchLegalStatus = action.payload;
    },
    setESPData: (state, action) => {
      state.espData = action.payload;
    },
    setClassifyData: (state, action) => {
      state.classifyData = action.payload;
    },
    setChatBoxData: (state, action) => {
      state.chatBoxData = action.payload;
    },



    resetPatentData: () => initialState,
  },
});

// ChatBox API COHERE
export const retrieveChatBoxData = async (message, dispatch) => {
  try {
    const response = await axios.post('http://localhost:8080/api/chatbox/chat', { message: message });


    console.log(response, 'responsefor chat')
    if (response.status === 200 && response.data) {
      dispatch(setChatBoxData(response.data));
    }

  } catch (error) {
    console.log(error, "ChatBox API not Triggered")
  }
};


// Cpc classification API
export const retrieveClassificationData = async (classifyNumber, dispatch, setShowAlert, setAlertType, setCustomAlertMessage) => {

  try {
    if (!classifyNumber) throw new Error("Patent number is required.");
    const response = await axios.get(`http://localhost:8080/api/ipc-definition/${classifyNumber}`);
    // const response = await axios.get(`http://localhost:8080/cpc/classify/${classifyNumber}`);
    

    console.log('classifyNumberResponse', response.data);

    if (response.status === 200 && response.data) {
      dispatch(setClassifyData(response.data));
      return response.data;
    } else {
      throw new Error("Classification data not found or invalid response.");
    }
  } catch (error) {
    console.log(error, "Classification api not triggered");
    setAlertType("error");
    setCustomAlertMessage("Invalid cpc number please check it.");
    setShowAlert(true);
  };
}



export const retrieveEspacePatentData = async (patentNumber, dispatch, setShowAlert) => {
  try {
    const trimmedNumber = patentNumber.trim();
    if (!trimmedNumber) throw new Error("Patent number is required.");

    const response = await axios.get(`http://localhost:8080/api/espacenet/${trimmedNumber}`);

    console.log('retrieveEspacePatentData', response.data);

    if (response.status === 200 && response.data) {
      dispatch(setEspaceApiData(response.data));
      console.log('response.data :>> ', response.data);

      if (setShowAlert) setShowAlert(true);
      return response.data;
    } else {
      throw new Error("Patent data not found or invalid response.");
    }

  } catch (error) {
    console.error("❌ Patent fetch error:", error.message || error);
    if (setShowAlert) setShowAlert(false);
    throw error;
  }
};


export const retrieveLensPatentData = (patentNumber, dispatch, setShowAlert) => {
  return new Promise(async (resolve, reject) => {
    try {
      const res = await axios.post('http://localhost:8080/api/lens/get-patent-data', {
        patentNumber: patentNumber.trim()
      });
      console.log('res.data :>> ', res.data);

      const { formattedData, fullData, url } = res.data;
      if (res.status === 200) {
        dispatch(setLensOrgApiData(formattedData));
        dispatch(setLensPageUrl(url));
        resolve("success");
        setShowAlert(true);
      } else {
        reject("error");
      }
    } catch (err) {
      console.error('Error fetching patent:', err);
      reject("error");
    }
  });
};

export const fetchGooglePatentData = async (patentNumber, dispatch) => {
  try {
    const response = await axios.get(`http://localhost:8080/patent/${patentNumber.trim()}`);

    console.log('fetchGooglePatentData', response.data);
    dispatch(setGoogleApiData(response.data));
  } catch (err) {
    console.error('Error fetching patent data:', err);
    throw err;
  }
};



export const fetchESPData = async (patentNumber, dispatch, type) => {
  try {
    const trimmedNumber = patentNumber.trim();
    if (!trimmedNumber) throw new Error("Patent number is required.");

    const response = await axios.get(`http://localhost:8080/esp/patentdata/${trimmedNumber}`);

    console.log('fetchESPData', response.data);

    if (response.status === 200 && response.data) {
      if (type === 'relavent') {
        dispatch(setFetchESPData(response.data));

      } else if (type === 'related') {
        dispatch(setESPData(response.data));
      }

      console.log('response.data :>> ', response.data);

      return response.data;
    } else {
      throw new Error("Patent data not found or invalid response.");
    }

  } catch (error) {
    console.error("❌ Patent fetch error:", error.message || error);
    throw error;
  }
};



export const fetchLegalStatusData = async (patentNumber, dispatch) => {
  try {
    if (!patentNumber) throw new Error("Patent number is required.");

    const response = await axios.get(`http://localhost:8080/esp/legalStatus/${patentNumber}`);

    if (response.status === 200 && response.data) {
      dispatch(setFetchLegalStatus(response.data));
      return response.data;
    } else {
      throw new Error("Patent data not found or invalid response.");
    }
  } catch (error) {
    console.error("❌ Patent fetch error:", error.message || error);
    throw error;
  }
};




export const { setPatentData, setEspaceApiData, resetPatentData, setGoogleApiData, setLensOrgApiData, setFreePatentApiData,
  setPatentLoading, setLensPageUrl, setFetchESPData, setESPData, setFetchLegalStatus, setClassifyData, setChatBoxData, 
} = patentSlice.actions;
export default patentSlice.reducer;