import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Col, Container, Row, Button, Card, CardBody, Label, Input, FormFeedback, Spinner, Badge, Table } from 'reactstrap';
import { useSelector, useDispatch } from 'react-redux';
import TableContainer from './TableContainer';
// import { retrieveCaptainData, retrieveEmployeeListAPI, empDuplicateCheck, setEmpIDExist, getAllCaptainMappings, setSameCaptainAndWaiter } from 'Slice/incentiveSlice';
import { isEmptyArray } from 'formik';
import toastr from 'toastr';
import 'toastr/build/toastr.min.css';
import { toLower } from 'lodash';
// import PageLoader from 'pages/ManageIncentive/Component/PageLoader';

const Edit_Employee = (props) => {
  const dispatch = useDispatch();
  const waiterList = useSelector((state) => state.incentiveSliceInfo.waiterList);
  const sameCaptainAndWaiter = useSelector((state) => state.incentiveSliceInfo.sameCaptainAndWaiter);
  const empIDExist = useSelector((state) => state.incentiveSliceInfo.empIDExist);

  const [dataloaded, setDataloaded] = useState(false);
  const [selectedWaiters, setSelectedWaiters] = useState([]);
  const [captainInfo, setCaptainInfo] = useState(props.captainData)
  const [employeeID, setEmployeeID] = useState('')
  const [error, setError] = useState('');
  const [filter, setFilter] = useState([]);
  const [disableSubmit, setDisableSubmit] = useState(false);

  

  // useEffect(() => {
  //   const captainId = captainInfo.captainid;
  //   const captainName = captainInfo.captainname;
  //   var captain_id = captainInfo?._id

  //   const initialize = async () => {
  //     await dispatch(retrieveEmployeeListAPI(props.captainData));

  //     if (captain_id !== undefined && captain_id !== null) {
  //       const formData = { action: "readOne", data: { id: captainId, name: captainName } };
  //       const response = await dispatch(retrieveCaptainData(formData));

  //       if (response) {
  //         setCaptainInfo(response);
  //         setEmployeeID(response.emp_id)
  //         setSelectedWaiters(response.waiterInfo);
  //         setDataloaded(true);
  //       }
  //     } else {
  //       setCaptainInfo(captainInfo);
  //       setDataloaded(true);
  //     }
  //   };
  //   dispatch(setEmpIDExist(false))

  //   initialize();
  // }, []);


  const handleRowSelection = (id, name) => {
    setSelectedWaiters((prevSelected) => {
      const isSelected = prevSelected.some(waiter => waiter.waiterid === id && waiter.waitername === name);
      if (isSelected) {
        return prevSelected.filter(waiter => waiter.waiterid !== id || waiter.waitername !== name);

      } else {
        return [...prevSelected, { waiterid: id, waitername: name }];
      }
    });

  };


  const onEmployeeIDChange = async (value) => {
    // const trimedValue = toLower(value).trim()
    // setEmployeeID(value);
    // const ID = captainInfo?._id;

    // try {
    //   const result = await dispatch(empDuplicateCheck(trimedValue, ID));
    //   dispatch(setEmpIDExist(result.exists));
    //   if (result.exists) {
    //     setError('Employee ID already exists.');
    //   } else {
    //     setError('');
    //     setCaptainInfo(prev => ({ ...prev, emp_id: value }));
    //     dispatch(setEmpIDExist(result.exists));
    //   }
    // } catch (err) {
    //   console.error('Error occurred while validating employee ID:', err);
    // }
  };

  const sortedWaiterList = useMemo(() => {

    let filteredList = waiterList;

    if (filter.length > 0) {
      filteredList = waiterList.filter(waiter => {
        const { waiterid, waitername, disable } = waiter;
        const isMapped = sameCaptainAndWaiter?.some(item =>
          item.waiterInfo?.some(it => it.waiterid === waiterid && it.waitername === waitername)
        );

        return filter.some(selectedOption => {
          if (selectedOption.value === 'Mapped to another Captain') {
            return disable === true;
          } else if (selectedOption.value === 'Mapped to this Captain') {
            return isMapped === true && !disable;
          } else if (selectedOption.value === 'Unmapped') {
            return !disable && !isMapped;
          }
          return false;
        });
      });
    }

    return filteredList.slice().sort((b, a) => {
      const isAMappedToCurrent = sameCaptainAndWaiter?.some(item =>
        item.waiterInfo?.some(it => it.waiterid === a.waiterid && it.waitername === a.waitername)
      );
      const isBMappedToCurrent = sameCaptainAndWaiter?.some(item =>
        item.waiterInfo?.some(it => it.waiterid === b.waiterid && it.waitername === b.waitername)
      );

      const isADisabled = a.disable;
      const isBDisabled = b.disable;

      if (isAMappedToCurrent && !isBMappedToCurrent) return -1;
      if (!isAMappedToCurrent && isBMappedToCurrent) return 1;
      if (isADisabled && !isBDisabled) return 1;
      if (!isADisabled && isBDisabled) return -1;

      return a.waitername?.localeCompare(b.waitername);
    });
  }, [waiterList, filter, sameCaptainAndWaiter]);


  const columns = useMemo(() => [
    {
      Header: () => (
        <div>
          <h5 className="font-size-14 mb-1">
            <span>{'Select'}</span>
          </h5>
        </div>
      ),
      id: 'select',
      Cell: ({ row }) => {
        const { waiterid, waitername, disable } = row.original;
        const isSelected = selectedWaiters.some(
          (waiter) => waiter.waiterid === waiterid && waiter.waitername === waitername
        );

        return (
          <>
            <input
              type="checkbox"
              defaultChecked={isSelected}
              disabled={disable === true}
              onChange={() => handleRowSelection(waiterid, waitername)}
              style={{
                width: '16px',
                height: '16px',
                background: isSelected ? '#4caf50' : '#fff',
                border: `2px solid ${isSelected ? '#4caf50' : '#ccc'}`,
              }}
            />

          </>
        );
      },
      width: 60,
    },
    {
      Header: "waiter ID",
      accessor: "waiterid",
      filterable: true,
      Cell: ({ row }) => (
        <h5 className="font-size-14 mb-1">
          <span>{row.original.waiterid}</span>
        </h5>
      ),
    },
    {
      Header: "waiter Name",
      accessor: "waitername",
      filterable: true,
      Cell: ({ row }) => (
        <h5 className="font-size-14 mb-1">
          <span>{row.original.waitername ? row.original.waitername : '-'}</span>
        </h5>
      ),
    },
    {
      Header: "Mapped Status",
      accessor: "mapped_status",
      filterable: true,
      Cell: ({ row }) => {
        const { waiterid, waitername, disable } = row.original;
        const isMapped = sameCaptainAndWaiter?.some(item => item.waiterInfo?.some(it => it.waiterid === waiterid && it.waitername === waitername));
        return (
          <h5 className="font-size-14 mb-1">
            <Badge className={`badge ${disable ? 'badge-soft-danger' : (isMapped ? 'badge-soft-success' : 'badge-soft-warning')}`}>
              {disable ? 'Mapped to another Captain' : (isMapped ? 'Mapped to this Captain' : 'Unmapped')}
            </Badge>
          </h5>
        );
      },
    }

  ], [selectedWaiters]);

  const handleSave = async () => {
    // setDisableSubmit(true)
    // var formData = {
    //   action: "create",
    //   data: {
    //     captainid: captainInfo.captainid,
    //     captainname: captainInfo.captainname,
    //     waiterInfo: selectedWaiters,
    //     emp_id: employeeID,
    //   }
    // }
    // var captainId = captainInfo?._id

    // if (captainId && captainId !== undefined && captainId !== 'undefined') {
    //   formData.data.id = captainId;
    //   formData.action = 'update';
    // }

    // if (isEmptyArray(formData.data.waiterInfo)) {
    //   setDisableSubmit(false)
    //   toastError('Waiter information is missing!', 'Failure!');
    // } else if (empIDExist === true) {
    //   setDisableSubmit(false)
    //   toastError(' Employee ID already exists.!');
    // } else {
    //   const response = await dispatch(retrieveCaptainData(formData));
    //   if (response) {
       
    //     toastSuccess('Waiter information is valid!', 'Success!')
        
    //     await dispatch(retrieveEmployeeListAPI());
    //     const data = await getAllCaptainMappings();
    //     if (data) {
    //       dispatch(setSameCaptainAndWaiter(data));
    //       setDisableSubmit(false)
    //     }
    //     props.toggleOffcanvas()
    //   }
    // }
  };

  const toastError = (message, title) => {
    toastr.options.closeDuration = 8000
    toastr.options.positionClass = "toast-top-right"
    toastr.error(message, title)
  }

  const toastSuccess = (message, title) => {
    toastr.options.closeDuration = 8000
    toastr.options.positionClass = "toast-top-right"
    toastr.success(message, title)
  }



  const options = [
    { value: 'All', label: 'All' },
    { value: 'Mapped to another Captain', label: 'Mapped to another Captain' },
    { value: 'Mapped to this Captain', label: 'Mapped to this Captain' },
    { value: 'Unmapped', label: 'Unmapped' },
  ];

  const filterChange = (selectedOptions) => {
    setFilter(selectedOptions);
  };

  return (
    <div>
      {dataloaded ? (
        <Container fluid>
          <Col lg="12">
            <Card>
              <CardBody>
                {/* Title Section */}
                <div>
                  <Label>Captain & Waiter Mapping</Label>
                </div>
                <Card style={{ border: '1px solid lightgrey' }}>
                  <CardBody className='p-0'>
                    <Table bordered className='m-0'>
                      <tbody>
                        <tr>
                          <td style={{ textAlign: 'center' }}>
                            <p>Captain ID</p>
                            <h5>{captainInfo.captainid}</h5>
                          </td>
                          <td style={{ textAlign: 'center' }}>
                            <p>Captain Name</p>
                            <h5>{captainInfo.captainname}</h5>
                          </td>
                          <td style={{ textAlign: 'center' }}>
                            <p>Employee ID</p>
                            <Input
                              type="text"
                              placeholder="Enter Employee ID"
                              invalid={!!error && employeeID !== ''}
                              onChange={(e) => onEmployeeIDChange(e.target.value)}
                              value={employeeID}
                            />
                            <FormFeedback>{error}</FormFeedback>
                          </td>
                        </tr>
                      </tbody>
                    </Table>
                  </CardBody>
                </Card>
                <TableContainer
                  isPagination={true}
                  columns={columns}
                  data={sortedWaiterList}
                  isGlobalFilter={true}
                  isShowingPageLength={true}
                  isAddUserList={true}
                  iscustomPageSizeOptions={true}
                  customPageSize={10}
                  tableClass="table align-middle table-nowrap table-hover"
                  theadClass="table-light"
                  paginationDiv="col-sm-12 col-md-7"
                  pagination="pagination pagination-rounded justify-content-end mt-4"
                  mappedOptions={options}
                  filteredValue={filter}
                  setFilter={filterChange}
                />
                <Row className="mt-3">
                  <Col className="text-end">
                    <Button color="success" disabled={disableSubmit} onClick={handleSave}>
                      Save
                    </Button>
                  </Col>
                </Row>
              </CardBody>
            </Card>
          </Col>
        </Container>
      ) : (
        <div >
            load
         {/* <PageLoader /> */}
        </div>
      )}
    </div>
  );

};

export default Edit_Employee;
