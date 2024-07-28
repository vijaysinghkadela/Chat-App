import React, { useState } from "react";
import AdminLayout from "../../components/layout/AdminLayout";
import Table from "../../components/shared/Table";

const columns = [{
  field: "id",
}];
const UserManagement = () => {
  const [rows, setRows] = useState([]);

  return (
    <AdminLayout>
      <Table heading={"All Users"} columns={columns} rows={rows} />
    </AdminLayout>
  );
};

export default UserManagement;
