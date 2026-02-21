"use client";

import { useState } from "react";
import { CopyIcon, CheckIcon, TypeIcon, RefreshCcwIcon, ArrowLeftIcon } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

const loremIpsum = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. ";
const japaneseDummy = "吾輩は猫である。名前はまだ無い。どこで生れたかとんと見当がつかぬ。何でも薄暗いじめじめした所でニャーニャー泣いていた事だけは記憶している。吾輩はここで始めて人間というものを見た。しかもあとで聞くとそれは書生という人間中で一番獰悪な種族であったそうだ。この書生というのは時々我々を捕えて煮て食うという話である。しかしその当時は何という考もなかったから別段恐しいとも思わなかった。ただ彼の掌に載せられてスーと持ち上げられた時何だかフワフワした感じがあったばかりである。掌の上で少し落ちついて書生の顔を見たのがいわゆる人間というものの見始であろう。この時妙なものだと思った感じが今でも残っている。";

const pools: Record<string, { full: string; half: string }> = {
    hiragana: {
        full: "あいうえおかきくけこさしすせそたちつてとなにぬねのはひふへほまみむめもやゆよらりるれろわをん",
        half: "あいうえおかきくけこさしすせそたちつてとなにぬねのはひふへほまみむめもやゆよらりるれろわをん",
    },
    katakana: {
        full: "アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン",
        half: "ｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄﾅﾆﾇﾈﾉﾊﾋﾌﾍﾎﾏﾐﾑﾒﾓﾔﾕﾖﾗﾘﾙﾚﾛﾜｦﾝ",
    },
    alphabets: {
        full: "ＡＢＣＤＥＦＧＨＩＪＫＬＭＮＯＰＱＲＳＴＵＶＷＸＹＺａｂｃｄｅｆｇｈｉｊｋｌｍｎｏｐｑｒｓｔｕｖｗｘｙｚ",
        half: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz",
    },
    numbers: {
        full: "０１２３４５６７８９",
        half: "0123456789",
    },
};

const toFullWidth = (str: string) => {
    return str
        .replace(/[A-Za-z0-9 ]/g, (s) => {
            if (s === " ") return "　";
            return String.fromCharCode(s.charCodeAt(0) + 0xfee0);
        })
        .replace(/[ｱ-ﾝ]/g, (s) => {
            const map: Record<string, string> = {
                ｱ: "ア", ｲ: "イ", ｳ: "ウ", ｴ: "エ", ｵ: "オ",
                ｶ: "カ", ｷ: "キ", ｸ: "ク", ｹ: "ケ", ｺ: "コ",
                ｻ: "サ", ｼ: "シ", ｽ: "ス", ｾ: "セ", ｿ: "ソ",
                ﾀ: "タ", ﾁ: "チ", ﾂ: "ツ", ﾃ: "テ", ﾄ: "ト",
                ﾅ: "ナ", ﾆ: "ニ", ﾇ: "ヌ", ﾈ: "ネ", ﾉ: "ノ",
                ﾊ: "ハ", ﾋ: "ヒ", ﾌ: "フ", ﾍ: "ヘ", ﾎ: "ホ",
                ﾏ: "マ", ﾐ: "ミ", ﾑ: "ム", ﾒ: "メ", ﾓ: "モ",
                ﾔ: "ヤ", ﾕ: "ユ", ﾖ: "ヨ",
                ﾗ: "ラ", ﾘ: "リ", ﾙ: "ル", ﾚ: "レ", ﾛ: "ロ",
                ﾜ: "ワ", ｦ: "ヲ", ﾝ: "ン",
            };
            return map[s] || s;
        });
};

