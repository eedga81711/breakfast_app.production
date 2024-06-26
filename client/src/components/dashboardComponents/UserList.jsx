/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useContext, useEffect, useState } from "react";

//material imports
import PropTypes from "prop-types";
import { alpha } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import TableSortLabel from "@mui/material/TableSortLabel";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Checkbox from "@mui/material/Checkbox";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
import DeleteIcon from "@mui/icons-material/Delete";
import FilterListIcon from "@mui/icons-material/FilterList";
import { visuallyHidden } from "@mui/utils";
import { Button } from "@mui/material";

//context imports
import { ModalContext } from "../../contexts/ModalContext";

import { CreateUser, DeleteUser, EditUser } from "../modalComponents";
import axios from "axios";
import { getUserUrl } from "../../constants";
import { FaUserEdit } from "react-icons/fa";
import { TbUserEdit } from "react-icons/tb";
import { TiUserDelete } from "react-icons/ti";

function createData(
  id,
  name,
  email,
  company,
  type,
  status,
  timestamps,
  actions
) {
  return {
    id,
    name,
    email,
    company,
    type,
    status,
    timestamps,
    actions,
  };
}

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) {
      return order;
    }
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

const headCells = [
  // {
  //   id: "id",
  //   numeric: false,
  //   disablePadding: true,
  //   label: "UserId",
  // },
  {
    id: "name",
    numeric: true,
    disablePadding: false,
    label: "Username",
  },
  {
    id: "email",
    numeric: true,
    disablePadding: false,
    label: "Email",
  },
  {
    id: "company",
    numeric: true,
    disablePadding: false,
    label: "Company",
  },
  {
    id: "type",
    numeric: true,
    disablePadding: false,
    label: "Type",
  },
  {
    id: "status",
    numeric: true,
    disablePadding: false,
    label: "Status",
  },
  {
    id: "timestamps",
    numeric: true,
    disablePadding: false,
    label: "Time Added",
  },
  {
    id: "actions",
    numeric: true,
    disablePadding: false,
    label: "Actions",
  },
];

function EnhancedTableHead(props) {
  const {
    onSelectAllClick,
    order,
    orderBy,
    numSelected,
    rowCount,
    onRequestSort,
  } = props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow className="bg-yellow">
        <TableCell padding="checkbox">
          <Checkbox
            color="primary"
            indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={rowCount > 0 && numSelected === rowCount}
            onChange={onSelectAllClick}
            inputProps={{
              "aria-label": "select all desserts",
            }}
          />
        </TableCell>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            // align={headCell.numeric ? "right" : "left"}
            align="center"
            padding={headCell.disablePadding ? "none" : "normal"}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : "asc"}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <Box component="span" sx={visuallyHidden}>
                  {order === "desc" ? "sorted descending" : "sorted ascending"}
                </Box>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

EnhancedTableHead.propTypes = {
  numSelected: PropTypes.number.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  onSelectAllClick: PropTypes.func.isRequired,
  order: PropTypes.oneOf(["asc", "desc"]).isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
};

function EnhancedTableToolbar(props) {
  const { numSelected } = props;

  //context
  const { setOpenDeleteUser } = useContext(ModalContext);

  const handleDelete = ({ selected }) => {
    setOpenDeleteUser(true);
  };

  return (
    <Toolbar
      sx={{
        pl: { sm: 2 },
        pr: { xs: 1, sm: 1 },
        ...(numSelected > 0 && {
          bgcolor: (theme) =>
            alpha(
              theme.palette.primary.main,
              theme.palette.action.activatedOpacity
            ),
        }),
      }}
    >
      {numSelected > 0 ? (
        <Typography
          sx={{ flex: "1 1 100%" }}
          color="inherit"
          variant="subtitle1"
          component="div"
        >
          {numSelected} selected
        </Typography>
      ) : (
        <Typography
          sx={{ flex: "1 1 100%" }}
          variant="h6"
          id="tableTitle"
          component="div"
        >
          Users List...
        </Typography>
      )}

      {numSelected > 0 ? (
        <Tooltip title="Delete">
          <IconButton onClick={handleDelete}>
            {/* <DeleteIcon /> */}
            <TiUserDelete size={24} color="black" />
          </IconButton>
        </Tooltip>
      ) : (
        <Tooltip title="Filter list">
          <IconButton>
            <FilterListIcon />
          </IconButton>
        </Tooltip>
      )}
    </Toolbar>
  );
}

EnhancedTableToolbar.propTypes = {
  numSelected: PropTypes.number.isRequired,
};

