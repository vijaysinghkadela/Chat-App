import React, { useEffect, useState } from "react";
import AdminLayout from "../../components/layout/AdminLayout";
import Table from "../../components/shared/Table";
import { dashboardData } from "../../constants/sampleData";
import { transfromImage } from "../../lib/features";
import { Badge } from "@mui/material";

const columns = [
  {
    field: "id",
    headerName: "ID",
    headerClassName: "table-header",
    width: 200,
  },
  {
    field: "avatar",
    headerName: "avatar",
    headerClassName: "table-header",
    width: 150,
    renderCell: (params) => (
      <avatar alt={params.row.name} src={params.row.avatar} />
    ),
  },

  {
    field: "name",
    headerName: "Name",
    headerClassName: "table-header",
    width: 200,
  },
  {
    field: "username",
    headerName: "Username",
    headerClassName: "table-header",
    width: 200,
  },
  {
    field: "friends",
    headerName: "Friends",
    headerClassName: "table-header",
    width: 150,
  },
  {
    field: "groups",
    headerName: "Groups",
    headerClassName: "table-header",
    width: 100,
    renderCell: (params) => (
      <Badge variant={params.row.status === "active" ? "success" : "danger"}>
        {params.row.status}
      </Badge>
    ),
  },
];
const UserManagement = () => {
  const [rows, setRows] = useState([]);

  useEffect(() => {
    setRows(
      dashboardData.users.map((i) => ({
        ...i,
        id: i._id,
        avatar: transfromImage(i.avatar, 50),
      }))
    );
  }, []);

  return (
    <AdminLayout>
      <Table heading={"All Users"} columns={columns} rows={rows} />
    </AdminLayout>
  );
};

export default UserManagement;
