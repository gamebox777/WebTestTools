import Link from "next/link";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ImageIcon, CalculatorIcon, TypeIcon, Scaling } from "lucide-react";
import packageJson from "../../package.json";

export default function Home() {
  const tools = [
    {
      title: "テスト画像生成ツール",
      description: "指定した形式(PNG, JPG, PDF, XLSX)、サイズ、枚数でダミーファイルを一括生成します。",
      href: "/tools/image-generator",
      icon: <ImageIcon className="w-8 h-8 text-blue-500 mb-4" />,
      color: "border-blue-200 dark:border-blue-900",
      active: true,
    },
    {
      title: "テキストカウンタ",
      description: "入力されたテキストの文字数、単語数、行数などを詳細にカウントします。",
      href: "/tools/text-counter",
      icon: <CalculatorIcon className="w-8 h-8 text-green-500 mb-4" />,
      color: "border-green-200 dark:border-green-900",
      active: true,
    },
    {
      title: "テキストジェネレータ",
      description: "指定された文字数や要件に基づいて、テスト用のダミーテキストを生成します。",
      href: "/tools/text-generator",
      icon: <TypeIcon className="w-8 h-8 text-purple-500 mb-4" />,
      color: "border-purple-200 dark:border-purple-900",
      active: true,
    },
    {
      title: "アスペクト比計算機",
      description: "画像の仕様決めやトリミング用に、縦横比からサイズや、サイズから比率を計算します。",
      href: "/tools/aspect-ratio",
      icon: <Scaling className="w-8 h-8 text-indigo-500 mb-4" />,
      color: "border-indigo-200 dark:border-indigo-900",
      active: true,
    },
  ];

  return (
    <main className="min-h-screen bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-50 p-8">
      <div className="max-w-5xl mx-auto space-y-8">
        <div className="space-y-2">
          <div className="flex items-end gap-3">
            <h1 className="text-4xl font-extrabold tracking-tight">WebSystemTestTools Portal</h1>
            <span className="text-sm font-medium text-neutral-500 dark:text-neutral-400 bg-neutral-200 dark:bg-neutral-800 px-2 py-1 rounded-md mb-1">
              v{packageJson.version}
            </span>
          </div>
          <p className="text-lg text-neutral-500 dark:text-neutral-400">
            Webシステムのテストを支援するための各種ツール群へアクセスできます。
          </p>
          <div className="pt-2">
            <a
              href="https://github.com/gamebox777/WebTestTools/blob/develop/README.md"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 dark:text-blue-400 hover:underline font-medium text-lg inline-flex items-center transition-colors"
            >
              【マニュアル】はこちら (GitHub)
            </a>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tools.map((tool) => (
            <Card
              key={tool.title}
              className={`flex flex-col h-full transition-all duration-300 hover:shadow-lg hover:-translate-y-1 ${tool.color}`}
            >
              <CardHeader>
                {tool.icon}
                <CardTitle>{tool.title}</CardTitle>
                <CardDescription className="text-sm">
                  {tool.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="mt-auto pt-6">
                {tool.active ? (
                  <Link href={tool.href} className="w-full">
                    <Button className="w-full border-blue-500 hover:bg-blue-50" variant="outline">
                      開く
                    </Button>
                  </Link>
                ) : (
                  <Button className="w-full" variant="secondary" disabled>
                    準備中
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </main>
  );
}
