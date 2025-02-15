import { useEffect, useMemo, useState } from "react";
import LogTable from "./LogTable";
import ApkSha256Uploader from "./ApkUploader";

// GitHub repo details
const githubRepo = "Valentine14th/rbtlog";
// Raw files from repo
// const files = [
//   `https://raw.githubusercontent.com/${githubRepo}/log/logs/ch.threema.app.libre.json`,
//   `https://raw.githubusercontent.com/${githubRepo}/log/logs/ch.threema.app.work.json`,
//   `https://raw.githubusercontent.com/${githubRepo}/log/logs/ch.threema.app.onprem.json`,
// ];

// GitHub pages
const files = [
  "https://valentine14th.github.io/rbtlog/logs/ch.threema.app.libre.json",
  "https://valentine14th.github.io/rbtlog/logs/ch.threema.app.work.json",
  "https://valentine14th.github.io/rbtlog/logs/ch.threema.app.onprem.json",
];

const sortTags = (data: any) => {
  const sortedTags = Object.entries(data.tags).sort(([a]: any, [b]: any) => {
    const [majorA, minorA = 0, patchA = 0] = a.split(".").map(Number);
    const [majorB, minorB = 0, patchB = 0] = b.split(".").map(Number);
    return majorB - majorA || minorB - minorA || patchB - patchA;
  });
  data.tags = Object.fromEntries(sortedTags);
  return data;
};

const Log = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [log, setLog] = useState<any[]>([]);

  const flatLog = useMemo(() => {
    let out: [string, any][] = [];
    if(!log || log.length == 0) return out;
    for (const app of log) {
      for (const [version, apks] of Object.entries(app.tags) as [
        string,
        any[]
      ][]) {
        for (const apk of apks) {
          out.push([version, apk]);
        }
      }
    }
    return out;
  }, [log]);

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
            }).then(async (res) => sortTags(await res.json()))
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

  return (
    <>
      <ApkSha256Uploader log={flatLog} />
      <LogTable log={flatLog} repo={githubRepo} />
    </>
  );
};

export default Log;
