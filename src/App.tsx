import { Outlet } from 'react-router-dom';
import style from './App.module.css';
import Menu from '@/components/Menu/Menu';
import { useState, useEffect, Suspense, useMemo } from 'react';
import { UserContext } from '@/hooks/userContext';
import useStore from '@/stores/index';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '@/units/queryClientConfig';
import Loading from '@/components/Loading';

function App() {
  const [message, setMessage] = useState('莫文蔚，哈哈很好的');
  console.log('Appas');
  const fetchData = useStore((state) => state.fetchData);
  const version = useStore((state) => state.version);
  useEffect(() => {
    fetchData(5);
    console.log('App');
  }, []);
  // fetchData(1);
  return (
    // <div className="app">
    <>
      <QueryClientProvider client={queryClient}>
        <UserContext.Provider value={{ message, setMessage }}>
          <header>
            <Menu />
          </header>
          <main className={style.content}>
            <Suspense fallback={<Loading />}>
              <Outlet /> {/* ← 子路由渲染位置 */}
            </Suspense>
          </main>
          <footer>
            {version}最顶层：{message}
          </footer>
        </UserContext.Provider>
      </QueryClientProvider>
    </>
    // </div>
  );
}
export default App;
