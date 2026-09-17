import { useState, type ChangeEvent, type FormEvent } from 'react'
import { QrCode, Sparkles } from 'lucide-react'
import QRCode from 'qrcode'

import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'

const MAX_TEXT_LENGTH = 3000

function TextQrCodeCard(): React.JSX.Element {
  const [text, setText] = useState('')
  const [qrCode, setQrCode] = useState('')
  const [error, setError] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)

  const handleTextChange = (event: ChangeEvent<HTMLTextAreaElement>): void => {
    setText(event.target.value)
    setQrCode('')
    setError('')
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault()

    const content = text.trim()
    if (!content) {
      setError('请输入需要生成二维码的文本。')
      return
    }

    setIsGenerating(true)
    setError('')

    try {
      const dataUrl = await QRCode.toDataURL(content, {
        errorCorrectionLevel: 'L',
        margin: 2,
        type: 'image/png',
        width: 512,
        color: {
          dark: '#0a0a0a',
          light: '#ffffff'
        }
      })

      setQrCode(dataUrl)
    } catch (cause) {
      const isCapacityError =
        cause instanceof Error && /too big|too long|capacity/i.test(cause.message)

      setQrCode('')
      setError(
        isCapacityError
          ? '当前文本的字节数超过单个二维码容量，请缩短内容后重试。'
          : '二维码生成失败，请稍后重试。'
      )
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <Card className="w-full max-w-4xl">
      <CardHeader className="border-b">
        <div className="flex size-10 items-center justify-center rounded-xl bg-primary text-primary-foreground">
          <QrCode className="size-5" />
        </div>
        <CardTitle className="mt-3 text-xl">文本二维码</CardTitle>
        <CardDescription>输入文本并在本地生成二维码，内容不会离开当前设备。</CardDescription>
      </CardHeader>

      <form onSubmit={handleSubmit}>
        <CardContent className="grid gap-6 py-2 md:grid-cols-[minmax(0,1fr)_20rem]">
          <div className="flex min-w-0 flex-col gap-3">
            <div className="flex items-center justify-between gap-4">
              <Label htmlFor="qr-text">文本内容</Label>
              <span className="text-xs tabular-nums text-muted-foreground">
                {text.length} / {MAX_TEXT_LENGTH}
              </span>
            </div>

            <Textarea
              id="qr-text"
              value={text}
              maxLength={MAX_TEXT_LENGTH}
              rows={14}
              placeholder="输入网址、说明文字或其他需要编码的内容……"
              aria-describedby={error ? 'qr-error' : 'qr-help'}
              aria-invalid={Boolean(error)}
              className="min-h-72 resize-none"
              onChange={handleTextChange}
            />

            <p id="qr-help" className="text-xs leading-5 text-muted-foreground">
              最多可输入 3000 个字符；单个二维码的实际容量还会受到字符编码影响。
            </p>

            {error ? (
              <p id="qr-error" role="alert" className="text-sm text-destructive">
                {error}
              </p>
            ) : null}
          </div>

          <div className="flex min-h-80 items-center justify-center rounded-xl border bg-muted/30 p-5">
            {qrCode ? (
              <img
                src={qrCode}
                alt="根据输入文本生成的二维码"
                className="aspect-square w-full max-w-72 rounded-lg bg-white object-contain shadow-sm"
              />
            ) : (
              <div className="flex max-w-48 flex-col items-center gap-3 text-center text-muted-foreground">
                <div className="flex size-16 items-center justify-center rounded-2xl border border-dashed bg-background">
                  <QrCode className="size-8" />
                </div>
                <p className="text-sm leading-5">生成后的二维码将在这里显示</p>
              </div>
            )}
          </div>
        </CardContent>

        <CardFooter className="justify-end">
          <Button type="submit" disabled={!text.trim() || isGenerating}>
            <Sparkles data-icon="inline-start" />
            {isGenerating ? '正在生成…' : '生成二维码'}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}

export { TextQrCodeCard }
