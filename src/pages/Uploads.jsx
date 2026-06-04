import { useState, useEffect, useCallback, useRef } from "react";
import toast from "react-hot-toast";
import API from "../api";
import AppLayout from "../components/AppLayout";
import Button from "../components/Button";
import { TableEmptyState } from "../components/EmptyState";
import Icon from "../components/Icon";
import Pagination, { PAGE_SIZE } from "../components/Pagination";
import StatusBadge from "../components/StatusBadge";

function progressWidth(status) {
  if (status === "done") return "100%";
  if (status === "processing") return "62%";
  if (status === "pending") return "20%";
  if (status === "error") return "28%";
  return "0%";
}

export default function Uploads() {
  const [rows, setRows] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [page, setPage] = useState(1);
  const fileRef = useRef(null);

  const fetchQueue = useCallback(async () => {
    try {
      const res = await API.get("/data");
      setRows(res.data.results || []);
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    fetchQueue();
    const interval = setInterval(fetchQueue, 10000);
    return () => clearInterval(interval);
  }, [fetchQueue]);

  useEffect(() => {
    setPage(1);
  }, [rows.length]);

  const uploadFiles = async (files) => {
    const wavFiles = files.filter((f) => f.name.toLowerCase().endsWith(".wav"));
    if (!wavFiles.length) return;
    setUploading(true);
    for (const file of wavFiles) {
      const form = new FormData();
      form.append("file", file);
      try {
        await API.post("/upload", form);
      } catch {
        toast.error(`Failed to upload ${file.name}`);
      }
    }
    setUploading(false);
    fetchQueue();
  };

  const handleFileChange = async (e) => {
    await uploadFiles(Array.from(e.target.files || []));
    e.target.value = "";
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    setDragging(false);
    await uploadFiles(Array.from(e.dataTransfer.files));
  };

  const totalPages = Math.max(1, Math.ceil(rows.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const slice = rows.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  return (
    <AppLayout active="uploads" crumbs={["Workspace", "Uploads"]}>
      <div className="page-head">
        <div>
          <h1 className="page-title">Uploads</h1>
          <p className="page-sub">Drop WAV recordings to queue them for analysis.</p>
        </div>
        <div className="action-bar">
          <Button variant="secondary" icon="refresh" onClick={fetchQueue}>
            Refresh queue
          </Button>
          <Button
            icon="upload"
            disabled={uploading}
            onClick={() => fileRef.current?.click()}
          >
            {uploading ? "Uploading…" : "Select files"}
          </Button>
        </div>
      </div>

      <input
        ref={fileRef}
        type="file"
        accept=".wav"
        multiple
        style={{ display: "none" }}
        onChange={handleFileChange}
      />

      <div
        className={`dropzone${dragging ? " drag" : ""}`}
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        onClick={() => !uploading && fileRef.current?.click()}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") fileRef.current?.click();
        }}
      >
        <div className="dz-icon">
          <Icon name="upload" size={28} />
        </div>
        <div className="dz-title">Drag & drop WAV files here</div>
        <div className="dz-sub">
          or click to browse — up to 50 MB per file, mono or stereo
        </div>
        <Button
          variant="violet"
          icon="upload"
          disabled={uploading}
          onClick={(e) => {
            e.stopPropagation();
            fileRef.current?.click();
          }}
        >
          {uploading ? "Uploading…" : "Browse files"}
        </Button>
      </div>

      <div className="section-label">
        <Icon name="wave" size={18} />
        Recent uploads
      </div>

      {rows.length === 0 ? (
        <TableEmptyState icon="upload" message="No uploads yet" />
      ) : (
        <div className="table-card">
          <div className="upload-list">
            {slice.map((row, i) => (
              <div key={row.audio_id || i} className="upload-row">
                <div className="upl-file">
                  <span className="upl-ico">
                    <Icon name="wave" size={18} />
                  </span>
                  <div>
                    <div className="upl-name">
                      {row.audio_id ? `${row.audio_id.slice(0, 24)}` : "—"}
                    </div>
                    <div className="upl-meta">
                      {row.pharmacy}
                      {row.uploaded_at
                        ? ` · ${new Date(row.uploaded_at).toLocaleString("fr-FR")}`
                        : ""}
                    </div>
                  </div>
                </div>
                <div>
                  <div className="upl-track">
                    <div
                      className={`upl-fill ${row.status}`}
                      style={{ width: progressWidth(row.status) }}
                    />
                  </div>
                </div>
                <StatusBadge status={row.status} />
              </div>
            ))}
          </div>
          <Pagination total={rows.length} page={currentPage} onChange={setPage} />
        </div>
      )}
    </AppLayout>
  );
}
