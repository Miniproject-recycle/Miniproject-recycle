import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import ResultModal from "./components/ResultModal";

const ResultRoute = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state || {};

  const imageUrl = state.imageUrl || null;
  const result = state.result || null;
  const isLoading = state.isLoading || false;

  return (
    <ResultModal
      open
      onClose={() => navigate(-1)}
      imageUrl={imageUrl}
      result={result}
      isLoading={isLoading}
    />
  );
};

export default ResultRoute;
