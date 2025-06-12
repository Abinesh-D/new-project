import React from 'react';
import { FaFileExcel, FaSpinner, FaDownload, FaTimesCircle } from 'react-icons/fa';

const IPCExcelUploader = ({
    definition,
    handleFileUpload,
    uploadedRows,
    handleDownloadExcel,
    loading,
    uploadProgress,
    uploadedFileName,
    handleClearFile,
    fileInputRef,
}) => {



console.log('definition :>> ', definition);



    return (
        <div style={{ marginTop: '2rem', padding: '1.5rem', backgroundColor: '#f9f9f9', borderRadius: '8px', boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)', maxWidth: '600px', margin: 'auto' }}>
            <h3 style={{ marginBottom: '1rem', fontSize: '1.2rem', color: '#333' }}>
                Upload IPC Excel
            </h3>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <label htmlFor="file-upload"
                    style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        padding: '0.6rem 1rem',
                        backgroundColor: '#28a745',
                        color: 'white',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontWeight: 'bold',
                        fontSize: '1rem',
                    }}
                >
                    <FaFileExcel style={{ marginRight: '0.5rem' }} />
                    Choose Excel File
                </label>

                <input
                    id="file-upload"
                    type="file"
                    accept=".xlsx, .xls"
                    onChange={handleFileUpload}
                    style={{ display: 'none' }}
                    ref={fileInputRef}
                />
            </div>

            {uploadedFileName && (
                <div style={{
                    marginTop: '1rem',
                    backgroundColor: '#e9ecef',
                    padding: '0.5rem 1rem',
                    borderRadius: '6px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    fontSize: '0.95rem',
                }}>
                    <span>{uploadedFileName}</span>
                    <FaTimesCircle
                        onClick={handleClearFile}
                        style={{ color: '#dc3545', cursor: 'pointer', fontSize: '1.2rem' }}
                        title="Remove File"
                    />
                </div>
            )}

            {loading && (
                <div style={{ marginTop: '1rem', color: '#007bff', display: 'flex', alignItems: 'center' }}>
                    <FaSpinner className="spin" style={{ marginRight: '0.5rem' }} />
                    Processing Excel...
                </div>
            )}

            {uploadProgress > 0 && (
                <div style={{ marginTop: '1rem', height: '10px', background: '#ddd', borderRadius: '4px' }}>
                    <div
                        style={{
                            width: `${uploadProgress}%`,
                            background: '#007bff',
                            height: '100%',
                            borderRadius: '4px',
                            transition: 'width 0.4s ease',
                        }}
                    />
                </div>
            )}

            <button
                onClick={handleDownloadExcel}
                disabled={definition.length === 0}
                style={{
                    marginTop: '1.5rem',
                    padding: '0.6rem 1.2rem',
                    backgroundColor: definition.length === 0 ? '#cccccc' : '#007bff',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '6px',
                    fontWeight: 'bold',
                    fontSize: '1rem',
                    cursor: definition.length === 0 ? 'not-allowed' : 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                }}
            >
                <FaDownload style={{ marginRight: '0.5rem' }} />
                Download Excel
            </button>
        </div>
    );
};

export default IPCExcelUploader;

















// import React, { useState } from 'react';
// import * as XLSX from 'xlsx';
// import { saveAs } from 'file-saver';
// import { FaFileExcel, FaDownload, FaSpinner } from 'react-icons/fa';



// const IPCExcelUploader = ({ definition, handleFileUpload, uploadedRows, handleDownloadExcel, loading }) => {
//     // const [uploadedRows, setUploadedRows] = useState([]);
//     const [error, setError] = useState('');

//     // const handleFileUpload = async (e) => {
//     //     const file = e.target.files[0];
//     //     if (!file) return;

//     //     setLoading(true);
//     //     setError('');

