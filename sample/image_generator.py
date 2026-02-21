import tkinter as tk
from tkinter import ttk, messagebox
from PIL import Image, ImageDraw, ImageFont
import os
from reportlab.pdfgen import canvas
import sys
import pandas as pd

class ImageGeneratorApp:
    def __init__(self, root):
        self.root = root
        self.root.title("テスト画像生成ツール")
        self.root.geometry("400x300")

        # フォント関連の処理を削除

        # 出力形式の選択
        self.format_label = ttk.Label(root, text="出力形式:")
        self.format_label.pack(pady=5)
        
        self.format_var = tk.StringVar(value="png")
        formats = ["png", "jpg", "pdf", "xlsx"]
        for fmt in formats:
            ttk.Radiobutton(root, text=fmt.upper(), value=fmt, variable=self.format_var).pack()

        # 枚数指定
        self.count_label = ttk.Label(root, text="生成枚数:")
        self.count_label.pack(pady=5)
        
        self.count_var = tk.StringVar(value="1")
        self.count_entry = ttk.Entry(root, textvariable=self.count_var)
        self.count_entry.pack()

        # サイズ指定
        self.size_frame = ttk.Frame(root)
        self.size_frame.pack(pady=10)
        
        self.width_label = ttk.Label(self.size_frame, text="幅:")
        self.width_label.pack(side=tk.LEFT)
        self.width_var = tk.StringVar(value="800")
        self.width_entry = ttk.Entry(self.size_frame, textvariable=self.width_var, width=8)
        self.width_entry.pack(side=tk.LEFT, padx=5)
        
        self.height_label = ttk.Label(self.size_frame, text="高さ:")
        self.height_label.pack(side=tk.LEFT)
        self.height_var = tk.StringVar(value="600")
        self.height_entry = ttk.Entry(self.size_frame, textvariable=self.height_var, width=8)
        self.height_entry.pack(side=tk.LEFT, padx=5)

        # 生成ボタン
        self.generate_button = ttk.Button(root, text="生成", command=self.generate_images)
        self.generate_button.pack(pady=20)

    def generate_images(self):
        try:
            count = int(self.count_var.get())
            width = int(self.width_var.get())
            height = int(self.height_var.get())
            output_format = self.format_var.get()

            if count <= 0:
                messagebox.showerror("エラー", "枚数は1以上を指定してください")
                return

            # メインの出力フォルダを作成
            output_dir = "generated_images"
            os.makedirs(output_dir, exist_ok=True)
            
            # 形式別のサブフォルダを作成
            format_dir = os.path.join(output_dir, output_format)
            os.makedirs(format_dir, exist_ok=True)

            if output_format == 'xlsx':
                self.generate_excel_files(count, format_dir)
            elif output_format in ['png', 'jpg']:
                self.generate_image_files(count, width, height, output_format, format_dir)
            else:  # pdf
                self.generate_pdf_files(count, width, height, format_dir)

            messagebox.showinfo("完了", f"{count}枚のファイルを生成しました\n保存先: {format_dir}")
            
            # 出力フォルダを開く
            os.startfile(os.path.abspath(format_dir))

        except ValueError:
            messagebox.showerror("エラー", "入力値が正しくありません")
        except Exception as e:
            messagebox.showerror("エラー", f"エラーが発生しました: {str(e)}")

    def generate_excel_files(self, count, output_dir):
        for i in range(1, count + 1):
            # ファイル名（拡張子付き）
            filename = f"test_{i}.xlsx"
            
            # A1セルにファイル名を入れる
            df = pd.DataFrame({'ファイル名': [filename]})
            
            # Excelファイルとして保存
            excel_path = os.path.join(output_dir, filename)
            df.to_excel(excel_path, index=False)

    def generate_image_files(self, count, width, height, output_format, output_dir):
        for i in range(1, count + 1):
            # 画像の生成
            image = Image.new('RGB', (width, height), 'white')
            draw = ImageDraw.Draw(image)

            # 拡張子を含めたテキスト
            text = f"test_{i}.{output_format}"
            
            # フォントサイズを画像サイズの1/6程度に設定（1/3から1/6に変更）
            font_size = min(width, height) // 6
            
            try:
                # Windowsの場合
                font = ImageFont.truetype("arial.ttf", font_size)
            except:
                try:
                    # macOSの場合
                    font = ImageFont.truetype("/System/Library/Fonts/Helvetica.ttc", font_size)
                except:
                    try:
                        # Linuxの場合
                        font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf", font_size)
                    except:
                        # それでも失敗した場合はデフォルトフォント
                        font = ImageFont.load_default()
            
            # テキストの位置を計算
            text_bbox = draw.textbbox((0, 0), text, font=font)
            text_width = text_bbox[2] - text_bbox[0]
            text_height = text_bbox[3] - text_bbox[1]
            x = (width - text_width) // 2
            y = (height - text_height) // 2
            
            # テキストを描画
            draw.text((x, y), text, font=font, fill='black')

            # 画像の保存
            filename = f"test_{i}.{output_format}"
            image.save(os.path.join(output_dir, filename))

    def generate_pdf_files(self, count, width, height, output_dir):
        for i in range(1, count + 1):
            filename = f"test_{i}.pdf"
            c = canvas.Canvas(os.path.join(output_dir, filename), pagesize=(width, height))
            
            font_name = 'Helvetica'
            # 拡張子を含めたテキスト
            text = f"test_{i}.pdf"
            
            # フォントサイズを画像サイズの1/6程度に設定（1/3から1/6に変更）
            font_size = min(width, height) // 6
            
            c.setFont(font_name, font_size)
            
            # テキストの位置を計算
            text_width = c.stringWidth(text, font_name, font_size)
            x = (width - text_width) / 2
            y = height / 2

            c.drawString(x, y, text)
            c.save()

if __name__ == "__main__":
    root = tk.Tk()
    app = ImageGeneratorApp(root)
    root.mainloop()
