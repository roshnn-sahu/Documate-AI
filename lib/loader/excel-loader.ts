import * as XLSX from "xlsx";

export async function parseExcel(buffer: Buffer) {
  const workbook = XLSX.read(buffer);

  let text = "";

  workbook.SheetNames.forEach((sheet) => {
    const worksheet = workbook.Sheets[sheet];

    text += XLSX.utils.sheet_to_csv(worksheet);
  });

  return {
    text,
  };
}
