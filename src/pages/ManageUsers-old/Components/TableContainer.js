import React, { Fragment } from "react"
import PropTypes from "prop-types"
import {
    useTable,
    useGlobalFilter,
    useAsyncDebounce,
    useSortBy,
    useExpanded,
    usePagination,
} from "react-table"
import {
    Table, Row, Col, Button,
    Dropdown,
    DropdownToggle,
    DropdownMenu,
    DropdownItem
} from "reactstrap"
import JobListGlobalFilter from "./GlobalSearchFilter"
import { Link } from "react-router-dom"
// import FuzzySearch from '../../../../common/FuzzySearch';


// Define a default UI for filtering
function GlobalFilter({
    preGlobalFilteredRows,
    globalFilter,
    setGlobalFilter,
    isJobListGlobalFilter,
}) {
    const count = preGlobalFilteredRows.length
    const [value, setValue] = React.useState(globalFilter)
    const onChange = useAsyncDebounce(value => {
        setGlobalFilter(value || undefined)
    }, 200)

    return (
        <React.Fragment>
            <Col lg={4} md={4} >
                <div className="col-12">
                    <input type="search" className="form-control" id="search-bar-0" value={value || ""} placeholder={`${count} records...`} onChange={e => { setValue(e.target.value); onChange(e.target.value) }} />
                </div>
            </Col>
            {isJobListGlobalFilter && <JobListGlobalFilter setGlobalFilter={setGlobalFilter} />}
        </React.Fragment>
    )
}

const RoleTableContainer = ({
    columns,
    data,
    isGlobalFilter,
    isJobListGlobalFilter,
    isAddOptions,
    isAddUserList,
    handleOrderClicks,
    handleUserClick,
    handleCustomerClick,
    isAddCustList,
    customPageSize,
    customPageSizeOptions,
    iscustomPageSizeOptions,
    isPagination,
    isShowingPageLength,
    paginationDiv,
    pagination,
    tableClass,
    theadClass,
    dynamicBtn,
    btnName,
    btnClick,
    protect_routes,
    search_group_name,
    getFuzzySearch,
    dup_search_group_name,
    dup_temp_search_group,
    dup_labelData,
    moveToLabel,
    toggle2,
    labelDefault,
    removeFromLabel,
    confirmDelete,
    resultData,
    filterStatus,
    show_selected,
    totalEntities,
    isAllSelected,
    loadUserLabels,
    selectedEOPT
}) => {
    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        page,
        prepareRow,
        canPreviousPage,
        canNextPage,
        pageOptions,
        gotoPage,
        nextPage,
        previousPage,
        setPageSize,
        state,
        preGlobalFilteredRows,
        setGlobalFilter,
        state: { pageIndex, pageSize },
    } = useTable(
        {
            columns,
            data,
            // defaultColumn: { Filter: DefaultColumnFilter },
            initialState: {
                pageIndex: 0,
                pageSize: customPageSize,
                sortBy: [
                    {
                        desc: true,
                    },
                ],
            },
        },
        useGlobalFilter,
        // useFilters,
        useSortBy,
        useExpanded,
        usePagination
    )

    const [folder_Menu, setFolderMenu] = React.useState(false)

    const generateSortingIndicator = column => {
        return column.isSorted ? (column.isSortedDesc ? " 🔽" : " 🔼") : ""
    }

    const onChangeInSelect = event => {
        setPageSize(Number(event.target.value))
    }

    const toggleFolder = () => {
        console.log(page,'page')
        // page.forEach((row) => {
        //     row.original.selected =false;
        //   }); 
        setFolderMenu(!folder_Menu)
        loadUserLabels()
    }

    return (
        <Fragment>
            <Row className="mb-2">

                {iscustomPageSizeOptions &&
                    <Col md={customPageSizeOptions ? 2 : 1}>
                        <select
                            className="form-select"
                            value={pageSize}
                            onChange={onChangeInSelect}
                        >
                            {[10, 20, 30, 40, 50].map(pageSize => (
                                <option key={pageSize} value={pageSize}>
                                    Show {pageSize}
                                </option>
                            ))}
                        </select>
                    </Col>
                }

                {isGlobalFilter && (
                    <GlobalFilter
                        preGlobalFilteredRows={preGlobalFilteredRows}
                        globalFilter={state.globalFilter}
                        setGlobalFilter={setGlobalFilter}
                        isJobListGlobalFilter={isJobListGlobalFilter}
                    />
                )}

              



               

                {dynamicBtn && (
                     <Col sm="7" xxl="8">
                        <div className="d-flex align-items-center justify-content-end">
                            <Button onClick={() => { btnClick() }} className="btn-sm d-flex align-items-center" color="primary" type="button">
                                <i className="bx bx-list-plus me-1" style={{ fontSize: '20px' }} /> {btnName}
                            </Button>
                        </div>                     
                    </Col>
                )}
            </Row>
               
          


            {/* <div className="table-responsive" style={{ minHeight: 500 }}> */}
            <div className="table-responsive">
                <Table {...getTableProps()} className={tableClass}>
                    <thead className={theadClass}>
                        {headerGroups.map(headerGroup => (
                            <tr key={headerGroup.id} {...headerGroup.getHeaderGroupProps()}>
                                {headerGroup.headers.map(column => (
                                    <th key={column.id} className={column.isSort ? "sorting" : ''} width={column.width}>
                                        {
                                            column.isSort ?
                                                <div className="m-0" {...column.getSortByToggleProps()}>
                                                    {column.render("Header")}
                                                </div> :
                                                <div className="m-0" >
                                                    {column.render("Header")}
                                                </div>
                                        }

                                    </th>
                                ))}
                            </tr>
                        ))}
                    </thead>

                    <tbody {...getTableBodyProps()}>
                        {page.map(row => {
                            prepareRow(row)
                            return (
                                <Fragment key={row.getRowProps().key}>
                                    <tr>
                                        {row.cells.map(cell => {
                                            return (
                                                <td key={cell.id} {...cell.getCellProps()}>
                                                    {cell.render("Cell")}
                                                </td>
                                            )
                                        })}
                                    </tr>
                                </Fragment>
                            )
                        })}
                    </tbody>
                </Table>
            </div>

            {
                isPagination && (
                    <Row className="justify-content-end align-items-center mt-2">
                        {isShowingPageLength && <div className="col-sm">
                            <div className="text-muted">Showing <span className="fw-semibold">{page.length}</span> of <span className="fw-semibold">{data.length}</span> entries</div>
                        </div>}
                        <div className={paginationDiv}>
                            <ul className={pagination}>
                                <li className={`page-item ${!canPreviousPage ? "disabled" : ''}`}>
                                    <Link to="#" className="page-link" onClick={previousPage}>
                                        <i className="mdi mdi-chevron-left"></i>
                                    </Link>
                                </li>
                                {pageOptions.map((item, key) => (
                                    <React.Fragment key={key}>
                                        <li className={pageIndex === item ? "page-item active" : "page-item"}>
                                            <Link to="#" className="page-link" onClick={() => gotoPage(item)}>{item + 1}</Link>
                                        </li>
                                    </React.Fragment>
                                ))}
                                <li className={`page-item ${!canNextPage ? "disabled" : ''}`}>
                                    <Link to="#" className="page-link" onClick={nextPage}>
                                        <i className="mdi mdi-chevron-right"></i>
                                    </Link>
                                </li>
                            </ul>
                        </div>
                    </Row>
                )
            }
        </Fragment>
    )
}

RoleTableContainer.propTypes = {
    preGlobalFilteredRows: PropTypes.any,
}

export default RoleTableContainer
