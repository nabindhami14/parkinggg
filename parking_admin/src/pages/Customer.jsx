import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";

import { privateApi } from "../api";
import ErrorComponent from "../components/ErrorComponent";
import Loading from "../components/Loading";
import UserProfile from "../components/Profile";
import UserDocuments from "../components/UserDocuments";

const Customer = () => {
  const { id } = useParams();

  const {
    data: customer,
    isLoading,
    isError,
    error,
  } = useQuery(["customer", id], async () => {
    const res = await privateApi.get(`/users/${id}`);
    return res.data.user;
  });

  if (isLoading) return <Loading />;

  if (isError) {
    return <ErrorComponent label="Customer Profile" error={error} />;
  }

  return (
    <>
      <UserProfile user={customer} />
      <UserDocuments userId={id} />
    </>
  );
};

export default Customer;
