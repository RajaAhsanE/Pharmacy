import { useState, useEffect, useCallback } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import API from "../api";
import AppLayout from "../components/AppLayout";
import Button from "../components/Button";
import CellList from "../components/CellList";
import Icon from "../components/Icon";
import { PanelEmptyState, TableEmptyState } from "../components/EmptyState";
import StatusBadge from "../components/StatusBadge";
import { getVisibleColumns, mapResultRow } from "../utils/parseAnalysis";

const PAGE_SIZE = 10;

function StatCard({ label, value, accent, icon, sub }) {
  return (
    <div className="stat-card" style={{ "--accent": accent }}>
      <div className="stat-top">
        <span className="stat-label">{label}</span>
        <span className="stat-icon" style={{ background: `${accent}1a`, color: accent }}>
          <Icon name={icon} size={18} />
        </span>
      </div>
      <div className="stat-value">{value}</div>
      <div className="stat-sub">{sub}</div>
    </div>
  );
}

function InsightsPanel({ insights }) {
  if (!insights) {
    return (
      <PanelEmptyState
        icon="insights"
        message='No insights yet — click "Generate Insights" then "Load Insights"'
      />
    );
  }

  if (insights.status === "processing") {
    return (
      <PanelEmptyState
        loading
        message='Generating insights… please wait and click "Load Insights" again.'
      />
    );
  }

  return (
    <div className="insights">
      <section className="panel">
        <div className="panel-head">
          <div className="panel-title">
            <span className="panel-icon" style={{ background: "#6C47FF1a", color: "#6C47FF" }}>
              <Icon name="insights" size={18} />
            </span>
            <div>
              <h3>Analyse croisée</h3>
              <p>Comparaison thématique entre groupes Success et Failure</p>
            </div>
          </div>
        </div>
        <div className="panel-body">
          <pre>{insights.analyse_croisee || "—"}</pre>
        </div>
      </section>
      <section className="panel">
        <div className="panel-head">
          <div className="panel-title">
            <span className="panel-icon" style={{ background: "#1B2B4B1a", color: "#1B2B4B" }}>
              <Icon name="sparkles" size={18} />
            </span>
            <div>
              <h3>Actions prioritaires</h3>
              <p>Recommandations classées par impact</p>
            </div>
          </div>
        </div>
        <div className="panel-body">
          <pre>{insights.actions_prioritaires || "—"}</pre>
        </div>
        {insights.generated_at && (
          <div className="insights-foot">Generated: {insights.generated_at}</div>
        )}
      </section>
    </div>
  );
}

