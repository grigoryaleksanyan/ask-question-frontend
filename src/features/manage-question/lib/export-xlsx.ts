import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';

import type { QuestionResponse } from '@/shared/dto';

import { getStatusLabel } from '@/entities/question';

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}.${month}.${year}`;
}

function getFileName(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `questions-${year}-${month}-${day}.xlsx`;
}

export async function exportToXlsx(
  questions: QuestionResponse[],
): Promise<void> {
  const workbook = new ExcelJS.Workbook();
  workbook.creator = 'Ask Question';
  workbook.created = new Date();

  const worksheet = workbook.addWorksheet('Вопросы');

  worksheet.columns = [
    { header: 'Вопрос', key: 'text', width: 50 },
    { header: 'Область', key: 'areaTitle', width: 18 },
    { header: 'Спикер', key: 'speakerName', width: 20 },
    { header: 'Статус', key: 'status', width: 15 },
    { header: 'Дата создания', key: 'created', width: 16 },
    { header: 'Просмотров', key: 'views', width: 14 },
    { header: 'Лайки', key: 'likes', width: 10 },
    { header: 'Дизлайки', key: 'dislikes', width: 12 },
  ];

  const headerRow = worksheet.getRow(1);
  headerRow.font = { bold: true, size: 11 };
  headerRow.alignment = { horizontal: 'center' };

  for (const question of questions) {
    worksheet.addRow({
      text: question.text,
      areaTitle: question.areaTitle ?? '\u2014',
      speakerName: question.speakerName || '\u2014',
      status: getStatusLabel(question.status),
      created: formatDate(question.created),
      views: question.views,
      likes: question.likes,
      dislikes: question.dislikes,
    });
  }

  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  });
  saveAs(blob, getFileName());
}
