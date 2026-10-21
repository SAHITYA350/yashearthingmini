// Safe, zero-dependency Excel/CSV exporter compatible with all spreadsheets
export function exportToExcel(rows, sheetName = "Sheet1", fileName = "export.xlsx") {
  if (!rows || rows.length === 0) return;

  try {
    const keys = Object.keys(rows[0]);
    const csvContent = [
      keys.join(","),
      ...rows.map((row) =>
        keys
          .map((k) => {
            let val = row[k] ?? "";
            if (typeof val === "string") {
              val = `"${val.replace(/"/g, '""')}"`;
            }
            return val;
          })
          .join(",")
      ),
    ].join("\r\n");

    const blob = new Blob(["\uFEFF" + csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", fileName.replace(/\.xlsx$/i, ".csv"));
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  } catch (err) {
    console.error("Export error:", err);
  }
}
