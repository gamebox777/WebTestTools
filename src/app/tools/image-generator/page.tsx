"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ImageIcon, ArrowLeftIcon, FileDownIcon, Loader2, RotateCcwIcon } from "lucide-react"
import Link from "next/link"

const PRESET_SIZES = [
    { name: "カスタムサイズ", w: "", h: "" },
    { name: "バナー (468x60)", w: "468", h: "60" },
    { name: "スマホバナー (320x50)", w: "320", h: "50" },
    { name: "リーダーボード (728x90)", w: "728", h: "90" },
    { name: "インラインレクタングル (300x250)", w: "300", h: "250" },
    { name: "スカイスクレイパー (120x600)", w: "120", h: "600" },
    { name: "HD (1280x720)", w: "1280", h: "720" },
    { name: "フルHD (1920x1080)", w: "1920", h: "1080" },
    { name: "スマホ向け縦長 (1080x1920)", w: "1080", h: "1920" },
    { name: "OGP画像 (1200x630)", w: "1200", h: "630" },
]

const COLOR_PALETTE = [
    "#ffffff", "#f1f5f9", "#cbd5e1", "#64748b", "#0f172a", "#000000",
    "#ef4444", "#f97316", "#eab308", "#22c55e", "#06b6d4", "#3b82f6", "#a855f7", "#ec4899"
]

const INITIAL_STATE = {
    format: "png",
    count: "1",
    width: "800",
    height: "600",
    preset: "カスタムサイズ",
    bgColor: "#ffffff",
    textColor: "#000000",
    borderColor: "",
    fontSize: ""
}