export default function EnhancedTable({ onSelectUser }) {
  const [order, setOrder] = React.useState("asc");
  const [orderBy, setOrderBy] = React.useState(""); // add userId as a property
  const [selected, setSelected] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [dense, setDense] = React.useState(false);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [data, setData] = React.useState([]);

  const formatTimestamp = (updatedAt) => {
    const date = new Date(updatedAt);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const seconds = String(date.getSeconds()).padStart(2, "0");
    return `${year}/${month}/${day} ${hours}:${minutes}:${seconds}`;
  };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await axios.get(getUserUrl);

      // console.log(res.data.users);
      setData(res.data.users);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelected = data.map((n) => n.id);
      setSelected(newSelected);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, id) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }
    setSelected(newSelected);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleChangeDense = (event) => {
    setDense(event.target.checked);
  };

  const isSelected = (id) => selected.indexOf(id) !== -1;

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - data.length) : 0;

  const visibleRows = React.useMemo(
    () =>
      stableSort(data, getComparator(order, orderBy)).slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage
      ),
    [order, orderBy, page, rowsPerPage, data]
  );

  //context
  const { setOpenCreateUser, setOpenEditUser } = useContext(ModalContext);

  const [selectedUserData, setSelectedUserData] = useState(null);
  const handleRowClick = (userData) => {
    setSelectedUserData(userData);
  };

  const handleCreate = () => {
    console.log("create User opened");
    setOpenCreateUser(true);
  };

  const handleEdit = (userData) => {
    console.log("edit User opened");
    setOpenEditUser(true);
    setSelectedUserData(userData);
  };

  return (
    <div className="surface-ground px-0 py-1 md:px-4 lg:px-6">
      <div className="flex flex-col">
        <div className="flex justify-end items-end p-0 gap-10">
          <div
            className={`rounded button-yellow mb-1 text-[14px] text-center py-2 col-12`}
            onClick={handleCreate}
          >
            <span className="text-black w-full">Add New User</span>
          </div>
        </div>

        <Box sx={{ width: "100%" }} c="true">
          <Paper sx={{ width: "100%", mb: 2 }}>
            <EnhancedTableToolbar numSelected={selected.length} />
            <TableContainer>
              <Table
                sx={{ minWidth: 750 }}
                aria-labelledby="tableTitle"
                size={dense ? "small" : "medium"}
              >
                <EnhancedTableHead
                  numSelected={selected.length}
                  order={order}
                  orderBy={orderBy}
                  onSelectAllClick={handleSelectAllClick}
                  onRequestSort={handleRequestSort}
                  rowCount={data.length}
                />
                <TableBody>
                  {visibleRows.map((row) => {
                    const isItemSelected = isSelected(row.userId);
                    const labelId = `enhanced-table-checkbox-${row.userId}`;

                    return (
                      <TableRow
                        hover
                        onClick={(event) => {
                          handleClick(event, row.userId);
                          handleRowClick(row);
                        }}
                        role="checkbox"
                        aria-checked={isItemSelected}
                        tabIndex={-1}
                        key={row.userId}
                        selected={isItemSelected}
                        sx={{ cursor: "pointer" }}
                      >
                        <TableCell padding="checkbox">
                          <Checkbox
                            color="primary"
                            checked={isItemSelected}
                            inputProps={{
                              "aria-labelledby": labelId,
                            }}
                            name="label"
                          />
                        </TableCell>
                        {/* <TableCell
                          component="th"
                          id={labelId}
                          scope="row"
                          padding="none"
                          align="center"
                        >
                          {row.userId}
                        </TableCell> */}
                        <TableCell align="center">{row.name}</TableCell>
                        <TableCell align="center">{row.email}</TableCell>
                        <TableCell align="center">{row.company}</TableCell>
                        <TableCell align="center">{row.userType}</TableCell>
                        <TableCell align="center">{row.status}</TableCell>
                        <TableCell align="center">
                          {formatTimestamp(row.updatedAt)}
                        </TableCell>
                        <TableCell align="center">
                          <IconButton
                            // style={{ background: "yellow", color: "black" }}
                            // variant="outlined"
                            size="xs"
                            onClick={handleEdit}
                          >
                            <TbUserEdit size={20} color="black" />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                  {emptyRows > 0 && (
                    <TableRow
                      style={{
                        height: (dense ? 20 : 30) * emptyRows,
                      }}
                    >
                      <TableCell colSpan={6} />
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={data.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </Paper>
          <FormControlLabel
            control={<Switch checked={dense} onChange={handleChangeDense} />}
            label="Dense padding"
          />
        </Box>

        <CreateUser fetchData={fetchData} />
        <DeleteUser fetchData={fetchData} selectedUserData={selectedUserData} />
        <EditUser selectedUserData={selectedUserData} fetchData={fetchData} />
      </div>
    </div>
  );
}