//     //     try {
//     //         const data = await file.arrayBuffer();
//     //         const workbook = XLSX.read(data, { type: 'buffer' });
//     //         const sheetName = workbook.SheetNames[0];
//     //         const worksheet = workbook.Sheets[sheetName];
//     //         const jsonData = XLSX.utils.sheet_to_json(worksheet);

//     //         setUploadedRows(jsonData); // Store uploaded data
//     //     } catch (err) {
//     //         console.error(err);
//     //         setError('Error processing the file.');
//     //     } finally {
//     //         setLoading(false);
//     //     }
//     // };



//     return (

//         // <div
//         //     style={{
//         //         marginTop: '2rem',
//         //         padding: '1.5rem',
//         //         backgroundColor: '#f9f9f9',
//         //         borderRadius: '8px',
//         //         boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
//         //         maxWidth: '500px',
//         //     }}
//         // >
//         //     <h3 style={{ marginBottom: '1rem', fontSize: '1.2rem', color: '#333' }}>Upload IPC Excel</h3>

//         //     <label
//         //         htmlFor="file-upload"
//         //         style={{
//         //             display: 'inline-flex',
//         //             alignItems: 'center',
//         //             padding: '0.6rem 1rem',
//         //             backgroundColor: '#28a745',
//         //             color: 'white',
//         //             borderRadius: '6px',
//         //             cursor: 'pointer',
//         //             fontWeight: 'bold',
//         //             fontSize: '1rem',
//         //         }}
//         //     >
//         //         <FaFileExcel style={{ marginRight: '0.5rem' }} />
//         //         Choose Excel File
//         //     </label>
//         //     <input
//         //         id="file-upload"
//         //         type="file"
//         //         accept=".xlsx, .xls"
//         //         onChange={handleFileUpload}
//         //         style={{ display: 'none' }}
//         //     />

//         //     {loading && (
//         //         <div style={{ marginTop: '1rem', display: 'flex', alignItems: 'center', color: '#007bff' }}>
//         //             <FaSpinner className="spin" style={{ marginRight: '0.5rem' }} />
//         //             Processing Excel file...
//         //         </div>
//         //     )}

//         //     {error && (
//         //         <p style={{ color: 'red', marginTop: '1rem', fontWeight: 500 }}>
//         //             ⚠️ {error}
//         //         </p>
//         //     )}

//         //     <button
//         //         onClick={handleDownloadExcel}
//         //         disabled={definition.length === 0}
//         //         style={{
//         //             marginTop: '1.5rem',
//         //             padding: '0.6rem 1.2rem',
//         //             backgroundColor: definition.length === 0 ? '#cccccc' : '#007bff',
//         //             color: '#fff',
//         //             border: 'none',
//         //             borderRadius: '6px',
//         //             fontWeight: 'bold',
//         //             fontSize: '1rem',
//         //             cursor: definition.length === 0 ? 'not-allowed' : 'pointer',
//         //             display: 'inline-flex',
//         //             alignItems: 'center',
//         //         }}
//         //     >
//         //         <FaDownload style={{ marginRight: '0.5rem' }} />
//         //         Download Excel with Definitions
//         //     </button>
//         // </div>


//         // <div style={{ marginTop: '2rem' }}>
//         //     <h3>Upload IPC Excel</h3>
//         //     <input type="file" accept=".xlsx, .xls" onChange={handleFileUpload} />
//         //     {/* {loading && <p>Processing...</p>}
//         //     {error && <p style={{ color: 'red' }}>{error}</p>} */}

//         //     <button
//         //         onClick={handleDownloadExcel}
//         //         disabled={definition.length === 0}
//         //         style={{
//         //             marginTop: '1rem',
//         //             padding: '0.5rem 1rem',
//         //             backgroundColor: '#007bff',
//         //             color: '#fff',
//         //             border: 'none',
//         //             cursor: 'pointer',
//         //         }}
//         //     >
//         //         Download Excel with Definitions
//         //     </button>
//         // </div>
//     );
// };

// export default IPCExcelUploader;
