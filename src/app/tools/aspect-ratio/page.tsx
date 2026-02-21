"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, RefreshCw, Calculator, Scaling } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

// 最大公約数を求める関数
function gcd(a: number, b: number): number {
    return b === 0 ? a : gcd(b, a % b);
}

export default function AspectRatioCalculator() {
    // モード: "ratioToSize" (比率からサイズ), "sizeToRatio" (サイズから比率)
    const [mode, setMode] = useState<"ratioToSize" | "sizeToRatio">("ratioToSize");

    // 比率からサイズ計算用のステート
    const [ratioW, setRatioW] = useState<string>("16");
    const [ratioH, setRatioH] = useState<string>("9");
    const [baseWidth, setBaseWidth] = useState<string>("1920");
    const [calculatedHeight, setCalculatedHeight] = useState<string>("1080");
    const [baseHeight, setBaseHeight] = useState<string>("");
    const [calculatedWidth, setCalculatedWidth] = useState<string>("");
    const [activeBase, setActiveBase] = useState<"width" | "height">("width");

    // サイズから比率計算用のステート
    const [inputWidth, setInputWidth] = useState<string>("1920");
    const [inputHeight, setInputHeight] = useState<string>("1080");
    const [resultRatioW, setResultRatioW] = useState<string>("16");
    const [resultRatioH, setResultRatioH] = useState<string>("9");
    const [ratioDec, setRatioDec] = useState<string>("1.78");

    // 一般的なアスペクト比プリセット
    const presets = [
        { label: "16:9", w: 16, h: 9, desc: "一般的なモニター・動画" },
        { label: "4:3", w: 4, h: 3, desc: "旧型TV・一部のタブレット" },
        { label: "1:1", w: 1, h: 1, desc: "正方形・SNSアイコン" },
        { label: "3:2", w: 3, h: 2, desc: "一眼レフ写真" },
        { label: "21:9", w: 21, h: 9, desc: "ウルトラワイドモニター" },
        { label: "9:16", w: 9, h: 16, desc: "スマホ縦向き・ショート動画" },
    ];

    // 【比率からサイズ】の計算実行
    useEffect(() => {
        const rw = parseFloat(ratioW);
        const rh = parseFloat(ratioH);

        if (isNaN(rw) || isNaN(rh) || rw <= 0 || rh <= 0) {
            if (activeBase === "width") setCalculatedHeight("");
            else setCalculatedWidth("");
            return;
        }

        if (activeBase === "width") {
            const bw = parseFloat(baseWidth);
            if (!isNaN(bw) && bw > 0) {
                const h = Math.round((bw / rw) * rh);
                setCalculatedHeight(h.toString());
            } else {
                setCalculatedHeight("");
            }
        } else {
            const bh = parseFloat(baseHeight);
            if (!isNaN(bh) && bh > 0) {
                const w = Math.round((bh / rh) * rw);
                setCalculatedWidth(w.toString());
            } else {
                setCalculatedWidth("");
            }
        }
    }, [ratioW, ratioH, baseWidth, baseHeight, activeBase]);

    // 【サイズから比率】の計算実行
    useEffect(() => {
        const iw = parseFloat(inputWidth);
        const ih = parseFloat(inputHeight);

        if (!isNaN(iw) && !isNaN(ih) && iw > 0 && ih > 0) {
            const divisor = gcd(iw, ih);
            setResultRatioW((iw / divisor).toString());
            setResultRatioH((ih / divisor).toString());
            setRatioDec((iw / ih).toFixed(2));
        } else {
            setResultRatioW("");
            setResultRatioH("");
            setRatioDec("");
        }
    }, [inputWidth, inputHeight]);

    // 比率の上下入れ替え
    const swapRatio = () => {
        const tempW = ratioW;
        setRatioW(ratioH);
        setRatioH(tempW);
    };

    return (
        <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 p-8">
            <div className="max-w-3xl mx-auto space-y-6">
                {/* ヘッダーと戻るボタン */}
                <div className="flex items-center gap-4">
                    <Link href="/">
                        <Button variant="ghost" size="icon" className="shrink-0">
                            <ArrowLeft className="w-5 h-5" />
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-3xl font-bold flex items-center gap-2">
                            <Scaling className="w-8 h-8 text-blue-500" />
                            アスペクト比計算機
                        </h1>
                        <p className="text-neutral-500 dark:text-neutral-400">
                            画像サイズの計算や、正確な縦横比の算出を行います
                        </p>
                    </div>
                </div>

                {/* モード切り替えタブ */}
                <div className="grid grid-cols-2 gap-2 p-1 bg-neutral-200/50 dark:bg-neutral-800/50 rounded-lg">
                    <Button
                        variant={mode === "ratioToSize" ? "default" : "ghost"}
                        onClick={() => setMode("ratioToSize")}
                        className="w-full font-bold"
                    >
                        比率からサイズを計算
                    </Button>
                    <Button
                        variant={mode === "sizeToRatio" ? "default" : "ghost"}
                        onClick={() => setMode("sizeToRatio")}
                        className="w-full font-bold"
                    >
                        サイズから比率を計算
                    </Button>
                </div>

                {mode === "ratioToSize" ? (
                    // === モード: 比率からサイズ ===
                    <Card className="border-4 border-blue-100 dark:border-blue-900 shadow-xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-bl-full -z-10" />
                        <CardHeader className="bg-blue-50/50 dark:bg-blue-900/20 border-b">
                            <CardTitle className="flex items-center gap-2 text-2xl">
                                <Calculator className="w-6 h-6 text-blue-500" />
                                比率に基づくサイズ計算
                            </CardTitle>
                            <CardDescription>指定した縦横比に合わせて、幅・高さを算出します</CardDescription>
                        </CardHeader>
                        <CardContent className="p-6 space-y-8">

                            {/* 1. 比率の設定 */}
                            <div className="bg-white dark:bg-neutral-900 border rounded-xl p-6 shadow-sm">
                                <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                                    <span className="bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300 w-6 h-6 rounded-full inline-flex items-center justify-center text-sm">1</span>
                                    比率を指定
                                </h3>

                                <div className="flex flex-wrap gap-2 mb-6">
                                    {presets.map((p) => (
                                        <Button
                                            key={p.label}
                                            variant="outline"
                                            size="sm"
                                            onClick={() => {
                                                setRatioW(p.w.toString());
                                                setRatioH(p.h.toString());
                                            }}
                                            title={p.desc}
                                            className="hover:border-blue-500 hover:text-blue-600 dark:hover:text-blue-400"
                                        >
                                            {p.label}
                                        </Button>
                                    ))}
                                </div>

                                <div className="flex items-center justify-center gap-6 p-4 bg-neutral-50 dark:bg-neutral-800 rounded-lg border border-neutral-200 dark:border-neutral-700">
                                    <div className="text-center w-32">
                                        <Label htmlFor="ratioW" className="text-sm font-medium text-neutral-500">幅の比率 (W)</Label>
                                        <Input
                                            id="ratioW"
                                            type="number"
                                            min="1"
                                            value={ratioW}
                                            onChange={(e) => setRatioW(e.target.value)}
                                            className="text-center text-2xl font-bold mt-2"
                                        />
                                    </div>
                                    <div className="flex flex-col items-center">
                                        <span className="text-3xl font-light text-neutral-400 mb-2">:</span>
                                        <Button variant="ghost" size="icon" onClick={swapRatio} className="text-neutral-500 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/50 rounded-full h-8 w-8">
                                            <RefreshCw className="w-4 h-4" />
                                        </Button>
                                    </div>
                                    <div className="text-center w-32">
                                        <Label htmlFor="ratioH" className="text-sm font-medium text-neutral-500">高さの比率 (H)</Label>
                                        <Input
                                            id="ratioH"
                                            type="number"
                                            min="1"
                                            value={ratioH}
                                            onChange={(e) => setRatioH(e.target.value)}
                                            className="text-center text-2xl font-bold mt-2"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* 2. 基準サイズの入力と結果 */}
                            <div className="bg-blue-50/30 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-800 rounded-xl p-6 shadow-sm">
                                <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-blue-900 dark:text-blue-100">
                                    <span className="bg-blue-500 text-white w-6 h-6 rounded-full inline-flex items-center justify-center text-sm shadow-md">2</span>
                                    サイズを計算
                                </h3>

                                <div className="grid md:grid-cols-2 gap-8 relative items-center">
                                    {/* 中央の区切り線（md以上） */}
                                    <div className="hidden md:flex absolute inset-y-0 left-1/2 -ml-px w-px bg-blue-200 dark:bg-blue-800/50 flex-col items-center justify-center">
                                        <span className="bg-white dark:bg-neutral-900 text-blue-400 text-xs px-2 py-1 rounded-full border border-blue-100 dark:border-blue-800">OR</span>
                                    </div>

                                    {/* 幅基準で計算 */}
                                    <div
                                        className={`p-5 rounded-xl border-2 transition-all duration-300 cursor-pointer ${activeBase === "width"
                                                ? "border-blue-500 bg-white dark:bg-neutral-900 shadow-md ring-4 ring-blue-50 dark:ring-blue-900/20"
                                                : "border-transparent hover:border-blue-200 bg-white/50 dark:bg-neutral-900/50 opacity-70 hover:opacity-100"
                                            }`}
                                        onClick={() => setActiveBase("width")}
                                    >
                                        <div className="flex items-center gap-2 mb-4">
                                            <div className={`w-3 h-3 rounded-full ${activeBase === "width" ? "bg-blue-500" : "bg-neutral-300"}`} />
                                            <h4 className="font-bold text-neutral-700 dark:text-neutral-300">幅を基準にする</h4>
                                        </div>
                                        <div className="space-y-4">
                                            <div>
                                                <Label>基準の幅 (px)</Label>
                                                <div className="relative mt-1">
                                                    <Input
                                                        type="number"
                                                        min="1"
                                                        value={baseWidth}
                                                        onChange={(e) => {
                                                            setActiveBase("width");
                                                            setBaseWidth(e.target.value);
                                                        }}
                                                        className={`font-mono text-lg ${activeBase === "width" ? "border-blue-300" : ""}`}
                                                    />
                                                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400">px</span>
                                                </div>
                                            </div>
                                            <div className="pt-2 border-t border-dashed">
                                                <Label className="text-blue-600 dark:text-blue-400 flex items-center gap-1">
                                                    ↳ 計算された高さ
                                                </Label>
                                                <div className="mt-1 text-3xl font-bold font-mono text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 p-2 rounded-lg text-center border border-blue-100 dark:border-blue-800">
                                                    {activeBase === "width" ? (calculatedHeight || "---") : "---"} <span className="text-lg font-normal text-blue-400">px</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* 高さ基準で計算 */}
                                    <div
                                        className={`p-5 rounded-xl border-2 transition-all duration-300 cursor-pointer ${activeBase === "height"
                                                ? "border-blue-500 bg-white dark:bg-neutral-900 shadow-md ring-4 ring-blue-50 dark:ring-blue-900/20"
                                                : "border-transparent hover:border-blue-200 bg-white/50 dark:bg-neutral-900/50 opacity-70 hover:opacity-100"
                                            }`}
                                        onClick={() => setActiveBase("height")}
                                    >
                                        <div className="flex items-center gap-2 mb-4">
                                            <div className={`w-3 h-3 rounded-full ${activeBase === "height" ? "bg-blue-500" : "bg-neutral-300"}`} />
                                            <h4 className="font-bold text-neutral-700 dark:text-neutral-300">高さを基準にする</h4>
                                        </div>
                                        <div className="space-y-4">
                                            <div>
                                                <Label>基準の高さ (px)</Label>
                                                <div className="relative mt-1">
                                                    <Input
                                                        type="number"
                                                        min="1"
                                                        value={baseHeight}
                                                        onChange={(e) => {
                                                            setActiveBase("height");
                                                            setBaseHeight(e.target.value);
                                                        }}
                                                        className={`font-mono text-lg ${activeBase === "height" ? "border-blue-300" : ""}`}
                                                    />
                                                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400">px</span>
                                                </div>
                                            </div>
                                            <div className="pt-2 border-t border-dashed">
                                                <Label className="text-blue-600 dark:text-blue-400 flex items-center gap-1">
                                                    ↳ 計算された幅
                                                </Label>
                                                <div className="mt-1 text-3xl font-bold font-mono text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 p-2 rounded-lg text-center border border-blue-100 dark:border-blue-800">
                                                    {activeBase === "height" ? (calculatedWidth || "---") : "---"} <span className="text-lg font-normal text-blue-400">px</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </CardContent>
                    </Card>
                ) : (
                    // === モード: サイズから比率 ===
                    <Card className="border-4 border-indigo-100 dark:border-indigo-900/50 shadow-xl relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-32 h-32 bg-indigo-500/10 rounded-br-full -z-10" />
                        <CardHeader className="bg-indigo-50/50 dark:bg-indigo-900/20 border-b">
                            <CardTitle className="flex items-center gap-2 text-2xl">
                                <Scaling className="w-6 h-6 text-indigo-500" />
                                正確な比率を算出
                            </CardTitle>
                            <CardDescription>画像の幅と高さから、最もシンプルな縦横比を計算します</CardDescription>
                        </CardHeader>
                        <CardContent className="p-6 space-y-8">

                            <div className="bg-white dark:bg-neutral-900 border rounded-xl p-6 shadow-sm">
                                <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                                    <span className="bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300 w-6 h-6 rounded-full inline-flex items-center justify-center text-sm">1</span>
                                    画像サイズを入力
                                </h3>

                                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8">
                                    <div className="w-full sm:w-48 relative">
                                        <Label htmlFor="inputW" className="text-neutral-500 font-medium ml-1">幅 (Width)</Label>
                                        <div className="relative mt-2">
                                            <Input
                                                id="inputW"
                                                type="number"
                                                min="1"
                                                value={inputWidth}
                                                onChange={(e) => setInputWidth(e.target.value)}
                                                className="font-mono text-2xl h-14 pl-4 pr-12 focus-visible:ring-indigo-500"
                                            />
                                            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400 font-medium">px</span>
                                        </div>
                                    </div>

                                    <div className="text-neutral-300 font-light text-4xl hidden sm:block">×</div>

                                    <div className="w-full sm:w-48 relative">
                                        <Label htmlFor="inputH" className="text-neutral-500 font-medium ml-1">高さ (Height)</Label>
                                        <div className="relative mt-2">
                                            <Input
                                                id="inputH"
                                                type="number"
                                                min="1"
                                                value={inputHeight}
                                                onChange={(e) => setInputHeight(e.target.value)}
                                                className="font-mono text-2xl h-14 pl-4 pr-12 focus-visible:ring-indigo-500"
                                            />
                                            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400 font-medium">px</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-indigo-50/50 dark:bg-indigo-900/10 border-2 border-indigo-100 dark:border-indigo-800 rounded-xl p-6 shadow-sm text-center relative overflow-hidden">
                                <div className="absolute -right-10 -top-10 w-40 h-40 bg-indigo-500/5 rounded-full blur-2xl pointer-events-none" />
                                <div className="absolute -left-10 -bottom-10 w-40 h-40 bg-indigo-500/5 rounded-full blur-2xl pointer-events-none" />

                                <h3 className="text-lg font-bold mb-6 text-indigo-900 dark:text-indigo-200">計算結果 (最もシンプルな比率)</h3>

                                <div className="inline-flex items-baseline justify-center gap-4 bg-white dark:bg-neutral-900 px-8 py-6 rounded-2xl shadow-inner border border-indigo-50 dark:border-indigo-900/30">
                                    <span className="text-6xl font-black text-indigo-600 dark:text-indigo-400 tabular-nums tracking-tight">
                                        {resultRatioW || "---"}
                                    </span>
                                    <span className="text-4xl font-light text-indigo-300 dark:text-indigo-700">:</span>
                                    <span className="text-6xl font-black text-indigo-600 dark:text-indigo-400 tabular-nums tracking-tight">
                                        {resultRatioH || "---"}
                                    </span>
                                </div>

                                {resultRatioW && resultRatioH && (
                                    <div className="mt-8 pt-6 border-t border-indigo-200/50 dark:border-indigo-800/50 flex flex-col items-center justify-center gap-2">
                                        <div className="text-sm font-medium text-neutral-500 bg-white/50 dark:bg-neutral-800 px-4 py-1.5 rounded-full inline-flex items-center gap-2">
                                            <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse" />
                                            小数比率 (横 ÷ 縦) = <strong className="text-indigo-700 dark:text-indigo-300 text-lg tabular-nums">{ratioDec}</strong>
                                        </div>
                                        <p className="text-xs text-neutral-400 mt-2 max-w-sm">
                                            ※ 基準となる比率（16:9 ≒ 1.78, 4:3 ≒ 1.33）と近いかどうかを判断する目安になります。
                                        </p>
                                    </div>
                                )}
                            </div>

                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    );
}
