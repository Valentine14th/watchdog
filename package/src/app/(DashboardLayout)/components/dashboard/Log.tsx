import { useEffect, useState } from "react";
import LogTable from "./LogTable";

// GitHub repo details
const files = [
  "https://raw.githubusercontent.com/Valentine14th/rbtlog/log/logs/ch.threema.app.libre.json",
  "https://raw.githubusercontent.com/Valentine14th/rbtlog/log/logs/ch.threema.app.work.json",
  "https://raw.githubusercontent.com/Valentine14th/rbtlog/log/logs/ch.threema.app.onprem.json",
];

const Log = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [log, setLog] = useState<any[]>([]);

  // Fetch data from the GitHub repo
  useEffect(() => {
    const fetchLog = async () => {
      try {
        const results = await Promise.all(
          files.map((file) =>
            fetch(`${file}`, {
              headers: {
                Accept: "application/vnd.github.v3+json",
              },
              cache: "force-cache", // Ensure the data is cached
              next: { revalidate: 86400 }, // Revalidate the data every 24 hours
            }).then((res) => res.json())
          )
        );
        setLog(results);
      } catch (error) {
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    fetchLog();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error fetching logs</div>;

  return <LogTable log={log} />;
};

export default Log;
