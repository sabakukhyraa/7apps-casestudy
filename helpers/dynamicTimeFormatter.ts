const dynamicTimeFormatter = (seconds: number): string => {
  if (seconds == 0) return "0:00";

  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;

  if (hours > 0) {
    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`;
  } else if (minutes > 0) {
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  } else {
    return `0:${remainingSeconds.toString().padStart(2, "0")}`;
  }
};

export default dynamicTimeFormatter;
