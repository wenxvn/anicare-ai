export async function fetchJson<T>(url: string, init?: RequestInit): Promise<T> {
  const response = await fetch(url, init);
  if (!response.ok) {
    throw new Error('请求失败：' + response.status);
  }
  return response.json() as Promise<T>;
}
