import React from 'react';
import { createBrowserRouter } from 'react-router-dom';
import type { RouteObject } from 'react-router-dom';
import App from '@/App.tsx';
import { lazy } from 'react';

export interface RouteItem {
  path: string;
  text: string;
  name: string;
  element: React.ReactElement;
}
export const route: RouteItem[] = [
  {
    path: '/',
    text: '',
    name: '/',
    element: lazyLoad(lazy(() => import('@/views/Home.tsx'))),
  },
  {
    path: '/home',
    text: '首页',
    name: 'home',
    element: lazyLoad(lazy(() => import('@/views/Home.tsx'))),
  },
  {
    path: '/test',
    text: '测试',
    name: 'test',
    element: lazyLoad(lazy(() => import('@/views/Test/Test.tsx'))),
  },
  {
    path: '/person/',
    text: '个人信息',
    name: 'person',
    element: lazyLoad(lazy(() => import('@/views/Person'))),
  },
  {
    path: '/testForm',
    text: '表单',
    name: 'testForm',
    element: lazyLoad(lazy(() => import('@/views/TestForm'))),
  },
  {
    path: '/list',
    text: '大列表',
    name: 'list',
    element: lazyLoad(lazy(() => import('@/views/UserList'))),
  },
  {
    path: '/hookForm',
    text: '表单校验',
    name: 'hookForm',
    element: lazyLoad(lazy(() => import('@/views/HookForm'))),
  },
];

function lazyLoad(component: React.LazyExoticComponent<React.ComponentType>) {
  const ComponentName = component;
  return <ComponentName />;
}

export const router = createBrowserRouter(
  [
    {
      path: '/',
      element: <App />, // ← 在这里放布局组件
      children: route as RouteObject[],
    },
  ],
  {
    basename: '/myReact', // ✅ 在这里设置路由基准路径
  }
);
