import { QueryClient } from '@tanstack/react-query';

// 创建客户端（全局配置）
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000, // 1分钟后变旧啊
      gcTime: 5 * 60 * 1000, // 缓存保留5分钟
      retry: 1, // 失败重试1次
      refetchOnWindowFocus: false, // 不自动刷新
    },
    mutations: {
      retry: 0, // mutation 失败不重试
    },
  },
});