function ResultsTable({ rows, onView, onDelete }) {
  const [groupTab, setGroupTab] = useState("SUCCESS");
  const [page, setPage] = useState(1);

  const successRows = rows.filter((row) => row.groupe === "SUCCESS");
  const failureRows = rows.filter((row) => row.groupe === "FAILURE");
  const groupedRows = { SUCCESS: successRows, FAILURE: failureRows };
  const filteredRows = groupedRows[groupTab];
  const columns = getVisibleColumns(filteredRows);
  const totalPages = Math.max(1, Math.ceil(filteredRows.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const slice = filteredRows.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);
  const offset = (currentPage - 1) * PAGE_SIZE;

  useEffect(() => {
    setPage(1);
  }, [groupTab, filteredRows.length]);

  if (!rows.length) {
    return (
      <TableEmptyState
        icon="wave"
        message="No data yet — upload WAV files to get started"
      />
    );
  }

  return (
    <>
      <div className="tabs tabs-group">
        <button
          type="button"
          className={`tab${groupTab === "SUCCESS" ? " active" : ""}`}
          onClick={() => setGroupTab("SUCCESS")}
        >
          <Icon name="check" size={17} />
          Success
          <span className="tab-count">{successRows.length}</span>
        </button>
        <button
          type="button"
          className={`tab${groupTab === "FAILURE" ? " active" : ""}`}
          onClick={() => setGroupTab("FAILURE")}
        >
          <Icon name="x" size={17} />
          Failure
          <span className="tab-count">{failureRows.length}</span>
        </button>
      </div>

      {!filteredRows.length ? (
        <TableEmptyState
          icon="wave"
          message={`No ${groupTab === "SUCCESS" ? "success" : "failure"} records yet`}
        />
      ) : (
        <div className="table-card">
          <div className="table-scroll">
            <table className="data-table">
              <thead>
                <tr>
                  <th className="col-n">#</th>
                  <th>Pharmacy</th>
                  <th>Status</th>
                  {columns.map((col) => (
                    <th key={col}>{col}</th>
                  ))}
                  <th className="col-actions">Actions</th>
                </tr>
              </thead>
              <tbody>
                {slice.map((row, i) => (
                  <tr key={row.id}>
                    <td className="col-n">{offset + i + 1}</td>
                    <td>
                      <div className="ph-cell">
                        <div className="ph-name">{row.pharmacy}</div>
                        <div className="ph-id">{row.id.slice(0, 8)}…</div>
                      </div>
                    </td>
                    <td>
                      <StatusBadge status={row.status} />
                    </td>
                    {columns.map((col) => (
                      <td key={col}>
                        <CellList items={row.analysisColumns?.[col]} />
                      </td>
                    ))}
                    <td className="col-actions">
                      <div className="row-actions">
                        <button
                          type="button"
                          className="icon-btn view"
                          title="View details"
                          onClick={() => onView(row.id)}
                        >
                          <Icon name="eye" size={17} />
                        </button>
                        <button
                          type="button"
                          className="icon-btn danger"
                          title="Delete"
                          onClick={() => onDelete(row.id)}
                        >
                          <Icon name="trash" size={17} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {totalPages > 1 && (
            <div className="pagination">
              <span className="pag-info">
                Showing {offset + 1}–{Math.min(offset + PAGE_SIZE, filteredRows.length)} of{" "}
                {filteredRows.length}
              </span>
              <div className="pag-controls">
                <button
                  type="button"
                  className="pag-btn"
                  disabled={currentPage <= 1}
                  onClick={() => setPage((p) => p - 1)}
                >
                  ‹
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
                  <button
                    key={n}
                    type="button"
                    className={`pag-btn${n === currentPage ? " pag-active" : ""}`}
                    onClick={() => setPage(n)}
                  >
                    {n}
                  </button>
                ))}
                <button
                  type="button"
                  className="pag-btn"
                  disabled={currentPage >= totalPages}
                  onClick={() => setPage((p) => p + 1)}
                >
                  ›
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
}

export default function Dashboard() {
  const [data, setData] = useState({ total: 0, success: 0, failure: 0, pending: 0, results: [] });
  const [insights, setInsights] = useState(null);
  const [genLoading, setGenLoading] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const tab = searchParams.get("tab") === "insights" ? "insights" : "results";
  const navigate = useNavigate();

  const fetchData = useCallback(async () => {
    try {
      const res = await API.get("/data");
      setData(res.data);
    } catch {
      /* ignore */
    }
  }, []);

  const fetchInsights = useCallback(async () => {
    try {
      const res = await API.get("/insights");
      setInsights(res.data);
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 10000);
    return () => clearInterval(interval);
  }, [fetchData]);

  const rows = data.results.map(mapResultRow);

  const handleDelete = async (audioId) => {
    const result = await Swal.fire({
      title: "Delete this record?",
      text: "This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Delete",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#1B2B4B",
      reverseButtons: true,
      heightAuto: false,
      scrollbarPadding: false,
    });
    if (!result.isConfirmed) return;
    try {
      await API.delete(`/data/${audioId}`);
      toast.success("Record deleted");
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.detail || "Failed to delete record");
    }
  };

  const handleGenerateInsights = async () => {
    setGenLoading(true);
    try {
      await API.post("/insights/generate");
      toast.success("Insights generation started — check back in a moment.");
      setTimeout(fetchInsights, 15000);
    } catch (err) {
      toast.error(err.response?.data?.detail || "Error");
    } finally {
      setGenLoading(false);
    }
  };

  const setTab = (next) => {
    if (next === "insights") setSearchParams({ tab: "insights" });
    else setSearchParams({});
  };

  return (
    <AppLayout crumbs={["Workspace", tab === "insights" ? "Insights" : "Dashboard"]}>
      <div className="page-head">
        <div>
          <h1 className="page-title">Dashboard</h1>
          <p className="page-sub">Overview of your pharmacy audio analyses.</p>
        </div>
        <div className="action-bar">
          <Button icon="upload" onClick={() => navigate("/uploads")}>
            Upload WAV Files
          </Button>
          <Button variant="secondary" icon="refresh" onClick={fetchData}>
            Refresh
          </Button>
          <Button
            variant="violet"
            icon="sparkles"
            disabled={genLoading}
            onClick={handleGenerateInsights}
          >
            {genLoading ? "Generating…" : "Generate Insights"}
          </Button>
          <Button variant="secondary" icon="download" onClick={fetchInsights}>
            Load Insights
          </Button>
        </div>
      </div>

      <div className="stat-grid">
        <StatCard label="Total" value={data.total} accent="#6C47FF" icon="wave" sub="All audio files" />
        <StatCard label="Success" value={data.success} accent="#22C55E" icon="check" sub="Analyzed & done" />
        <StatCard label="Failure" value={data.failure} accent="#EF4444" icon="x" sub="Needs re-upload" />
        <StatCard label="Processing" value={data.pending} accent="#F59E0B" icon="clock" sub="In the queue" />
      </div>

      <div className="tabs">
        <button
          type="button"
          className={`tab${tab === "results" ? " active" : ""}`}
          onClick={() => setTab("results")}
        >
          <Icon name="dashboard" size={17} />
          Results Table
          <span className="tab-count">{rows.length}</span>
        </button>
        <button
          type="button"
          className={`tab${tab === "insights" ? " active" : ""}`}
          onClick={() => setTab("insights")}
        >
          <Icon name="insights" size={17} />
          Insights
        </button>
      </div>

      {tab === "results" ? (
        <ResultsTable
          rows={rows}
          onView={(id) => navigate(`/audio/${id}`)}
          onDelete={handleDelete}
        />
      ) : (
        <InsightsPanel insights={insights} />
      )}
    </AppLayout>
  );
}
