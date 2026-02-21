import { NextResponse } from 'next/server';
import { createCanvas } from 'canvas';
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';
import ExcelJS from 'exceljs';
import JSZip from 'jszip';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { format, count, width, height, bgColor = '#ffffff', textColor = '#000000', borderColor, fontSize } = body;

        if (!format || !count || count <= 0) {
            return NextResponse.json({ error: '無効なパラメータです' }, { status: 400 });
        }

        // 1つの場合は直接返すための変数
        let singleFileBuffer: Uint8Array | Buffer | null = null;
        let singleFileName = "";
        let contentType = "";

        const zip = new JSZip();

        for (let i = 1; i <= count; i++) {
            const filename = `test_${i}.${format}`;

            if (format === 'png' || format === 'jpg') {
                const canvas = createCanvas(width, height);
                const ctx = canvas.getContext('2d');

                // 背景を塗りつぶし
                ctx.fillStyle = bgColor;
                ctx.fillRect(0, 0, width, height);

                // 枠線を描画（指定がある場合）
                if (borderColor) {
                    ctx.strokeStyle = borderColor;
                    ctx.lineWidth = 10; // 枠線の太さ（固定値または必要に応じて）
                    ctx.strokeRect(0, 0, width, height);
                }

                // テキストを描画
                const text = filename;
                const computedFontSize = fontSize ? fontSize : Math.floor(Math.min(width, height) / 6);
                ctx.font = `${computedFontSize}px sans-serif`;
                ctx.fillStyle = textColor;
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText(text, width / 2, height / 2);

                let buffer;
                if (format === 'png') {
                    buffer = canvas.toBuffer('image/png');
                    contentType = 'image/png';
                } else {
                    buffer = canvas.toBuffer('image/jpeg');
                    contentType = 'image/jpeg';
                }

                if (count === 1) {
                    singleFileBuffer = buffer;
                    singleFileName = filename;
                } else {
                    zip.file(filename, buffer);
                }

            } else if (format === 'pdf') {
                const pdfDoc = await PDFDocument.create();
                const page = pdfDoc.addPage([width, height]);
                const { width: pageWidth, height: pageHeight } = page.getSize();

                // 16進数カラーコードを rgb(R, G, B) の割合に変換する補助関数
                const hexToRgb = (hex: string) => {
                    const cleanHex = hex.replace('#', '');
                    const r = parseInt(cleanHex.substring(0, 2), 16) / 255;
                    const g = parseInt(cleanHex.substring(2, 4), 16) / 255;
                    const b = parseInt(cleanHex.substring(4, 6), 16) / 255;
                    return rgb(r, g, b);
                };

                // 背景を描画
                page.drawRectangle({
                    x: 0,
                    y: 0,
                    width: pageWidth,
                    height: pageHeight,
                    color: hexToRgb(bgColor),
                });

                // 枠線を描画
                if (borderColor) {
                    page.drawRectangle({
                        x: 0,
                        y: 0,
                        width: pageWidth,
                        height: pageHeight,
                        borderColor: hexToRgb(borderColor),
                        borderWidth: 10,
                    });
                }

                const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
                const computedFontSize = fontSize ? fontSize : Math.floor(Math.min(width, height) / 6);
                const text = filename;
                const textWidth = font.widthOfTextAtSize(text, computedFontSize);

                page.drawText(text, {
                    x: (pageWidth - textWidth) / 2,
                    y: (pageHeight - computedFontSize) / 2, // 簡易的な中央揃え
                    size: computedFontSize,
                    font: font,
                    color: hexToRgb(textColor),
                });

                const pdfBytes = await pdfDoc.save();
                if (count === 1) {
                    singleFileBuffer = pdfBytes;
                    singleFileName = filename;
                    contentType = 'application/pdf';
                } else {
                    zip.file(filename, pdfBytes);
                }

            } else if (format === 'xlsx') {
                const workbook = new ExcelJS.Workbook();
                const sheet = workbook.addWorksheet('Sheet1');

                sheet.columns = [
                    { header: 'ファイル名', key: 'filename', width: 30 }
                ];
                sheet.addRow({ filename: filename });

                const buffer = await workbook.xlsx.writeBuffer();
                if (count === 1) {
                    singleFileBuffer = new Uint8Array(buffer);
                    singleFileName = filename;
                    contentType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
                } else {
                    zip.file(filename, buffer);
                }
            }
        }

        // 1つの場合は直接ファイルを返す
        if (count === 1 && singleFileBuffer) {
            // TypeErrorに対応するため、Bufferなら直接使える形で包むか適切なレスポンス作成を行う
            const responseBody = singleFileBuffer instanceof Buffer
                ? singleFileBuffer
                : Buffer.from(singleFileBuffer);

            return new NextResponse(responseBody, {
                status: 200,
                headers: {
                    'Content-Type': contentType,
                    'Content-Disposition': `attachment; filename="${singleFileName}"`,
                },
            });
        }

        const zipContent = await zip.generateAsync({ type: 'blob' });

        return new NextResponse(zipContent, {
            status: 200,
            headers: {
                'Content-Type': 'application/zip',
                // ZIPファイル名: generated_images.zip 等でダウンロードさせる
                'Content-Disposition': `attachment; filename="generated_${format}_files.zip"`,
            },
        });

    } catch (error) {
        console.error('Generate Error:', error);
        return NextResponse.json({ error: 'ファイル生成中にエラーが発生しました' }, { status: 500 });
    }
}
