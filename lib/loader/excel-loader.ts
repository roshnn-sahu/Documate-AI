import * as XLSX from "xlsx";

export async function parseExcel(filepath: string) {
  const workbook = XLSX.readFile(filepath);

  let text = "";

  workbook.SheetNames.forEach((sheet) => {
    const worksheet = workbook.Sheets[sheet];

    text += XLSX.utils.sheet_to_csv(worksheet);
  });

  return {
    text,
  };
}
