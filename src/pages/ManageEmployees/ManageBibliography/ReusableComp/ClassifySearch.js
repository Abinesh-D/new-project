import React, { useState } from "react";
import { Row, Col, Spinner, TabPane, Card, CardBody } from "reactstrap";
import { motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { retrieveClassificationData, setClassifyData } from "../BibliographySLice/BibliographySlice";
import ClassifyWindowModal from "../PatentReuseComp/ClassifyWindowModal";
import { FaCode, FaBook, FaCalendarAlt, FaInfoCircle, FaArrowLeft, FaArrowRight } from "react-icons/fa";
import IPCDefinition from "../IpcComp/IPCDefinition";



const ClassifySearch = () => {
  const [classifyNumber, setClassifyNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertType, setAlertType] = useState("");
  const [customAlertMessage, setCustomAlertMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const dispatch = useDispatch();
  const classifyData = useSelector((state) => state.patentSlice.classifyData);

  const classificationItem =
    classifyData?.classifyData?.["world-patent-data"]?.["classification-scheme"]?.["cpc"]?.["class-scheme"]?.["classification-item"];

  const cpcStarted = classifyData?.cpcFullData?.["world-patent-data"]?.["classification-scheme"]?.["cpc"];

  function getCPCClassificationItems(rootItem) {
    const result = [];

    const extractTitlePart = (titlePart) => {
  if (!titlePart) return '';

  if (Array.isArray(titlePart)) {
    return titlePart
      .map(part => {
        if (typeof part === 'string') return part;
        if (part?.text) return part.text;
        if (part?.comment?.text) return part.comment.text;
        if (Array.isArray(part['class-ref'])) {
          return part['class-ref'].map(ref => ref._).join(', ');
        }
        if (part['class-ref']?._) {
          return part['class-ref']._;
        }
        return '';
      })
      .filter(Boolean)
      .join('; ');
  }

  if (typeof titlePart === 'object') {
    const val =
      titlePart.text ||
      titlePart?.comment?.text ||
      (Array.isArray(titlePart['class-ref'])
        ? titlePart['class-ref'].map(ref => ref._).join(', ')
        : titlePart['class-ref']?._);

    return typeof val === 'string' ? val.trim() : '';
  }

  return typeof titlePart === 'string' ? titlePart.trim() : '';
};


    const traverse = (item) => {
      if (!item) return;

      (Array.isArray(item) ? item : [item]).forEach(node => {
        try {
          const symbol = node['classification-symbol'] || node?.$?.['sort-key'];
          const titlePart = extractTitlePart(node['class-title']?.['title-part']);

          if (symbol && titlePart) {
            result.push({ symbol, title: titlePart });
          }

          if (typeof node['classification-item']) {
            traverse(node['classification-item']);
          }
        } catch (error) {
          console.warn('Error processing node:', node, error);
        }
      });
    };

    traverse(rootItem);
    return result;
  }


  const rootItem = classifyData.cpcFullData?.['world-patent-data']?.['classification-scheme']?.['cpc']?.['class-scheme']?.['classification-item'];

  const cpcItems = getCPCClassificationItems(rootItem);

  const classTitle =
    classificationItem?.["class-title"]?.["title-part"]?.["comment"]?.["text"] ||
    classificationItem?.["class-title"]?.["title-part"]?.["text"] ||
    classificationItem?.["class-title"]?.["title-part"]?.map(part => part.text).join('; ');

  const classificationSymbol = classificationItem?.["classification-symbol"];
  const dateRevised = classificationItem?.["$"]?.["date-revised"];
  const status = classificationItem?.["$"]?.["status"];
  const sortKey = classificationItem?.["$"]?.["sort-key"];
  const metaData = classificationItem?.["meta-data"];


  const handleClassifySubmit = async (e) => {
    e.preventDefault();
    setSubmitted(true);
    dispatch(setClassifyData([]));
    const trimmedNumber = classifyNumber.trim();

    if (trimmedNumber === '') {
      setAlertType("error");
      setCustomAlertMessage("CPC number is required.");
      setShowAlert(true);
      return;
    }

    setShowAlert(false);
    setLoading(true);

    try {
      await retrieveClassificationData(
        trimmedNumber,
        dispatch,
        setShowAlert,
        setAlertType,
        setCustomAlertMessage
      );

      if (!cpcItems || cpcItems.length === 0) {
        console.log("No classification items found.");
      }

    } catch (error) {
      console.error("Espacenet fetch error:", error);
    } finally {
      setLoading(false);
    }

    setTimeout(() => setShowAlert(false), 3000);
  };



  return (
    <div>
        <>
        <IPCDefinition />
        </>
      {/* <TabPane tabId="1">
      
        <div className="p-3 bg-white rounded-3 shadow-sm border border-light mb-3">
          <form onSubmit={handleClassifySubmit}>
            <div className="mb-3">
              <label className="form-label fw-semibold text-primary mb-1" style={{ fontSize: "0.95rem" }}>
                CPC Classification Number
              </label>
              <input
                type="text"
                value={classifyNumber.trim()}
                onChange={(e) => setClassifyNumber(e.target.value)}
                className="form-control form-control-md rounded-2"
                placeholder="E.g., A01B 1/00"
              />
              <small className="text-muted" style={{ fontSize: "0.75rem" }}>
                Enter a valid Cooperative Patent Classification number(CPC).
              </small>
            </div>

            <Row className="align-items-center mt-3">
              <Col md="9" className="mb-2 mb-md-0">
                {showAlert && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className={`alert ${alertType === "success" ? "alert-success" : "alert-danger"} fw-normal py-2 px-3 mb-0 rounded-2 text-center`}
                    style={{ fontSize: "0.85rem" }}
                  >
                    {customAlertMessage}
                  </motion.div>
                )}
              </Col>
              <Col md="3" className="text-md-end text-center">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  type="submit"
                  className="btn btn-sm btn-primary px-3 py-2 rounded-pill shadow-sm"
                  disabled={loading}
                  style={{ fontSize: "0.85rem", minWidth: loading ? "120px" : "auto" }}
                >
                  {loading && <Spinner size="sm" color="light" className="me-2" />}
                  {loading ? "Searching..." : "Search"}
                </motion.button>
              </Col>
            </Row>
          </form>
        </div>
      </TabPane>


      {!submitted ? null : loading ? (
        <div style={{ position: 'relative', height: '100%', width: '100%' }}>
          <Spinner size="md" color="primary" style={{ position: 'absolute', top: '50%', left: '50%', }} />
        </div>
      ) : cpcItems && cpcItems.length > 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          style={{
            backgroundColor: "#f9f9f9",
            border: "1px solid #ccc",
            borderRadius: "10px",
            padding: "1.5rem",
            marginTop: "1rem",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
          }}
        >
          {classificationSymbol && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mt-4"
            >
              <div className="row align-items-center justify-content-between mb-3">
                <ClassifyWindowModal cpcItems={cpcItems} classificationSymbol={classificationSymbol} />
              </div>

              <Card className="mb-3 shadow-sm border-start border-primary border-4">
                <CardBody>
                  <h6 className="fw-semibold text-primary d-flex align-items-center">
                    <FaCode className="me-2" /> Classification Symbol
                  </h6>
                  <p className="mb-0 text-muted">{classificationSymbol || "N/A"}</p>
                </CardBody>
              </Card>

              <Card className="mb-3 shadow-sm border-start border-success border-4">
                <CardBody>
                  <h6 className="fw-semibold text-success d-flex align-items-center">
                    <FaBook className="me-2" /> Title Text
                  </h6>
                  <p className="mb-0 text-muted">{classTitle || "N/A"}</p>
                </CardBody>
              </Card>

              <Card className="mb-3 shadow-sm border-start border-info border-4">
                <CardBody>
                  <h6 className="fw-semibold text-info d-flex align-items-center">
                    <FaArrowLeft className="me-2" /> Navigation
                  </h6>
                  <p className="mb-0 text-muted">
                    <strong>Previous:</strong> {cpcStarted.navigation?.prev?._ || "N/A"} &nbsp;&nbsp;|&nbsp;&nbsp;
                    <strong>Next:</strong> {cpcStarted.navigation?.next?._ || "N/A"}
                  </p>
                </CardBody>
              </Card>

              <Card className="mb-3 shadow-sm border-start border-warning border-4">
                <CardBody>
                  <h6 className="fw-semibold text-warning d-flex align-items-center">
                    <FaCalendarAlt className="me-2" /> Date Revised
                  </h6>
                  <p className="mb-0 text-muted">{dateRevised || "N/A"}</p>
                </CardBody>
              </Card>

              <Card className="mb-3 shadow-sm border-start border-danger border-4">
                <CardBody>
                  <h6 className="fw-semibold text-danger d-flex align-items-center">
                    <FaInfoCircle className="me-2" /> Status
                  </h6>
                  <p className="mb-0">
                    <span
                      className={`badge px-3 py-1 ${status === "published"
                        ? "bg-success"
                        : status === "Inactive"
                          ? "bg-secondary"
                          : "bg-dark"
                        }`}
                    >
                      {status || "N/A"}
                    </span>
                  </p>
                </CardBody>
              </Card>
            </motion.div>
          )}  </motion.div>
      ) : null} */}
    </div>
  );
};

export default ClassifySearch;























              // <Card className="mb-3 shadow-sm">
              //   <CardBody>
              //     <h6 className="fw-semibold">Classification Symbol</h6>
              //     <p className="mb-0">{classificationSymbol}</p>
              //   </CardBody>
              // </Card>

              // <Card className="mb-3 shadow-sm">
              //   <CardBody>
              //     <h6 className="fw-semibold">Title Text</h6>
              //     <p className="mb-0">{classTitle ||  "N/A"}</p>
              //   </CardBody>
              // </Card>

              // <Card className="mb-3 shadow-sm">
              //   <CardBody>
              //     <h6 className="fw-semibold">Navigation</h6>
              //     <p className="mb-0">
              //       <strong>Previous(code):</strong> {cpcStarted.navigation?.prev?._ || "N/A"}&nbsp;&nbsp;|&nbsp;&nbsp;
              //       <strong>Next(code):</strong> {cpcStarted.navigation?.next?._ || "N/A"}
              //     </p>
              //   </CardBody>
              // </Card>
              // <Card className="mb-3 shadow-sm">
              //   <CardBody>
              //     <h6 className="fw-semibold">Date Revised</h6>
              //     <p className="mb-0">{dateRevised || "N/A"}</p>
              //   </CardBody>
              // </Card>

              // <Card className="mb-3 shadow-sm">
              //   <CardBody>
              //     <h6 className="fw-semibold">Status</h6>
              //     <p className="mb-0">{status || "N/A"}</p>
              //   </CardBody>
              // </Card>





              {/* <TabPane tabId="1">
        <div className="p-4 bg-light rounded shadow-sm mb-4">
          <form onSubmit={handleClassifySubmit}>
            <div className="mb-4">
              <label className="form-label fw-semibold">Enter CPC Number:</label>
              <input
                type="text"
                value={classifyNumber.trim()}
                onChange={(e) => setClassifyNumber(e.target.value)}
                className="form-control"
                placeholder="Example: A01B 1/00"
              />
            </div>

            <Row className="align-items-center">
              <Col md="9" className="mb-3 mb-md-0">
                {showAlert && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    className={`alert ${alertType === "success" ? "alert-success" : "alert-danger"
                      } text-center`}
                  >
                    {customAlertMessage}
                  </motion.div>
                )}
              </Col>
              <Col md="3" className="text-md-end text-center">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  type="submit"
                  className="btn btn-primary px-4"
                  disabled={loading}
                  style={{ minWidth: loading ? "140px" : "auto" }}
                >
                  {loading && <Spinner size="sm" color="light" className="me-2" />}
                  {loading ? "Searching..." : "Search"}
                </motion.button>
              </Col>
            </Row>
          </form>
        </div>
      </TabPane> */}





        {/* {false ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          style={{
            backgroundColor: "#f9f9f9",
            border: "1px solid #ccc",
            borderRadius: "10px",
            padding: "1.5rem",
            marginTop: "1rem",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
          }}
        >
          {classificationSymbol && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mt-4"
            >

              <div className="row align-items-center justify-content-between mb-3">

                <ClassifyWindowModal cpcItems={cpcItems} classificationSymbol={classificationSymbol} />
              </div>

              <Card className="mb-3 shadow-sm border-start border-primary border-4">
                <CardBody>
                  <h6 className="fw-semibold text-primary d-flex align-items-center">
                    <FaCode className="me-2" /> Classification Symbol
                  </h6>
                  <p className="mb-0 text-muted">{classificationSymbol || "N/A"}</p>
                </CardBody>
              </Card>

              <Card className="mb-3 shadow-sm border-start border-success border-4">
                <CardBody>
                  <h6 className="fw-semibold text-success d-flex align-items-center">
                    <FaBook className="me-2" /> Title Text
                  </h6>
                  <p className="mb-0 text-muted">{classTitle || "N/A"}</p>
                </CardBody>
              </Card>

              <Card className="mb-3 shadow-sm border-start border-info border-4">
                <CardBody>
                  <h6 className="fw-semibold text-info d-flex align-items-center">
                    <FaArrowLeft className="me-2" /> Navigation
                  </h6>
                  <p className="mb-0 text-muted">
                    <strong>Previous:</strong> {cpcStarted.navigation?.prev?._ || "N/A"} &nbsp;&nbsp;|&nbsp;&nbsp;
                    <strong>Next:</strong> {cpcStarted.navigation?.next?._ || "N/A"}
                  </p>
                </CardBody>
              </Card>

              <Card className="mb-3 shadow-sm border-start border-warning border-4">
                <CardBody>
                  <h6 className="fw-semibold text-warning d-flex align-items-center">
                    <FaCalendarAlt className="me-2" /> Date Revised
                  </h6>
                  <p className="mb-0 text-muted">{dateRevised || "N/A"}</p>
                </CardBody>
              </Card>

              <Card className="mb-3 shadow-sm border-start border-danger border-4">
                <CardBody>
                  <h6 className="fw-semibold text-danger d-flex align-items-center">
                    <FaInfoCircle className="me-2" /> Status
                  </h6>
                  <p className="mb-0">
                    <span
                      className={`badge px-3 py-1 ${status === "published"
                        ? "bg-success"
                        : status === "Inactive"
                          ? "bg-secondary"
                          : "bg-dark"
                        }`}
                    >
                      {status || "N/A"}
                    </span>
                  </p>
                </CardBody>
              </Card>
            </motion.div>
          )}
        </motion.div>
      ) : (
        <div style={{ position: 'relative', height: '100%', width: '100%' }}>
          <Spinner size={'md'} color="light" style={{ position: 'absolute', right: '50%', top: '50%', }} />
        </div>
      )} */}


