export default function DocsPage() {
    return (
        <div className="container mx-auto py-10 px-6 md:px-8">
            <div className="mx-auto max-w-3xl space-y-8">
                <h1 className="text-4xl font-bold tracking-tight">Introduction</h1>
                <div className="space-y-4">
                    <p className="leading-7">
                        個人的にほしいなと思ったものを作っているだけです。 主にエンジニアが使うツールを提供しています。
                    </p>
                    <p className="leading-7">
                        計算処理はすべてクライアントで実行しています。 使い方によっては端末に負荷をかける可能性があるのでご注意ください。
                    </p>
                    <p className="leading-7">
                        動作は保証しませんので、利用は自己責任でお願いします。
                    </p>
                </div>
            </div>
        </div>
    )
}
