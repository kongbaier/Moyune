import api, { type ApiResponse } from "../utils/api";

export interface Book {
  /** 作者 */
  author: string;
  /** 书籍 URL */
  bookUrl: string;
  /** 是否可更新 */
  canUpdate: boolean;
  /** 封面 URL */
  coverUrl: string;
  /** 当前章节索引 */
  durChapterIndex: number;
  /** 当前章节位置 */
  durChapterPos: number;
  /** 当前章节时间 */
  durChapterTime: number;
  /** 当前章节标题 */
  durChapterTitle: string;
  /** 分组 */
  group: number;
  /** 简介 */
  intro: string;
  /** 类型 */
  kind: string;

  lastCheckCount: number;
  /** 最后检查时间 */
  lastCheckTime: number;
  /** 最新章节时间 */
  latestChapterTime: number;
  /** 最新章节标题 */
  latestChapterTitle: string;
  /** 书籍名称 */
  name: string;
  /** 排序 */
  order: number;
  /** 来源 */
  origin: string;
  /** 来源名称 */
  originName: string;
  /** 来源排序 */
  originOrder: number;
  /** 书籍配置 */
  readConfig: {
    dailyChapters: number;
    delTag: number;
    reSegment: boolean;
    readSimulating: boolean;
    reverseToc: boolean;
    splitLongChapter: boolean;
  };
  syncTime: number;
  tocUrl: string;
  /** 总章节数 */
  totalChapterNum: number;
  type: number;
  /** 字数 */
  wordCount: string;
}

// ── 缓存 ──

interface BookshelfCache {
  data: Book[];
  timestamp: number;
}

/** 缓存有效期：5 分钟 */
const TTL = 5 * 60 * 1000;

const SESSION_KEY = "veader:bookshelf";

/** 模块级内存缓存（同一 JS 执行周期内复用） */
let memoryCache: BookshelfCache | null = null;

/** 从 sessionStorage 读取缓存并校验有效期 */
function readSessionCache(): BookshelfCache | null {
  try {
    const raw = sessionStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    const cache = JSON.parse(raw) as BookshelfCache;
    if (Date.now() - cache.timestamp > TTL) {
      sessionStorage.removeItem(SESSION_KEY);
      return null;
    }
    return cache;
  } catch {
    sessionStorage.removeItem(SESSION_KEY);
    return null;
  }
}

/** 同时写入内存和 sessionStorage */
function writeCache(data: Book[]): void {
  const cache: BookshelfCache = { data, timestamp: Date.now() };
  memoryCache = cache;
  try {
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(cache));
  } catch {
    // sessionStorage 满或被禁用，静默失败（内存缓存仍有效）
  }
}

/** 从 API 获取书架数据（内部使用） */
async function fetchFromApi(): Promise<Book[]> {
  const res = await api.get<ApiResponse<Book[]>>("getBookshelf").json();
  if (!res.isSuccess) {
    throw new Error(res.errorMsg);
  }
  return res.data;
}

/**
 * 获取书架数据，三层缓存：
 *   ① 内存缓存 → ② sessionStorage → ③ API 请求
 *
 * @param options.force  跳过缓存，强制请求网络
 */
export const getBookshelf = async (options?: {
  force?: boolean;
}): Promise<Book[]> => {
  // ① 内存缓存
  if (
    !options?.force &&
    memoryCache &&
    Date.now() - memoryCache.timestamp < TTL
  ) {
    return memoryCache.data;
  }

  // ② sessionStorage
  if (!options?.force) {
    const sessionCache = readSessionCache();
    if (sessionCache) {
      memoryCache = sessionCache; // 回填内存
      return sessionCache.data;
    }
  }

  // ③ API 请求
  const data = await fetchFromApi();
  writeCache(data);
  return data;
};

/** 强制刷新书架（跳过缓存） */
export const refreshBookshelf = () => getBookshelf({ force: true });
