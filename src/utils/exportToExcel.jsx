import ExcelJS from "exceljs";
import {saveAs} from "file-saver";

export async function exportToExcel(
  data,
  sheetName = "Sheet1",
  fileName = "export.xlsx"
) {
  if (!data || data.length === 0) return;

  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet(sheetName);

  sheet.columns = Object.keys(data[0]).map((key) => ({
    header: key.toUpperCase(),
    key: key,
    width: 20,
  }));

  data.forEach((item) => {
    sheet.addRow(item);
  });

  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });

  saveAs(blob, fileName);
}
