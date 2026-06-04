import { Document, Packer, Paragraph, TextRun, HeadingLevel } from 'docx';
import { saveAs } from 'file-saver';

import type { QuestionResponse } from '@/shared/dto';

import { getStatusColor, getStatusLabel } from '@/entities/question';

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
  return `questions-${year}-${month}-${day}.docx`;
}

function buildQuestionCard(question: QuestionResponse): Paragraph[] {
  const statusColor = getStatusColor(question.status);
  const statusLabel = getStatusLabel(question.status);
  const createdDate = formatDate(question.created);

  return [
    new Paragraph({
      children: [
        new TextRun({
          text: '\u25CF ',
          color: statusColor,
          font: 'Arial',
          size: 22,
        }),
        new TextRun({
          text: statusLabel,
          bold: true,
          font: 'Arial',
          size: 22,
        }),
        new TextRun({
          text: `  |  Дата создания: ${createdDate}`,
          font: 'Arial',
          size: 22,
        }),
      ],
      spacing: { after: 120 },
    }),
    new Paragraph({
      children: [
        new TextRun({
          text: `Спикер: ${question.speakerName || '\u2014'}`,
          font: 'Arial',
          size: 22,
        }),
        new TextRun({
          text: `  |  Зона: ${question.areaTitle ?? '\u2014'}`,
          font: 'Arial',
          size: 22,
        }),
      ],
      spacing: { after: 120 },
    }),
    new Paragraph({
      children: [
        new TextRun({
          text: `Просмотров: ${question.views}`,
          font: 'Arial',
          size: 22,
        }),
        new TextRun({
          text: `  |  \u25B2 ${question.likes}  \u25BC ${question.dislikes}`,
          font: 'Arial',
          size: 22,
        }),
      ],
      spacing: { after: 250 },
    }),
    new Paragraph({
      children: [
        new TextRun({
          text: question.text,
          font: 'Arial',
          size: 24,
          italics: true,
        }),
      ],
    }),
    new Paragraph({
      children: [],
      thematicBreak: true,
      spacing: { after: 200 },
    }),
  ];
}

export async function exportToDocx(
  questions: QuestionResponse[],
): Promise<void> {
  const now = new Date();
  const dateStr = formatDate(now.toISOString());

  const headerParagraphs: Paragraph[] = [
    new Paragraph({
      text: `Вопросы \u2014 ${dateStr}`,
      heading: HeadingLevel.HEADING_1,
      thematicBreak: true,
    }),
    new Paragraph({
      children: [
        new TextRun({
          text: `Экспортировано: ${questions.length} записей`,
          color: '808080',
          font: 'Arial',
          size: 22,
        }),
      ],
      spacing: { after: 300 },
    }),
  ];

  const questionParagraphs = questions.flatMap((q) => buildQuestionCard(q));

  const doc = new Document({
    sections: [
      {
        children: [...headerParagraphs, ...questionParagraphs],
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  saveAs(blob, getFileName());
}