export default function ImageGenerator() {
    const [format, setFormat] = useState(INITIAL_STATE.format)
    const [count, setCount] = useState(INITIAL_STATE.count)
    const [width, setWidth] = useState(INITIAL_STATE.width)
    const [height, setHeight] = useState(INITIAL_STATE.height)
    const [preset, setPreset] = useState(INITIAL_STATE.preset)
    const [bgColor, setBgColor] = useState(INITIAL_STATE.bgColor)
    const [textColor, setTextColor] = useState(INITIAL_STATE.textColor)
    const [borderColor, setBorderColor] = useState(INITIAL_STATE.borderColor)
    const [fontSize, setFontSize] = useState(INITIAL_STATE.fontSize)
    const [isGenerating, setIsGenerating] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const previewCanvasRef = useRef<HTMLCanvasElement>(null)

    // リセット機能
    const handleReset = () => {
        setFormat(INITIAL_STATE.format)
        setCount(INITIAL_STATE.count)
        setWidth(INITIAL_STATE.width)
        setHeight(INITIAL_STATE.height)
        setPreset(INITIAL_STATE.preset)
        setBgColor(INITIAL_STATE.bgColor)
        setTextColor(INITIAL_STATE.textColor)
        setBorderColor(INITIAL_STATE.borderColor)
        setFontSize(INITIAL_STATE.fontSize)
        setError(null)
    }

    // プレビュー描画処理
    useEffect(() => {
        if (!previewCanvasRef.current) return;
        const canvas = previewCanvasRef.current;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const w = parseInt(width, 10) || 800;
        const h = parseInt(height, 10) || 600;

        // プレビュー用にCanvasの表示サイズを制限するが、描画解像度は指定サイズを維持
        canvas.width = w;
        canvas.height = h;

        // 背景
        ctx.fillStyle = bgColor;
        ctx.fillRect(0, 0, w, h);

        // 枠線
        if (borderColor.trim() !== "") {
            ctx.strokeStyle = borderColor;
            // 枠線の太さはプレビューと生成で一貫させる（ここでは10）
            ctx.lineWidth = 10;
            ctx.strokeRect(0, 0, w, h);
        }

        // テキスト
        const displayFilename = `test_1.${format === 'xlsx' ? 'xlsx (PDF/Excelはプレビューと異なる場合があります)' : format}`;
        const computedFontSize = fontSize.trim() !== "" ? parseInt(fontSize, 10) : Math.floor(Math.min(w, h) / 6);
        ctx.font = `${computedFontSize}px sans-serif`;
        ctx.fillStyle = textColor;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(displayFilename, w / 2, h / 2);

    }, [format, width, height, bgColor, textColor, borderColor, fontSize]);

    const handlePresetChange = (value: string) => {
        setPreset(value)
        const selected = PRESET_SIZES.find(p => p.name === value)
        if (selected && selected.w !== "") {
            setWidth(selected.w)
            setHeight(selected.h)
        }
    }

    const handleWidthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setWidth(e.target.value)
        setPreset("カスタムサイズ")
    }

    const handleHeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setHeight(e.target.value)
        setPreset("カスタムサイズ")
    }

    const handleGenerate = async (e: React.FormEvent) => {
        e.preventDefault()
        setError(null)
        setIsGenerating(true)

        try {
            const payload = {
                format,
                count: parseInt(count, 10),
                width: parseInt(width, 10),
                height: parseInt(height, 10),
                bgColor,
                textColor,
                borderColor: borderColor.trim() !== "" ? borderColor : undefined,
                fontSize: fontSize.trim() !== "" ? parseInt(fontSize, 10) : undefined
            }

            const response = await fetch('/api/generate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'サーバーエラーが発生しました');
            }

            // ZIPまたは単体ファイルのダウンロード処理
            const blob = await response.blob();
            const downloadUrl = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = downloadUrl;

            // countが1の場合はZIPではなくそのままの拡張子で保存する
            if (parseInt(count, 10) === 1) {
                link.download = `test_1.${format}`;
            } else {
                link.download = `test_files_${format}_${count}.zip`;
            }

            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(downloadUrl);

        } catch (err: unknown) {
            if (err instanceof Error) {
                setError(err.message)
            } else {
                setError("画像の生成中にエラーが発生しました。")
            }
        } finally {
            setIsGenerating(false)
        }
    }

    return (
        <main className="min-h-screen bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-50 p-8">
            <div className="max-w-2xl mx-auto space-y-6">
                <Link
                    href="/"
                    className="inline-flex items-center text-sm text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-50 transition-colors"
                >
                    <ArrowLeftIcon className="w-4 h-4 mr-2" />
                    ポータルへ戻る
                </Link>

                <div className="flex items-center justify-between w-full">
                    <div className="flex items-center space-x-4">
                        <div className="p-3 bg-blue-100 dark:bg-blue-900/40 rounded-xl">
                            <ImageIcon className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight">テスト画像生成ツール</h1>
                            <p className="text-neutral-500 dark:text-neutral-400">
                                各種フォーマットの検証用ダミーファイルを一括生成します
                            </p>
                        </div>
                    </div>
                    <Button variant="outline" size="sm" onClick={handleReset} className="hidden sm:flex" type="button">
                        <RotateCcwIcon className="w-4 h-4 mr-2" />
                        デフォルトに戻す
                    </Button>
                </div>
                {/* スマホ用リセットボタン（折り返し時用） */}
                <Button variant="outline" size="sm" onClick={handleReset} className="w-full sm:hidden mt-4" type="button">
                    <RotateCcwIcon className="w-4 h-4 mr-2" />
                    デフォルトに戻す
                </Button>

                <Card className="border-blue-100 dark:border-blue-900/50 shadow-sm">
                    <form onSubmit={handleGenerate}>
                        <CardHeader>
                            <CardTitle>生成パラメータの設定</CardTitle>
                            <CardDescription>出力形式やサイズなどの条件を指定してください</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">

                            <div className="space-y-3">
                                <Label>出力形式</Label>
                                <RadioGroup
                                    defaultValue={format}
                                    onValueChange={setFormat}
                                    className="flex flex-wrap gap-4"
                                >
                                    {["png", "jpg", "pdf", "xlsx"].map((fmt) => (
                                        <div key={fmt} className="flex items-center space-x-2">
                                            <RadioGroupItem value={fmt} id={fmt} />
                                            <Label htmlFor={fmt} className="uppercase cursor-pointer">{fmt}</Label>
                                        </div>
                                    ))}
                                </RadioGroup>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="count">生成枚数</Label>
                                    <Input
                                        id="count"
                                        type="number"
                                        min="1"
                                        max="100"
                                        value={count}
                                        onChange={(e) => setCount(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>

                            {format !== 'xlsx' && (
                                <>
                                    <div className="space-y-4">
                                        <div className="space-y-2">
                                            <Label>プリセットサイズ</Label>
                                            <Select value={preset} onValueChange={handlePresetChange}>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="サイズを選択" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {PRESET_SIZES.map((p) => (
                                                        <SelectItem key={p.name} value={p.name}>{p.name}</SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="width">幅 (px)</Label>
                                                <Input
                                                    id="width"
                                                    type="number"
                                                    min="10"
                                                    value={width}
                                                    onChange={handleWidthChange}
                                                    required={format !== 'xlsx'}
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="height">高さ (px)</Label>
                                                <Input
                                                    id="height"
                                                    type="number"
                                                    min="10"
                                                    value={height}
                                                    onChange={handleHeightChange}
                                                    required={format !== 'xlsx'}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-4 border-t pt-4 dark:border-neutral-800">
                                        <Label className="text-base">スタイル設定</Label>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="bgColor">背景色</Label>
                                                <div className="flex items-center space-x-2">
                                                    <Input
                                                        id="bgColor"
                                                        type="color"
                                                        value={bgColor}
                                                        onChange={(e) => setBgColor(e.target.value)}
                                                        className="w-12 h-10 p-1 cursor-pointer"
                                                    />
                                                    <Input
                                                        type="text"
                                                        value={bgColor}
                                                        onChange={(e) => setBgColor(e.target.value)}
                                                        className="flex-1 uppercase"
                                                    />
                                                </div>
                                                <div className="flex flex-wrap gap-1 mt-1">
                                                    {COLOR_PALETTE.map(c => (
                                                        <button key={c} type="button" onClick={() => setBgColor(c)} className="w-5 h-5 rounded-full border border-gray-300 dark:border-gray-600 hover:scale-110 transition-transform shadow-sm" style={{ backgroundColor: c }} title={c} />
                                                    ))}
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="textColor">文字色</Label>
                                                <div className="flex items-center space-x-2">
                                                    <Input
                                                        id="textColor"
                                                        type="color"
                                                        value={textColor}
                                                        onChange={(e) => setTextColor(e.target.value)}
                                                        className="w-12 h-10 p-1 cursor-pointer"
                                                    />
                                                    <Input
                                                        type="text"
                                                        value={textColor}
                                                        onChange={(e) => setTextColor(e.target.value)}
                                                        className="flex-1 uppercase"
                                                    />
                                                </div>
                                                <div className="flex flex-wrap gap-1 mt-1">
                                                    {COLOR_PALETTE.map(c => (
                                                        <button key={c} type="button" onClick={() => setTextColor(c)} className="w-5 h-5 rounded-full border border-gray-300 dark:border-gray-600 hover:scale-110 transition-transform shadow-sm" style={{ backgroundColor: c }} title={c} />
                                                    ))}
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="borderColor">枠線色 (空で枠線なし)</Label>
                                                <div className="flex items-center space-x-2">
                                                    <Input
                                                        id="borderColor"
                                                        type="color"
                                                        value={borderColor || "#000000"}
                                                        onChange={(e) => setBorderColor(e.target.value)}
                                                        className="w-12 h-10 p-1 cursor-pointer"
                                                    />
                                                    <Input
                                                        type="text"
                                                        value={borderColor}
                                                        onChange={(e) => setBorderColor(e.target.value)}
                                                        placeholder="例: #FF0000"
                                                        className="flex-1 uppercase"
                                                    />
                                                </div>
                                                <div className="flex flex-wrap gap-1 mt-1">
                                                    <button type="button" onClick={() => setBorderColor("")} className="px-2 h-5 text-xs rounded border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors shadow-sm" title="枠線なし">なし</button>
                                                    {COLOR_PALETTE.map(c => (
                                                        <button key={c} type="button" onClick={() => setBorderColor(c)} className="w-5 h-5 rounded-full border border-gray-300 dark:border-gray-600 hover:scale-110 transition-transform shadow-sm" style={{ backgroundColor: c }} title={c} />
                                                    ))}
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="fontSize">フォントサイズ (px) (空で自動計算)</Label>
                                                <Input
                                                    id="fontSize"
                                                    type="number"
                                                    min="8"
                                                    value={fontSize}
                                                    onChange={(e) => setFontSize(e.target.value)}
                                                    placeholder="自動"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </>
                            )}

                            {error && (
                                <div className="p-3 text-sm text-red-500 bg-red-50 dark:bg-red-950/50 rounded-md border border-red-200 dark:border-red-900">
                                    {error}
                                </div>
                            )}
                        </CardContent>
                        <CardFooter>
                            <Button
                                type="submit"
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                                disabled={isGenerating}
                            >
                                {isGenerating ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        生成中...
                                    </>
                                ) : (
                                    <>
                                        <FileDownIcon className="mr-2 h-4 w-4" />
                                        ファイルを生成
                                    </>
                                )}
                            </Button>
                        </CardFooter>
                    </form>
                </Card>

                {/* プレビュー表示エリア */}
                <Card className="border-neutral-200 dark:border-neutral-800 shadow-sm mt-8 overflow-hidden">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0">
                        <div>
                            <CardTitle>サンプルプレビュー</CardTitle>
                            <CardDescription>生成される画像（1枚目）のイメージです</CardDescription>
                        </div>
                    </CardHeader>
                    <CardContent className="flex justify-center bg-gray-50 dark:bg-gray-900 border-t p-4 sm:p-8 min-h-[300px]">
                        <div className="relative max-w-full overflow-auto">
                            <canvas
                                ref={previewCanvasRef}
                                className="max-w-full h-auto border border-gray-300 dark:border-gray-700 shadow-sm"
                                style={{
                                    // プレビューが大きすぎる場合に折り返すための制約
                                    maxHeight: "60vh",
                                    objectFit: "contain"
                                }}
                            />
                        </div>
                    </CardContent>
                </Card>
            </div>
        </main>
    )
}
