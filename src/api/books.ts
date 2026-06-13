import api, { type ApiResponse } from "../utils/api";

export interface Book {
  author: string;
  bookUrl: string;
  canUpdate: boolean;
  coverUrl: string;
  durChapterIndex: number;
  durChapterPos: number;
  durChapterTime: number;
  durChapterTitle: string;
  group: number;
  intro: string;
  kind: string;
  lastCheckCount: number;
  lastCheckTime: number;
  latestChapterTime: number;
  latestChapterTitle: string;
  name: string;
  order: number;
  origin: string;
  originName: string;
  originOrder: number;
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
  totalChapterNum: number;
  type: number;
  wordCount: string;
}

export const getBookshelf = async () => {
  const res = await api.get<ApiResponse<Book[]>>("getBookshelf").json();
  if (!res.isSuccess) {
    throw new Error(res.errorMsg);
  }
  return res.data;
};
