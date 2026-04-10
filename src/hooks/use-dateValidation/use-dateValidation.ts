import { useState, useEffect } from "react";

type DateTypes = {
  minDate?: string;
  maxDate?: string;
  publishDate?: string;
  publishStartDate?: string;
  publishEndDate?: string;
  expirationDate?: string;
};

type DateValidationConfig = {
  maxMinDateErrorMessage?: string;
  publishDateErrorMessage?: string;
};

export const useDateValidation = (
  initialFilters: DateTypes,
  config?: DateValidationConfig
) => {
  const [filters, setFilters] = useState(initialFilters);
  const [error, setError] = useState("");
  const [publishError, setPublishError] = useState("");

  useEffect(() => {
    if (
      filters.minDate &&
      filters.maxDate &&
      new Date(filters.minDate) > new Date(filters.maxDate)
    ) {
      setError(
        config?.maxMinDateErrorMessage ||
          "Max date should not be earlier than the min date."
      );
    } else if (
      filters.publishStartDate &&
      filters.publishEndDate &&
      new Date(filters.publishStartDate) > new Date(filters.publishEndDate)
    ) {
      setPublishError(
        config?.publishDateErrorMessage ||
          "Publish end date should not be earlier than the publish start date."
      );
    } else if (
      filters.publishDate &&
      filters.expirationDate &&
      new Date(filters.publishDate) > new Date(filters.expirationDate)
    ) {
      setPublishError(
        config?.publishDateErrorMessage ||
          "Expiration date should not be earlier than the publish date."
      );
    } else {
      setError("");
    }
  }, [
    filters.minDate,
    filters.maxDate,
    filters.publishStartDate,
    filters.publishEndDate,
    filters.publishDate,
    filters.expirationDate,
  ]);

  const handleDateChange = (type: keyof DateTypes) => (value: string) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      [type]: value,
    }));
  };

  return {
    filters,
    error,
    publishError,
    handleMinDateChange: handleDateChange("minDate"),
    handleMaxDateChange: handleDateChange("maxDate"),
    handlePublishDateChange: handleDateChange("publishDate"),
    handlePublishStartDateChange: handleDateChange("publishStartDate"),
    handlePublishEndDateChange: handleDateChange("publishEndDate"),
    handleExpireDateChange: handleDateChange("expirationDate"),
    setFilters,
  };
};

export default useDateValidation;
