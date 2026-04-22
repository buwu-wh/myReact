import { create } from 'zustand';
import appInfo from '@/apis/requests/appInfo';
import { subscribeWithSelector } from 'zustand/middleware';
interface BearState {
  count: number;
  bears: number;
  version: string;
  increment: () => void;
  reset: () => void;
  incrementBears: (by: number) => void;
  fetchData: (id: number) => Promise<void>;
}
const useStore = create(
  subscribeWithSelector((set, get: () => BearState) => ({
    // 状态
    count: 0,
    bears: 0,
    version: 'version',

    // 同步 Action
    increment: () => set((state: BearState) => ({ count: state.count + 1 })),

    // 直接设置
    reset: () => set({ count: 0, bears: 0 }),
    incrementBears: (bears: number) => set(() => ({ bears: bears })),

    // 异步 Action
    fetchData: async (id: number) => {
      setTimeout(async () => {
        const data = await appInfo.getAppInfo({ id });
        set(() => ({ version: data?.data?.version + get().count }));
      }, 5000);
    },
  }))
);
/*const useStore = create(
  persist(
    (set, get) => ({
      // 状态
      count: 0,
      bears: 0,
      version: 'version',

      // 同步 Action
      increment: () => set((state: BearState) => ({ count: state.count + 1 })),

      // 直接设置
      reset: () => set({ count: 0, bears: 0 }),
      incrementBears: (bears: number) => set(() => ({ bears: bears })),

      // 异步 Action
      fetchData: async (id: number) => {
        setTimeout(async () => {
          const data = await appInfo.getAppInfo({ id });
          set(() => ({ version: data.data.version + get().count }));
        }, 5000);
      },
    }),
    {
      name: 'bears-storage', // localStorage 的 key
      // storage: createJSONStorage(() => sessionStorage), // 可选，默认 localStorage
      partialize: (state: BearState) => ({ bears: state.bears }), // 只持久化部分字段
    }
  )
);*/
useStore.subscribe(
  (state) => state.bears, // 选择器
  (bears, prevBears) => {
    console.log(`bears啊啊 从 ${prevBears} 变为 ${bears}`);
  }
);
// const unsubscribe = useStore.subscribe((state, prevState) => {
//   console.log(state, prevState, `bears 从 ${prevState} 变为 ${state}`);
// });
export default useStore;
