"use client";

import { useState, useMemo } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeftIcon, CopyIcon, TrashIcon } from "lucide-react";
import Link from "next/link";

export default function TextCounterPage() {
    const [text, setText] = useState("");

    const stats = useMemo(() => {
        const charsWithSpaces = text.length;
        // \s は全ての空白文字にマッチ。全角スペース(\u3000)等も含む
        const charsWithoutSpaces = text.replace(/\s/g, "").length;
        // 何も入力されていない場合は0行として扱う
        const lines = text === "" ? 0 : text.split(/\r\n|\r|\n/).length;
        // Blob を用いてUTF-8としてのバイト数を計算
        const byteLength = new Blob([text]).size;
        // 単語数: 空白区切りのトークン数（単語カウントは英語等向けだが参考値として）
        const wordCount = text.trim() === "" ? 0 : text.trim().split(/\s+/).length;

        return {
            charsWithSpaces,
            charsWithoutSpaces,
            lines,
            byteLength,
            wordCount,
        };
    }, [text]);

    const handleCopy = () => {
        if (text) {
            navigator.clipboard.writeText(text);
        }
    };

    const handleClear = () => {
        setText("");
    };

    return (
        <main className="min-h-screen bg-neutral-50 dark:bg-neutral-950 p-8 text-neutral-900 dark:text-neutral-50">
            <div className="max-w-5xl mx-auto space-y-8">
                {/* ヘッダーと戻るボタン */}
                <div className="flex flex-col space-y-4">
                    <div>
                        <Link href="/">
                            <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground -ml-2">
                                <ArrowLeftIcon className="w-4 h-4 mr-2" />
                                ポータルへ戻る
                            </Button>
                        </Link>
                    </div>
                    <div className="flex items-center space-x-4">
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight">テキストカウンタ</h1>
                            <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">
                                入力されたテキストの文字数、行数、バイト数などをリアルタイムに計算します。
                            </p>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
                    {/* テキスト入力エリア */}
                    <Card className="md:col-span-2 flex flex-col h-full bg-white dark:bg-neutral-900">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-lg">テキスト入力</CardTitle>
                            <div className="flex space-x-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={handleCopy}
                                    disabled={!text}
                                    className="h-8"
                                >
                                    <CopyIcon className="w-4 h-4 mr-2" />
                                    コピー
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={handleClear}
                                    disabled={!text}
                                    className="h-8 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/50"
                                >
                                    <TrashIcon className="w-4 h-4 mr-2" />
                                    クリア
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent className="flex-1">
                            <textarea
                                value={text}
                                onChange={(e) => setText(e.target.value)}
                                placeholder="ここにテキストを入力してください..."
                                className="w-full h-[500px] resize-none rounded-md border border-neutral-200 dark:border-neutral-800 bg-transparent px-3 py-2 text-base shadow-sm placeholder:text-neutral-400 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-neutral-950 dark:focus-visible:ring-neutral-300"
                            />
                        </CardContent>
                    </Card>

                    {/* カウント結果エリア */}
                    <div className="space-y-3">
                        <Card className="bg-white dark:bg-neutral-900 border-l-4 border-l-blue-500 rounded-md">
                            <CardHeader className="px-4 py-3 pb-1">
                                <CardTitle className="text-xs font-semibold text-neutral-500 dark:text-neutral-400">
                                    文字数 (空白含む)
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="px-4 pb-3 pt-0">
                                <div className="text-2xl font-medium text-neutral-800 dark:text-neutral-100">{stats.charsWithSpaces}</div>
                            </CardContent>
                        </Card>

                        <Card className="bg-white dark:bg-neutral-900 border-l-4 border-l-green-500 rounded-md">
                            <CardHeader className="px-4 py-3 pb-1">
                                <CardTitle className="text-xs font-semibold text-neutral-500 dark:text-neutral-400">
                                    文字数 (空白なし)
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="px-4 pb-3 pt-0">
                                <div className="text-2xl font-medium text-neutral-800 dark:text-neutral-100">{stats.charsWithoutSpaces}</div>
                            </CardContent>
                        </Card>

                        <Card className="bg-white dark:bg-neutral-900 border-l-4 border-l-purple-500 rounded-md">
                            <CardHeader className="px-4 py-3 pb-1">
                                <CardTitle className="text-xs font-semibold text-neutral-500 dark:text-neutral-400">
                                    行数
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="px-4 pb-3 pt-0">
                                <div className="text-2xl font-medium text-neutral-800 dark:text-neutral-100">{stats.lines}</div>
                            </CardContent>
                        </Card>

                        <Card className="bg-white dark:bg-neutral-900 border-l-4 border-l-yellow-500 rounded-md">
                            <CardHeader className="px-4 py-3 pb-1">
                                <CardTitle className="text-xs font-semibold text-neutral-500 dark:text-neutral-400">
                                    単語数
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="px-4 pb-3 pt-0">
                                <div className="text-2xl font-medium text-neutral-800 dark:text-neutral-100">{stats.wordCount}</div>
                            </CardContent>
                        </Card>

                        <Card className="bg-white dark:bg-neutral-900 border-l-4 border-l-red-500 rounded-md">
                            <CardHeader className="px-4 py-3 pb-1">
                                <CardTitle className="text-xs font-semibold text-neutral-500 dark:text-neutral-400">
                                    バイト数 (UTF-8)
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="px-4 pb-3 pt-0">
                                <div className="flex items-baseline space-x-2">
                                    <div className="text-2xl font-medium text-neutral-800 dark:text-neutral-100">{stats.byteLength}</div>
                                    <span className="text-xs font-normal text-neutral-500">bytes</span>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </main>
    );
}
