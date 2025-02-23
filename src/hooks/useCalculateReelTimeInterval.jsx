import React, { useEffect, useState } from "react";

function useCalculateReelTimeInterval(uploadTime) {
  const [dateInterval, setDateInterval] = useState("");

  const formatTime = () => {
    const now = new Date();
    const date = new Date(uploadTime); // Use uploadTime here
    const diffInMilliseconds = now - date;

    const diffInSeconds = Math.floor(diffInMilliseconds / 1000);
    const diffInMinutes = Math.floor(diffInMilliseconds / (1000 * 60));
    const diffInHours = Math.floor(diffInMilliseconds / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInMilliseconds / (1000 * 60 * 60 * 24));
    const diffInMonths = Math.floor(
      diffInMilliseconds / (1000 * 60 * 60 * 24 * 30)
    );
    const diffInYears = Math.floor(
      diffInMilliseconds / (1000 * 60 * 60 * 24 * 365)
    );

    const rtf = new Intl.RelativeTimeFormat("en", { numeric: "auto" });

    if (diffInYears > 0) {
      return rtf.format(-diffInYears, "year");
    } else if (diffInMonths > 0) {
      return rtf.format(-diffInMonths, "month");
    } else if (diffInDays > 0) {
      return rtf.format(-diffInDays, "day");
    } else if (diffInHours > 0) {
      return rtf.format(-diffInHours, "hour");
    } else if (diffInMinutes > 0) {
      return rtf.format(-diffInMinutes, "minute");
    } else {
      return rtf.format(-diffInSeconds, "second");
    }
  };

  useEffect(() => {
    setDateInterval(formatTime());
  }, [uploadTime]); // Add uploadTime as a dependency

  return [dateInterval, setDateInterval];
}

export default useCalculateReelTimeInterval;
