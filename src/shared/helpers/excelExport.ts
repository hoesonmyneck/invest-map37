import * as XLSX from 'xlsx';

interface DataItem {
  [key: string]: any;
}

interface SheetDataItem {
  name: string;
  data: DataItem[];
}

export function exportToExcel(data: DataItem[], fileName: string, sheetName: string = 'Данные'): void {
  try {
    const worksheet = XLSX.utils.json_to_sheet(data);
    
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
    
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    
    const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `${fileName}.xlsx`;
    document.body.appendChild(link);
    link.click();
 
    setTimeout(() => {
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }, 100);
  } catch (error) {
    console.error('Ошибка при экспорте в Excel:', error);
    alert('Ошибка при экспорте в Excel. Проверьте консоль для деталей.');
  }
}

export function exportToExcelMultiSheet(sheetsData: SheetDataItem[], fileName: string): void {
  try {
    const workbook = XLSX.utils.book_new();
    
    sheetsData.forEach(sheet => {
      if (sheet.data && sheet.data.length > 0) {
        const worksheet = XLSX.utils.json_to_sheet(sheet.data);
        let sheetName = sheet.name.substring(0, 31);
        sheetName = sheetName.replace(/[\[\]\*\?\/\\:]/g, '_');
        XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
      }
    });
    
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
   
    const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `${fileName}.xlsx`;
    document.body.appendChild(link);
    link.click();
   
    setTimeout(() => {
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }, 100);
  } catch (error) {
    console.error('Ошибка при экспорте в Excel:', error);
    alert('Ошибка при экспорте в Excel. Проверьте консоль для деталей.');
  }
} 