const toHalfWidth = (str: string) => {
    return str
        .replace(/[Ａ-Ｚａ-ｚ０-９　]/g, (s) => {
            if (s === "　") return " ";
            return String.fromCharCode(s.charCodeAt(0) - 0xfee0);
        })
        .replace(/[ア-ン]/g, (s) => {
            const map: Record<string, string> = {
                ア: "ｱ", イ: "ｲ", ウ: "ｳ", エ: "ｴ", オ: "ｵ",
                カ: "ｶ", キ: "ｷ", ク: "ｸ", ケ: "ｹ", コ: "ｺ",
                サ: "ｻ", シ: "ｼ", ス: "ｽ", セ: "ｾ", ソ: "ｿ",
                タ: "ﾀ", チ: "ﾁ", ツ: "ﾂ", テ: "ﾃ", ト: "ﾄ",
                ナ: "ﾅ", ニ: "ﾆ", ヌ: "ﾇ", ネ: "ﾈ", ノ: "ﾉ",
                ハ: "ﾊ", ヒ: "ﾋ", フ: "ﾌ", ヘ: "ﾍ", ホ: "ﾎ",
                マ: "ﾏ", ミ: "ﾐ", ム: "ﾑ", メ: "ﾒ", モ: "ﾓ",
                ヤ: "ﾔ", ユ: "ﾕ", ヨ: "ﾖ",
                ラ: "ﾗ", リ: "ﾘ", ル: "ﾙ", レ: "ﾚ", ロ: "ﾛ",
                ワ: "ﾜ", ヲ: "ｦ", ン: "ﾝ",
            };
            return map[s] || s;
        });
};

