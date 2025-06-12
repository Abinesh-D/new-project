import React, { useState, useEffect, useMemo } from 'react';
import { Col, Container, Row, Label, Card, CardBody, Badge, Spinner, UncontrolledTooltip, Offcanvas, OffcanvasBody, OffcanvasHeader } from 'reactstrap';
import TableContainer from './TableContainer';
import { useSelector, useDispatch } from 'react-redux';
import Edit_Employee from './Edit_Employee';
// import DeleteModal from 'components/Common/DeleteModal'; 
// import { retrieveCaptainData, setSameCaptainAndWaiter } from '../../../Slice/incentiveSlice';
// import PageLoader from 'pages/ManageIncentive/Component/PageLoader';


const HS_Employees = () => {
    const dispatch = useDispatch();

    const captainList = useSelector((state) => state.incentiveSliceInfo.captainList);
    const sameCaptainAndWaiter = useSelector((state) => state.incentiveSliceInfo.sameCaptainAndWaiter);
    const [captainInfo, setCaptainInfo] = useState([]);
    const [filter, setFilter] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const [selectedCaptain, setSelectedCaptain] = useState(null);
    const [modalOpen, setModalOpen] = useState(false)



    // useEffect(() => {
    //     const updatedCaptainList = captainList.map(item => {
    //         const waiterData = sameCaptainAndWaiter.find(data => data.captainid === item.captainid && data.captainname === item.captainname);
    //         return waiterData ? { ...waiterData } : { ...item, waiterInfo: [] };
    //     });
    //     setCaptainInfo(updatedCaptainList);
    // }, [captainList, sameCaptainAndWaiter]);

    const totalRows = captainInfo.length;

    const onEditClick = (data) => {
        setSelectedCaptain(data);
        setTimeout(() => {
            setIsOpen(true);
        }, 200);
    };

    const columns = useMemo(() => [
        {
            Header: "S.No",
            accessor: "serial_number",
            Cell: ({ row }) => <h5 className="font-size-14 mb-1"><span>{totalRows - row.index}</span></h5>
        },
        {
            Header: "Captain Name",
            accessor: "captainname",
            Cell: ({ row }) => <h5 className="font-size-14 mb-1"><span>{row.original.captainname}</span></h5>
        },
        {
            Header: "Captain ID",
            accessor: "captainid",
            Cell: ({ row }) => <h5 className="font-size-14 mb-1"><span>{row.original.captainid}</span></h5>
        },
        {
            Header: "Waiter Mapping",
            accessor: "waitername",
            Cell: ({ row }) => (
                <h5 className="font-size-14 mb-1">
                    <Badge className={`badge ${row.original.waiterInfo.length > 0 ? 'badge-soft-success' : 'badge-soft-danger'}`}>
                        {row.original.waiterInfo.length > 0 ? 'Mapped' : 'Not Mapped'}
                    </Badge>
                </h5>
            )
        },
        {
            Header: "Created At",
            accessor: "createdAt",
            Cell: cellProps => {
                const { createdAt } = cellProps.row.original;
                const formatDate = (date) => {
                    const options = { year: 'numeric', month: 'short', day: '2-digit' };
                    const dateParts = new Date(date)
                        .toLocaleDateString('en-GB', options)
                        .replace(',', '')
                        .split(' ');
                    return `${dateParts[0]}-${dateParts[1]}-${dateParts[2]}`;
                };

                const formattedDate = createdAt ? formatDate(createdAt) : 'DD-MM-YYYY';

                return (
                    <>
                        <h5 className="font-size-14 mb-1">
                            <span>{formattedDate}</span>
                        </h5>
                    </>
                );
            },
        },
        {
            Header: 'Actions',
            Cell: ({ row }) => (
                <div className="d-flex align-items-center gap-3">

                    <div className="d-flex align-items-end gap-3" onClick={() => onEditClick(row.original)}>
                        <i className="bx bx-pencil font-size-18 text-success" id="edittooltip" style={{ cursor: 'pointer' }} />
                        <UncontrolledTooltip placement="top" target="edittooltip">Edit</UncontrolledTooltip>
                    </div>
                    {
                        row.original.waiterInfo?.length > 0 && (
                            <div style={{ cursor: 'pointer' }} className="text-danger" onClick={() => { const data = row.original; onRemove(data); }} >
                                <i className="mdi mdi-account-cancel-outline font-size-18" id="removetooltip" />
                                <UncontrolledTooltip placement="top" target="removetooltip">
                                    Remove Mapping
                                </UncontrolledTooltip>
                            </div>
                        )
                    }


                </div>

            ),
            disableSortBy: true
        },
    ], [captainInfo, totalRows]);

    const filteredCaptainInfo = useMemo(() => {
        const filteredList = filter.length > 0 && filter[0].value !== 'All'
            ? captainInfo.filter(captain => filter.some(selected => selected.value === (captain.waiterInfo.length > 0 ? 'Mapped' : 'Not Mapped')))
            : captainInfo;

        const mappedCaptains = filteredList.filter(captain => captain.waiterInfo.length > 0).sort((a, b) => a.captainname?.localeCompare(b.captainname));
        const nonMappedCaptains = filteredList.filter(captain => captain.waiterInfo.length === 0).sort((a, b) => b.captainname?.localeCompare(a.captainname));

        return [...nonMappedCaptains, ...mappedCaptains];
    }, [filter, captainInfo]);

    const filterChange = (selectedOptions) => setFilter(selectedOptions);

    const toggleOffcanvas = () => setIsOpen(!isOpen);


    const onRemove = (data) => {
        setSelectedCaptain(data)
        setModalOpen(true)
    }

    const removeWaiterMapping = async () => {

        // const formData = { action: "remove", data: { id: selectedCaptain._id } };
        // const response = await dispatch(retrieveCaptainData(formData));
        // if (response) {
        //     const formData2 = { "action": "readAll", };
        //     const data = await dispatch(retrieveCaptainData(formData2));
        //     if (data) {
        //         dispatch(setSameCaptainAndWaiter(data));
        //     }
        //     setModalOpen(false);

        // }
    };

    return (
        <div>
            {/* <Row className="mb-3">
                <Col md={6}><Label className="ms-2">Captain and Waiter Mapping</Label></Col>
            </Row> */}
            {/* {
                modalOpen && (s
                    <DeleteModal
                        show={modalOpen}
                        onDeleteClick={removeWaiterMapping}
                        onCloseClick={() => setModalOpen(false)}
                        profileName={selectedCaptain.captainname}
                        warningText={'Are you sure you want to Unmapping'}
                    />
                )
            } */}

            {totalRows > 0 ? (
                <Container fluid>
                    <Row>
                        <Col lg="12">
                            <Card>
                                <CardBody>
                                    {/* <TableContainer
                                        isPagination={true}
                                        columns={columns}
                                        data={filteredCaptainInfo}
                                        isGlobalFilter={true}
                                        isShowingPageLength={true}
                                        iscustomPageSizeOptions={true}
                                        customPageSize={10}
                                        tableClass="table align-middle table-nowrap table-hover"
                                        theadClass="table-light"
                                        paginationDiv="col-sm-12 col-md-7"
                                        pagination="pagination pagination-rounded justify-content-end mt-4"
                                        mappedOptions={[
                                            // { value: 'All', label: 'All' },
                                            { value: 'Mapped', label: 'Mapped' },
                                            { value: 'Not Mapped', label: 'Not Mapped' },
                                        ]}
                                        filteredValue={filter}
                                        setFilter={filterChange}
                                    /> */}
                                    <TableContainer
                                        isPagination={true}
                                        columns={columns}
                                        data={filteredCaptainInfo}
                                        isGlobalFilter={true}
                                        isShowingPageLength={true}
                                        iscustomPageSizeOptions={true}
                                        customPageSize={10}
                                        tableClass="table align-middle table-nowrap table-hover"
                                        theadClass="table-light"
                                        paginationDiv="col-sm-12 col-md-7"
                                        pagination="pagination pagination-rounded justify-content-start mt-4"
                                        mappedOptions={[
                                            { value: 'Mapped', label: 'Mapped' },
                                            { value: 'Not Mapped', label: 'Not Mapped' },
                                        ]}
                                        filteredValue={filter}
                                        setFilter={filterChange}
                                    />
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>
                </Container>
            ) : (
                <p>loaded</p>
                // <PageLoader />
            )}

            <Offcanvas isOpen={isOpen} toggle={toggleOffcanvas} direction="end" style={{ width: '50%' }} backdrop={false}>
                <OffcanvasHeader toggle={toggleOffcanvas}>Edit Captain Info</OffcanvasHeader>
                <OffcanvasBody className='p-0'>
                    <Edit_Employee captainData={selectedCaptain} toggleOffcanvas={toggleOffcanvas} />
                </OffcanvasBody>
            </Offcanvas>
        </div>
    );
};

export default HS_Employees;
