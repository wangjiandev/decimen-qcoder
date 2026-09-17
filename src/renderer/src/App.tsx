import { CheckCircle2, RadioTower } from 'lucide-react'

import { Button } from '@/components/ui/button'

function App(): React.JSX.Element {
  const ipcHandle = (): void => window.electron.ipcRenderer.send('ping')

  return (
    <main className="flex min-h-screen items-center justify-center bg-muted/40 p-6">
      <section className="w-full max-w-xl rounded-2xl border bg-card p-8 text-card-foreground shadow-sm">
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border bg-background px-3 py-1 text-sm text-muted-foreground">
          <CheckCircle2 className="size-4 text-emerald-600" />
          shadcn/ui 4.21.0 已集成
        </div>

        <h1 className="text-3xl font-semibold tracking-tight">Decimen QCoder</h1>
        <p className="mt-3 max-w-md text-sm leading-6 text-muted-foreground">
          Electron、React、TypeScript、Tailwind CSS v4 与 shadcn/ui 已完成初始化。
        </p>

        <div className="mt-8 flex items-center gap-3">
          <Button onClick={ipcHandle}>
            <RadioTower data-icon="inline-start" />
            测试 Electron IPC
          </Button>
          <span className="text-xs text-muted-foreground">按 F12 可打开开发者工具</span>
        </div>
      </section>
    </main>
  )
}

export default App