export default function TextGeneratorPage() {
    const [length, setLength] = useState<number>(100);
    const [type, setType] = useState<string>("japanese");
    const [charWidth, setCharWidth] = useState<string>("default");
    const [newline, setNewline] = useState<string>("none");
    const [generatedText, setGeneratedText] = useState<string>("");
    const [copied, setCopied] = useState(false);

    const generateText = () => {
        let result = "";

        // 生成する幅を決定
        let targetWidth = charWidth;
        if (targetWidth === "default") {
            targetWidth = ["japanese", "hiragana", "katakana"].includes(type) ? "full" : "half";
        }

        if (type === "lorem" || type === "japanese") {
            let baseStr = type === "lorem" ? loremIpsum : japaneseDummy;
            if (newline === "yes") {
                if (type === "japanese") baseStr = baseStr.replace(/。/g, "。\n");
                if (type === "lorem") baseStr = baseStr.replace(/\. /g, ".\n");
            }

            while (result.length < length) {
                result += baseStr;
            }
            result = result.substring(0, length);

            // 全角半角の変換
            if (targetWidth === "full") {
                result = toFullWidth(result);
            } else if (targetWidth === "half") {
                result = toHalfWidth(result);
            } else if (targetWidth === "mixed") {
                let mixed = "";
                for (let i = 0; i < result.length; i++) {
                    mixed += Math.random() > 0.5 ? toFullWidth(result[i]) : toHalfWidth(result[i]);
                }
                result = mixed;
            }
        } else {
            const poolType = pools[type];
            let pool = "";
            if (targetWidth === "full") {
                pool = poolType.full;
            } else if (targetWidth === "half") {
                pool = poolType.half;
            } else {
                pool = poolType.full + poolType.half;
            }

            for (let i = 0; i < length; i++) {
                if (newline === "yes" && result.length > 0 && result.length % 50 === 0) {
                    result += "\n";
                }
                result += pool.charAt(Math.floor(Math.random() * pool.length));
            }
            result = result.substring(0, length);
        }
        setGeneratedText(result);
        setCopied(false);
    };

    const copyToClipboard = async () => {
        if (!generatedText) return;
        try {
            await navigator.clipboard.writeText(generatedText);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error("Failed to copy text: ", err);
        }
    };

    return (
        <div className="container mx-auto py-10 px-4 max-w-4xl">
            <div className="flex flex-col space-y-4 mb-8">
                <div>
                    <Link href="/">
                        <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                            <ArrowLeftIcon className="w-4 h-4 mr-2" />
                            ポータルへ戻る
                        </Button>
                    </Link>
                </div>
                <div className="flex items-center space-x-4">
                    <div className="p-3 bg-purple-100 dark:bg-purple-900 rounded-lg">
                        <TypeIcon className="w-8 h-8 text-purple-600 dark:text-purple-300" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">テキストジェネレータ</h1>
                        <p className="text-muted-foreground mt-1">指定した条件でテスト用のダミーテキストを生成します</p>
                    </div>
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
                {/* Settings Panel */}
                <Card className="md:col-span-1 h-fit border-purple-200 dark:border-purple-900 shadow-sm">
                    <CardHeader>
                        <CardTitle>生成設定</CardTitle>
                        <CardDescription>生成するテキストの条件を指定してください。</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="text-type">テキストの種類</Label>
                            <Select value={type} onValueChange={setType}>
                                <SelectTrigger id="text-type" className="focus:ring-purple-500">
                                    <SelectValue placeholder="種類を選択" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="japanese">日本語文章 (吾輩は猫である)</SelectItem>
                                    <SelectItem value="lorem">英語文章 (Lorem ipsum)</SelectItem>
                                    <SelectItem value="hiragana">ひらがな (ランダム)</SelectItem>
                                    <SelectItem value="katakana">カタカナ (ランダム)</SelectItem>
                                    <SelectItem value="alphabets">英字 (ランダム)</SelectItem>
                                    <SelectItem value="numbers">数字 (ランダム)</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="text-width">文字幅</Label>
                            <Select value={charWidth} onValueChange={setCharWidth}>
                                <SelectTrigger id="text-width" className="focus:ring-purple-500">
                                    <SelectValue placeholder="文字幅を選択" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="default">おまかせ (種類に合わせる)</SelectItem>
                                    <SelectItem value="half">半角</SelectItem>
                                    <SelectItem value="full">全角</SelectItem>
                                    <SelectItem value="mixed">混在</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="newline">改行</Label>
                            <Select value={newline} onValueChange={setNewline}>
                                <SelectTrigger id="newline" className="focus:ring-purple-500">
                                    <SelectValue placeholder="改行を選択" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="none">なし</SelectItem>
                                    <SelectItem value="yes">あり (文章、または50文字ごと)</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="length">文字数 ({length.toLocaleString()} 文字)</Label>
                            <Input
                                id="length"
                                type="number"
                                min={1}
                                max={100000}
                                value={length}
                                onChange={(e) => setLength(Number(e.target.value) || 1)}
                                className="font-mono focus-visible:ring-purple-500"
                            />
                        </div>

                        <Button onClick={generateText} className="w-full bg-purple-600 hover:bg-purple-700 text-white" size="lg">
                            <RefreshCcwIcon className="w-4 h-4 mr-2" />
                            テキスト生成
                        </Button>
                    </CardContent>
                </Card>

                {/* Result Area */}
                <Card className="md:col-span-2 flex flex-col shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between pb-4">
                        <div>
                            <CardTitle>生成結果</CardTitle>
                            <CardDescription>
                                {generatedText.length > 0
                                    ? `現在 ${generatedText.length.toLocaleString()} 文字生成されています`
                                    : "まだ生成されていません"}
                            </CardDescription>
                        </div>
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={copyToClipboard}
                            disabled={!generatedText}
                            title="クリップボードにコピー"
                            className={copied ? "text-green-600 border-green-200 bg-green-50" : ""}
                        >
                            {copied ? (
                                <CheckIcon className="h-4 w-4" />
                            ) : (
                                <CopyIcon className="h-4 w-4" />
                            )}
                        </Button>
                    </CardHeader>
                    <CardContent className="flex-1 min-h-[400px]">
                        <Textarea
                            readOnly
                            value={generatedText}
                            placeholder="生成されたテキストがここに表示されます..."
                            className="resize-none h-full min-h-[350px] font-mono p-4 focus-visible:ring-0 focus-visible:border-purple-300"
                        />
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
