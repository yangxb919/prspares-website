type UnknownJson = Record<string, unknown> | unknown[] | string | number | boolean | null

const isJsonContentType = (contentType: string | null) =>
  Boolean(contentType && contentType.toLowerCase().includes('application/json'))

const tryReadJson = async (response: Response): Promise<UnknownJson | null> => {
  try {
    return (await response.json()) as UnknownJson
  } catch {
    return null
  }
}

const stripHtml = (input: string) =>
  input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, ' ')
    .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()

export async function readJsonResponse<T = unknown>(response: Response): Promise<T> {
  const contentType = response.headers.get('content-type')
  if (!isJsonContentType(contentType)) {
    const text = await response.text().catch(() => '')
    const summary = stripHtml(text).slice(0, 300)
    throw new Error(`Expected JSON but got ${contentType || 'unknown content-type'}${summary ? `: ${summary}` : ''}`)
  }

  return (await response.json()) as T
}

export async function readErrorMessage(response: Response): Promise<string> {
  const contentType = response.headers.get('content-type')

  if (isJsonContentType(contentType)) {
    const json = await tryReadJson(response)
    if (json && typeof json === 'object' && !Array.isArray(json)) {
      const anyJson = json as Record<string, unknown>
      const maybeError =
        (typeof anyJson.error === 'string' && anyJson.error) ||
        (typeof anyJson.message === 'string' && anyJson.message)
      if (maybeError) return maybeError
    }

    if (typeof json === 'string') return json
  }

  const text = await response.text().catch(() => '')
  const cleaned = stripHtml(text)

  if (response.status === 413) {
    return '上传失败：图片文件过大（413）。请尝试压缩图片后再上传。'
  }

  if (cleaned) {
    return `${response.status} ${response.statusText}: ${cleaned.slice(0, 300)}`
  }

  return `${response.status} ${response.statusText}`.trim()
}

