import { useMutation } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import { useNavigate } from "react-router-dom";
import { uploadDocuments } from "../api";
import Loading from "../components/Loading";

const Documents = () => {
  const navigate = useNavigate();

  const [frontImage, setFrontImage] = useState(null);
  const [backImage, setBackImage] = useState(null);
  const [frontImageUrl, setFrontImageUrl] = useState(null);
  const [backImageUrl, setBackImageUrl] = useState(null);

  const { isLoading, mutate } = useMutation({
    mutationFn: uploadDocuments,
    onSuccess: () => {
      navigate("/");
      toast.success("Successfully Uploaded the documents");
    },
    onError: (err) => {
      console.log("error while log in", err);
      toast.error(err?.response?.data.message || "INTERNAL SERVER ERROR");
    },
  });

  useEffect(() => {
    if (frontImage) {
      const url = URL.createObjectURL(frontImage);
      setFrontImageUrl(url);
      return () => URL.revokeObjectURL(url);
    }
  }, [frontImage]);

  useEffect(() => {
    if (backImage) {
      const url = URL.createObjectURL(backImage);
      setBackImageUrl(url);
      return () => URL.revokeObjectURL(url);
    }
  }, [backImage]);

  const handleFrontImageChange = (e) => {
    setFrontImage(e.target.files[0]);
  };

  const handleBackImageChange = (e) => {
    setBackImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();

    formData.append("front", frontImage);
    formData.append("back", backImage);
    mutate(formData);
  };

  if (isLoading) return <Loading />;

  return (
    <div className="rounded-lg border">
      <form onSubmit={handleSubmit} className="p-6">
        <div className="flex flex-col space-y-1.5">
          <h3 className="whitespace-nowrap text-2xl font-semibold leading-none tracking-tight">
            Upload Citizenship Documents
          </h3>
          <p className="text-sm text-muted-foreground">
            Please upload both the front and back sides of your citizenship
            document.
          </p>
        </div>
        <div className="grid gap-4">
          <div className="space-y-2">
            <label
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              htmlFor="front"
            >
              Front of Document
            </label>
            <div className="flex items-center gap-4">
              <input
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                id="front"
                type="file"
                accept="image/*"
                onChange={handleFrontImageChange}
              />
            </div>
            {frontImageUrl && (
              <img
                src={frontImageUrl}
                alt="Front of Document"
                className="mt-2 rounded-md w-64 h-64"
              />
            )}
          </div>
          <div className="space-y-2">
            <label
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              htmlFor="back"
            >
              Back of Document
            </label>
            <div className="flex items-center gap-4">
              <input
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                id="back"
                type="file"
                accept="image/*"
                onChange={handleBackImageChange}
              />
            </div>
            {backImageUrl && (
              <img
                src={backImageUrl}
                alt="Back of Document"
                className="mt-2 rounded-md w-64 h-64"
              />
            )}
          </div>
          <button
            type="submit"
            className="mt-4 w-full bg-blue-500 text-white py-2 rounded-md"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default Documents;
