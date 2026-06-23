import api, { type ApiResponse } from "../utils/api";

// ── 类型 ──

export interface ChapterItem {
  baseUrl: string;
  bookUrl: string;
  index: number;
  isPlay: boolean;
  isVip: boolean;
  isVolume: boolean;
  tag: string;
  title: string;
  url: string;
}

export interface SaveProgressPayload {
  name: string;
  author: string;
  durChapterIndex: number;
  durChapterPos: number;
  durChapterTime: number;
  durChapterTitle: string;
}

// ── API ──

/**
 * 获取书籍章节目录
 * @param bookUrl - 书籍的目录 URL（来自 Book.tocUrl）
 */
export const getChapterList = async (
  bookUrl: string
): Promise<ChapterItem[]> => {
  const res = await api
    .get<ApiResponse<ChapterItem[]>>("getChapterList", {
      searchParams: { url: bookUrl },
    })
    .json();
  if (!res.isSuccess) {
    throw new Error(res.errorMsg);
  }
  return res.data;
};

/**
 * 获取章节正文内容
 * @param bookUrl - 书籍标识 URL（来自 Book.bookUrl）
 * @param chapterIndex - 章节索引
 */
export const getChapterContent = async (
  bookUrl: string,
  chapterIndex: number
): Promise<string> => {
  const res = await api
    .get<ApiResponse<string>>("getBookContent", {
      searchParams: {
        url: bookUrl,
        index: chapterIndex,
      },
    })
    .json();
  if (!res.isSuccess) {
    throw new Error(res.errorMsg);
  }
  return res.data;
};

/**
 * 保存阅读进度到服务端
 */
export const saveBookProgress = async (
  payload: SaveProgressPayload,
  signal?: AbortSignal
): Promise<void> => {
  await api.post("saveBookProgress", { json: payload, signal });
};
